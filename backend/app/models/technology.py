"""Technology detection model — كشف التقنيات (CMS, frameworks, servers)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DetectedTechnology(Base):
    __tablename__ = "detected_technologies"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    tech_name: Mapped[str] = mapped_column(String(255), nullable=False)
    tech_version: Mapped[str | None] = mapped_column(String(50))
    tech_category: Mapped[str | None] = mapped_column(String(100))  # CMS, Framework, Server, JS Library
    is_outdated: Mapped[bool] = mapped_column(Boolean, default=False)
    known_cves_count: Mapped[int] = mapped_column(Integer, default=0)
    cves: Mapped[dict | None] = mapped_column(JSONB)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="detected_technologies")
