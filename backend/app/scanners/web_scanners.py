"""
Scanner 6: Cookie Security — أمان الكوكيز
Scanner 7: Content Security Policy (CSP) — سياسة أمان المحتوى
Scanner 9: Information Disclosure — تسريب المعلومات

Combined into one file since all use httpx response analysis.
Weights: Cookie 4% | CSP 5% | Info Disclosure 5%
"""

import re
import time
import httpx

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


class CookieScanner(BaseScanner):
    """Scanner 6: Cookie Security (4%)"""
    category = "cookie"
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
                raise RuntimeError("No HTTP response for cookies")

            cookies = response.headers.get_list("set-cookie")

            if not cookies:
                findings.append(Finding(
                    title="✓ No exposed cookies",
                    severity="info",
                    category="cookie",
                ))
            else:
                for cookie in cookies:
                    cookie_lower = cookie.lower()
                    cookie_name = cookie.split("=")[0].strip()

                    if "secure" not in cookie_lower:
                        findings.append(Finding(
                            title={
                                "ar": f"كوكي بدون علامة Secure: {cookie_name}",
                                "fr": f"Cookie sans flag Secure : {cookie_name}",
                                "en": f"Cookie Missing Secure Flag: {cookie_name}",
                            },
                            severity="medium",
                            category="cookie",
                            description={
                                "ar": "الكوكي لا يحمل علامة Secure — يُرسل عبر HTTP",
                                "fr": "Cookie sans flag Secure — envoyé en clair via HTTP",
                                "en": "Cookie missing Secure flag — sent over HTTP",
                            },
                            remediation={
                                "ar": "أضف علامة Secure لجميع الكوكيز",
                                "fr": "Ajouter le flag 'Secure' à tous les cookies",
                                "en": "Add 'Secure' flag to all cookies",
                            },
                            owasp_category="A05",
                            evidence=f"Set-Cookie: {cookie_name} [MISSING Secure]",
                        ))
                        score -= 1.0

                    if "httponly" not in cookie_lower:
                        findings.append(Finding(
                            title={
                                "ar": f"كوكي بدون علامة HttpOnly: {cookie_name}",
                                "fr": f"Cookie sans flag HttpOnly : {cookie_name}",
                                "en": f"Cookie Missing HttpOnly Flag: {cookie_name}",
                            },
                            severity="medium",
                            category="cookie",
                            description={
                                "ar": "الكوكي لا يحمل علامة HttpOnly — متاح عبر JavaScript",
                                "fr": "Cookie sans flag HttpOnly — accessible via JavaScript",
                                "en": "Cookie missing HttpOnly flag — accessible via JavaScript",
                            },
                            remediation={
                                "ar": "أضف علامة HttpOnly لمنع سرقة الكوكيز عبر XSS",
                                "fr": "Ajouter le flag 'HttpOnly' pour prévenir le vol de cookies via XSS",
                                "en": "Add 'HttpOnly' flag to prevent XSS cookie theft",
                            },
                            owasp_category="A03",
                            evidence=f"Set-Cookie: {cookie_name} [MISSING HttpOnly]",
                        ))
                        score -= 1.0

                    if "samesite" not in cookie_lower:
                        findings.append(Finding(
                            title={
                                "ar": f"كوكي بدون علامة SameSite: {cookie_name}",
                                "fr": f"Cookie sans attribut SameSite : {cookie_name}",
                                "en": f"Cookie Missing SameSite Attribute: {cookie_name}",
                            },
                            severity="low",
                            category="cookie",
                            description={
                                "ar": "الكوكي لا يحمل خاصية SameSite — خطر CSRF",
                                "fr": "Cookie sans attribut SameSite — risque CSRF",
                                "en": "Cookie missing SameSite attribute — CSRF risk",
                            },
                            remediation={
                                "ar": "أضف SameSite=Strict أو SameSite=Lax",
                                "fr": "Ajouter 'SameSite=Strict' ou 'SameSite=Lax'",
                                "en": "Add 'SameSite=Strict' or 'SameSite=Lax'",
                            },
                            owasp_category="A01",
                            evidence=f"Set-Cookie: {cookie_name} [MISSING SameSite]",
                        ))
                        score -= 0.5

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل فحص الكوكيز",
                    "fr": "Échec de l'analyse des cookies",
                    "en": "Cookie Scan Failed",
                },
                severity="low",
                category="cookie",
                description=str(e)[:200],
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class CSPScanner(BaseScanner):
    """Scanner 7: Content Security Policy (5%)"""
    category = "csp"
    timeout = 15

    DANGEROUS_DIRECTIVES = ["'unsafe-inline'", "'unsafe-eval'", "*", "data:"]

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
                raise RuntimeError("No HTTP response for CSP")

            csp = response.headers.get("content-security-policy", "")

            if not csp:
                findings.append(Finding(
                    title={
                        "ar": "سياسة أمان المحتوى (CSP) مفقودة",
                        "fr": "Content Security Policy (CSP) absente",
                        "en": "Content Security Policy (CSP) Missing",
                    },
                    severity="high",
                    category="csp",
                    description={
                        "ar": "لم يُعثر على ترويسة Content-Security-Policy",
                        "fr": "Aucun en-tête Content-Security-Policy trouvé",
                        "en": "No Content-Security-Policy header found",
                    },
                    remediation={
                        "ar": "طبّق ترويسة Content-Security-Policy",
                        "fr": "Implémenter un en-tête Content-Security-Policy",
                        "en": "Implement a Content-Security-Policy header",
                    },
                    owasp_category="A05",
                    nist_function="PR", nist_control="PR.IP-1",
                    iso27002_control="A.8.26",
                    evidence="[ABSENT] content-security-policy",
                ))
                score -= 4.0
            else:
                # Check for dangerous directives
                for directive in self.DANGEROUS_DIRECTIVES:
                    if directive in csp:
                        findings.append(Finding(
                            title={
                                "ar": f"CSP يحتوي على توجيه خطير: {directive}",
                                "fr": f"CSP contient une directive dangereuse : {directive}",
                                "en": f"CSP Contains Dangerous Directive: {directive}",
                            },
                            severity="medium",
                            category="csp",
                            description={
                                "ar": f"CSP يحتوي على '{directive}' مما يضعف الحماية",
                                "fr": f"CSP contient '{directive}' ce qui affaiblit la protection",
                                "en": f"CSP contains '{directive}' which weakens protection",
                            },
                            remediation={
                                "ar": f"أزل '{directive}' من CSP واستخدم nonces أو hashes",
                                "fr": f"Supprimer '{directive}' du CSP et utiliser des nonces ou des hashes",
                                "en": f"Remove '{directive}' from CSP and use nonces or hashes",
                            },
                            owasp_category="A05",
                            evidence=f"CSP contains: {directive}",
                        ))
                        score -= 0.5

                # Check for default-src
                if "default-src" not in csp:
                    findings.append(Finding(
                        title={
                            "ar": "CSP بدون default-src",
                            "fr": "CSP sans default-src",
                            "en": "CSP Missing default-src",
                        },
                        severity="medium",
                        category="csp",
                        description={
                            "ar": "CSP لا يحتوي على توجيه default-src الاحتياطي",
                            "fr": "CSP sans directive de repli 'default-src'",
                            "en": "CSP missing 'default-src' fallback directive",
                        },
                        remediation={
                            "ar": "أضف توجيه default-src إلى CSP",
                            "fr": "Ajouter la directive 'default-src' au CSP",
                            "en": "Add 'default-src' directive to CSP",
                        },
                        evidence="[ABSENT] default-src in CSP",
                    ))
                    score -= 1.0

                # Check for script-src
                if "script-src" not in csp and "default-src" not in csp:
                    findings.append(Finding(
                        title={
                            "ar": "CSP بدون script-src",
                            "fr": "CSP sans script-src",
                            "en": "CSP Missing script-src",
                        },
                        severity="medium",
                        category="csp",
                        description={
                            "ar": "CSP لا يحتوي على توجيه script-src",
                            "fr": "CSP sans directive 'script-src'",
                            "en": "CSP missing 'script-src' directive",
                        },
                        remediation={
                            "ar": "أضف توجيه script-src للتحكم في مصادر JavaScript",
                            "fr": "Ajouter la directive 'script-src' pour contrôler les sources JavaScript",
                            "en": "Add 'script-src' directive to control JavaScript sources",
                        },
                        evidence="[ABSENT] script-src in CSP",
                    ))
                    score -= 1.0

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل فحص CSP",
                    "fr": "Échec de l'analyse CSP",
                    "en": "CSP Scan Failed",
                },
                severity="low",
                category="csp",
                description=str(e)[:200],
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class InfoDisclosureScanner(BaseScanner):
    """Scanner 9: Information Disclosure (5%)"""
    category = "info"
    timeout = 15

    SENSITIVE_PATHS = [
        ("/.env", {
            "ar": "ملف البيئة مكشوف",
            "fr": "Fichier d'environnement exposé",
            "en": "Environment file exposed",
        }),
        ("/.git/HEAD", {
            "ar": "مستودع Git مكشوف",
            "fr": "Dépôt Git exposé",
            "en": "Git repository exposed",
        }),
        ("/wp-admin/", {
            "ar": "لوحة إدارة WordPress مكشوفة",
            "fr": "Panneau d'administration WordPress accessible",
            "en": "WordPress admin panel accessible",
        }),
        ("/phpinfo.php", {
            "ar": "صفحة PHP info مكشوفة",
            "fr": "Page phpinfo exposée",
            "en": "PHP info page exposed",
        }),
        ("/server-status", {
            "ar": "حالة خادم Apache مكشوفة",
            "fr": "Apache server-status exposé",
            "en": "Apache server-status exposed",
        }),
        ("/elmah.axd", {
            "ar": "سجل أخطاء .NET مكشوف",
            "fr": "Journal d'erreurs .NET exposé",
            "en": ".NET error log exposed",
        }),
        ("/.DS_Store", {
            "ar": "ملف macOS metadata مكشوف",
            "fr": "Fichier metadata macOS exposé",
            "en": "macOS metadata file exposed",
        }),
        ("/robots.txt", None),  # Just informational
    ]

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        base_url = target.rstrip("/")

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=False, verify=False) as client:
                for path, desc in self.SENSITIVE_PATHS:
                    try:
                        resp = await client.get(f"{base_url}{path}")
                        if resp.status_code == 200 and len(resp.content) > 10:
                            if desc is None:
                                # robots.txt is informational
                                findings.append(Finding(
                                    title="✓ robots.txt",
                                    severity="info",
                                    category="info",
                                    evidence=f"{path} ({len(resp.content)} bytes)",
                                ))
                            else:
                                severity = "critical" if path in ("/.env", "/.git/HEAD") else "high"
                                findings.append(Finding(
                                    title={
                                        "ar": f"مسار حساس مكشوف: {path}",
                                        "fr": f"Chemin sensible exposé : {path}",
                                        "en": f"Sensitive Path Exposed: {path}",
                                    },
                                    severity=severity,
                                    category="info",
                                    description=desc,
                                    remediation={
                                        "ar": f"امنع الوصول إلى {path} في إعدادات خادم الويب",
                                        "fr": f"Bloquer l'accès à {path} dans la configuration du serveur web",
                                        "en": f"Block access to {path} in your web server config",
                                    },
                                    owasp_category="A01",
                                    nist_function="PR", nist_control="PR.AC-1",
                                    evidence=f"HTTP {resp.status_code} on {path} ({len(resp.content)} bytes)",
                                ))
                                score -= 2.0 if severity == "critical" else 1.0
                    except Exception:
                        pass  # Connection error on specific path — skip

                # Check for version info in HTML
                try:
                    resp = await client.get(base_url)
                    body = resp.text[:5000].lower()
                    generators = re.findall(r'<meta\s+name=["\']generator["\']\s+content=["\']([^"\']+)', body)
                    for gen in generators:
                        findings.append(Finding(
                            title={
                                "ar": f"إفشاء إصدار CMS: {gen}",
                                "fr": f"Divulgation de version CMS : {gen}",
                                "en": f"CMS Version Disclosure: {gen}",
                            },
                            severity="medium",
                            category="info",
                            description={
                                "ar": f"علامة meta generator تكشف: {gen}",
                                "fr": f"La balise meta generator révèle : {gen}",
                                "en": f"Generator meta tag reveals: {gen}",
                            },
                            remediation={
                                "ar": "أزل علامة meta generator من HTML",
                                "fr": "Supprimer la balise meta generator du HTML",
                                "en": "Remove the generator meta tag from HTML",
                            },
                            owasp_category="A05",
                            evidence=f"<meta name=\"generator\" content=\"{gen}\">",
                        ))
                        score -= 1.0
                except Exception:
                    pass

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل فحص تسريب المعلومات",
                    "fr": "Échec de l'analyse de divulgation d'informations",
                    "en": "Information Disclosure Scan Failed",
                },
                severity="low",
                category="info",
                description=str(e)[:200],
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
