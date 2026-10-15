"""
Docker-based scanners — Scanners that invoke Docker containers
Scanner 3:  OWASP Vulnerabilities (ZAP)   — 15%
Scanner 4:  Network Security (Nmap)       — 8%
Scanner 10: Patching Cadence (Nuclei)     — 8%
Scanner 11: Subdomain Discovery           — 5%
"""

import json
import time
import subprocess
import logging

from app.scanners.base import BaseScanner, Finding, ScanCategoryResult, CATEGORY_WEIGHTS

logger = logging.getLogger("cyberscore.scanners.docker")


import shutil

def _run_tool_command(tool_name: str, container: str, cmd: list[str], timeout: int = 120) -> str:
    """Execute a tool command natively if installed, or via Docker container."""
    # 1. Native execution if tool is present on host (e.g. /usr/bin/nmap)
    native_path = shutil.which(tool_name)
    if native_path:
        try:
            native_cmd = [native_path] + cmd
            result = subprocess.run(native_cmd, capture_output=True, text=True, timeout=timeout)
            if result.stdout:
                return result.stdout
        except subprocess.TimeoutExpired:
            logger.warning(f"Native {tool_name} timeout: {' '.join(cmd[:3])}")
            return ""
        except Exception as e:
            logger.warning(f"Native {tool_name} error: {e}")

    # 2. Docker container execution if Docker daemon is available
    if shutil.which("docker"):
        full_cmd = ["docker", "exec", container, tool_name] + cmd
        try:
            result = subprocess.run(full_cmd, capture_output=True, text=True, timeout=timeout)
            return result.stdout
        except subprocess.TimeoutExpired:
            logger.warning(f"Docker exec timeout for {container}: {' '.join(cmd[:3])}")
            return ""
        except Exception as e:
            logger.error(f"Docker exec error for {container}: {e}")
            return ""

    return ""


def _docker_exec(container: str, cmd: list[str], timeout: int = 120) -> str:
    """Backward compatibility wrapper for _docker_exec."""
    tool = cmd[0] if cmd else "nmap"
    args = cmd[1:] if len(cmd) > 1 else []
    return _run_tool_command(tool, container, args, timeout=timeout)


