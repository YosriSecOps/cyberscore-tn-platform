"""
CyberScore TN — Dashboard API Routes
Aggregated statistics for the Command Center.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud import get_dashboard_stats, get_recent_scans, get_threat_intel_stats, get_predictions_overview

router = APIRouter(tags=["Dashboard & Threats"])


@router.get("/api/dashboard/stats")
async def dashboard_stats(db: AsyncSession = Depends(get_db)):
    """🎯 Get aggregated dashboard statistics for Command Center."""
    stats = await get_dashboard_stats(db)
    recent = [
        {
            "id": s.id,
            "url": s.url,
            "scan_type": s.scan_type,
            "status": s.status,
            "total_score": s.total_score,
            "grade": s.grade,
            "star_rating": s.star_rating,
            "critical_count": s.critical_count,
            "duration_ms": s.duration_ms,
            "created_at": str(s.created_at) if s.created_at else None,
        }
        for s in stats.pop("recent_scans", [])
    ]
    stats["recent_scans"] = recent
    return stats


@router.get("/api/threats/stats")
async def threats_stats(db: AsyncSession = Depends(get_db)):
    """🛡️ Get live threat intelligence posture statistics."""
    return await get_threat_intel_stats(db)


@router.get("/api/predictions/overview")
async def predictions_overview(db: AsyncSession = Depends(get_db)):
    """🔮 Get live AI Predictive Analytics (+30 days forecast) based on database audits."""
    return await get_predictions_overview(db)


