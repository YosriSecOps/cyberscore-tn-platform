"""Badge models — الأوسمة (Gamification badges and achievements)."""

from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BadgeDefinition(Base):
    __tablename__ = "badge_definitions"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_ar: Mapped[str | None] = mapped_column(String(255))
    name_fr: Mapped[str | None] = mapped_column(String(255))
    name_en: Mapped[str | None] = mapped_column(String(255))
    description_ar: Mapped[str | None] = mapped_column(Text)
    description_fr: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    icon: Mapped[str | None] = mapped_column(String(10))  # Emoji
    condition_type: Mapped[str | None] = mapped_column(String(50))
    condition_value: Mapped[dict | None] = mapped_column(JSONB)
    rarity: Mapped[str] = mapped_column(String(20), default="common")  # common, rare, epic, legendary

    earned = relationship("EarnedBadge", back_populates="badge")


class EarnedBadge(Base):
    __tablename__ = "earned_badges"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int] = mapped_column(ForeignKey("websites.id"), nullable=False)
    badge_id: Mapped[int] = mapped_column(ForeignKey("badge_definitions.id"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("website_id", "badge_id"),)

    website = relationship("Website", back_populates="earned_badges")
    badge = relationship("BadgeDefinition", back_populates="earned")
