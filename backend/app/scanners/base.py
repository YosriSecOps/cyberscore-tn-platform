"""
CyberScore TN — Base Scanner
Abstract base class for all scanner modules.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Union
import logging

logger = logging.getLogger("cyberscore.scanners")


@dataclass
class Finding:
    """A single security finding from a scanner."""
    title: Union[str, dict]  # str or {"ar": "...", "fr": "...", "en": "..."}
    severity: str  # critical, high, medium, low, info
    category: str  # ssl, headers, owasp, network, dns, cookie, csp, email, info, patching, subdomain, threat, tech, supply_chain, cert, history
    description: Union[str, dict] = ""  # str or {"ar": "...", "fr": "...", "en": "..."}
    remediation: Union[str, dict] = ""  # str or {"ar": "...", "fr": "...", "en": "..."}
    cvss_score: Optional[float] = None
    owasp_category: Optional[str] = None  # A01-A10
    nist_function: Optional[str] = None   # ID, PR, DE, RS, RC
    nist_control: Optional[str] = None    # PR.DS-2, etc.
    iso27002_control: Optional[str] = None  # A.8.24, etc.
    evidence: Union[dict, str] = field(default_factory=dict)


@dataclass
class ScanCategoryResult:
    """Result of a single scanner category."""
    category: str
    score: float        # Achieved score (0 to max_score)
    max_score: float    # Maximum possible for this category
    weight: float       # Weight (0.0 to 1.0)
    findings: list[Finding] = field(default_factory=list)
    duration_ms: int = 0
    error: Optional[str] = None

    @property
    def finding_counts(self) -> dict:
        counts = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
        for f in self.findings:
            if f.severity in counts:
                counts[f.severity] += 1
        return counts


# ── 16 Risk Factor Weights (from implementation plan) ────

CATEGORY_WEIGHTS = {
    "ssl":           {"weight": 0.12, "max_score": 12, "label_ar": "أمان SSL/TLS",           "label_fr": "Sécurité SSL/TLS",          "label_en": "SSL/TLS Security"},
    "headers":       {"weight": 0.10, "max_score": 10, "label_ar": "ترويسات الأمان",         "label_fr": "Headers de sécurité",        "label_en": "Security Headers"},
    "owasp":         {"weight": 0.15, "max_score": 15, "label_ar": "ثغرات OWASP",            "label_fr": "Vulnérabilités OWASP",       "label_en": "OWASP Vulnerabilities"},
    "network":       {"weight": 0.08, "max_score": 8,  "label_ar": "أمان الشبكة",            "label_fr": "Sécurité réseau",            "label_en": "Network Security"},
    "dns":           {"weight": 0.05, "max_score": 5,  "label_ar": "صحة DNS",               "label_fr": "Santé DNS",                  "label_en": "DNS Health"},
    "cookie":        {"weight": 0.04, "max_score": 4,  "label_ar": "أمان الكوكيز",           "label_fr": "Sécurité cookies",           "label_en": "Cookie Security"},
    "csp":           {"weight": 0.05, "max_score": 5,  "label_ar": "سياسة أمان المحتوى",     "label_fr": "Content Security Policy",    "label_en": "Content Security Policy"},
    "email":         {"weight": 0.04, "max_score": 4,  "label_ar": "أمان البريد الإلكتروني", "label_fr": "Sécurité email",              "label_en": "Email Security"},
    "info":          {"weight": 0.05, "max_score": 5,  "label_ar": "تسريب المعلومات",        "label_fr": "Divulgation d'information",  "label_en": "Information Disclosure"},
    "patching":      {"weight": 0.08, "max_score": 8,  "label_ar": "التحديثات الأمنية",      "label_fr": "Patching / CVEs",            "label_en": "Patching / CVEs"},
    "subdomain":     {"weight": 0.05, "max_score": 5,  "label_ar": "أمان النطاقات الفرعية",  "label_fr": "Sous-domaines",              "label_en": "Subdomains"},
    "threat_intel":  {"weight": 0.05, "max_score": 5,  "label_ar": "استخبارات التهديدات",    "label_fr": "Threat Intelligence",        "label_en": "Threat Intelligence"},
    "tech":          {"weight": 0.05, "max_score": 5,  "label_ar": "حداثة التقنيات",         "label_fr": "Fraîcheur technologique",    "label_en": "Technology Freshness"},
    "supply_chain":  {"weight": 0.04, "max_score": 4,  "label_ar": "مخاطر سلسلة التوريد",   "label_fr": "Risque supply chain",        "label_en": "Supply Chain Risk"},
    "cert":          {"weight": 0.03, "max_score": 3,  "label_ar": "إدارة الشهادات",         "label_fr": "Gestion certificats",        "label_en": "Certificate Management"},
    "history":       {"weight": 0.02, "max_score": 2,  "label_ar": "الامتثال التاريخي",      "label_fr": "Conformité historique",      "label_en": "Historical Compliance"},
}


class BaseScanner(ABC):
    """Abstract base class for all CyberScore TN scanners."""

    category: str = ""
    timeout: int = 30  # seconds

    @abstractmethod
    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        """Execute the scan and return findings."""
        pass

    def _create_result(self, findings: list[Finding], score: float, duration_ms: int = 0) -> ScanCategoryResult:
        """Helper to create a properly configured ScanCategoryResult."""
        cat = CATEGORY_WEIGHTS.get(self.category, {"weight": 0, "max_score": 0})
        return ScanCategoryResult(
            category=self.category,
            score=min(score, cat["max_score"]),
            max_score=cat["max_score"],
            weight=cat["weight"],
            findings=findings,
            duration_ms=duration_ms,
        )

    def _deduct(self, max_score: float, findings: list[Finding]) -> float:
        """Calculate score by deducting from max based on finding severity."""
        SEVERITY_DEDUCTIONS = {
            "critical": 3.0,
            "high": 2.0,
            "medium": 1.0,
            "low": 0.5,
            "info": 0.0,
        }
        deduction = sum(SEVERITY_DEDUCTIONS.get(f.severity, 0) for f in findings)
        return max(0, max_score - deduction)
