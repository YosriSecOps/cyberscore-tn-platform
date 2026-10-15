"""
CyberScore TN — Configuration
Pydantic Settings for environment-based configuration.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_NAME: str = "CyberScore TN"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://cyberscore_user:cyberscore_secure_2026@postgres:5432/cyberscore"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Ollama (Local AI)
    OLLAMA_URL: str = "http://127.0.0.1:25000"
    OLLAMA_MODEL: str = "qwen2.5-coder:7b"

    # Gemini (Fallback AI)
    GEMINI_API_KEY: Optional[str] = None

    # JWT Auth
    JWT_SECRET_KEY: str = "cyberscore-tn-dev-secret-key-2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # OWASP ZAP
    ZAP_URL: str = "http://owasp-zap:8080"

    # Threat Intelligence APIs
    ABUSEIPDB_API_KEY: Optional[str] = None
    VIRUSTOTAL_API_KEY: Optional[str] = None

    # Email
    SMTP_HOST: str = "mailhog"
    SMTP_PORT: int = 1025
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    # CORS (Strict origin list required when allow_credentials=True)
    CORS_ORIGINS: list[str] = [
        "https://cyberscore.tn",
        "http://cyberscore.tn",
        "https://www.cyberscore.tn",
        "http://www.cyberscore.tn",
        "https://192.168.98.150",
        "http://192.168.98.150",
        "http://192.168.98.150:3000",
        "https://192.168.98.150:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000",
        "http://192.168.98.149:8000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
