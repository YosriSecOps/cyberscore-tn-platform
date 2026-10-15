"""Alert models — التنبيهات (Automated alert system)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int] = mapped_column(ForeignKey("websites.id"), nullable=False)
    scan_id: Mapped[int | None] = mapped_column(ForeignKey("scans.id"))
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)  # score_drop, ssl_expiry, new_cve, etc.
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    title_ar: Mapped[str | None] = mapped_column(String(500))
    title_fr: Mapped[str | None] = mapped_column(String(500))
    title_en: Mapped[str | None] = mapped_column(String(500))
    message: Mapped[str | None] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="alerts")
    scan = relationship("Scan", back_populates="alerts")


class AlertRule(Base):
    __tablename__ = "alert_rules"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)
    threshold: Mapped[float | None] = mapped_column(Numeric(5, 2))
    notify_email: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_dashboard: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    user = relationship("User", back_populates="alert_rules")
