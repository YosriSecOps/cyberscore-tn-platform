"""ScanResult model — نتائج الفحص (Individual findings per scan)."""

from datetime import datetime
from sqlalchemy import String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # ssl, headers, owasp, etc.
    finding_type: Mapped[str | None] = mapped_column(String(100))
    finding_title: Mapped[str] = mapped_column(String(255), nullable=False)
    finding_description: Mapped[str | None] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)  # critical, high, medium, low, info
    cvss_score: Mapped[float | None] = mapped_column(Numeric(3, 1))
    owasp_category: Mapped[str | None] = mapped_column(String(10))  # A01 to A10
    nist_function: Mapped[str | None] = mapped_column(String(10))  # ID, PR, DE, RS, RC
    nist_control: Mapped[str | None] = mapped_column(String(20))
    iso27002_control: Mapped[str | None] = mapped_column(String(20))
    remediation_steps: Mapped[str | None] = mapped_column(Text)
    evidence: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    scan = relationship("Scan", back_populates="results")

    def __repr__(self):
        return f"<ScanResult [{self.severity}] {self.finding_title}>"
