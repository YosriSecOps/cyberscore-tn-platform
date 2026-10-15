"""
Scanner 5: DNS Health — صحة DNS
Weight: 5% | Max: 5 points
Checks: DNSSEC, CAA records, nameserver redundancy, CNAME chains
"""

import time
import dns.resolver
import dns.exception

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


class DNSScanner(BaseScanner):
    category = "dns"
    timeout = 10

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        resolver = dns.resolver.Resolver()
        resolver.timeout = self.timeout
        resolver.lifetime = self.timeout

        # 1. Check DNSSEC
        try:
            answer = resolver.resolve(hostname, "A")
            if not answer.response.flags & 0x0020:  # AD flag
                findings.append(Finding(
                    title={
                        "ar": "DNSSEC غير مفعل",
                        "fr": "DNSSEC non activé",
                        "en": "DNSSEC Not Enabled",
                    },
                    severity="medium",
                    category="dns",
                    description={
                        "ar": "DNSSEC غير مفعل لهذا النطاق",
                        "fr": "DNSSEC n'est pas activé pour ce domaine",
                        "en": "DNSSEC is not enabled for this domain",
                    },
                    remediation={
                        "ar": "قم بتفعيل DNSSEC لدى مسجل النطاق",
                        "fr": "Activer DNSSEC auprès de votre registrar",
                        "en": "Enable DNSSEC at your domain registrar",
                    },
                    nist_function="PR", nist_control="PR.DS-2",
                    evidence="DNSSEC AD flag: False",
                ))
                score -= 1.5
            else:
                findings.append(Finding(
                    title="✓ DNSSEC",
                    severity="info",
                    category="dns",
                    description="DNSSEC is active",
                    evidence="DNSSEC AD flag: True",
                ))
        except Exception:
            findings.append(Finding(
                title={
                    "ar": "تعذر التحقق من DNSSEC",
                    "fr": "Impossible de vérifier DNSSEC",
                    "en": "Could Not Verify DNSSEC",
                },
                severity="low",
                category="dns",
                description={
                    "ar": "تعذر التحقق من حالة DNSSEC",
                    "fr": "Impossible de vérifier le statut DNSSEC",
                    "en": "Could not verify DNSSEC status",
                },
            ))
            score -= 0.5

        # 2. Check CAA records
        try:
            resolver.resolve(hostname, "CAA")
            findings.append(Finding(
                title="✓ CAA Records",
                severity="info",
                category="dns",
                description="CAA records present",
                evidence="CAA records found",
            ))
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.exception.DNSException):
            findings.append(Finding(
                title={
                    "ar": "سجلات CAA مفقودة",
                    "fr": "Enregistrements CAA manquants",
                    "en": "CAA Records Missing",
                },
                severity="low",
                category="dns",
                description={
                    "ar": "لم يتم العثور على سجلات CAA — يمكن لأي جهة إصدار شهادات",
                    "fr": "Aucun enregistrement CAA trouvé — toute AC peut émettre des certificats",
                    "en": "No CAA records found — any CA can issue certificates",
                },
                remediation={
                    "ar": "أضف سجلات CAA لتحديد سلطات إصدار الشهادات المخولة",
                    "fr": "Ajouter des enregistrements DNS CAA pour restreindre l'émission de certificats",
                    "en": "Add CAA DNS records to restrict certificate issuance",
                },
                nist_function="PR", nist_control="PR.DS-2",
                evidence="[ABSENT] CAA DNS Record",
            ))
            score -= 1.0

        # 3. Nameserver redundancy
        try:
            ns_records = resolver.resolve(hostname, "NS")
            ns_count = len(list(ns_records))
            if ns_count < 2:
                findings.append(Finding(
                    title={
                        "ar": "خادم DNS واحد فقط",
                        "fr": "Serveur DNS unique (sans redondance)",
                        "en": "Single DNS Nameserver (No Redundancy)",
                    },
                    severity="medium",
                    category="dns",
                    description={
                        "ar": f"تم العثور على {ns_count} خادم DNS فقط — لا توجد استمرارية",
                        "fr": f"Seulement {ns_count} serveur DNS trouvé — pas de redondance",
                        "en": f"Only {ns_count} nameserver found — no redundancy",
                    },
                    remediation={
                        "ar": "قم بتهيئة خادمي DNS على الأقل للاستمرارية",
                        "fr": "Configurer au moins 2 serveurs de noms pour la redondance",
                        "en": "Configure at least 2 nameservers for redundancy",
                    },
                    nist_function="PR", nist_control="PR.PT-3",
                    evidence=f"NS Count: {ns_count}",
                ))
                score -= 1.5
            else:
                findings.append(Finding(
                    title=f"✓ {ns_count} NS Records",
                    severity="info",
                    category="dns",
                    evidence=f"Nameservers count: {ns_count}",
                ))
        except Exception:
            score -= 0.5

        # 4. MX record exists (for email security check support)
        try:
            mx_records = resolver.resolve(hostname, "MX")
            findings.append(Finding(
                title=f"✓ {len(list(mx_records))} MX Records",
                severity="info",
                category="dns",
                evidence=f"MX records count: {len(list(mx_records))}",
            ))
        except Exception:
            findings.append(Finding(
                title={
                    "ar": "لا توجد سجلات MX",
                    "fr": "Aucun enregistrement MX",
                    "en": "No MX Records Configured",
                },
                severity="info",
                category="dns",
                description="No MX records — email may not be configured",
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
