"""Scan model — عمليات الفحص (Scan jobs and their lifecycle)."""

from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int | None] = mapped_column(ForeignKey("websites.id"), nullable=True)
    url: Mapped[str] = mapped_column(String(500), nullable=False)  # The scanned URL
    scan_type: Mapped[str] = mapped_column(String(20), nullable=False)  # quick, standard, deep
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, running, completed, failed
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    total_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    grade: Mapped[str | None] = mapped_column(String(2))
    star_rating: Mapped[int | None] = mapped_column(Integer)  # 1, 2, or 3
    total_findings: Mapped[int] = mapped_column(Integer, default=0)
    critical_count: Mapped[int] = mapped_column(Integer, default=0)
    high_count: Mapped[int] = mapped_column(Integer, default=0)
    medium_count: Mapped[int] = mapped_column(Integer, default=0)
    low_count: Mapped[int] = mapped_column(Integer, default=0)
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    scan_duration_seconds: Mapped[int | None] = mapped_column(Integer)
    triggered_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    website = relationship("Website", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan", cascade="all, delete-orphan")
    category_scores = relationship("CategoryScore", back_populates="scan", cascade="all, delete-orphan")
    threat_intel_results = relationship("ThreatIntelResult", back_populates="scan", cascade="all, delete-orphan")
    detected_technologies = relationship("DetectedTechnology", back_populates="scan", cascade="all, delete-orphan")
    external_resources = relationship("ExternalResource", back_populates="scan", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="scan")

    def __repr__(self):
        return f"<Scan {self.id} [{self.status}] {self.total_score}>"
