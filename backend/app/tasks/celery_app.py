"""Celery application configuration."""

from celery import Celery
import os

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "cyberscore",
    broker=redis_url,
    backend=redis_url,
    include=["app.tasks.scan_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Africa/Tunis",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=1800,  # 30 minutes max per task
    worker_prefetch_multiplier=1,
)
