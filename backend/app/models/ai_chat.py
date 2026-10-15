"""AI Chat models — محادثات الذكاء الاصطناعي (Amina conversations)."""

from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    scan_id: Mapped[int | None] = mapped_column(ForeignKey("scans.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("ai_conversations.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False)  # user, assistant
    content: Mapped[str] = mapped_column(Text, nullable=False)
    context_type: Mapped[str | None] = mapped_column(String(50))  # scan_result, comparison, general
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
