"""Framework reference models — الأطر المرجعية (OWASP, NIST, ISO)."""

from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class OWASPTop10(Base):
    """OWASP Top 10 (2021) reference data."""
    __tablename__ = "owasp_top10"

    id: Mapped[str] = mapped_column(String(10), primary_key=True)  # A01 to A10
    name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    name_fr: Mapped[str | None] = mapped_column(String(255))
    name_ar: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    year: Mapped[int] = mapped_column(Integer, default=2021)

    def __repr__(self):
        return f"<OWASP {self.id}: {self.name_en}>"


class NISTCSF(Base):
    """NIST Cybersecurity Framework v2 reference data."""
    __tablename__ = "nist_csf"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)  # ID.AM-1, PR.DS-2, etc.
    function: Mapped[str] = mapped_column(String(20), nullable=False)  # Identify, Protect, Detect, Respond, Recover
    category: Mapped[str | None] = mapped_column(String(100))
    subcategory: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)

    def __repr__(self):
        return f"<NIST {self.id}: {self.function}>"


class ISO27002Control(Base):
    """ISO/IEC 27002:2022 controls reference data."""
    __tablename__ = "iso27002_controls"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)  # A.5.1, A.6.1, etc.
    domain: Mapped[str | None] = mapped_column(String(100))
    control_name: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    def __repr__(self):
        return f"<ISO27002 {self.id}: {self.control_name}>"
