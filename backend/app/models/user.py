"""User model — المستخدمون (Platform users with RBAC and Accreditation Workflow)."""

from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="viewer")  # admin, auditor, viewer
    
    # Accreditation / Habilitation fields
    organization_name: Mapped[str | None] = mapped_column(String(255))
    position: Mapped[str | None] = mapped_column(String(100))  # e.g., "RSSI", "DSI", "Auditeur"
    matricule: Mapped[str | None] = mapped_column(String(50))
    phone: Mapped[str | None] = mapped_column(String(30))
    status: Mapped[str] = mapped_column(String(20), default="approved")  # pending, approved, rejected
    rejection_reason: Mapped[str | None] = mapped_column(Text)

    organization_id: Mapped[int | None] = mapped_column(ForeignKey("organizations.id"))
    preferred_language: Mapped[str] = mapped_column(String(5), default="fr")  # ar, fr, en
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)

    # Relationships
    alert_rules = relationship("AlertRule", back_populates="user")

    def __repr__(self):
        return f"<User {self.email} [{self.role} - {self.status}]>"