class OWASPScanner(BaseScanner):
    """Scanner 3: OWASP Vulnerabilities via ZAP or Native Heuristic Audit (15%)"""
    category = "owasp"
    timeout = 300  # 5 minutes for ZAP

    ZAP_SEVERITY_MAP = {"3": "critical", "2": "high", "1": "medium", "0": "low", "-1": "info"}
    OWASP_MAPPING = {
        "Cross Site Scripting": "A03",
        "SQL Injection": "A03",
        "Path Traversal": "A01",
        "Remote File Inclusion": "A03",
        "CSRF": "A01",
        "Session": "A07",
        "Authentication": "A07",
        "Cookie": "A05",
        "CORS": "A05",
        "CSP": "A05",
    }

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score

        try:
            # 1. Try ZAP spider + active scan if ZAP daemon is running
            import httpx
            zap_url = kwargs.get("zap_url", "http://localhost:8080")
            async with httpx.AsyncClient(timeout=10) as client:
                # Check ZAP availability
                check_resp = await client.get(f"{zap_url}/JSON/core/view/version/")
                if check_resp.status_code == 200:
                    await client.get(f"{zap_url}/JSON/spider/action/scan/", params={"url": target, "maxChildren": "5"})
                    import asyncio
                    await asyncio.sleep(10)
                    await client.get(f"{zap_url}/JSON/ajaxSpider/action/scan/", params={"url": target})
                    await asyncio.sleep(5)
                    resp = await client.get(f"{zap_url}/JSON/core/view/alerts/", params={"baseurl": target, "count": "50"})
                    data = resp.json()

                    for alert in data.get("alerts", []):
                        sev = self.ZAP_SEVERITY_MAP.get(str(alert.get("riskcode", "0")), "info")
                        owasp_cat = None
                        for keyword, cat in self.OWASP_MAPPING.items():
                            if keyword.lower() in alert.get("name", "").lower():
                                owasp_cat = cat
                                break

                        if sev != "info":
                            findings.append(Finding(
                                title=alert.get("name", "Vulnerability Detected"),
                                severity=sev,
                                category="owasp",
                                description=alert.get("description", "")[:500],
                                remediation=alert.get("solution", "")[:500],
                                owasp_category=owasp_cat,
                                nist_function="DE", nist_control="DE.CM-8",
                                evidence=f"URL: {alert.get('url', '')[:120]}, Param: {alert.get('param', '')}, CWE: {alert.get('cweid', '')}",
                            ))

                    severity_deductions = {"critical": 4.0, "high": 2.5, "medium": 1.0, "low": 0.3}
                    for f in findings:
                        score -= severity_deductions.get(f.severity, 0)
                else:
                    raise RuntimeError("ZAP returned non-200")

        except Exception as e:
            logger.info(f"ZAP container scan unavailable ({e}), running native OWASP heuristic audit")
            # 2. Native OWASP active/passive security checks (Zero-Docker required)
            try:
                import httpx
                async with httpx.AsyncClient(timeout=12, verify=False, follow_redirects=True) as client:
                    # A. Test for dangerous HTTP TRACE method (Cross-Site Tracing XST) -> OWASP A05
                    try:
                        trace_resp = await client.request("TRACE", target)
                        if trace_resp.status_code == 200 and "message/http" in trace_resp.headers.get("content-type", "").lower():
                            findings.append(Finding(
                                title={
                                    "ar": "طريقة HTTP TRACE مفعّلة (مخاطر XST)",
                                    "fr": "Méthode HTTP TRACE activée (Risque XST)",
                                    "en": "HTTP TRACE Method Enabled",
                                },
                                severity="medium",
                                category="owasp",
                                description={
                                    "ar": "يقبل الخادم طريقة TRACE مما يسمح بسرقة الكوكيز المحمية بـ HttpOnly",
                                    "fr": "Le serveur accepte la méthode TRACE, permettant de contourner la protection HttpOnly",
                                    "en": "Server accepts TRACE method which can leak HttpOnly cookies via XST",
                                },
                                remediation={
                                    "ar": "عطّل TraceEnable في إعدادات خادم الويب",
                                    "fr": "Désactiver la directive TraceEnable Off dans la configuration serveur",
                                    "en": "Set TraceEnable Off in web server configuration",
                                },
                                owasp_category="A05",
                                nist_function="PR", nist_control="PR.IP-1",
                            ))
                            score -= 2.0
                    except Exception:
                        pass

                    # B. Check Clickjacking / UI Redressing defense -> OWASP A05
                    try:
                        main_resp = await client.get(target)
                        headers_lower = {k.lower(): v for k, v in main_resp.headers.items()}
                        csp_val = headers_lower.get("content-security-policy", "")
                        xfo_val = headers_lower.get("x-frame-options", "")
                        if "frame-ancestors" not in csp_val and not xfo_val:
                            findings.append(Finding(
                                title={
                                    "ar": "ضعف الحماية ضد هجمات Clickjacking",
                                    "fr": "Protection anti-Clickjacking manquante",
                                    "en": "Missing Clickjacking Protection",
                                },
                                severity="medium",
                                category="owasp",
                                description={
                                    "ar": "يمكن تضمين الموقع في إطار iframe خارجي دون تقييد",
                                    "fr": "Le site ne restreint pas l'inclusion en iframe via CSP frame-ancestors ou X-Frame-Options",
                                    "en": "Site does not restrict framing via frame-ancestors or X-Frame-Options",
                                },
                                remediation={
                                    "ar": "أضف frame-ancestors 'self' إلى CSP أو X-Frame-Options: SAMEORIGIN",
                                    "fr": "Ajouter frame-ancestors 'self' dans la CSP ou X-Frame-Options: SAMEORIGIN",
                                    "en": "Configure frame-ancestors 'self' in CSP or X-Frame-Options",
                                },
                                owasp_category="A05",
                                nist_function="PR", nist_control="PR.PT-3",
                            ))
                            score -= 2.0
                    except Exception:
                        pass

                    # C. Path Traversal probe -> OWASP A01
                    try:
                        trav_resp = await client.get(f"{target.rstrip('/')}/../../../../etc/passwd")
                        if trav_resp.status_code == 200 and ("root:x:" in trav_resp.text or "daemon:" in trav_resp.text):
                            findings.append(Finding(
                                title={
                                    "ar": "ثغرة قراءة مسار الملفات Path Traversal",
                                    "fr": "Vulnérabilité Path Traversal critique",
                                    "en": "Critical Path Traversal Detected",
                                },
                                severity="critical",
                                category="owasp",
                                description={
                                    "ar": "تمكن الماسح من قراءة ملف النظام etc/passwd عبر مسار نسبي",
                                    "fr": "Le serveur web autorise la lecture arbitraire de fichiers système via chemin relatif",
                                    "en": "Web server allows arbitrary system file reading via relative path",
                                },
                                owasp_category="A01",
                                nist_function="DE", nist_control="DE.CM-8",
                            ))
                            score -= 8.0
                    except Exception:
                        pass

                if not findings:
                    findings.append(Finding(
                        title={
                            "ar": "✓ لا توجد ثغرات OWASP واضحة عبر الفحص المباشر",
                            "fr": "✓ Aucune faille OWASP critique identifiée (Audit heuristique natif)",
                            "en": "✓ No obvious OWASP flaws detected (Native heuristic audit)",
                        },
                        severity="info",
                        category="owasp",
                    ))
            except Exception as audit_err:
                logger.warning(f"Native OWASP audit error: {audit_err}")
                score = max_score * 0.85

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class NetworkScanner(BaseScanner):
    """Scanner 4: Network Security via Nmap (8%)"""
    category = "network"
    timeout = 60

    RISKY_PORTS = {
        21: ("FTP", "critical"),
        23: ("Telnet", "critical"),
        25: ("SMTP (open relay risk)", "high"),
        110: ("POP3 unencrypted", "high"),
        135: ("MS RPC", "high"),
        139: ("NetBIOS", "high"),
        445: ("SMB", "critical"),
        1433: ("MS SQL", "critical"),
        3306: ("MySQL", "critical"),
        3389: ("RDP", "critical"),
        5432: ("PostgreSQL", "critical"),
        6379: ("Redis", "critical"),
        8080: ("HTTP Proxy", "medium"),
        27017: ("MongoDB", "critical"),
    }

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        # 1. Run nmap natively or via Docker
        output = _run_tool_command("nmap", "cyberscore-nmap", [
            "-sT", "--top-ports", "100", "-T4",
            "--open", "-oX", "-", hostname
        ], timeout=self.timeout)

        open_ports = []
        if output:
            import xml.etree.ElementTree as ET
            try:
                root = ET.fromstring(output)
                for port in root.findall(".//port"):
                    state = port.find("state")
                    if state is not None and state.get("state") == "open":
                        port_num = int(port.get("portid", 0))
                        service = port.find("service")
                        service_name = service.get("name", "unknown") if service is not None else "unknown"
                        open_ports.append(port_num)

                        if port_num in self.RISKY_PORTS:
                            name, sev = self.RISKY_PORTS[port_num]
                            findings.append(Finding(
                                title={
                                    "ar": f"منفذ خطير مفتوح: {port_num} ({name})",
                                    "fr": f"Port à risque ouvert : {port_num} ({name})",
                                    "en": f"Risky Port Open: {port_num} ({name})",
                                },
                                severity=sev,
                                category="network",
                                description={
                                    "ar": f"المنفذ {port_num} ({name}) مفتوح ومكشوف على الإنترنت",
                                    "fr": f"Le port {port_num} ({name}) est ouvert et accessible publiquement",
                                    "en": f"Port {port_num} ({name}) is open and publicly accessible",
                                },
                                remediation={
                                    "ar": f"أغلق المنفذ {port_num} أو قيّد الوصول عبر جدار ناري",
                                    "fr": f"Fermer le port {port_num} ou restreindre l'accès via pare-feu",
                                    "en": f"Close port {port_num} or restrict access with firewall",
                                },
                                owasp_category="A05",
                                nist_function="PR", nist_control="PR.PT-3",
                                iso27002_control="A.8.20",
                                evidence=f"Port: {port_num}/TCP, Service: {service_name}",
                            ))
                            score -= 2.0 if sev == "critical" else 1.0

                findings.append(Finding(
                    title=f"✓ {len(open_ports)} Open Ports",
                    severity="info",
                    category="network",
                    evidence=f"Open ports: {open_ports[:20]}",
                ))
            except ET.ParseError:
                pass

        # 2. Python TCP socket fallback if nmap produced no output
        if not open_ports and not output:
            import socket
            top_ports_check = [21, 22, 25, 80, 110, 143, 443, 445, 8080, 8443, 3306, 3389, 5432, 6379, 27017]
            try:
                ip = socket.gethostbyname(hostname)
                for port_num in top_ports_check:
                    try:
                        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                            s.settimeout(0.6)
                            if s.connect_ex((ip, port_num)) == 0:
                                open_ports.append(port_num)
                                if port_num in self.RISKY_PORTS:
                                    name, sev = self.RISKY_PORTS[port_num]
                                    findings.append(Finding(
                                        title={
                                            "ar": f"منفذ خطير مفتوح: {port_num} ({name})",
                                            "fr": f"Port à risque ouvert : {port_num} ({name})",
                                            "en": f"Risky Port Open: {port_num} ({name})",
                                        },
                                        severity=sev,
                                        category="network",
                                        evidence=f"Port: {port_num}/TCP (Socket probe)",
                                    ))
                                    score -= 2.0 if sev == "critical" else 1.0
                    except Exception:
                        pass
                if open_ports:
                    findings.append(Finding(
                        title=f"✓ {len(open_ports)} Open Ports (Socket probe)",
                        severity="info",
                        category="network",
                        evidence=f"Open ports: {open_ports}",
                    ))
            except Exception as sock_err:
                logger.warning(f"Socket port scan fallback failed: {sock_err}")

        if not open_ports and not output:
            findings.append(Finding(
                title={
                    "ar": "لم يتم اكتشاف منافذ مفتوحة",
                    "fr": "Aucun port réseau ouvert détecté sur la cible",
                    "en": "No Open Network Ports Detected",
                },
                severity="info",
                category="network",
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)


class SubdomainScanner(BaseScanner):
    """Scanner 11: Subdomain Discovery via Subfinder or Native DNS (5%)"""
    category = "subdomain"
    timeout = 60

    async def scan(self, target: str, **kwargs) -> ScanCategoryResult:
        start = time.time()
        findings: list[Finding] = []
        max_score = CATEGORY_WEIGHTS[self.category]["max_score"]
        score = max_score
        hostname = target.replace("https://", "").replace("http://", "").split("/")[0]

        # 1. Run subfinder natively or via Docker
        output = _run_tool_command("subfinder", "cyberscore-subfinder", [
            "-d", hostname, "-silent"
        ], timeout=self.timeout)

        subdomains = [s.strip() for s in output.strip().split("\n") if s.strip()] if output else []

        # 2. Native DNS wordlist enumeration if subfinder produced no output
        if not subdomains:
            import dns.resolver
            common_subs = [
                "www", "mail", "webmail", "smtp", "portal", "api", "admin",
                "remote", "vpn", "ns1", "ns2", "cloud", "secure", "intra",
                "dev", "app", "m", "auth", "login"
            ]
            resolver = dns.resolver.Resolver()
            resolver.timeout = 1.5
            resolver.lifetime = 1.5
            for sub in common_subs:
                fqdn = f"{sub}.{hostname}"
                try:
                    answers = resolver.resolve(fqdn, "A")
                    if answers:
                        subdomains.append(fqdn)
                except Exception:
                    pass

        if subdomains:
            findings.append(Finding(
                title={
                    "ar": f"تم اكتشاف {len(subdomains)} نطاق فرعي",
                    "fr": f"{len(subdomains)} sous-domaine(s) découvert(s)",
                    "en": f"{len(subdomains)} subdomain(s) discovered",
                },
                severity="info",
                category="subdomain",
                description=f"Found {len(subdomains)} subdomains",
                evidence=f"Subdomains count: {len(subdomains)}, sample: {', '.join(subdomains[:6])}",
            ))

            # High count of subdomains = larger attack surface
            if len(subdomains) > 50:
                findings.append(Finding(
                    title={
                        "ar": "سطح هجوم واسع: أكثر من 50 نطاقاً فرعياً",
                        "fr": "Surface d'attaque étendue : plus de 50 sous-domaines",
                        "en": "Large Attack Surface: >50 subdomains",
                    },
                    severity="medium",
                    category="subdomain",
                    description={
                        "ar": f"{len(subdomains)} نطاق فرعي تزيد من مساحة الهجوم",
                        "fr": f"{len(subdomains)} sous-domaines augmentent considérablement la surface d'exposition",
                        "en": f"{len(subdomains)} subdomains increase external attack surface",
                    },
                    remediation={
                        "ar": "راجع جميع النطاقات الفرعية واحذف غير المستخدمة منها",
                        "fr": "Inventorier et désactiver les sous-domaines obsolètes ou inutilisés",
                        "en": "Review all subdomains and decommission unused assets",
                    },
                    nist_function="ID", nist_control="ID.AM-1",
                ))
                score -= 1.5
            elif len(subdomains) > 20:
                findings.append(Finding(
                    title={
                        "ar": "عدد كبير من النطاقات الفرعية",
                        "fr": "Nombre élevé de sous-domaines actifs",
                        "en": "High Number of Subdomains",
                    },
                    severity="low",
                    category="subdomain",
                    description={
                        "ar": f"تم العثور على {len(subdomains)} نطاق فرعي",
                        "fr": f"{len(subdomains)} sous-domaines découverts",
                        "en": f"{len(subdomains)} subdomains found",
                    },
                ))
                score -= 0.5
        else:
            findings.append(Finding(
                title={
                    "ar": "لم يتم اكتشاف نطاقات فرعية إضافية",
                    "fr": "Aucun sous-domaine additionnel découvert",
                    "en": "No Additional Subdomains Discovered",
                },
                severity="info",
                category="subdomain",
            ))

        duration = int((time.time() - start) * 1000)
        return self._create_result(findings, max(0, score), duration)
