"""
Scanner 2: HTTP Security Headers — ترويسات الأمان
Weight: 10% | Max: 10 points
Checks: X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy, X-XSS-Protection
"""

import time
import httpx

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


# Required security headers and their importance
SECURITY_HEADERS = {
    "strict-transport-security": {
        "severity": "high",
        "title": {
            "ar": "ترويسة HSTS مفقودة",
            "fr": "En-tête HSTS manquant",
            "en": "HSTS Header Missing",
        },
        "desc": {
            "ar": "ترويسة HTTP Strict-Transport-Security مفقودة",
            "fr": "L'en-tête HTTP Strict-Transport-Security est absent",
            "en": "HTTP Strict-Transport-Security header is missing",
        },
        "remediation": {
            "ar": "أضف ترويسة Strict-Transport-Security: max-age=31536000; includeSubDomains",
            "fr": "Ajouter l'en-tête Strict-Transport-Security: max-age=31536000; includeSubDomains",
            "en": "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' header",
        },
        "owasp": "A05", "nist": "PR.DS-2", "iso": "A.8.24",
        "deduction": 2.0,
    },
    "x-frame-options": {
        "severity": "medium",
        "title": {
            "ar": "ترويسة X-Frame-Options مفقودة",
            "fr": "En-tête X-Frame-Options manquant",
            "en": "X-Frame-Options Header Missing",
        },
        "desc": {
            "ar": "ترويسة X-Frame-Options مفقودة — خطر Clickjacking",
            "fr": "En-tête X-Frame-Options absent — risque de clickjacking",
            "en": "X-Frame-Options header is missing — clickjacking risk",
        },
        "remediation": {
            "ar": "أضف ترويسة X-Frame-Options: DENY أو SAMEORIGIN",
            "fr": "Ajouter l'en-tête X-Frame-Options: DENY ou SAMEORIGIN",
            "en": "Add 'X-Frame-Options: DENY' or 'SAMEORIGIN' header",
        },
        "owasp": "A05", "nist": "PR.IP-1", "iso": "A.8.26",
        "deduction": 1.5,
    },
    "x-content-type-options": {
        "severity": "medium",
        "title": {
            "ar": "ترويسة X-Content-Type-Options مفقودة",
            "fr": "En-tête X-Content-Type-Options manquant",
            "en": "X-Content-Type-Options Header Missing",
        },
        "desc": {
            "ar": "ترويسة X-Content-Type-Options مفقودة — خطر MIME sniffing",
            "fr": "En-tête X-Content-Type-Options absent — risque de MIME sniffing",
            "en": "X-Content-Type-Options header is missing — MIME sniffing risk",
        },
        "remediation": {
            "ar": "أضف ترويسة X-Content-Type-Options: nosniff",
            "fr": "Ajouter l'en-tête X-Content-Type-Options: nosniff",
            "en": "Add 'X-Content-Type-Options: nosniff' header",
        },
        "owasp": "A05", "nist": "PR.IP-1", "iso": "A.8.26",
        "deduction": 1.0,
    },
    "referrer-policy": {
        "severity": "low",
        "title": {
            "ar": "ترويسة Referrer-Policy مفقودة",
            "fr": "En-tête Referrer-Policy manquant",
            "en": "Referrer-Policy Header Missing",
        },
        "desc": {
            "ar": "ترويسة Referrer-Policy مفقودة — خطر تسريب بيانات",
            "fr": "En-tête Referrer-Policy absent — risque de fuite de données",
            "en": "Referrer-Policy header is missing — potential data leakage",
        },
        "remediation": {
            "ar": "أضف ترويسة Referrer-Policy: strict-origin-when-cross-origin",
            "fr": "Ajouter l'en-tête Referrer-Policy: strict-origin-when-cross-origin",
            "en": "Add 'Referrer-Policy: strict-origin-when-cross-origin' header",
        },
        "owasp": "A05", "deduction": 0.5,
    },
    "permissions-policy": {
        "severity": "low",
        "title": {
            "ar": "ترويسة Permissions-Policy مفقودة",
            "fr": "En-tête Permissions-Policy manquant",
            "en": "Permissions-Policy Header Missing",
        },
        "desc": {
            "ar": "ترويسة Permissions-Policy مفقودة — ميزات المتصفح غير مقيدة",
            "fr": "En-tête Permissions-Policy absent — fonctionnalités du navigateur non restreintes",
            "en": "Permissions-Policy header is missing — browser features not restricted",
        },
        "remediation": {
            "ar": "أضف ترويسة Permissions-Policy لتقييد الموقع الجغرافي والكاميرا وغيرها",
            "fr": "Ajouter l'en-tête Permissions-Policy pour restreindre géolocalisation, caméra, etc.",
            "en": "Add Permissions-Policy header to restrict geolocation, camera, etc.",
        },
        "owasp": "A05", "deduction": 0.5,
    },
    "x-xss-protection": {
        "severity": "low",
        "title": {
            "ar": "ترويسة X-XSS-Protection مفقودة",
            "fr": "En-tête X-XSS-Protection manquant",
            "en": "X-XSS-Protection Header Missing",
        },
        "desc": {
            "ar": "ترويسة X-XSS-Protection مفقودة (قديمة لكن لا تزال موصى بها)",
            "fr": "En-tête X-XSS-Protection absent (obsolète mais toujours recommandé)",
            "en": "X-XSS-Protection header is missing (legacy but still recommended)",
        },
        "remediation": {
            "ar": "أضف ترويسة X-XSS-Protection: 1; mode=block",
            "fr": "Ajouter l'en-tête X-XSS-Protection: 1; mode=block",
            "en": "Add 'X-XSS-Protection: 1; mode=block' header",
        },
        "owasp": "A03", "deduction": 0.5,
    },
}

