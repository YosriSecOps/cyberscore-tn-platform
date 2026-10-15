"""
CyberScore TN — Scan Orchestrator
Coordinates all 16 scanners and produces the final result.
Supports 3 scan depths: quick, standard, deep.
"""

import asyncio
import time
import logging
from typing import Optional

from app.scanners.base import ScanCategoryResult
from app.scanners.ssl_scanner import SSLScanner
from app.scanners.headers_scanner import HeadersScanner
from app.scanners.dns_scanner import DNSScanner
from app.scanners.email_scanner import EmailSecurityScanner
from app.scanners.web_scanners import CookieScanner, CSPScanner, InfoDisclosureScanner
from app.scanners.docker_scanners import OWASPScanner, NetworkScanner, SubdomainScanner
from app.scanners.advanced_scanners import (
    ThreatIntelScanner, TechDetectionScanner, SupplyChainScanner,
    CertManagementScanner, HistoricalComplianceScanner,
)
from app.scanners.score_engine import calculate_total_score

logger = logging.getLogger("cyberscore.orchestrator")


# Scan phases by depth
SCAN_PHASES = {
    "quick": {
        "phase_1": [SSLScanner, HeadersScanner, CookieScanner, CSPScanner],
        # ~30 seconds total
    },
    "standard": {
        "phase_1": [SSLScanner, HeadersScanner, CookieScanner, CSPScanner],
        "phase_2": [DNSScanner, EmailSecurityScanner, InfoDisclosureScanner,
                    TechDetectionScanner, SupplyChainScanner, CertManagementScanner],
        # ~2 minutes total
    },
    "deep": {
        "phase_1": [SSLScanner, HeadersScanner, CookieScanner, CSPScanner],
        "phase_2": [DNSScanner, EmailSecurityScanner, InfoDisclosureScanner,
                    TechDetectionScanner, SupplyChainScanner, CertManagementScanner],
        "phase_3": [OWASPScanner, NetworkScanner, SubdomainScanner,
                    ThreatIntelScanner, HistoricalComplianceScanner],
        # ~10 minutes total
    },
}


async def _run_scanner(scanner_class, target: str, **kwargs) -> Optional[ScanCategoryResult]:
    """Run a single scanner with error handling."""
    scanner = scanner_class()
    try:
        result = await asyncio.wait_for(
            scanner.scan(target, **kwargs),
            timeout=scanner.timeout + 10,
        )
        logger.info(f"  ✓ {scanner.category}: {result.score}/{result.max_score} ({len(result.findings)} findings)")
        return result
    except asyncio.TimeoutError:
        logger.warning(f"  ✗ {scanner.category}: Timeout after {scanner.timeout}s")
        return ScanCategoryResult(
            category=scanner.category,
            score=0, max_score=0, weight=0,
            error=f"Scanner timeout after {scanner.timeout}s",
        )
    except Exception as e:
        logger.error(f"  ✗ {scanner.category}: Error — {e}")
        return ScanCategoryResult(
            category=scanner.category,
            score=0, max_score=0, weight=0,
            error=str(e)[:200],
        )


async def run_scan(
    target: str,
    scan_type: str = "standard",
    progress_callback=None,
    **kwargs,
) -> dict:
    """
    Run a complete security scan on a target URL.
    
    Args:
        target: URL to scan (e.g., "https://www.finances.gov.tn")
        scan_type: "quick", "standard", or "deep"
        progress_callback: async function(phase, scanner_name, status) for real-time updates
        **kwargs: Extra config (zap_url, abuseipdb_key, virustotal_key, previous_scores)
    
    Returns:
        Complete scan result dict with scores, grades, findings, and breakdown.
    """
    start_time = time.time()
    all_results: list[ScanCategoryResult] = []
    phases = SCAN_PHASES.get(scan_type, SCAN_PHASES["standard"])

    # Ensure target has protocol
    if not target.startswith(("http://", "https://")):
        target = f"https://{target}"

    import urllib.parse
    import socket

    parsed = urllib.parse.urlparse(target)
    hostname = (parsed.hostname or "").lower().strip()
    if not hostname or len(hostname) < 3:
        raise ValueError(f"Cible invalide : '{target}'.")

    # Fast DNS pre-validation check
    dns_ok = False
    try:
        loop = asyncio.get_running_loop()
        await loop.getaddrinfo(hostname, 80, family=socket.AF_UNSPEC, type=socket.SOCK_STREAM)
        dns_ok = True
    except Exception:
        if not hostname.startswith("www."):
            try:
                loop = asyncio.get_running_loop()
                await loop.getaddrinfo(f"www.{hostname}", 80, family=socket.AF_UNSPEC, type=socket.SOCK_STREAM)
                dns_ok = True
            except Exception:
                dns_ok = False
        else:
            dns_ok = False

    if not dns_ok:
        raise ValueError(f"Résolution DNS impossible pour '{hostname}'. Vérifiez que le domaine existe et est actif sur Internet.")

    logger.info(f"🔍 Starting {scan_type} scan: {target}")

    for phase_name, scanner_classes in phases.items():
        phase_num = int(phase_name.split("_")[1])
        logger.info(f"📋 Phase {phase_num}: {len(scanner_classes)} scanners")

        if progress_callback:
            await progress_callback(phase_num, "starting", "running")

        # Run all scanners in this phase concurrently
        tasks = [_run_scanner(sc, target, **kwargs) for sc in scanner_classes]
        results = await asyncio.gather(*tasks)
        
        for result in results:
            if result and result.max_score > 0:
                all_results.append(result)

        if progress_callback:
            await progress_callback(phase_num, "complete", "done")

    # Calculate final score
    score_result = calculate_total_score(all_results)
    
    # Gather all findings
    all_findings = []
    for result in all_results:
        for finding in result.findings:
            all_findings.append({
                "category": finding.category,
                "title": finding.title,
                "severity": finding.severity,
                "description": finding.description,
                "remediation": finding.remediation,
                "owasp_category": finding.owasp_category,
                "nist_function": finding.nist_function,
                "nist_control": finding.nist_control,
                "iso27002_control": finding.iso27002_control,
                "evidence": finding.evidence,
                "cvss_score": finding.cvss_score,
            })

    total_duration = int((time.time() - start_time) * 1000)

    logger.info(f"✅ Scan complete: {score_result['total_score']}/100 ({score_result['grade']}) in {total_duration}ms")

    return {
        "target": target,
        "scan_type": scan_type,
        **score_result,
        "findings": sorted(
            [f for f in all_findings if f["severity"] != "info"],
            key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x["severity"], 4),
        ),
        "info_findings": [f for f in all_findings if f["severity"] == "info"],
        "duration_ms": total_duration,
        "scanner_count": len(all_results),
        "timestamp": time.time(),
    }
