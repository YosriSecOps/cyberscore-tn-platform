"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  LucideIcon,
  Search,
} from "lucide-react";

export type PassiveScanType = "quick" | "standard" | "deep";

interface PassiveStepConfig {
  id: number;
  title: { fr: string; ar: string; en: string };
  subtitle: { fr: string; ar: string; en: string };
  icon: LucideIcon;
  color: string;
  lightColor: string;
  glowColor: string;
  startPct: number;
  completePct: number;
  scannersCount: number;
  subtasks: { fr: string[]; ar: string[]; en: string[] };
}

interface PassiveScanWorkflowStepperProps {
  scanType: PassiveScanType;
  progress: number;
  locale: string;
  target?: string;
}

export default function PassiveScanWorkflowStepper({
  scanType,
  progress,
  locale,
  target = "cible.gov.tn",
}: PassiveScanWorkflowStepperProps) {
  const isAr = locale === "ar";
  const isFr = locale === "fr";
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Detect current theme (light vs dark) from data-theme attribute on <html>
  useEffect(() => {
    const updateTheme = () => {
      const themeAttr = document.documentElement.getAttribute("data-theme");
      setIsDark(themeAttr === "dark");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Dynamic step configurations adapted to the scan depth
  const getStepsForScanType = (type: PassiveScanType): PassiveStepConfig[] => {
    if (type === "quick") {
      return [
        {
          id: 1,
          title: {
            fr: "Phase 1 : Vitrine Web & Chiffrement SSL/TLS",
            ar: "المرحلة 1: الواجهة الرقمية والتشفير SSL/TLS",
            en: "Phase 1: Web Surface & SSL/TLS Encryption",
          },
          subtitle: {
            fr: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
            ar: "4 محركات • TLS 1.3 • HSTS • الكوكيز • CSP",
            en: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
          },
          icon: Lock,
          color: "#00e5ff",
          lightColor: "#0284c7",
          glowColor: "rgba(2, 132, 199, 0.2)",
          startPct: 0,
          completePct: 60,
          scannersCount: 4,
          subtasks: {
            fr: [
              "Négociation TLS 1.2/1.3 & validation du certificat TunTrust",
              "Inspection des en-têtes défensifs (HSTS, CSP, X-Frame-Options)",
              "Audit des drapeaux de cookies (Secure, HttpOnly, SameSite)",
            ],
            ar: [
              "التفاوض على بروتوكول TLS 1.2/1.3 والتحقق من الشهادة الرقمية",
              "فحص ترويسات الأمان الصارم (HSTS, CSP, X-Frame-Options)",
              "تدقيق مؤشرات أمان ملفات الارتباط (Secure, HttpOnly, SameSite)",
            ],
            en: [
              "TLS 1.2/1.3 handshake & TunTrust X.509 certificate validation",
              "Defensive HTTP response headers audit (HSTS, CSP, X-Frame-Options)",
              "Cookie security flags inspection (Secure, HttpOnly, SameSite)",
            ],
          },
        },
        {
          id: 2,
          title: {
            fr: "Phase Finale : Évaluation & Calcul du CyberScore",
            ar: "المرحلة النهائية: تقييم المخاطر واحتساب النقاط",
            en: "Final Phase: CyberScore Evaluation & Grading",
          },
          subtitle: {
            fr: "Score souverain • Grade A+ à F • Recommandations",
            ar: "النقاط السيادية • الدرجة من A+ إلى F • المعالجات",
            en: "Sovereign score • Grade A+ to F • Remediation",
          },
          icon: ShieldCheck,
          color: "#10b981",
          lightColor: "#059669",
          glowColor: "rgba(16, 185, 129, 0.2)",
          startPct: 60,
          completePct: 98,
          scannersCount: 4,
          subtasks: {
            fr: [
              "Pondération des 4 facteurs de risque essentiels",
              "Attribution du label de sécurité souverain ANCS",
              "Génération des directives de remédiation prioritaires",
            ],
            ar: [
              "حساب ترجيح عوامل المخاطر الأربعة الأساسية",
              "منح تصنيف الحصانة السيادية المعتمد من الوكالة",
              "صياغة التوجيهات الفنية للمعالجة السريعة",
            ],
            en: [
              "Weighting of 4 core cyber risk factors",
              "Attribution of sovereign ANCS trust grade",
              "Generation of high-priority remediation roadmap",
            ],
          },
        },
      ];
    }

    if (type === "standard") {
      return [
        {
          id: 1,
          title: {
            fr: "Phase 1 : Vitrine Web & Chiffrement SSL/TLS",
            ar: "المرحلة 1: الواجهة الرقمية والتشفير SSL/TLS",
            en: "Phase 1: Web Surface & SSL/TLS Encryption",
          },
          subtitle: {
            fr: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
            ar: "4 محركات • TLS 1.3 • HSTS • الكوكيز • CSP",
            en: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
          },
          icon: Lock,
          color: "#00e5ff",
          lightColor: "#0284c7",
          glowColor: "rgba(2, 132, 199, 0.2)",
          startPct: 0,
          completePct: 35,
          scannersCount: 4,
          subtasks: {
            fr: [
              "Handshake cryptographique TLS 1.3 & validation du certificat X.509",
              "Examen des en-têtes de durcissement (HSTS Preload, Content-Security-Policy)",
              "Attributs de protection des cookies de session utilisateur",
            ],
            ar: [
              "المصافحة التشفيرية TLS 1.3 وتدقيق شهادة X.509 الوطنية",
              "فحص ترويسات الحماية المتقدمة (HSTS Preload, Content-Security-Policy)",
              "خصائص حماية وتأمين ملفات الارتباط للجلسات",
            ],
            en: [
              "TLS 1.3 cryptographic handshake & X.509 certificate check",
              "Hardening headers inspection (HSTS Preload, Content-Security-Policy)",
              "User session cookie protection attributes",
            ],
          },
        },
        {
          id: 2,
          title: {
            fr: "Phase 2 : Infrastructure DNS, Messagerie & Hygiène",
            ar: "المرحلة 2: البنية التحتية، البريد ونظافة النظام",
            en: "Phase 2: DNS, Email Infrastructure & Hygiene",
          },
          subtitle: {
            fr: "6 Scanners • DNSSEC • SPF/DMARC • Détection Stack • Fuites .git",
            ar: "6 محركات • DNSSEC • SPF/DMARC • كشف التقنيات • التسريبات",
            en: "6 Scanners • DNSSEC • SPF/DMARC • Tech Stack • Leaks",
          },
          icon: Globe,
          color: "#818cf8",
          lightColor: "#4f46e5",
          glowColor: "rgba(99, 102, 241, 0.2)",
          startPct: 35,
          completePct: 72,
          scannersCount: 6,
          subtasks: {
            fr: [
              "Vérification de la chaîne de confiance DNSSEC & enregistrements CAA",
              "Contrôle anti-usurpation d'e-mail officiel : alignement SPF, DKIM & DMARC",
              "Recherche passive de chemins sensibles (.git, .env) et empreinte logicielle",
            ],
            ar: [
              "التحقق من سلسلة الثقة التشفيرية DNSSEC وسجلات الترخيص CAA",
              "فحص الحماية البريدية ضد الانتحال: تطابق SPF و DKIM وسياسة DMARC",
              "كشف الملفات الحساسة المسربة دون إذن (.git, .env) وبصمات البرمجيات",
            ],
            en: [
              "DNSSEC cryptographic chain of trust & CAA record validation",
              "Email spoofing prevention audit: SPF, DKIM & strict DMARC alignment",
              "Passive sensitive paths lookup (.git, .env) & software fingerprinting",
            ],
          },
        },
        {
          id: 3,
          title: {
            fr: "Phase Finale : Notation Souveraine & Restitution",
            ar: "المرحلة النهائية: التقييم السيادي وصياغة التقرير",
            en: "Final Phase: Sovereign Scoring & Findings",
          },
          subtitle: {
            fr: "10 Piliers audités • Score Global • Directives ANCS",
            ar: "10 محاور خضعت للفحص • الدرجة الإجمالية • معايير الوكالة",
            en: "10 Pillars Audited • Total Score • ANCS Directives",
          },
          icon: ShieldCheck,
          color: "#10b981",
          lightColor: "#059669",
          glowColor: "rgba(16, 185, 129, 0.2)",
          startPct: 72,
          completePct: 98,
          scannersCount: 10,
          subtasks: {
            fr: [
              "Agrégation des 10 modules d'analyse et calcul du score sur 100",
              "Vérification de la souveraineté de l'hébergement (Décret 2023-17 / AS2609)",
              "Génération du rapport d'audit exhaustif trilingue",
            ],
            ar: [
              "دمج نتائج المحركات العشرة وحساب النقاط الإجمالية من 100",
              "التحقق من الاستضافة السيادية الوطنية (المرسوم 2023-17 / AS2609)",
              "إعداد التقرير الرقابي الشامل بثلاث لغات",
            ],
            en: [
              "Aggregation of 10 security modules & score computation over 100",
              "Sovereign hosting verification (Decree 2023-17 / ATI AS2609 block)",
              "Exhaustive trilingual compliance report compilation",
            ],
          },
        },
      ];
    }

    // Default: Deep scan (4 complete phases)
    return [
      {
        id: 1,
        title: {
          fr: "Phase 1 : Vitrine Web & Chiffrement SSL/TLS",
          ar: "المرحلة 1: الواجهة الرقمية والتشفير SSL/TLS",
          en: "Phase 1: Web Surface & SSL/TLS Encryption",
        },
        subtitle: {
          fr: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
          ar: "4 محركات • TLS 1.3 • HSTS • الكوكيز • CSP",
          en: "4 Scanners • TLS 1.3 • HSTS • Cookies • CSP",
        },
        icon: Lock,
        color: "#00e5ff",
        lightColor: "#0284c7",
        glowColor: "rgba(2, 132, 199, 0.2)",
        startPct: 0,
        completePct: 25,
        scannersCount: 4,
        subtasks: {
          fr: [
            "Handshake TLS 1.3, suites de chiffrement et autorité TunTrust X.509",
            "Vérification des en-têtes HTTP de sécurité (HSTS Preload, nosniff, XFO)",
            "Confinement des cookies de session (Secure, HttpOnly, SameSite)",
          ],
          ar: [
            "المصافحة التشفيرية TLS 1.3 والتحقق من شهادة TunTrust الوطنية",
            "فحص ترويسات الحماية المتقدمة (HSTS Preload, nosniff, XFO)",
            "تأمين ملفات الارتباط للجلسات (Secure, HttpOnly, SameSite)",
          ],
          en: [
            "TLS 1.3 handshake, cipher suites & TunTrust X.509 certificate check",
            "HTTP security headers inspection (HSTS Preload, nosniff, XFO)",
            "Session cookies hardening flags (Secure, HttpOnly, SameSite)",
          ],
        },
      },
      {
        id: 2,
        title: {
          fr: "Phase 2 : Infrastructure DNS, Messagerie & Hygiène",
          ar: "المرحلة 2: البنية التحتية، البريد ونظافة النظام",
          en: "Phase 2: DNS, Email Infrastructure & Hygiene",
        },
        subtitle: {
          fr: "6 Scanners • DNSSEC • DMARC • Leaks • Cert Lifecycle",
          ar: "6 محركات • DNSSEC • DMARC • التسريبات • دورة الشهادات",
          en: "6 Scanners • DNSSEC • DMARC • Leaks • Cert Lifecycle",
        },
        icon: Globe,
        color: "#818cf8",
        lightColor: "#4f46e5",
        glowColor: "rgba(99, 102, 241, 0.2)",
        startPct: 25,
        completePct: 50,
        scannersCount: 6,
        subtasks: {
          fr: [
            "Validation de la chaîne cryptographique DNSSEC & enregistrements CAA",
            "Audit anti-usurpation d'e-mail officiel (SPF, DKIM, alignement DMARC)",
            "Détection d'obsolescence technologique, fuites sensibles et intégrité SRI",
          ],
          ar: [
            "التحقق من سلسلة التشفير DNSSEC وسجلات الترخيص CAA",
            "فحص الحماية البريدية ضد الانتحال (SPF, DKIM, وسياسة DMARC)",
            "رصد تقادم البرمجيات والملفات الحساسة وتكامل الموارد SRI",
          ],
          en: [
            "DNSSEC cryptographic chain validation & CAA records audit",
            "Official email anti-spoofing inspection (SPF, DKIM, strict DMARC)",
            "Software obsolescence detection, sensitive leaks & SRI CDN integrity",
          ],
        },
      },
      {
        id: 3,
        title: {
          fr: "Phase 3 : Scans Avancés & Cartographie Externe",
          ar: "المرحلة 3: الفحص المتقدم والمسح الخارجي",
          en: "Phase 3: Advanced Scans & External Surface",
        },
        subtitle: {
          fr: "6 Scanners • OWASP ZAP • Nmap Top-100 • Subfinder • CTI AbuseIPDB",
          ar: "6 محركات • فحص OWASP • مسح 100 منفذ • النطاقات الفرعية • CTI",
          en: "6 Scanners • OWASP ZAP • Nmap Top-100 • Subfinder • CTI Rep",
        },
        icon: Server,
        color: "#f59e0b",
        lightColor: "#d97706",
        glowColor: "rgba(217, 119, 6, 0.2)",
        startPct: 50,
        completePct: 78,
        scannersCount: 6,
        subtasks: {
          fr: [
            "Inspection applicative DAST ciblée (Injection SQL, XSS, CSRF)",
            "Cartographie d'exposition réseau des 100 ports critiques (SSH, RDP, BD)",
            "Énumération de sous-domaines (crt.sh) et corrélation CTI VirusTotal/AbuseIPDB",
          ],
          ar: [
            "الفحص التطبيقي التلقائي لاكتشاف ثغرات الحقن (SQLi, XSS, CSRF)",
            "مسح المنافذ المائة الأكثر استهدافاً (SSH, RDP, قواعد البيانات)",
            "حصر النطاقات الفرعية ومطابقة السمعة الدولية عبر قواعد CTI",
          ],
          en: [
            "Targeted DAST application vulnerability audit (SQLi, XSS, CSRF)",
            "Network surface exposure mapping on top-100 critical ports",
            "Subdomain enumeration (crt.sh) & CTI correlation (VirusTotal/AbuseIPDB)",
          ],
        },
      },
      {
        id: 4,
        title: {
          fr: "Phase 4 : Corrélation & Notation CyberScore Exhaustive",
          ar: "المرحلة 4: الدمج المتعدد والتقييم السيادي الشامل",
          en: "Phase 4: Multi-Layer Correlation & Deep CyberScore",
        },
        subtitle: {
          fr: "16 Facteurs de risque • Note A+ à F • Directives ANCS",
          ar: "16 محور مخاطر • الدرجة الرسمية • توصيات المعالجة",
          en: "16 Risk Factors • Grade A+ to F • ANCS Guidelines",
        },
        icon: ShieldCheck,
        color: "#10b981",
        lightColor: "#059669",
        glowColor: "rgba(16, 185, 129, 0.2)",
        startPct: 78,
        completePct: 98,
        scannersCount: 16,
        subtasks: {
          fr: [
            "Consolidation des 16 modules techniques et calcul de la note globale",
            "Contrôle de conformité au Décret-loi n° 2023-17 et matrice de risques",
            "Génération du dossier d'audit officiel avec feuille de route technique",
          ],
          ar: [
            "توحيد نتائج 16 محوراً فنياً واحتساب الدرجة الوطنية المعتمدة",
            "مطابقة البنود التنظيمية للمرسوم عدد 17 ومصفوفة المخاطر",
            "إصدار التقرير الرسمي الشامل مصحوباً بخارطة طريق المعالجة",
          ],
          en: [
            "Consolidation of 16 technical modules & global score computation",
            "Compliance verification against Decree-Law 2023-17 & risk matrix",
            "Official audit dossier compilation with actionable remediation roadmap",
          ],
        },
      },
    ];
  };

  const steps = getStepsForScanType(scanType);

  const getStepStatus = (step: PassiveStepConfig) => {
    if (progress >= step.completePct) return "completed";
    if (progress >= step.startPct) return "in_progress";
    return "pending";
  };

  const activeStep = steps.find((s) => getStepStatus(s) === "in_progress") || steps[steps.length - 1];

  const scanTypeLabels: Record<PassiveScanType, { fr: string; ar: string; en: string }> = {
    quick: {
      fr: "Audit Passif Rapide (Surface Web & Chiffrement)",
      ar: "تدقيق سلبي سريع (الواجهة والتشفير)",
      en: "Quick Passive Audit (Web Surface & SSL)",
    },
    standard: {
      fr: "Audit Passif Standard (Hygiène & Infrastructure)",
      ar: "تدقيق سلبي قياسي (النظافة الرقمية والبنية التحتية)",
      en: "Standard Passive Audit (Hygiene & Infrastructure)",
    },
    deep: {
      fr: "Audit Passif Approfondi",
      ar: "تدقيق سلبي معمق",
      en: "Deep Passive Audit",
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "920px",
        margin: "0 auto",
        textAlign: isAr ? "right" : "left",
      }}
    >
      {/* Header telemetry badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          padding: "12px 18px",
          background: isDark ? "rgba(15, 23, 42, 0.75)" : "#ffffff",
          backdropFilter: "blur(12px)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
          borderRadius: "14px",
          boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "all 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isDark ? "#00e5ff" : "#0284c7",
              boxShadow: isDark ? "0 0 12px #00e5ff" : "0 0 8px rgba(2, 132, 199, 0.5)",
              animation: "pulse 1.8s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "13px",
              fontWeight: 700,
              color: isDark ? "#38bdf8" : "#0284c7",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {scanTypeLabels[scanType][isAr ? "ar" : isFr ? "fr" : "en"]}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            dir="ltr"
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: isDark ? "#cbd5e1" : "#334155",
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9",
              padding: "4px 12px",
              borderRadius: "6px",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #cbd5e1",
            }}
          >
            {target}
          </span>
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              color: isDark ? "#94a3b8" : "#475569",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 10px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
            }}
            title={isAr ? "إظهار/إخفاء التفاصيل" : "Afficher/Masquer les détails"}
          >
            {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{isAr ? "التفاصيل" : "Détails"}</span>
          </button>
        </div>
      </div>

      {/* Main Stepper Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {steps.map((step) => {
          const status = getStepStatus(step);
          const isDone = status === "completed";
          const isRunning = status === "in_progress";
          const StepIcon = step.icon;
          const activeColor = isDark ? step.color : step.lightColor;

          return (
            <div
              key={step.id}
              style={{
                position: "relative",
                padding: "16px 14px",
                borderRadius: "14px",
                background: isRunning
                  ? isDark
                    ? "rgba(15, 23, 42, 0.85)"
                    : "#ffffff"
                  : isDone
                  ? isDark
                    ? "rgba(16, 185, 129, 0.08)"
                    : "#f0fdf4"
                  : isDark
                  ? "rgba(30, 41, 59, 0.35)"
                  : "#f8fafc",
                border: isRunning
                  ? `2px solid ${activeColor}`
                  : isDone
                  ? isDark
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid #86efac"
                  : isDark
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid #e2e8f0",
                boxShadow: isRunning
                  ? isDark
                    ? `0 0 20px ${step.glowColor}`
                    : `0 8px 24px -4px ${step.glowColor}, 0 2px 6px rgba(0,0,0,0.04)`
                  : isDark
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.03)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "135px",
              }}
            >
              {/* Top Row: Icon + Status Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isRunning
                      ? isDark
                        ? step.glowColor
                        : "rgba(2, 132, 199, 0.1)"
                      : isDone
                      ? isDark
                        ? "rgba(16, 185, 129, 0.15)"
                        : "#dcfce7"
                      : isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isRunning
                      ? activeColor
                      : isDone
                      ? isDark
                        ? "#10b981"
                        : "#16a34a"
                      : isDark
                      ? "#64748b"
                      : "#94a3b8",
                    transition: "all 0.3s ease",
                  }}
                >
                  <StepIcon size={19} />
                </div>

                {isDone && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isDark ? "#10b981" : "#15803d",
                      background: isDark ? "rgba(16, 185, 129, 0.15)" : "#dcfce7",
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #86efac",
                    }}
                  >
                    <CheckCircle2 size={12} />
                    {isAr ? "مكتمل" : isFr ? "Terminé" : "Done"}
                  </span>
                )}

                {isRunning && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: activeColor,
                      background: isDark ? step.glowColor : "rgba(2, 132, 199, 0.1)",
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      border: `1px solid ${activeColor}`,
                      animation: "pulse 1.5s infinite",
                    }}
                  >
                    <Activity size={12} className="animate-spin" />
                    {isAr ? "قيد الفحص" : isFr ? "En cours" : "Running"}
                  </span>
                )}

                {!isDone && !isRunning && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: isDark ? "#64748b" : "#64748b",
                      background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9",
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      border: isDark ? "1px solid transparent" : "1px solid #e2e8f0",
                    }}
                  >
                    <Clock size={11} />
                    {isAr ? "في الانتظار" : isFr ? "En attente" : "Pending"}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: isRunning
                      ? isDark
                        ? "#ffffff"
                        : "#0f172a"
                      : isDone
                      ? isDark
                        ? "#e2e8f0"
                        : "#1e293b"
                      : isDark
                      ? "#94a3b8"
                      : "#475569",
                    marginBottom: "4px",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title[isAr ? "ar" : isFr ? "fr" : "en"]}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: isRunning ? 600 : 500,
                    color: isRunning
                      ? activeColor
                      : isDark
                      ? "#94a3b8"
                      : "#64748b",
                    lineHeight: 1.25,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {step.subtitle[isAr ? "ar" : isFr ? "fr" : "en"]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Detailed Tasks Card */}
      {showSubtasks && activeStep && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "14px",
            background: isDark ? "rgba(15, 23, 42, 0.65)" : "#ffffff",
            backdropFilter: "blur(12px)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
            boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "0 4px 16px rgba(0, 0, 0, 0.04)",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              borderBottom: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid #e2e8f0",
              paddingBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: isDark ? "#f1f5f9" : "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Zap
                size={14}
                style={{
                  color: isDark ? activeStep.color : activeStep.lightColor,
                }}
              />
              {isAr
                ? `المهام الجارية الآن : ${activeStep.title.ar}`
                : isFr
                ? `Opérations en cours : ${activeStep.title.fr}`
                : `Current Operations: ${activeStep.title.en}`}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: isDark ? "#94a3b8" : "#64748b",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {Math.round(progress)}% • {activeStep.scannersCount}{" "}
              {isAr
                ? "محركات نشطة"
                : isFr
                ? "scanners mobilisés"
                : "active scanners"}
            </span>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {activeStep.subtasks[isAr ? "ar" : isFr ? "fr" : "en"].map(
              (task, tidx) => {
                const stepStatus = getStepStatus(activeStep);
                const isTaskDone =
                  stepStatus === "completed" ||
                  (stepStatus === "in_progress" &&
                    progress >= activeStep.startPct + (tidx + 1) * 8);

                return (
                  <li
                    key={tidx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12.5px",
                      color: isTaskDone
                        ? isDark
                          ? "#64748b"
                          : "#94a3b8"
                        : isDark
                        ? "#e2e8f0"
                        : "#1e293b",
                      transition: "color 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isTaskDone
                          ? isDark
                            ? "rgba(16, 185, 129, 0.2)"
                            : "#dcfce7"
                          : isDark
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(2, 132, 199, 0.1)",
                        color: isTaskDone
                          ? isDark
                            ? "#10b981"
                            : "#16a34a"
                          : isDark
                          ? "#38bdf8"
                          : "#0284c7",
                        flexShrink: 0,
                      }}
                    >
                      {isTaskDone ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isDark ? "#38bdf8" : "#0284c7",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        textDecoration: isTaskDone ? "line-through" : "none",
                        opacity: isTaskDone ? 0.75 : 1,
                      }}
                    >
                      {task}
                    </span>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
