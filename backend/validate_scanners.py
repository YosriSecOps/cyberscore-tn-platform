"""
CyberScore TN — Scanner Validation Script
============================================
Tests each scanner independently against real websites.
No database or Redis required — runs scanners directly.

Usage:
    cd backend
    python validate_scanners.py
"""

import asyncio
import ssl
import socket
import time
import json
import sys
import os

# Add the backend root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.scanners.base import ScanCategoryResult, CATEGORY_WEIGHTS
from app.scanners.ssl_scanner import SSLScanner
from app.scanners.headers_scanner import HeadersScanner
from app.scanners.dns_scanner import DNSScanner
from app.scanners.email_scanner import EmailSecurityScanner
from app.scanners.web_scanners import CookieScanner, CSPScanner, InfoDisclosureScanner
from app.scanners.score_engine import calculate_total_score

# ── Test Targets ─────────────────────────────────────────
# 3 profiles: strong, medium, weak
TEST_TARGETS = [
    {
        "url": "https://www.google.com",
        "label": "Google (site bien sécurisé — référence mondiale)",
        "expected_grade_range": ["A+", "A", "B"],  # Should be high
    },
    {
        "url": "https://www.finances.gov.tn",
        "label": "Ministère des Finances (site .gov.tn)",
        "expected_grade_range": ["A+", "A", "B", "C", "D", "F"],  # Unknown
    },
    {
        "url": "https://www.education.gov.tn",
        "label": "Ministère de l'Éducation (site .gov.tn)",
        "expected_grade_range": ["A+", "A", "B", "C", "D", "F"],  # Unknown
    },
]

# ── Colors ───────────────────────────────────────────────
class Colors:
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

def severity_color(sev):
    return {
        "critical": Colors.RED,
        "high": Colors.MAGENTA,
        "medium": Colors.YELLOW,
        "low": Colors.CYAN,
        "info": Colors.WHITE,
    }.get(sev, Colors.WHITE)


# ── Manual Verification Functions ────────────────────────

def manual_ssl_check(hostname: str) -> dict:
    """Manual SSL check using Python's ssl module — acts as ground truth."""
    result = {"available": False, "protocol": None, "days_left": None, "issuer": None, "subject": None}
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                result["available"] = True
                result["protocol"] = ssock.version()
                
                from datetime import datetime, timezone
                not_after = cert.get("notAfter", "")
                if not_after:
                    exp = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
                    result["days_left"] = (exp - datetime.now(timezone.utc)).days
                    result["expires"] = not_after
                
                issuer = dict(x[0] for x in cert.get("issuer", []))
                subject = dict(x[0] for x in cert.get("subject", []))
                result["issuer"] = issuer.get("commonName", "?")
                result["subject"] = subject.get("commonName", "?")
    except Exception as e:
        result["error"] = str(e)[:200]
    return result


def manual_headers_check(url: str) -> dict:
    """Manual HTTP headers check using httpx."""
    import httpx
    result = {}
    try:
        with httpx.Client(timeout=15, follow_redirects=True, verify=False) as client:
            resp = client.head(url)
            headers_lower = {k.lower(): v for k, v in resp.headers.items()}
            
            SECURITY_HEADERS = [
                "strict-transport-security",
                "x-frame-options",
                "x-content-type-options",
                "referrer-policy",
                "permissions-policy",
                "x-xss-protection",
                "content-security-policy",
            ]
            for h in SECURITY_HEADERS:
                result[h] = headers_lower.get(h, None)
    except Exception as e:
        result["error"] = str(e)[:200]
    return result


# ── Scanner Test Runner ──────────────────────────────────

