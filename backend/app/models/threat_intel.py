"""Threat Intelligence model — استخبارات التهديدات (Shodan, AbuseIPDB, VT)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ThreatIntelResult(Base):
    __tablename__ = "threat_intel_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # shodan, abuseipdb, virustotal
    ip_address: Mapped[str | None] = mapped_column(String(45))
    is_blacklisted: Mapped[bool] = mapped_column(Boolean, default=False)
    abuse_score: Mapped[int | None] = mapped_column(Integer)
    known_cves: Mapped[dict | None] = mapped_column(JSONB)
    malicious_count: Mapped[int | None] = mapped_column(Integer)
    raw_data: Mapped[dict | None] = mapped_column(JSONB)
    checked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="threat_intel_results")
