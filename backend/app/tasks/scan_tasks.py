"""
CyberScore TN — Celery Scan Tasks
Background tasks for running scans asynchronously.
"""

import asyncio
import logging

from app.tasks.celery_app import celery_app

logger = logging.getLogger("cyberscore.tasks")


@celery_app.task(name="scan.run", bind=True, max_retries=2)
def run_scan_task(self, target: str, scan_type: str = "standard", scan_id: int = None):
    """
    Celery task to run a full security scan in the background.
    
    This wraps the async orchestrator in a sync Celery task.
    """
    logger.info(f"📋 Task {self.request.id}: Scanning {target} ({scan_type})")
    
    try:
        from app.scanners.orchestrator import run_scan
        
        # Run the async scan in a new event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            result = loop.run_until_complete(run_scan(
                target=target,
                scan_type=scan_type,
            ))
        finally:
            loop.close()
        
        logger.info(
            f"✅ Task {self.request.id}: Scan complete — "
            f"{result['total_score']}/100 ({result['grade']})"
        )
        
        # TODO: Save result to database in Phase 3
        # TODO: Trigger WebSocket notification in Phase 4
        
        return {
            "scan_id": scan_id,
            "target": target,
            "total_score": result["total_score"],
            "grade": result["grade"],
            "star_rating": result["star_rating"],
            "total_findings": result["total_findings"],
            "critical_count": result["critical_count"],
            "high_count": result["high_count"],
            "duration_ms": result["duration_ms"],
        }
        
    except Exception as exc:
        logger.error(f"❌ Task {self.request.id}: Scan failed — {exc}")
        raise self.retry(exc=exc, countdown=30)


@celery_app.task(name="scan.batch")
def batch_scan_task(targets: list[str], scan_type: str = "quick"):
    """Run scans on multiple targets (e.g., all sites in a sector)."""
    logger.info(f"📋 Batch scan: {len(targets)} targets ({scan_type})")
    
    results = []
    for target in targets:
        result = run_scan_task.delay(target, scan_type)
        results.append(result.id)
    
    return {"queued": len(results), "task_ids": results}