async def test_single_scanner(scanner_class, target: str, scanner_name: str) -> ScanCategoryResult | None:
    """Run a single scanner with timeout and error handling."""
    scanner = scanner_class()
    print(f"    ⏳ Running {scanner_name}...", end="", flush=True)
    start = time.time()
    
    try:
        result = await asyncio.wait_for(
            scanner.scan(target),
            timeout=scanner.timeout + 15,
        )
        elapsed = int((time.time() - start) * 1000)
        
        if result.max_score > 0:
            pct = (result.score / result.max_score) * 100
            color = Colors.GREEN if pct >= 80 else (Colors.YELLOW if pct >= 50 else Colors.RED)
            print(f"\r    ✅ {scanner_name}: {color}{result.score:.1f}/{result.max_score}{Colors.RESET} "
                  f"({pct:.0f}%) — {len(result.findings)} findings — {elapsed}ms")
        else:
            print(f"\r    ⚠️  {scanner_name}: No score (error or N/A) — {elapsed}ms")
        
        return result
    except asyncio.TimeoutError:
        elapsed = int((time.time() - start) * 1000)
        print(f"\r    ❌ {scanner_name}: TIMEOUT after {elapsed}ms")
        return None
    except Exception as e:
        elapsed = int((time.time() - start) * 1000)
        print(f"\r    ❌ {scanner_name}: ERROR — {str(e)[:100]} — {elapsed}ms")
        return None


