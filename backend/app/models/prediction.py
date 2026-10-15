"""Prediction model — التنبؤات (AI-powered score prediction)."""

from datetime import datetime
from sqlalchemy import String, Integer, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_id: Mapped[int] = mapped_column(ForeignKey("websites.id"), nullable=False)
    predicted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    predicted_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    prediction_days: Mapped[int] = mapped_column(Integer, nullable=False)  # Days ahead
    trend: Mapped[str] = mapped_column(String(20), nullable=False)  # improving, declining, stable
    ai_analysis: Mapped[str | None] = mapped_column(Text)
    confidence: Mapped[float | None] = mapped_column(Numeric(3, 2))
    actual_score: Mapped[float | None] = mapped_column(Numeric(5, 2))  # Filled later for accuracy

    website = relationship("Website", back_populates="predictions")
