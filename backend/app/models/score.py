"""CategoryScore model — نتائج الفئات (Per-category scores for radar chart)."""

from sqlalchemy import String, Integer, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CategoryScore(Base):
    __tablename__ = "category_scores"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    weight: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False)
    findings_count: Mapped[int] = mapped_column(Integer, default=0)
    critical_count: Mapped[int] = mapped_column(Integer, default=0)
    high_count: Mapped[int] = mapped_column(Integer, default=0)
    medium_count: Mapped[int] = mapped_column(Integer, default=0)
    low_count: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    scan = relationship("Scan", back_populates="category_scores")

    def __repr__(self):
        return f"<CategoryScore {self.category}: {self.score}/{self.max_score}>"
