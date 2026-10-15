"""Subdomain model — النطاقات الفرعية (Discovered subdomains)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subdomain(Base):
    __tablename__ = "subdomains"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int] = mapped_column(ForeignKey("websites.id"), nullable=False)
    subdomain: Mapped[str] = mapped_column(String(500), nullable=False)
    is_alive: Mapped[bool] = mapped_column(Boolean, default=False)
    ip_address: Mapped[str | None] = mapped_column(String(45))
    last_scan_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    discovered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="subdomains")
