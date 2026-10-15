"""
CyberScore TN — Pydantic Schemas
Request/Response models for all API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Sector ───────────────────────────────────────────────

class SectorOut(BaseModel):
    id: int
    name_ar: str
    name_fr: str
    name_en: Optional[str] = None
    icon: Optional[str] = None
    org_count: int = 0
    avg_score: Optional[float] = None

    class Config:
        from_attributes = True


# ── Organization ─────────────────────────────────────────

class OrganizationOut(BaseModel):
    id: int
    name_ar: str
    name_fr: str
    name_en: Optional[str] = None
    sector_id: int
    sector_name_ar: Optional[str] = None
    website_count: int = 0

    class Config:
        from_attributes = True


# ── Website ──────────────────────────────────────────────

class WebsiteCreate(BaseModel):
    url: str
    organization_id: Optional[int] = None
    label: Optional[str] = None


class WebsiteOut(BaseModel):
    id: int
    url: str
    label: Optional[str] = None
    organization_id: Optional[int] = None
    org_name_ar: Optional[str] = None
    latest_score: Optional[float] = None
    latest_grade: Optional[str] = None
    star_rating: Optional[int] = None
    scan_count: int = 0

    class Config:
        from_attributes = True


# ── Scan ─────────────────────────────────────────────────

class ScanCreate(BaseModel):
    url: str
    scan_type: str = "standard"  # quick, standard, deep


class ScanOut(BaseModel):
    id: int
    website_id: Optional[int] = None
    url: str
    scan_type: str
    status: str
    total_score: Optional[float] = None
    grade: Optional[str] = None
    star_rating: Optional[int] = None
    total_findings: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    duration_ms: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScanDetailOut(ScanOut):
    category_breakdown: list[dict] = []
    findings: list[dict] = []
    info_findings: list[dict] = []


# ── Score ────────────────────────────────────────────────

class ScoreOut(BaseModel):
    id: int
    scan_id: int
    category: str
    score: float
    max_score: float
    weight: float
    findings_count: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0

    class Config:
        from_attributes = True


# ── Dashboard Stats ──────────────────────────────────────

class DashboardStats(BaseModel):
    total_sites: int
    total_scans: int
    average_score: float
    critical_alerts: int
    scans_today: int
    sector_breakdown: list[dict]
    recent_scans: list[ScanOut]
    top_sites: list[dict]
    worst_sites: list[dict]
