"""Security Badge model — شارة الأمان (QR code public badge — China CCL inspired)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Integer, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SecurityBadge(Base):
    __tablename__ = "security_badges"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int] = mapped_column(ForeignKey("websites.id"), nullable=False, unique=True)
    badge_token: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    qr_code_svg: Mapped[str | None] = mapped_column(Text)
    current_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    current_grade: Mapped[str | None] = mapped_column(String(2))
    current_stars: Mapped[int | None] = mapped_column(Integer)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="security_badge")
