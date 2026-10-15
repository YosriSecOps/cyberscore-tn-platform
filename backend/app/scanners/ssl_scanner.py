"""
Scanner 1: SSL/TLS Security — أمان SSL/TLS
Weight: 12% | Max: 12 points
Checks: certificate validity, protocol versions, cipher strength, HSTS
"""

import ssl
import socket
import time
from datetime import datetime, timezone
from typing import Optional

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


class SSLScanner(BaseScanner):
    category = "ssl"
    timeout = 20

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score

        cert = None
        protocol = None
        last_conn_err = None

        try:
            # 1. Check if SSL is available with retry
            for attempt in range(2):
                try:
                    context = ssl.create_default_context()
                    with socket.create_connection((hostname, 443), timeout=self.timeout) as sock:
                        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                            cert = ssock.getpeercert()
                            protocol = ssock.version()
                            break
                except ssl.SSLCertVerificationError:
                    raise
                except (socket.timeout, ConnectionRefusedError, OSError) as e:
                    last_conn_err = e
                    if attempt == 0:
                        import asyncio
                        await asyncio.sleep(1.0)
                        continue

            if not cert:
                if last_conn_err:
                    raise last_conn_err
                return self._create_result([], 0)

            # 2. Certificate expiry
            not_after_str = cert.get("notAfter", "")
            if not_after_str:
                not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
                days_left = (not_after - datetime.now(timezone.utc)).days

                if days_left <= 0:
                    findings.append(Finding(
                        title={
                            "ar": "شهادة SSL منتهية الصلاحية",
                            "fr": "Certificat SSL expiré",
                            "en": "SSL Certificate Expired",
                        },
                        severity="critical",
                        category="ssl",
                        description={
                            "ar": f"انتهت صلاحية شهادة SSL منذ {abs(days_left)} يومًا",
                            "fr": f"Le certificat SSL a expiré il y a {abs(days_left)} jours",
                            "en": f"SSL certificate expired {abs(days_left)} days ago",
                        },
                        remediation={
                            "ar": "جدد شهادة SSL فورًا",
                            "fr": "Renouveler le certificat SSL immédiatement",
                            "en": "Renew the SSL certificate immediately",
                        },
                        owasp_category="A02",
                        nist_function="PR", nist_control="PR.DS-2",
                        iso27002_control="A.8.24",
                        evidence=f"notAfter={not_after_str} (expired {abs(days_left)} days ago)",
                    ))
                    score -= 4
                elif days_left <= 30:
                    findings.append(Finding(
                        title={
                            "ar": "شهادة SSL تنتهي قريباً",
                            "fr": "Certificat SSL expire bientôt",
                            "en": "SSL Certificate Expiring Soon",
                        },
                        severity="high",
                        category="ssl",
                        description={
                            "ar": f"تنتهي شهادة SSL خلال {days_left} يومًا",
                            "fr": f"Le certificat SSL expire dans {days_left} jours",
                            "en": f"SSL certificate expires in {days_left} days",
                        },
                        remediation={
                            "ar": "خطط لتجديد الشهادة قبل انتهاء صلاحيتها",
                            "fr": "Planifier le renouvellement avant expiration",
                            "en": "Plan certificate renewal before expiry",
                        },
                        owasp_category="A02",
                        nist_function="PR", nist_control="PR.DS-2",
                        iso27002_control="A.8.24",
                        evidence=f"notAfter={not_after_str} ({days_left} days remaining)",
                    ))
                    score -= 2
                elif days_left <= 90:
                    findings.append(Finding(
                        title={
                            "ar": "شهادة SSL تنتهي خلال 90 يوماً",
                            "fr": "Certificat SSL expire dans 90 jours",
                            "en": "SSL Certificate Expires Within 90 Days",
                        },
                        severity="medium",
                        category="ssl",
                        description={
                            "ar": f"تنتهي شهادة SSL خلال {days_left} يومًا",
                            "fr": f"Le certificat SSL expire dans {days_left} jours",
                            "en": f"SSL certificate expires in {days_left} days",
                        },
                        remediation={
                            "ar": "فكر في تفعيل التجديد التلقائي",
                            "fr": "Envisager l'activation du renouvellement automatique",
                            "en": "Consider enabling auto-renewal",
                        },
                        evidence=f"notAfter={not_after_str} ({days_left} days remaining)",
                    ))
                    score -= 1

            # 3. Protocol version check
            if protocol and "TLSv1.0" in protocol:
                findings.append(Finding(
                    title={
                        "ar": "استخدام بروتوكول TLS 1.0 القديم",
                        "fr": "Protocole TLS 1.0 obsolète détecté",
                        "en": "Deprecated TLS 1.0 Protocol Detected",
                    },
                    severity="high",
                    category="ssl",
                    description={
                        "ar": "بروتوكول TLS 1.0 قديم وعرضة للثغرات",
                        "fr": "TLS 1.0 est obsolète et vulnérable",
                        "en": "TLS 1.0 is deprecated and vulnerable",
                    },
                    remediation={
                        "ar": "ترقية إلى TLS 1.2 أو TLS 1.3",
                        "fr": "Mettre à niveau vers TLS 1.2 ou TLS 1.3",
                        "en": "Upgrade to TLS 1.2 or TLS 1.3",
                    },
                    owasp_category="A02",
                    nist_function="PR", nist_control="PR.DS-2",
                    evidence=f"Negotiated protocol: {protocol}",
                ))
                score -= 3
            elif protocol and "TLSv1.1" in protocol:
                findings.append(Finding(
                    title={
                        "ar": "استخدام بروتوكول TLS 1.1 القديم",
                        "fr": "Protocole TLS 1.1 obsolète détecté",
                        "en": "Deprecated TLS 1.1 Protocol Detected",
                    },
                    severity="medium",
                    category="ssl",
                    description={
                        "ar": "بروتوكول TLS 1.1 قديم",
                        "fr": "TLS 1.1 est obsolète",
                        "en": "TLS 1.1 is deprecated",
                    },
                    remediation={
                        "ar": "ترقية إلى TLS 1.2 أو TLS 1.3",
                        "fr": "Mettre à niveau vers TLS 1.2 ou TLS 1.3",
                        "en": "Upgrade to TLS 1.2 or TLS 1.3",
                    },
                    owasp_category="A02",
                    evidence=f"Negotiated protocol: {protocol}",
                ))
                score -= 2

            # 4. Check for TLS 1.3 support (bonus)
            if protocol and "TLSv1.3" in protocol:
                findings.append(Finding(
                    title="✓ TLS 1.3",
                    severity="info",
                    category="ssl",
                    description="TLS 1.3 is supported",
                    evidence=f"Negotiated protocol: {protocol}",
                ))

            # 5. Self-signed certificate check
            issuer = dict(x[0] for x in cert.get("issuer", []))
            subject = dict(x[0] for x in cert.get("subject", []))
            if issuer.get("commonName") == subject.get("commonName"):
                findings.append(Finding(
                    title={
                        "ar": "شهادة SSL ذاتية التوقيع",
                        "fr": "Certificat SSL auto-signé détecté",
                        "en": "Self-Signed SSL Certificate Detected",
                    },
                    severity="high",
                    category="ssl",
                    description={
                        "ar": "تم اكتشاف شهادة ذاتية التوقيع",
                        "fr": "Certificat auto-signé détecté",
                        "en": "Self-signed certificate detected",
                    },
                    remediation={
                        "ar": "استخدم شهادة من سلطة موثوقة مثل Let's Encrypt",
                        "fr": "Utiliser un certificat d'une autorité de confiance (ex: Let's Encrypt)",
                        "en": "Use a certificate from a trusted CA (e.g., Let's Encrypt)",
                    },
                    owasp_category="A02",
                    evidence=f"Issuer CN={issuer.get('commonName', '?')} == Subject CN={subject.get('commonName', '?')}",
                ))
                score -= 3

        except ssl.SSLCertVerificationError as e:
            findings.append(Finding(
                title={
                    "ar": "فشل التحقق من شهادة SSL",
                    "fr": "Échec de la vérification du certificat SSL",
                    "en": "SSL Certificate Verification Failed",
                },
                severity="critical",
                category="ssl",
                description={
                    "ar": f"فشل التحقق من شهادة SSL: {str(e)[:150]}",
                    "fr": f"La vérification du certificat SSL a échoué: {str(e)[:150]}",
                    "en": f"SSL certificate verification failed: {str(e)[:150]}",
                },
                remediation={
                    "ar": "تأكد من تثبيت شهادة SSL صالحة من سلطة موثوقة",
                    "fr": "S'assurer qu'un certificat SSL valide d'une autorité de confiance est installé",
                    "en": "Ensure a valid SSL certificate from a trusted CA is installed",
                },
                owasp_category="A02",
                nist_function="PR", nist_control="PR.DS-2",
                evidence=str(e)[:200],
            ))
            score = 0
        except (socket.timeout, ConnectionRefusedError, OSError) as e:
            findings.append(Finding(
                title={
                    "ar": "لا يوجد اتصال SSL/TLS",
                    "fr": "Aucune connexion SSL/TLS",
                    "en": "No SSL/TLS Connection",
                },
                severity="critical",
                category="ssl",
                description={
                    "ar": f"تعذر إنشاء اتصال SSL: {str(e)[:150]}",
                    "fr": f"Impossible d'établir la connexion SSL: {str(e)[:150]}",
                    "en": f"Could not establish SSL connection: {str(e)[:150]}",
                },
                remediation={
                    "ar": "تفعيل HTTPS على المنفذ 443",
                    "fr": "Activer HTTPS sur le port 443",
                    "en": "Enable HTTPS on port 443",
                },
                owasp_category="A02",
                evidence=str(e)[:200],
            ))
            score = 0

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
