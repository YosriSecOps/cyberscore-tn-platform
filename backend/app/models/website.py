"""Website model — المواقع الإلكترونية (.gov.tn URLs to scan)."""

from datetime import datetime
from sqlalchemy import String, Boolean, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Website(Base):
    __tablename__ = "websites"

    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    label: Mapped[str | None] = mapped_column(String(200))
    organization_id: Mapped[int | None] = mapped_column(ForeignKey("organizations.id"), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    latest_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    latest_grade: Mapped[str | None] = mapped_column(String(2))
    star_rating: Mapped[int | None] = mapped_column(Integer)
    last_scanned_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="websites")
    scans = relationship("Scan", back_populates="website")
    subdomains = relationship("Subdomain", back_populates="website")
    alerts = relationship("Alert", back_populates="website")
    predictions = relationship("Prediction", back_populates="website")
    earned_badges = relationship("EarnedBadge", back_populates="website")
    security_badge = relationship("SecurityBadge", back_populates="website", uselist=False)

    def __repr__(self):
        return f"<Website {self.url}>"
