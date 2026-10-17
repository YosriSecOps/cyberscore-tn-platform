"""
CyberScore TN — Scan API Routes (v2 — with DB persistence + WebSocket)
"""

from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
import json
import asyncio
import socket
import urllib.parse
import re

from app.database import get_db, AsyncSessionLocal
from app.scanners.orchestrator import run_scan
from app.crud import (
    get_or_create_website, create_scan, complete_scan,
    get_scan_by_id, get_recent_scans, get_scan_history,
    get_websites,
)

router = APIRouter(prefix="/api/scans", tags=["Scans"])


# ── Domain & DNS Validation ─────────────────────────────

def extract_and_validate_hostname(raw_url: str) -> str:
    cleaned = (raw_url or "").strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="URL requise pour l'audit.")

    test_url = cleaned if "://" in cleaned else f"https://{cleaned}"
    try:
        parsed = urllib.parse.urlparse(test_url)
    except Exception:
        raise HTTPException(status_code=400, detail="Format d'URL invalide.")

    hostname = (parsed.hostname or "").lower().strip()
    if not hostname or len(hostname) < 3:
        raise HTTPException(status_code=400, detail="Nom de domaine invalide ou manquant.")

    if "." not in hostname and hostname != "localhost":
        raise HTTPException(
            status_code=400,
            detail=f"Nom de domaine invalide : '{hostname}' (doit comporter un domaine et une extension TLD valide).",
        )

    # Disallow invalid characters
    if not re.match(r"^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$", hostname):
        raise HTTPException(status_code=400, detail=f"Caractères non autorisés dans le domaine '{hostname}'.")

    parts = hostname.split(".")
    tld = parts[-1]
    if len(tld) < 2 and hostname != "localhost":
        raise HTTPException(status_code=400, detail=f"Extension de domaine (TLD) invalide : '.{tld}'.")

    return hostname


async def verify_dns_resolution(hostname: str) -> str:
    """Verifies that the target hostname resolves via DNS, returning resolved IP or raising HTTPException."""
    loop = asyncio.get_running_loop()

    # 1. Try hostname as given (IPv4 prioritized for speed and VMware NAT compatibility)
    for fam in (socket.AF_INET, socket.AF_UNSPEC):
        try:
            infos = await loop.getaddrinfo(hostname, 80, family=fam, type=socket.SOCK_STREAM)
            if infos and len(infos) > 0:
                return infos[0][4][0]
        except (socket.gaierror, socket.herror, OSError):
            pass

    # 2. Try with www. prefix if not already present
    if not hostname.startswith("www."):
        for fam in (socket.AF_INET, socket.AF_UNSPEC):
            try:
                infos = await loop.getaddrinfo(f"www.{hostname}", 80, family=fam, type=socket.SOCK_STREAM)
                if infos and len(infos) > 0:
                    return infos[0][4][0]
            except (socket.gaierror, socket.herror, OSError):
                pass

    raise HTTPException(
        status_code=400,
        detail=f"Résolution DNS impossible pour '{hostname}'. Vérifiez que le domaine existe et est actif sur Internet.",
    )


# ── Models ───────────────────────────────────────────────

class ScanRequest(BaseModel):
    url: str
    scan_type: str = "standard"

    class Config:
        json_schema_extra = {
            "example": {"url": "https://www.finances.gov.tn", "scan_type": "standard"}
        }


