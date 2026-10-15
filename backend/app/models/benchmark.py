"""International Benchmark model — المقارنة الدولية (Cross-country comparison data)."""

from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class InternationalBenchmark(Base):
    __tablename__ = "international_benchmarks"

    id: Mapped[int] = mapped_column(primary_key=True)
    country: Mapped[str | None] = mapped_column(String(100))
    sector: Mapped[str | None] = mapped_column(String(100))
    average_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    sample_size: Mapped[int | None] = mapped_column(Integer)
    source: Mapped[str | None] = mapped_column(String(255))
    year: Mapped[int | None] = mapped_column(Integer)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
