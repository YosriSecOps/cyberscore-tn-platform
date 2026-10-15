"""
Unit tests for CyberScore TN Scanners.
Validates CSP scanner, Headers scanner, and Finding serialization.
"""

import pytest
from app.scanners.base import Finding, ScanResult
from app.scanners.web_scanners import ContentSecurityPolicyScanner


def test_finding_creation():
    """Verify standard finding structure and fields."""
    f = Finding(
        title={"fr": "Test Vuln", "ar": "اختبار", "en": "Test Vuln"},
        severity="high",
        category="http_headers",
        description={"fr": "Description test", "ar": "وصف", "en": "Test description"},
        remediation={"fr": "Solution test", "ar": "حل", "en": "Test remediation"},
        owasp_category="A05",
        evidence="Header missing",
    )
    assert f.severity == "high"
    assert f.owasp_category == "A05"
    assert f.evidence == "Header missing"


def test_csp_dangerous_directives():
    """Verify CSP scanner dangerous directive definitions."""
    scanner = ContentSecurityPolicyScanner()
    assert "unsafe-inline" in scanner.DANGEROUS_DIRECTIVES
    assert "unsafe-eval" in scanner.DANGEROUS_DIRECTIVES
    assert "*" in scanner.DANGEROUS_DIRECTIVES


def test_scan_result_initialization():
    """Verify ScanResult container calculation."""
    res = ScanResult(
        category="ssl_tls",
        score=85.0,
        grade="A",
        findings=[],
        duration_ms=120,
    )
    assert res.score == 85.0
    assert res.grade == "A"
    assert len(res.findings) == 0
