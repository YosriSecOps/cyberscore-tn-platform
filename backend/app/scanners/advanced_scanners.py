"""
Advanced Scanners — الماسحات المتقدمة
Scanner 12: Threat Intelligence (5%)
Scanner 13: Technology Freshness (5%)
Scanner 14: Supply Chain Risk (4%)
Scanner 15: Certificate Management (3%)
Scanner 16: Historical Compliance (2%)
"""

import re
import time
from urllib.parse import urlparse
from datetime import datetime, timezone

import httpx

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS


class ThreatIntelScanner(BaseScanner):
    """Scanner 12: Threat Intelligence via AbuseIPDB/VirusTotal (5%)"""
    category = "threat_intel"
    timeout = 15

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        # Resolve IP
        import socket
        try:
            ip = socket.gethostbyname(hostname)
        except socket.gaierror:
            findings.append(Finding(
                title={
                    "ar": "تعذر حل DNS",
                    "fr": "Résolution DNS impossible",
                    "en": "DNS Resolution Failed",
                },
                severity="high",
                category="threat_intel",
                description={
                    "ar": "تعذر حل اسم النطاق إلى عنوان IP",
                    "fr": "Impossible de résoudre le nom d'hôte en adresse IP",
                    "en": "Could not resolve hostname to IP address",
                },
            ))
            return self._create_result(findings, max_score * 0.3, int((time.time() - start) * 1000))

        # AbuseIPDB check
        abuseipdb_key = kwargs.get("abuseipdb_key", "")
        if abuseipdb_key:
            try:
                async with httpx.AsyncClient(timeout=10) as client:
                    resp = await client.get(
                        "https://api.abuseipdb.com/api/v2/check",
                        params={"ipAddress": ip, "maxAgeInDays": "90"},
                        headers={"Key": abuseipdb_key, "Accept": "application/json"},
                    )
                    data = resp.json().get("data", {})
                    abuse_score = data.get("abuseConfidenceScore", 0)

                    if abuse_score > 50:
                        findings.append(Finding(
                            title={
                                "ar": f"عنوان IP مدرج في القائمة السوداء ({abuse_score}%)",
                                "fr": f"Adresse IP sur liste noire ({abuse_score}%)",
                                "en": f"Blacklisted IP Address ({abuse_score}%)",
                            },
                            severity="critical",
                            category="threat_intel",
                            description={
                                "ar": f"العنوان {ip} لديه مؤشر إساءة {abuse_score}% على AbuseIPDB",
                                "fr": f"L'IP {ip} a un score de suspicion de {abuse_score}% sur AbuseIPDB",
                                "en": f"IP {ip} has abuse score of {abuse_score}% on AbuseIPDB",
                            },
                            remediation={
                                "ar": "تحقق من سمعة IP وفكر في تغيير الاستضافة",
                                "fr": "Vérifier la réputation de l'IP et contacter l'hébergeur",
                                "en": "Investigate IP reputation and consider changing hosting",
                            },
                            nist_function="DE", nist_control="DE.CM-1",
                            evidence=f"IP={ip}, abuseScore={abuse_score}%, reports={data.get('totalReports', 0)}",
                        ))
                        score -= 3.0
                    elif abuse_score > 10:
                        findings.append(Finding(
                            title={
                                "ar": f"عنوان IP مشبوه ({abuse_score}%)",
                                "fr": f"Adresse IP suspecte ({abuse_score}%)",
                                "en": f"Suspicious IP Address ({abuse_score}%)",
                            },
                            severity="medium",
                            category="threat_intel",
                            evidence=f"IP={ip}, abuseScore={abuse_score}%",
                        ))
                        score -= 1.0
                    else:
                        findings.append(Finding(
                            title=f"✓ Clean IP ({ip})",
                            severity="info",
                            category="threat_intel",
                        ))
            except Exception as e:
                findings.append(Finding(
                    title={
                        "ar": "تعذر فحص AbuseIPDB",
                        "fr": "Impossible de vérifier AbuseIPDB",
                        "en": "AbuseIPDB Check Failed",
                    },
                    severity="info",
                    category="threat_intel",
                    description=str(e)[:200],
                ))
        else:
            findings.append(Finding(
                title={
                    "ar": "مفتاح AbuseIPDB غير متوفر",
                    "fr": "Clé AbuseIPDB non configurée",
                    "en": "AbuseIPDB API Key Not Set",
                },
                severity="info",
                category="threat_intel",
            ))

        # VirusTotal check
        vt_key = kwargs.get("virustotal_key", "")
        if vt_key:
            try:
                async with httpx.AsyncClient(timeout=10) as client:
                    resp = await client.get(
                        f"https://www.virustotal.com/api/v3/domains/{hostname}",
                        headers={"x-apikey": vt_key},
                    )
                    if resp.status_code == 200:
                        attrs = resp.json().get("data", {}).get("attributes", {})
                        stats = attrs.get("last_analysis_stats", {})
                        malicious = stats.get("malicious", 0)
                        if malicious > 3:
                            findings.append(Finding(
                                title={
                                    "ar": f"VirusTotal: {malicious} محركات تكشف تهديد",
                                    "fr": f"VirusTotal : {malicious} moteurs détectent une menace",
                                    "en": f"VirusTotal: {malicious} engines detect threats",
                                },
                                severity="critical",
                                category="threat_intel",
                                description={
                                    "ar": f"{malicious} محركات مكافحة فيروسات صنفت هذا النطاق كخبيث",
                                    "fr": f"{malicious} moteurs antivirus ont signalé ce domaine",
                                    "en": f"{malicious} antivirus engines flagged this domain",
                                },
                                evidence=f"VirusTotal malicious count: {malicious}",
                            ))
                            score -= 3.0
                        elif malicious > 0:
                            findings.append(Finding(
                                title={
                                    "ar": f"VirusTotal: {malicious} تنبيه",
                                    "fr": f"VirusTotal : {malicious} alerte(s)",
                                    "en": f"VirusTotal: {malicious} alert(s)",
                                },
                                severity="medium",
                                category="threat_intel",
                                evidence=f"VirusTotal malicious count: {malicious}",
                            ))
                            score -= 1.0
                        else:
                            findings.append(Finding(
                                title="✓ VirusTotal Clean",
                                severity="info",
                                category="threat_intel",
                            ))
            except Exception:
                pass
        
        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class TechDetectionScanner(BaseScanner):
    """Scanner 13: Technology Freshness (5%)"""
    category = "tech"
    timeout = 15

    # Simple fingerprinting patterns
    TECH_PATTERNS = {
        "WordPress": [r"wp-content", r"wp-includes", r"WordPress"],
        "Joomla": [r"com_content", r"/media/jui/", r"Joomla"],
        "Drupal": [r"Drupal\.settings", r"sites/default/files"],
        "jQuery": [r"jquery[.-](\d+\.\d+\.\d+)"],
        "Bootstrap": [r"bootstrap[.-](\d+\.\d+\.\d+)"],
        "Angular": [r"ng-version=\"(\d+)", r"angular"],
        "React": [r"__NEXT_DATA__", r"_next/static", r"react"],
        "PHP": [r"\.php", r"PHPSESSID"],
        "ASP.NET": [r"__VIEWSTATE", r"aspnet", r"\.aspx"],
        "Apache": [],  # Detected via headers
        "Nginx": [],
    }

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True, verify=False) as client:
                response = await client.get(target)
                body = response.text[:10000]
                headers = {k.lower(): v for k, v in response.headers.items()}
                detected = []

                # Check body patterns
                for tech, patterns in self.TECH_PATTERNS.items():
                    for pattern in patterns:
                        match = re.search(pattern, body, re.IGNORECASE)
                        if match:
                            version = match.group(1) if match.lastindex else None
                            detected.append({"name": tech, "version": version})
                            break

                # Check server header
                server = headers.get("server", "")
                if server:
                    detected.append({"name": server.split("/")[0], "version": server.split("/")[1] if "/" in server else None})

                # X-Powered-By
                powered = headers.get("x-powered-by", "")
                if powered:
                    detected.append({"name": powered.split("/")[0], "version": powered.split("/")[1] if "/" in powered else None})

                for tech in detected:
                    v_str = f" v{tech['version']}" if tech.get('version') else ""
                    findings.append(Finding(
                        title={
                            "ar": f"تقنية مكتشفة: {tech['name']}{v_str}",
                            "fr": f"Technologie détectée : {tech['name']}{v_str}",
                            "en": f"Technology Detected: {tech['name']}{v_str}",
                        },
                        severity="info",
                        category="tech",
                        evidence=f"Technology: {tech['name']}{v_str}",
                    ))

                # Outdated technology checks
                if any(t["name"] == "WordPress" for t in detected):
                    findings.append(Finding(
                        title={
                            "ar": "WordPress مكتشف — يجب التحقق من التحديثات",
                            "fr": "WordPress détecté — vérifier les mises à jour",
                            "en": "WordPress Detected — verify updates",
                        },
                        severity="low",
                        category="tech",
                        description={
                            "ar": "مواقع WordPress تتطلب تحديثات أمنية منتظمة",
                            "fr": "Les sites WordPress nécessitent des mises à jour régulières de sécurité",
                            "en": "WordPress sites need regular security updates",
                        },
                        remediation={
                            "ar": "تأكد من تحديث نواة WordPress والقوالب والإضافات",
                            "fr": "Mettre à jour le cœur WordPress, les thèmes et extensions",
                            "en": "Ensure WordPress core, themes, and plugins are up to date",
                        },
                        owasp_category="A06",
                    ))
                    score -= 0.5

                if not detected:
                    findings.append(Finding(
                        title={
                            "ar": "لم يتم كشف تقنيات معروفة",
                            "fr": "Aucune technologie vulnérable détectée",
                            "en": "No known outdated technology detected",
                        },
                        severity="info",
                        category="tech",
                    ))

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل كشف التقنيات",
                    "fr": "Échec de détection technologique",
                    "en": "Tech Detection Failed",
                },
                severity="info",
                category="tech",
                description=str(e)[:200],
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class SupplyChainScanner(BaseScanner):
    """Scanner 14: Supply Chain Risk (4%)"""
    category = "supply_chain"
    timeout = 15

    TRUSTED_DOMAINS = {
        "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "fonts.googleapis.com",
        "fonts.gstatic.com", "code.jquery.com", "unpkg.com", "ajax.googleapis.com",
        "stackpath.bootstrapcdn.com", "maxcdn.bootstrapcdn.com", "use.fontawesome.com",
        "cdn.bootcss.com", "www.googletagmanager.com", "www.google-analytics.com",
    }

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        target_domain = urlparse(target).netloc

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True, verify=False) as client:
                response = await client.get(target)
                body = response.text

                # Find all external resources
                src_urls = re.findall(r'(?:src|href)=["\']?(https?://[^"\'\s>]+)', body)
                external = []
                for url in src_urls:
                    domain = urlparse(url).netloc
                    if domain and domain != target_domain:
                        external.append({"url": url, "domain": domain})

                # Check mixed content (HTTP on HTTPS page)
                if target.startswith("https"):
                    http_resources = [r for r in external if r["url"].startswith("http://")]
                    if http_resources:
                        findings.append(Finding(
                            title={
                                "ar": f"محتوى مختلط: {len(http_resources)} مورد HTTP غير آمن",
                                "fr": f"Contenu mixte : {len(http_resources)} ressource(s) HTTP non sécurisée(s)",
                                "en": f"Mixed Content: {len(http_resources)} HTTP resource(s) loaded",
                            },
                            severity="high",
                            category="supply_chain",
                            description={
                                "ar": "صفحة HTTPS تحمّل موارد عبر HTTP — إمكانية هجوم Downgrade",
                                "fr": "Une page HTTPS charge des ressources en clair HTTP — risque d'attaque par dégradation",
                                "en": "HTTPS page loads HTTP resources — downgrade attack possible",
                            },
                            remediation={
                                "ar": "قم بتغيير جميع روابط الموارد إلى HTTPS",
                                "fr": "Remplacer tous les liens de ressources par HTTPS",
                                "en": "Change all resource URLs to HTTPS",
                            },
                            owasp_category="A08",
                            evidence=f"Mixed HTTP count: {len(http_resources)}, examples: {[r['url'][:60] for r in http_resources[:3]]}",
                        ))
                        score -= 2.0

                # Check untrusted domains
                untrusted = [r for r in external if r["domain"] not in self.TRUSTED_DOMAINS]
                if untrusted:
                    findings.append(Finding(
                        title={
                            "ar": f"{len(untrusted)} مورد خارجي من مصادر غير قياسية",
                            "fr": f"{len(untrusted)} ressource(s) externe(s) provenant de domaines tiers",
                            "en": f"{len(untrusted)} external resource(s) from third-party domains",
                        },
                        severity="low",
                        category="supply_chain",
                        description={
                            "ar": f"تم تحميل موارد خارجية من {len(untrusted)} نطاق غير قياسي",
                            "fr": f"Ressources externes chargées depuis {len(untrusted)} domaine(s) tiers",
                            "en": f"External resources from {len(untrusted)} non-standard domains",
                        },
                        remediation={
                            "ar": "راجع نطاقات الموارد الخارجية واقتصر على المصادر الموثوقة",
                            "fr": "Vérifier la légitimité des domaines tiers et héberger les scripts en local",
                            "en": "Audit third-party scripts and consider self-hosting assets",
                        },
                        evidence=f"Third-party domains: {', '.join(list(set(r['domain'] for r in untrusted))[:6])}",
                    ))
                    if len(untrusted) > 10:
                        score -= 1.0

                # Check SRI (subresource integrity)
                scripts_without_sri = re.findall(r'<script[^>]+src=["\']https?://[^"\']+["\'][^>]*>', body)
                sri_missing = [s for s in scripts_without_sri if "integrity=" not in s]
                if sri_missing:
                    findings.append(Finding(
                        title={
                            "ar": f"خاصية SRI مفقودة في {len(sri_missing)} سكريبت خارجي",
                            "fr": f"Absence de signature SRI sur {len(sri_missing)} script(s) externe(s)",
                            "en": f"Missing SRI hash on {len(sri_missing)} external script(s)",
                        },
                        severity="low",
                        category="supply_chain",
                        description={
                            "ar": "سكريبتات خارجية بدون هاش تكامل الموارد الفرعية (SRI)",
                            "fr": "Scripts externes chargés sans condensat d'intégrité Subresource Integrity (SRI)",
                            "en": "External scripts without Subresource Integrity hashes",
                        },
                        remediation={
                            "ar": "أضف سمة integrity='sha384-...' إلى وسوم script الخارجية",
                            "fr": "Ajouter l'attribut integrity='sha384-...' aux balises script externes",
                            "en": "Add integrity='sha384-...' attribute to external script tags",
                        },
                        owasp_category="A08",
                        evidence=f"Missing SRI count: {len(sri_missing)}",
                    ))
                    score -= 0.5

                findings.append(Finding(
                    title=f"✓ {len(external)} External Resources",
                    severity="info",
                    category="supply_chain",
                    evidence=f"Total external resources: {len(external)}",
                ))

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "فشل فحص سلسلة التوريد",
                    "fr": "Échec de l'analyse supply chain",
                    "en": "Supply Chain Scan Failed",
                },
                severity="info",
                category="supply_chain",
                description=str(e)[:200],
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class CertManagementScanner(BaseScanner):
    """Scanner 15: Certificate Management (3%)"""
    category = "cert"
    timeout = 10

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        import ssl
        import socket
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        try:
            context = ssl.create_default_context()
            with socket.create_connection((hostname, 443), timeout=self.timeout) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()

                    # Check certificate chain length
                    not_before = cert.get("notBefore", "")
                    not_after = cert.get("notAfter", "")

                    if not_after:
                        expiry = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
                        days_left = (expiry - datetime.now(timezone.utc)).days

                        if days_left > 397:
                            findings.append(Finding(
                                title={
                                    "ar": "شهادة بمدة صلاحية طويلة جداً",
                                    "fr": "Certificat avec durée de validité excessive",
                                    "en": "Certificate Valid for Excessive Duration",
                                },
                                severity="low",
                                category="cert",
                                description={
                                    "ar": f"الشهادة صالحة لمدة {days_left} يومًا (>397 يوم)",
                                    "fr": f"Certificat valide pour {days_left} jours (>397 jours recommandés)",
                                    "en": f"Certificate valid for {days_left} days (>397 days)",
                                },
                                remediation={
                                    "ar": "استخدم شهادات بمدة صلاحية أقصر لتحسين الأمان",
                                    "fr": "Privilégier des durées de validité plus courtes (max 397 jours)",
                                    "en": "Use shorter certificate lifetimes for better security",
                                },
                                evidence=f"Days valid: {days_left}",
                            ))
                            score -= 0.5

                    # Check SAN (Subject Alternative Names)
                    san = cert.get("subjectAltName", [])
                    wildcard_sans = [name for typ, name in san if typ == "DNS" and name.startswith("*")]
                    if wildcard_sans:
                        findings.append(Finding(
                            title={
                                "ar": "شهادة Wildcard مستخدمة",
                                "fr": "Certificat Wildcard utilisé",
                                "en": "Wildcard Certificate Detected",
                            },
                            severity="low",
                            category="cert",
                            description={
                                "ar": "تم اكتشاف شهادة Wildcard — توسيع نطاق الهجوم في حال تسريب المفتاح",
                                "fr": "Certificat Wildcard détecté — surface d'attaque élargie en cas de compromission de clé",
                                "en": "Wildcard certificate detected — broader attack surface if key is compromised",
                            },
                            evidence=f"Wildcard SANs: {', '.join(wildcard_sans)}",
                        ))
                        score -= 0.5
                    
                    findings.append(Finding(
                        title="✓ Certificate Valid",
                        severity="info",
                        category="cert",
                        evidence=f"notAfter: {not_after}, SAN count: {len(san)}",
                    ))

        except Exception as e:
            findings.append(Finding(
                title={
                    "ar": "تعذر فحص الشهادة",
                    "fr": "Impossible de vérifier le certificat",
                    "en": "Could Not Verify Certificate",
                },
                severity="medium",
                category="cert",
                description=str(e)[:200],
            ))
            score -= 2.0

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class HistoricalComplianceScanner(BaseScanner):
    """Scanner 16: Historical Compliance (2%) — based on previous scan data"""
    category = "history"
    timeout = 5

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score

        previous_scores = kwargs.get("previous_scores", [])

        if len(previous_scores) >= 2:
            latest = previous_scores[-1]
            previous = previous_scores[-2]
            trend = latest - previous

            if trend < -10:
                findings.append(Finding(
                    title={
                        "ar": f"انخفاض حاد في النتيجة: {trend:+.1f} نقطة",
                        "fr": f"Baisse critique du score : {trend:+.1f} pts",
                        "en": f"Sharp Score Drop: {trend:+.1f} pts",
                    },
                    severity="high",
                    category="history",
                    description={
                        "ar": f"انخفضت النتيجة من {previous:.1f} إلى {latest:.1f}",
                        "fr": f"Le score a chuté de {previous:.1f} à {latest:.1f}",
                        "en": f"Score dropped from {previous:.1f} to {latest:.1f}",
                    },
                    evidence=f"Previous={previous:.1f}, Current={latest:.1f}, Trend={trend:+.1f}",
                ))
                score -= 1.5
            elif trend < -5:
                findings.append(Finding(
                    title={
                        "ar": f"انخفاض في النتيجة: {trend:+.1f} نقطة",
                        "fr": f"Baisse du score : {trend:+.1f} pts",
                        "en": f"Score Decline: {trend:+.1f} pts",
                    },
                    severity="medium",
                    category="history",
                    evidence=f"Trend={trend:+.1f}",
                ))
                score -= 0.5
            elif trend > 5:
                findings.append(Finding(
                    title=f"✓ Score Improved ({trend:+.1f} pts)",
                    severity="info",
                    category="history",
                    evidence=f"Trend={trend:+.1f}",
                ))
        else:
            findings.append(Finding(
                title={
                    "ar": "أول فحص — لا توجد بيانات تاريخية",
                    "fr": "Premier audit — pas d'historique antérieur",
                    "en": "First Scan — no historical baseline",
                },
                severity="info",
                category="history",
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