# ── WebSocket Connection Manager ────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active: dict[int, list[WebSocket]] = {}

    async def connect(self, scan_id: int, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(scan_id, []).append(ws)

    def disconnect(self, scan_id: int, ws: WebSocket):
        if scan_id in self.active:
            self.active[scan_id] = [w for w in self.active[scan_id] if w != ws]

    async def broadcast(self, scan_id: int, data: dict):
        for ws in self.active.get(scan_id, []):
            try:
                await ws.send_json(data)
            except Exception:
                pass

manager = ConnectionManager()


# ── Endpoints ────────────────────────────────────────────

@router.post("/run")
async def trigger_scan(request: ScanRequest, db: AsyncSession = Depends(get_db)):
    """
    🔍 Run a security scan and save results to database.
    
    - **quick**: SSL + Headers + Cookies + CSP (~30s)
    - **standard**: Quick + DNS + Email + Info + Tech + Supply Chain + Cert (~2min)
    - **deep**: Standard + OWASP ZAP + Nmap + Subdomains + Threat Intel (~10min)
    """
    if request.scan_type not in ("quick", "standard", "deep"):
        raise HTTPException(400, "scan_type must be 'quick', 'standard', or 'deep'")

    # Validate target domain syntax and DNS resolution BEFORE creating any DB record
    hostname = extract_and_validate_hostname(request.url)
    await verify_dns_resolution(hostname)

    url = request.url.strip()
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"

    # 1. Get or create website record
    website = await get_or_create_website(db, url)

    # 2. Create scan record (status=running)
    scan = await create_scan(db, website.id, url, request.scan_type)
    scan_id = scan.id
    await db.commit()

    # 3. Run the scan with progress callback
    async def progress_cb(phase, scanner_name, status):
        await manager.broadcast(scan_id, {
            "type": "progress",
            "scan_id": scan_id,
            "phase": phase,
            "scanner": scanner_name,
            "status": status,
        })

    try:
        result = await run_scan(
            target=url,
            scan_type=request.scan_type,
            progress_callback=progress_cb,
        )

        # 4. Save results to DB
        async with AsyncSessionLocal() as save_db:
            scan = await complete_scan(save_db, scan_id, result)
            await save_db.commit()

        # 5. Notify WebSocket clients
        await manager.broadcast(scan_id, {
            "type": "complete",
            "scan_id": scan_id,
            "total_score": result["total_score"],
            "grade": result["grade"],
        })

        return {
            "scan_id": scan_id,
            "target": url,
            **{k: v for k, v in result.items() if k != "target"},
        }

    except Exception as e:
        # Mark scan as failed
        async with AsyncSessionLocal() as fail_db:
            s = await get_scan_by_id(fail_db, scan_id)
            if s:
                s.status = "failed"
                await fail_db.commit()
        raise HTTPException(500, f"Scan failed: {str(e)[:500]}")


@router.get("/recent")
async def recent_scans(limit: int = 20, db: AsyncSession = Depends(get_db)):
    """📋 Get recent scan results."""
    scans = await get_recent_scans(db, limit)
    return {
        "scans": [
            {
                "id": s.id,
                "url": s.url,
                "scan_type": s.scan_type,
                "status": s.status,
                "total_score": s.total_score,
                "grade": s.grade,
                "star_rating": s.star_rating,
                "total_findings": s.total_findings,
                "critical_count": s.critical_count,
                "duration_ms": s.duration_ms,
                "created_at": str(s.created_at) if s.created_at else None,
            }
            for s in scans
        ],
        "total": len(scans),
    }


@router.get("/{scan_id}")
async def get_scan_detail(scan_id: int, db: AsyncSession = Depends(get_db)):
    """📊 Get detailed scan result by ID."""
    scan = await get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(404, "Scan not found")
    return {
        "id": scan.id,
        "url": scan.url,
        "scan_type": scan.scan_type,
        "status": scan.status,
        "total_score": scan.total_score,
        "grade": scan.grade,
        "star_rating": scan.star_rating,
        "total_findings": scan.total_findings,
        "critical_count": scan.critical_count,
        "high_count": scan.high_count,
        "medium_count": scan.medium_count,
        "low_count": scan.low_count,
        "duration_ms": scan.duration_ms,
        "started_at": str(scan.started_at) if scan.started_at else None,
        "completed_at": str(scan.completed_at) if scan.completed_at else None,
    }


@router.get("/history/{website_url:path}")
async def scan_history(website_url: str, db: AsyncSession = Depends(get_db)):
    """📈 Get scan history for a specific website URL."""
    from app.crud import get_website_by_url
    website = await get_website_by_url(db, website_url)
    if not website:
        raise HTTPException(404, "Website not found")
    
    scans = await get_scan_history(db, website.id)
    return {
        "website_url": website_url,
        "scans": [
            {
                "id": s.id,
                "total_score": s.total_score,
                "grade": s.grade,
                "created_at": str(s.created_at) if s.created_at else None,
            }
            for s in scans
        ],
    }


@router.get("/health")
async def scanner_health():
    """Check scanner engine health."""
    return {
        "status": "operational",
        "scanners": 16,
        "scan_types": ["quick", "standard", "deep"],
    }


# ── WebSocket for Real-Time Scan Progress ────────────────

@router.websocket("/ws/{scan_id}")
async def scan_progress_ws(websocket: WebSocket, scan_id: int):
    """🔌 WebSocket for real-time scan progress updates."""
    await manager.connect(scan_id, websocket)
    try:
        while True:
            # Keep alive — client can send pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(scan_id, websocket)


# ── Singular Route Alias (/api/scan) ────────────────────

scan_alias_router = APIRouter(prefix="/api", tags=["Scans"])

@scan_alias_router.post("/scan")
async def trigger_scan_alias(request: ScanRequest, db: AsyncSession = Depends(get_db)):
    """Direct alias for /api/scan requests."""
    if request.scan_type == "autonomous":
        request.scan_type = "deep"
    return await trigger_scan(request, db)