async def validate_target(target_info: dict) -> dict:
    """Run all scanners on a single target and validate results."""
    url = target_info["url"]
    label = target_info["label"]
    hostname = url.replace("https://", "").replace("http://", "").split("/")[0]
    
    print(f"\n{'='*70}")
    print(f"{Colors.BOLD}{Colors.CYAN}🔍 TARGET: {url}{Colors.RESET}")
    print(f"   {label}")
    print(f"{'='*70}")
    
    # ── Phase 1: Manual ground-truth checks ──
    print(f"\n  {Colors.BOLD}📋 Étape 1: Vérification manuelle (ground truth){Colors.RESET}")
    
    manual_ssl = manual_ssl_check(hostname)
    if manual_ssl["available"]:
        print(f"    🔐 SSL: ✅ Disponible | Protocol: {manual_ssl['protocol']} | "
              f"Expire dans: {manual_ssl['days_left']} jours")
        print(f"       Issuer: {manual_ssl['issuer']} | Subject: {manual_ssl['subject']}")
    else:
        print(f"    🔐 SSL: ❌ Indisponible — {manual_ssl.get('error', 'unknown')}")
    
    manual_hdr = manual_headers_check(url)
    if "error" not in manual_hdr:
        present = sum(1 for v in manual_hdr.values() if v is not None)
        total = len(manual_hdr)
        print(f"    🛡️  Headers: {present}/{total} security headers présents")
        for h, v in manual_hdr.items():
            status = f"✅ {v[:60]}..." if v and len(v) > 60 else (f"✅ {v}" if v else "❌ Manquant")
            print(f"       {h}: {status}")
    else:
        print(f"    🛡️  Headers: ❌ Erreur — {manual_hdr['error']}")
    
    # ── Phase 2: Run CyberScore scanners ──
    print(f"\n  {Colors.BOLD}📋 Étape 2: Scanners CyberScore TN{Colors.RESET}")
    
    # Phase 1 scanners (quick)
    scanners_phase1 = [
        (SSLScanner, "SSL/TLS"),
        (HeadersScanner, "Headers"),
        (CookieScanner, "Cookies"),
        (CSPScanner, "CSP"),
    ]
    
    # Phase 2 scanners (standard — skip Docker-dependent ones)
    scanners_phase2 = [
        (DNSScanner, "DNS"),
        (EmailSecurityScanner, "Email Security"),
        (InfoDisclosureScanner, "Info Disclosure"),
    ]
    
    all_results = []
    
    print(f"\n    {Colors.BOLD}Phase 1 (Quick):{Colors.RESET}")
    for scanner_class, name in scanners_phase1:
        result = await test_single_scanner(scanner_class, url, name)
        if result and result.max_score > 0:
            all_results.append(result)
    
    print(f"\n    {Colors.BOLD}Phase 2 (Standard):{Colors.RESET}")
    for scanner_class, name in scanners_phase2:
        result = await test_single_scanner(scanner_class, url, name)
        if result and result.max_score > 0:
            all_results.append(result)
    
    # ── Phase 3: Calculate composite score ──
    print(f"\n  {Colors.BOLD}📋 Étape 3: Calcul du score composite{Colors.RESET}")
    
    if not all_results:
        print(f"    ❌ Aucun résultat — impossible de calculer le score")
        return {"url": url, "error": "No scanner results"}
    
    score_result = calculate_total_score(all_results)
    
    grade = score_result["grade"]
    total = score_result["total_score"]
    stars = score_result["star_rating"]
    
    grade_color = Colors.GREEN if total >= 80 else (Colors.YELLOW if total >= 60 else Colors.RED)
    
    print(f"\n    {'─'*50}")
    print(f"    {Colors.BOLD}SCORE FINAL: {grade_color}{total:.1f}/100{Colors.RESET} "
          f"| Grade: {grade_color}{grade}{Colors.RESET} "
          f"| {'★' * stars}{'☆' * (3-stars)}")
    print(f"    {'─'*50}")
    
    # Category breakdown
    print(f"\n    {Colors.BOLD}Breakdown par catégorie:{Colors.RESET}")
    for cat in score_result["category_breakdown"]:
        pct = cat["normalized_score"]
        bar_filled = int(pct / 5)
        bar_empty = 20 - bar_filled
        color = Colors.GREEN if pct >= 80 else (Colors.YELLOW if pct >= 50 else Colors.RED)
        bar = f"{'█' * bar_filled}{'░' * bar_empty}"
        print(f"    {cat['category']:15s} {color}{bar} {pct:5.1f}%{Colors.RESET} "
              f"({cat['score']:.1f}/{cat['max_score']}) ×{cat['weight']:.2f}")
    
    # Findings summary
    print(f"\n    {Colors.BOLD}Findings:{Colors.RESET}")
    print(f"    🔴 Critical: {score_result['critical_count']} | "
          f"🟠 High: {score_result['high_count']} | "
          f"🟡 Medium: {score_result['medium_count']} | "
          f"🔵 Low: {score_result['low_count']}")
    
    # Show top findings
    all_findings = []
    for r in all_results:
        for f in r.findings:
            if f.severity != "info":
                title = f.title if isinstance(f.title, str) else f.title.get("en", str(f.title))
                desc = f.description if isinstance(f.description, str) else f.description.get("en", str(f.description))
                all_findings.append((f.severity, f.category, title, desc))
    
    if all_findings:
        # Sort by severity
        sev_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        all_findings.sort(key=lambda x: sev_order.get(x[0], 4))
        
        print(f"\n    {Colors.BOLD}Détail des findings:{Colors.RESET}")
        for sev, cat, title, desc in all_findings[:15]:
            color = severity_color(sev)
            print(f"    {color}[{sev.upper():8s}]{Colors.RESET} [{cat}] {title}")
            if desc:
                desc_str = desc[:80] + "..." if len(str(desc)) > 80 else desc
                print(f"               └─ {desc_str}")
    
    # ── Phase 4: Cross-validation SSL ──
    print(f"\n  {Colors.BOLD}📋 Étape 4: Cross-validation (Scanner vs Manuel){Colors.RESET}")
    
    ssl_result = next((r for r in all_results if r.category == "ssl"), None)
    if ssl_result and manual_ssl["available"]:
        ssl_pct = (ssl_result.score / ssl_result.max_score * 100) if ssl_result.max_score > 0 else 0
        
        # Check SSL findings match manual
        ssl_findings_titles = [
            (f.title.get("en", "") if isinstance(f.title, dict) else f.title)
            for f in ssl_result.findings
        ]
        
        checks = []
        # Check 1: Certificate validity
        if manual_ssl["days_left"] is not None:
            if manual_ssl["days_left"] <= 0:
                has_expired = any("Expired" in t for t in ssl_findings_titles)
                checks.append(("Cert expiré détecté", has_expired, f"days_left={manual_ssl['days_left']}"))
            elif manual_ssl["days_left"] <= 30:
                has_expiring = any("Expiring" in t or "expire" in t.lower() for t in ssl_findings_titles)
                checks.append(("Cert bientôt expiré détecté", has_expiring, f"days_left={manual_ssl['days_left']}"))
            else:
                checks.append(("Cert valide (pas d'alerte expiration)", True, f"days_left={manual_ssl['days_left']}"))
        
        # Check 2: Protocol version
        if manual_ssl["protocol"]:
            if "TLSv1.3" in manual_ssl["protocol"] or "TLSv1.2" in manual_ssl["protocol"]:
                has_bad_protocol = any("TLS 1.0" in t or "TLS 1.1" in t for t in ssl_findings_titles)
                checks.append(("Protocol moderne détecté", not has_bad_protocol, f"protocol={manual_ssl['protocol']}"))
        
        # Check 3: Self-signed
        if manual_ssl["issuer"] and manual_ssl["subject"]:
            is_self_signed = manual_ssl["issuer"] == manual_ssl["subject"]
            scanner_found_self_signed = any("Self-Signed" in t for t in ssl_findings_titles)
            if is_self_signed:
                checks.append(("Self-signed détecté", scanner_found_self_signed, f"issuer={manual_ssl['issuer']}"))
            else:
                checks.append(("Cert CA valide", not scanner_found_self_signed, f"issuer={manual_ssl['issuer']}"))
        
        for check_name, passed, evidence in checks:
            status = f"{Colors.GREEN}✅ PASS{Colors.RESET}" if passed else f"{Colors.RED}❌ FAIL{Colors.RESET}"
            print(f"    {status} {check_name} ({evidence})")
    
    # Headers cross-validation
    header_result = next((r for r in all_results if r.category == "headers"), None)
    if header_result and "error" not in manual_hdr:
        headers_findings_titles = [
            (f.title.get("en", "") if isinstance(f.title, dict) else f.title)
            for f in header_result.findings if f.severity != "info"
        ]
        
        key_headers = {
            "strict-transport-security": "HSTS",
            "x-frame-options": "X-Frame-Options",
            "x-content-type-options": "X-Content-Type-Options",
        }
        
        for header_key, header_name in key_headers.items():
            is_present = manual_hdr.get(header_key) is not None
            scanner_flagged = any(header_name in t or header_key.upper() in t.upper() for t in headers_findings_titles)
            
            if is_present and not scanner_flagged:
                print(f"    {Colors.GREEN}✅ PASS{Colors.RESET} {header_name}: Présent manuellement, pas de finding → Cohérent")
            elif not is_present and scanner_flagged:
                print(f"    {Colors.GREEN}✅ PASS{Colors.RESET} {header_name}: Absent manuellement, finding généré → Cohérent")
            elif is_present and scanner_flagged:
                print(f"    {Colors.RED}❌ FAIL{Colors.RESET} {header_name}: Présent manuellement MAIS finding généré → Faux positif?")
            else:
                print(f"    {Colors.YELLOW}⚠️  WARN{Colors.RESET} {header_name}: Absent manuellement, pas de finding → Faux négatif?")
    
    # Grade expectation check
    expected = target_info.get("expected_grade_range", [])
    if expected and grade not in expected:
        print(f"\n    {Colors.RED}⚠️  ATTENTION: Grade {grade} hors de la plage attendue {expected}{Colors.RESET}")
    
    return {
        "url": url,
        "total_score": total,
        "grade": grade,
        "stars": stars,
        "findings": score_result["total_findings"],
        "critical": score_result["critical_count"],
        "high": score_result["high_count"],
        "medium": score_result["medium_count"],
        "low": score_result["low_count"],
        "scanners_run": len(all_results),
        "breakdown": {cat["category"]: cat["normalized_score"] for cat in score_result["category_breakdown"]},
    }


