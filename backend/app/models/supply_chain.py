"""Supply chain model — سلسلة التوريد (External scripts, CDNs, dependencies)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ExternalResource(Base):
    __tablename__ = "external_resources"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    resource_url: Mapped[str] = mapped_column(Text, nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(20))  # script, style, font, image
    domain: Mapped[str | None] = mapped_column(String(255))
    is_trusted: Mapped[bool] = mapped_column(Boolean, default=True)
    has_sri: Mapped[bool] = mapped_column(Boolean, default=False)
    is_expired_domain: Mapped[bool] = mapped_column(Boolean, default=False)
    is_mixed_content: Mapped[bool] = mapped_column(Boolean, default=False)
    risk_level: Mapped[str] = mapped_column(String(20), default="low")
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="external_resources")
