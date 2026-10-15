"""Organization model — المؤسسات (Ministries, institutions, etc.)."""

from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    name_fr: Mapped[str] = mapped_column(String(255), nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(255))
    sector_id: Mapped[int] = mapped_column(ForeignKey("sectors.id"), nullable=False)
    governorate: Mapped[str | None] = mapped_column(String(100))
    criticality_level: Mapped[int] = mapped_column(Integer, default=3)  # 1-5
    logo_url: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    sector = relationship("Sector", back_populates="organizations")
    websites = relationship("Website", back_populates="organization")

    def __repr__(self):
        return f"<Organization {self.name_fr}>"