# Headers that should NOT be present (information leakage)
BAD_HEADERS = {
    "server": {
        "severity": "low",
        "title": {
            "ar": "ترويسة Server تكشف معلومات الخادم",
            "fr": "En-tête Server divulgue des informations serveur",
            "en": "Server Header Reveals Backend Info",
        },
        "desc": {
            "ar": "ترويسة Server تكشف تقنية الخادم المستخدمة",
            "fr": "L'en-tête Server révèle la technologie backend",
            "en": "Server header reveals backend technology",
        },
        "deduction": 0.5,
    },
    "x-powered-by": {
        "severity": "medium",
        "title": {
            "ar": "ترويسة X-Powered-By تكشف التقنية المستخدمة",
            "fr": "En-tête X-Powered-By divulgue le framework",
            "en": "X-Powered-By Header Reveals Framework",
        },
        "desc": {
            "ar": "ترويسة X-Powered-By تكشف إطار العمل أو التقنية",
            "fr": "L'en-tête X-Powered-By révèle le framework/technologie",
            "en": "X-Powered-By header reveals framework/technology",
        },
        "deduction": 1.0,
    },
}


class HeadersScanner(BaseScanner):
    category = "headers"
    timeout = 15

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score

        try:
            response = None
            for attempt in range(2):
                try:
                    async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True, verify=False) as client:
                        response = await client.get(target)
                        break
                except Exception as e:
                    if attempt == 0:
                        import asyncio
                        await asyncio.sleep(1.0)
                        continue
                    raise

            if not response:
                raise RuntimeError("No HTTP response obtained")

            headers = {k.lower(): v for k, v in response.headers.items()}

            # Check required security headers
            for header_name, config in SECURITY_HEADERS.items():
                if header_name not in headers:
                    findings.append(Finding(
                        title=config["title"],
                        severity=config["severity"],
                        category="headers",
                        description=config["desc"],
                        remediation=config.get("remediation", ""),
                        owasp_category=config.get("owasp"),
                        nist_function="PR",
                        nist_control=config.get("nist"),
                        iso27002_control=config.get("iso"),
                        evidence=f"[ABSENT] {header_name}",
                    ))
                    score -= config["deduction"]
                else:
                    findings.append(Finding(
                        title=f"✓ {header_name}",
                        severity="info",
                        category="headers",
                        description=f"Header present: {headers[header_name][:100]}",
                        evidence=f"{header_name}: {headers[header_name][:200]}",
                    ))

            # Check headers that should NOT be present
            for header_name, config in BAD_HEADERS.items():
                if header_name in headers:
                    findings.append(Finding(
                        title=config["title"],
                        severity=config["severity"],
                        category="headers",
                        description=config["desc"],
                        remediation={
                            "ar": f"احذف أو أخفِ ترويسة '{header_name}'",
                            "fr": f"Supprimer ou masquer l'en-tête '{header_name}'",
                            "en": f"Remove or obfuscate the '{header_name}' header",
                        },
                        owasp_category="A05",
                        evidence=f"{header_name}: {headers[header_name][:200]}",
                    ))
                    score -= config["deduction"]

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل فحص ترويسات الأمان",
                    "fr": "Échec de l'analyse des en-têtes HTTP",
                    "en": "Security Headers Scan Failed",
                },
                severity="high",
                category="headers",
                description={
                    "ar": f"تعذر جلب الترويسات: {str(e)[:100]}",
                    "fr": f"Impossible de récupérer les en-têtes: {str(e)[:100]}",
                    "en": f"Could not fetch headers: {str(e)[:100]}",
                },
                evidence=str(e)[:200],
            ))
            score = 0

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