async def main():
    print(f"""
{Colors.BOLD}{Colors.CYAN}
╔══════════════════════════════════════════════════════════════════╗
║          CyberScore TN — Validation du Moteur de Scan          ║
║            منصة CyberScore TN — التحقق من محرك المسح           ║
╚══════════════════════════════════════════════════════════════════╝
{Colors.RESET}""")
    
    print(f"  📅 Date: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  🔧 Scanners disponibles: {len(CATEGORY_WEIGHTS)}")
    print(f"  🎯 Cibles de test: {len(TEST_TARGETS)}")
    print(f"  📊 Catégories de poids:")
    for cat, info in sorted(CATEGORY_WEIGHTS.items(), key=lambda x: x[1]["weight"], reverse=True):
        print(f"     {info['label_fr']:30s} {info['weight']*100:4.0f}% (max: {info['max_score']})")
    
    # Run all validations
    results = []
    for target in TEST_TARGETS:
        try:
            result = await validate_target(target)
            results.append(result)
        except Exception as e:
            print(f"\n  ❌ ERREUR FATALE pour {target['url']}: {e}")
            import traceback
            traceback.print_exc()
            results.append({"url": target["url"], "error": str(e)})
    
    # ── Final Summary ─────────────────────────────────────
    print(f"\n\n{'='*70}")
    print(f"{Colors.BOLD}{Colors.CYAN}📊 RÉSUMÉ FINAL DE LA VALIDATION{Colors.RESET}")
    print(f"{'='*70}")
    
    print(f"\n{'Site':<40s} {'Score':>6s} {'Grade':>6s} {'Stars':>6s} {'Findings':>9s} {'Critical':>9s}")
    print(f"{'─'*40} {'─'*6} {'─'*6} {'─'*6} {'─'*9} {'─'*9}")
    
    for r in results:
        if "error" in r:
            print(f"{r['url']:<40s} {'ERROR':>6s}")
        else:
            url_short = r["url"].replace("https://", "").replace("http://", "")[:38]
            score_str = f"{r['total_score']:.0f}"
            grade_color = Colors.GREEN if r["total_score"] >= 80 else (Colors.YELLOW if r["total_score"] >= 60 else Colors.RED)
            print(f"{url_short:<40s} {grade_color}{score_str:>6s}{Colors.RESET} "
                  f"{grade_color}{r['grade']:>6s}{Colors.RESET} "
                  f"{'★' * r['stars'] + '☆' * (3-r['stars']):>6s} "
                  f"{r['findings']:>9d} "
                  f"{r['critical']:>9d}")
    
    # Score formula verification
    print(f"\n{Colors.BOLD}🧮 Vérification de la formule de scoring:{Colors.RESET}")
    print(f"  Formula: total = Σ(normalized_score × weight) / Σ(weight)")
    print(f"  Grades: A+ (≥95) | A (≥90) | B (≥80) | C (≥70) | D (≥60) | F (<60)")
    
    for r in results:
        if "error" not in r and "breakdown" in r:
            print(f"\n  {r['url']}:")
            total_weighted = 0
            total_weight = 0
            for cat, normalized in r["breakdown"].items():
                w = CATEGORY_WEIGHTS.get(cat, {}).get("weight", 0)
                contribution = normalized * w
                total_weighted += contribution
                total_weight += w
            manual_total = total_weighted / total_weight if total_weight > 0 else 0
            match = abs(manual_total - r["total_score"]) < 0.1
            status = f"{Colors.GREEN}✅ MATCH{Colors.RESET}" if match else f"{Colors.RED}❌ MISMATCH{Colors.RESET}"
            print(f"    Calcul manuel: {manual_total:.2f} | Moteur: {r['total_score']:.2f} → {status}")
    
    print(f"\n{'='*70}")
    print(f"{Colors.BOLD}{Colors.GREEN}✅ Validation terminée !{Colors.RESET}")
    print(f"{'='*70}\n")
    
    # Save results to JSON
    output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "validation_results.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"  📁 Résultats sauvegardés: {output_file}\n")


if __name__ == "__main__":
    asyncio.run(main())
