"""Sector model — القطاعات (Ministères, Institutions, Collectivités, EP)."""

from datetime import datetime
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Sector(Base):
    __tablename__ = "sectors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name_ar: Mapped[str] = mapped_column(String(100), nullable=False)
    name_fr: Mapped[str] = mapped_column(String(100), nullable=False)
    name_en: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(10))
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    organizations = relationship("Organization", back_populates="sector")

    def __repr__(self):
        return f"<Sector {self.name_fr}>"
