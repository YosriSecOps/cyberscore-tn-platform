"""
Scanner 8: Email Security — أمان البريد الإلكتروني
Weight: 4% | Max: 4 points
Checks: SPF, DKIM, DMARC records
"""

import time
import dns.resolver
import dns.exception

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


class EmailSecurityScanner(BaseScanner):
    category = "email"
    timeout = 10

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        resolver = dns.resolver.Resolver()
        resolver.timeout = self.timeout

        # 1. SPF record
        try:
            txt_records = resolver.resolve(hostname, "TXT")
            spf_found = False
            for record in txt_records:
                txt = record.to_text().strip('"')
                if txt.startswith("v=spf1"):
                    spf_found = True
                    if "+all" in txt:
                        findings.append(Finding(
                            title={
                                "ar": "سجل SPF ضعيف (+all)",
                                "fr": "Enregistrement SPF permissif (+all)",
                                "en": "Weak SPF Record (+all)",
                            },
                            severity="high",
                            category="email",
                            description={
                                "ar": "سجل SPF يستخدم '+all' مما يسمح لأي خادم بإرسال بريد إلكتروني",
                                "fr": "L'enregistrement SPF utilise '+all', autorisant tout serveur à envoyer des emails",
                                "en": "SPF record uses '+all' which allows any server to send email",
                            },
                            remediation={
                                "ar": "غيّر '+all' إلى '-all' أو '~all'",
                                "fr": "Remplacer '+all' par '-all' ou '~all'",
                                "en": "Change '+all' to '-all' or '~all'",
                            },
                            owasp_category="A05",
                            evidence=f"SPF TXT: {txt[:200]}",
                        ))
                        score -= 1.5
                    else:
                        findings.append(Finding(
                            title="✓ SPF Record",
                            severity="info",
                            category="email",
                            evidence=f"SPF: {txt[:200]}",
                        ))
                    break
            if not spf_found:
                findings.append(Finding(
                    title={
                        "ar": "سجل SPF مفقود",
                        "fr": "Enregistrement SPF manquant",
                        "en": "SPF Record Missing",
                    },
                    severity="medium",
                    category="email",
                    description={
                        "ar": "لم يتم العثور على سجل SPF — انتحال البريد الإلكتروني ممكن",
                        "fr": "Aucun enregistrement SPF trouvé — risque d'usurpation d'identité (spoofing)",
                        "en": "No SPF record found — email spoofing possible",
                    },
                    remediation={
                        "ar": "أضف سجل TXT مع سياسة 'v=spf1'",
                        "fr": "Ajouter un enregistrement TXT avec une politique 'v=spf1'",
                        "en": "Add a TXT record with 'v=spf1' policy",
                    },
                    nist_function="PR", nist_control="PR.DS-2",
                    evidence="[ABSENT] SPF TXT Record",
                ))
                score -= 1.5
        except Exception:
            findings.append(Finding(
                title={
                    "ar": "تعذر فحص SPF",
                    "fr": "Impossible de vérifier SPF",
                    "en": "Could Not Check SPF",
                },
                severity="low",
                category="email",
            ))
            score -= 0.5

        # 2. DMARC record
        try:
            dmarc_records = resolver.resolve(f"_dmarc.{hostname}", "TXT")
            dmarc_found = False
            for record in dmarc_records:
                txt = record.to_text().strip('"')
                if "v=DMARC1" in txt:
                    dmarc_found = True
                    if "p=none" in txt:
                        findings.append(Finding(
                            title={
                                "ar": "سياسة DMARC ضعيفة (p=none)",
                                "fr": "Politique DMARC permissive (p=none)",
                                "en": "Weak DMARC Policy (p=none)",
                            },
                            severity="low",
                            category="email",
                            description={
                                "ar": "سياسة DMARC هي 'none' — لا يوجد تطبيق صارم",
                                "fr": "La politique DMARC est sur 'none' — aucun blocage effectif",
                                "en": "DMARC policy is 'none' — no enforcement",
                            },
                            remediation={
                                "ar": "غيّر سياسة DMARC إلى 'quarantine' أو 'reject'",
                                "fr": "Passer la politique DMARC à 'quarantine' ou 'reject'",
                                "en": "Change DMARC policy to 'quarantine' or 'reject'",
                            },
                            evidence=f"DMARC TXT: {txt[:200]}",
                        ))
                        score -= 0.5
                    else:
                        findings.append(Finding(
                            title="✓ DMARC Active",
                            severity="info",
                            category="email",
                            evidence=f"DMARC: {txt[:200]}",
                        ))
                    break
            if not dmarc_found:
                findings.append(Finding(
                    title={
                        "ar": "سجل DMARC مفقود",
                        "fr": "Enregistrement DMARC manquant",
                        "en": "DMARC Record Missing",
                    },
                    severity="medium",
                    category="email",
                    description={
                        "ar": "لم يتم العثور على سجل DMARC",
                        "fr": "Aucun enregistrement DMARC trouvé",
                        "en": "No DMARC record found",
                    },
                    remediation={
                        "ar": "أضف سجل TXT عند _dmarc.domain مع سياسة DMARC",
                        "fr": "Ajouter un enregistrement TXT sur _dmarc.domaine avec politique DMARC",
                        "en": "Add a TXT record at _dmarc.domain with DMARC policy",
                    },
                    evidence="[ABSENT] _dmarc TXT Record",
                ))
                score -= 1.5
        except Exception:
            findings.append(Finding(
                title={
                    "ar": "سجل DMARC مفقود",
                    "fr": "Enregistrement DMARC manquant",
                    "en": "DMARC Record Missing",
                },
                severity="medium",
                category="email",
                description={
                    "ar": "لم يتم العثور على سجل DMARC",
                    "fr": "Aucun enregistrement DMARC trouvé",
                    "en": "No DMARC record found",
                },
                remediation={
                    "ar": "أضف سجل TXT عند _dmarc.domain",
                    "fr": "Ajouter l'enregistrement TXT '_dmarc.domaine'",
                    "en": "Add '_dmarc.domain' TXT record",
                },
                evidence="[ABSENT] _dmarc TXT Record",
            ))
            score -= 1.5

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
