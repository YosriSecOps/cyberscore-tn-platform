"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import {
  Sun,
  Moon,
  Search,
  Bell,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  CheckCheck,
  Trash2,
  Radio,
  Globe,
  LayoutDashboard,
  Shield,
  Bot,
  Award,
  FileText,
  Settings,
  TrendingUp,
  ArrowRight,
  X,
  LogOut,
} from "lucide-react";
import { NOTIFS_STORAGE_KEY, NotificationPayload } from "@/utils/notifications";
import { logoutUser } from "@/lib/api";

interface NotificationItem {
  id: string;
  type: "critical" | "warning" | "success" | "ai";
  title: { ar: string; fr: string; en: string };
  desc: { ar: string; fr: string; en: string };
  time: { ar: string; fr: string; en: string };
  read: boolean;
  href?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "critical",
    title: {
      ar: "شهادة SSL تنتهي قريبًا",
      fr: "Expiration certificat SSL",
      en: "SSL Certificate Expiring",
    },
    desc: {
      ar: "شهادة sante.gov.tn تنتهي خلال 23 يومًا.",
      fr: "Certificat SSL expirant dans 23j sur sante.gov.tn.",
      en: "SSL cert on sante.gov.tn expires in 23 days.",
    },
    time: { ar: "منذ 10 دقائق", fr: "Il y a 10 min", en: "10m ago" },
    read: false,
    href: "/scan?domain=sante.gov.tn",
  },
  {
    id: "notif-2",
    type: "warning",
    title: {
      ar: "ثغرات CVE حرجة جديدة",
      fr: "Nouvelles CVEs critiques",
      en: "Critical CVEs Detected",
    },
    desc: {
      ar: "تم رصد 3 ثغرات غير مصححة في 5 وزارات.",
      fr: "3 CVEs critiques non corrigées détectées.",
      en: "3 unpatched critical CVEs found across 5 sites.",
    },
    time: { ar: "منذ ساعة", fr: "Il y a 1h", en: "1h ago" },
    read: false,
    href: "/threats",
  },
  {
    id: "notif-3",
    type: "ai",
    title: {
      ar: "توصية جديدة من أمينة",
      fr: "Analyse IA Amina disponible",
      en: "Amina AI Insight Ready",
    },
    desc: {
      ar: "تحليل جديد لجودة رؤوس الأمان HTTP متوفر.",
      fr: "Nouvelle analyse prédictive sur les en-têtes HTTP.",
      en: "New predictive score forecast available for review.",
    },
    time: { ar: "منذ ساعتين", fr: "Il y a 2h", en: "2h ago" },
    read: false,
    href: "/assistant",
  },
  {
    id: "notif-4",
    type: "success",
    title: {
      ar: "اكتمل الفحص الوطني",
      fr: "Scan national terminé",
      en: "National Scan Complete",
    },
    desc: {
      ar: "تم تقييم 120 موقعًا حكوميًا بنجاح.",
      fr: "120 sites gouvernementaux évalués avec succès.",
      en: "120 government domains scanned and indexed.",
    },
    time: { ar: "منذ 5 ساعات", fr: "Il y a 5h", en: "5h ago" },
    read: true,
    href: "/sectors",
  },
];

interface SearchItem {
  category: "sites" | "tools" | "threats";
  title: { ar: string; fr: string; en: string };
  subtitle: { ar: string; fr: string; en: string };
  href: string;
  icon: any;
  keywords: string[];
}

const SEARCH_DATABASE: SearchItem[] = [
  // Sites .gov.tn
  {
    category: "sites",
    title: { ar: "وزارة المالية", fr: "Ministère des Finances", en: "Ministry of Finance" },
    subtitle: { ar: "finances.gov.tn • قطاع المالية", fr: "finances.gov.tn • Score 88/100 (Grade B+)", en: "finances.gov.tn • Public Finance" },
    href: "/scan?domain=finances.gov.tn",
    icon: Globe,
    keywords: ["finances", "finance", "finances.gov.tn", "impots", "douane", "المالية", "ضرائب"],
  },
  {
    category: "sites",
    title: { ar: "وزارة الداخلية", fr: "Ministère de l'Intérieur", en: "Ministry of Interior" },
    subtitle: { ar: "interieur.gov.tn • الأمن والسيادة", fr: "interieur.gov.tn • Score 82/100 (Grade B)", en: "interieur.gov.tn • Security" },
    href: "/scan?domain=interieur.gov.tn",
    icon: Globe,
    keywords: ["interieur", "police", "interieur.gov.tn", "الداخلية", "شرطة"],
  },
  {
    category: "sites",
    title: { ar: "وزارة الصحة", fr: "Ministère de la Santé", en: "Ministry of Health" },
    subtitle: { ar: "sante.gov.tn • قطاع الصحة", fr: "sante.gov.tn • Score 64/100 (Grade C-)", en: "sante.gov.tn • Public Health" },
    href: "/scan?domain=sante.gov.tn",
    icon: Globe,
    keywords: ["sante", "hopital", "sante.gov.tn", "الصحة", "مستشفى"],
  },
  {
    category: "sites",
    title: { ar: "وزارة الدفاع الوطني", fr: "Ministère de la Défense Nationale", en: "Ministry of Defense" },
    subtitle: { ar: "defense.nat.tn • بنية تحتية حرجة", fr: "defense.nat.tn • Score 91/100 (Grade A)", en: "defense.nat.tn • Defense" },
    href: "/scan?domain=defense.nat.tn",
    icon: Globe,
    keywords: ["defense", "armee", "defense.nat.tn", "الدفاع", "جيش"],
  },
  {
    category: "sites",
    title: { ar: "رئاسة الحكومة", fr: "Présidence du Gouvernement", en: "Presidency of the Government" },
    subtitle: { ar: "pm.gov.tn • البوابة الرسمية", fr: "pm.gov.tn • Score 85/100 (Grade B)", en: "pm.gov.tn • Government Portal" },
    href: "/scan?domain=pm.gov.tn",
    icon: Globe,
    keywords: ["pm", "gouvernement", "pm.gov.tn", "premier ministre", "القصبة", "الحكومة"],
  },
  {
    category: "sites",
    title: { ar: "وزارة العدل", fr: "Ministère de la Justice", en: "Ministry of Justice" },
    subtitle: { ar: "justice.gov.tn • قطاع العدل", fr: "justice.gov.tn • Score 76/100 (Grade C)", en: "justice.gov.tn • Justice" },
    href: "/scan?domain=justice.gov.tn",
    icon: Globe,
    keywords: ["justice", "tribunal", "justice.gov.tn", "العدل", "محاكم"],
  },
  {
    category: "sites",
    title: { ar: "الإدارة العامة للديوانة", fr: "Direction Générale des Douanes", en: "Customs Authority" },
    subtitle: { ar: "douane.gov.tn • بوابات التجارة", fr: "douane.gov.tn • Score 78/100 (Grade C+)", en: "douane.gov.tn • Customs" },
    href: "/scan?domain=douane.gov.tn",
    icon: Globe,
    keywords: ["douane", "douane.gov.tn", "diwana", "الديوانة", "جمارك"],
  },
  {
    category: "sites",
    title: { ar: "الوكالة الوطنية للسلامة السيبرانية ANCS", fr: "Agence Nationale de la Cybersécurité (ANCS)", en: "National Cybersecurity Agency (ANCS)" },
    subtitle: { ar: "anci.tn / ancs.tn • هيئة الإشراف", fr: "ancs.tn • Score 96/100 (Grade A+)", en: "ancs.tn • Sovereign Authority" },
    href: "/scan?domain=ancs.tn",
    icon: Globe,
    keywords: ["ancs", "ansi", "cyberscurite", "securite", "الوكالة", "سيبراني"],
  },

  // Tools & Sections
  {
    category: "tools",
    title: { ar: "محرك الفحص الشامل", fr: "Scanner de Vulnérabilités", en: "Vulnerability Scanner" },
    subtitle: { ar: "فحص فوري للـ SSL، Headers، DNS، وOWASP", fr: "Auditez n'importe quel domaine étatique en 1 clic", en: "Run deep security scans on any domain" },
    href: "/scan",
    icon: Shield,
    keywords: ["scan", "scanner", "audit", "analyse", "فحص", "تدقيق", "اختبار"],
  },
  {
    category: "tools",
    title: { ar: "المساعدة الذكية أمينة", fr: "Assistant IA Amina (SOC Analyst)", en: "Amina AI SOC Assistant" },
    subtitle: { ar: "توليد كود الحماية والإصلاح الفوري", fr: "Génération automatique de patchs et scripts NGINX/Apache", en: "AI remediation & security patch generator" },
    href: "/assistant",
    icon: Bot,
    keywords: ["amina", "ia", "ai", "assistant", "chat", "patch", "أمينة", "ذكاء"],
  },
  {
    category: "tools",
    title: { ar: "لوحة القيادة والمراقبة السيادية", fr: "Centre de Commande (Command Center)", en: "SOC Command Center" },
    subtitle: { ar: "نظرة عامة حية على الأمن القومي", fr: "Flux d'alertes en direct, carte 3D et KPI nationaux", en: "Real-time threat telemetry & 3D Tunisia map" },
    href: "/",
    icon: LayoutDashboard,
    keywords: ["dashboard", "home", "command", "soc", "accueil", "الرئيسية", "القيادة"],
  },
  {
    category: "tools",
    title: { ar: "أوسمة التميز ومستوى الكفاءة", fr: "Badges d'Excellence & Sceau de Confiance", en: "Excellence Badges & Trust Seal" },
    subtitle: { ar: "نقاط الخبرة (XP) وأوسمة الامتثال", fr: "Progression des officiers RSSI et widget SVG officiel", en: "Gamification XP tiers and certified SVG seals" },
    href: "/badges",
    icon: Award,
    keywords: ["badges", "xp", "gamification", "niveau", "level", "sceau", "أوسمة", "كفاءة"],
  },
  {
    category: "tools",
    title: { ar: "المقارنة الدولية (Benchmark MENA)", fr: "Benchmark Régional & International", en: "International Benchmark" },
    subtitle: { ar: "ترتيب تونس مقارنة بدول المنطقة", fr: "Comparatif macroscopique Tunisie vs MENA / France", en: "Tunisia cybersecurity scoring vs MENA peers" },
    href: "/benchmark",
    icon: Globe,
    keywords: ["benchmark", "comparatif", "mena", "international", "مقارنة", "ترتيب"],
  },
  {
    category: "tools",
    title: { ar: "التنبؤات والتحليلات الاستشرافية", fr: "Prédictions Cyber & Tendances", en: "Cyber Predictions" },
    subtitle: { ar: "استشراف تراجع أو تحسن درجات الأمان", fr: "Modélisation prédictive du score à 30/90 jours", en: "Predictive vulnerability & score trends" },
    href: "/predictions",
    icon: TrendingUp,
    keywords: ["predictions", "tendances", "futur", "forecast", "تنبؤ", "توقعات"],
  },
  {
    category: "tools",
    title: { ar: "مركز إدارة النظام (SYS.ADMIN)", fr: "Console d'Administration & RBAC", en: "Administration Console" },
    subtitle: { ar: "إدارة حسابات الضباط وسياسات المراقبة", fr: "Gestion des utilisateurs, 24 ministères et Mode Maintenance", en: "User management, 24 ministries, Kill-Switch" },
    href: "/admin",
    icon: Settings,
    keywords: ["admin", "administration", "users", "utilisateurs", "maintenance", "إدارة", "مستخدمين"],
  },
  {
    category: "tools",
    title: { ar: "توليد التقارير الرسمية PDF", fr: "Générateur de Rapports PDF Certifiés", en: "Certified PDF Reports" },
    subtitle: { ar: "تصدير وثائق رسمية مطابقة لمعايير ANCS", fr: "Génération de rapports d'audit avec QR Code et signature", en: "Export official signed security reports" },
    href: "/reports",
    icon: FileText,
    keywords: ["pdf", "report", "rapport", "export", "download", "تقرير", "تصدير"],
  },

  // Common Threats
  {
    category: "threats",
    title: { ar: "خريطة التهديدات والهجمات الحية", fr: "Matrice des Menaces & Attaques Réelles", en: "Threat Matrix & Live Attacks" },
    subtitle: { ar: "رصد فوري لمحاولات الاختراق وCVEs", fr: "Cartographie géostratégique des cyberattaques", en: "Global cyberattack origin & targeted ministries" },
    href: "/threats",
    icon: ShieldAlert,
    keywords: ["menace", "threat", "cve", "attaque", "ddos", "ransomware", "تهديد", "هجوم"],
  },
];

export default function TopBar({ title }: { title?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isLivePulsing, setIsLivePulsing] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAr = locale === "ar";
  const isFr = locale === "fr";
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Active Authenticated User for TopBar
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    email: string;
    fullName: string;
    role: "admin" | "auditor" | "viewer";
    organization: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cyberscore_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          const safeName = parsed.fullName || parsed.full_name || parsed.name || (parsed.email ? parsed.email.split("@")[0] : "Admin ANCS");
          const safeOrg = typeof parsed.organization === "string" ? parsed.organization : parsed.organization_name || "Agence Nationale CyberSécurité (ANCS)";
          const safeRole = parsed.role === "admin" || parsed.role === "auditor" || parsed.role === "viewer" ? parsed.role : "admin";
          setCurrentUser({
            id: parsed.id || 1,
            email: parsed.email || "admin@cyberscore.tn",
            fullName: safeName,
            role: safeRole,
            organization: safeOrg,
          });
        }
      } else {
        setCurrentUser({
          id: 1,
          email: "admin@cyberscore.tn",
          fullName: "Admin ANCS",
          role: "admin",
          organization: "Agence Nationale CyberSécurité (ANCS)",
        });
      }
    } catch {}
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    window.location.href = `/${isAr ? "ar" : locale === "en" ? "en" : "fr"}/login`;
  };

  const saveNotifsToStorage = useCallback((items: NotificationItem[]) => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, []);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? SEARCH_DATABASE.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle =
          item.title.fr.toLowerCase().includes(q) ||
          item.title.ar.toLowerCase().includes(q) ||
          item.title.en.toLowerCase().includes(q);
        const matchSubtitle =
          item.subtitle.fr.toLowerCase().includes(q) ||
          item.subtitle.ar.toLowerCase().includes(q) ||
          item.subtitle.en.toLowerCase().includes(q);
        const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        return matchTitle || matchSubtitle || matchKeywords;
      }).slice(0, 8)
    : [];

  useEffect(() => {
    // 1. Read theme
    const savedTheme =
      (localStorage.getItem("cyberscore_theme") as "dark" | "light") ||
      (document.documentElement.getAttribute("data-theme") as "dark" | "light") ||
      "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    try {
      document.cookie = `cyberscore_theme=${savedTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    // 2. Read notifications from localStorage
    try {
      const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        } else {
          saveNotifsToStorage(INITIAL_NOTIFICATIONS);
        }
      } else {
        saveNotifsToStorage(INITIAL_NOTIFICATIONS);
      }
    } catch {}

    // 3. Listen to live events dispatched by any component (Scanner, Amina, Admin)
    const handleNewEvent = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationItem>;
      if (customEvent.detail) {
        setNotifications((prev) => {
          const updated = [customEvent.detail, ...prev.filter((p) => p.id !== customEvent.detail.id)].slice(0, 25);
          saveNotifsToStorage(updated);
          return updated;
        });
        setIsLivePulsing(true);
        setTimeout(() => setIsLivePulsing(false), 3000);
      }
    };

    window.addEventListener("cyberscore_new_notif", handleNewEvent);

    // 4. Global Keyboard Shortcut Ctrl+K / Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
      }
      if (e.key === "Escape") {
        setShowSearchDropdown(false);
        setShowNotifs(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("cyberscore_new_notif", handleNewEvent);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [saveNotifsToStorage]);

  const switchLocale = (newLocale: "ar" | "fr" | "en") => {
    if (newLocale === locale) return;

    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      try {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
    }

    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const targetPath = currentSearch ? `${pathname}${currentSearch}` : pathname;

    startTransition(() => {
      router.replace(targetPath, { locale: newLocale, scroll: false });
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("cyberscore_theme", newTheme);
    try {
      document.cookie = `cyberscore_theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifsToStorage(updated);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifsToStorage(updated);
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveNotifsToStorage(updated);
    setShowNotifs(false);
    if (notif.href) {
      router.push(notif.href);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If matches any search item directly
    if (searchResults.length > 0) {
      router.push(searchResults[0].href);
      setShowSearchDropdown(false);
      setSearchQuery("");
      return;
    }

    // Default: treat as a domain to audit in Scanner
    const cleanDomain = searchQuery.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    router.push(`/scan?domain=${cleanDomain}`);
    setShowSearchDropdown(false);
    setSearchQuery("");
  };

  const handleSearchResultClick = (href: string) => {
    router.push(href);
    setShowSearchDropdown(false);
    setSearchQuery("");
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title || t("nav.commandCenter")}</h1>

      {/* Global Interactive Search Bar with Ctrl+K & Instant Dropdown */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }} ref={searchContainerRef}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            background: "var(--bg-secondary)",
            border: showSearchDropdown && searchQuery.trim() ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
            borderRadius: "var(--radius-full)",
            padding: "6px 16px",
            width: "100%",
            maxWidth: "420px",
            color: "var(--text-tertiary)",
            transition: "all 0.2s ease",
            boxShadow: showSearchDropdown && searchQuery.trim() ? "0 0 12px rgba(99, 102, 241, 0.2)" : "none",
          }}
        >
          <Search size={16} strokeWidth={1.5} className="text-accent" />
          <input
            suppressHydrationWarning
            ref={searchInputRef}
            type="text"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder={isAr ? "ابحث عن موقع (.gov.tn)، ثغرة، أو أداة..." : isFr ? "Rechercher un site (.gov.tn), une menace..." : "Search a site (.gov.tn), CVE, or tool..."}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              flex: 1,
              fontSize: "var(--text-sm)",
              color: "var(--text-primary)",
            }}
          />
          {searchQuery && (
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
          <div
            onClick={() => searchInputRef.current?.focus()}
            style={{ display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}
          >
            <kbd
              style={{
                fontSize: "10px",
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
              }}
            >
              Ctrl K
            </kbd>
          </div>
        </form>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchQuery.trim() && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "480px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
              zIndex: 150,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              animation: "fadeIn 0.15s ease-out",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "8px 14px",
                background: "var(--bg-tertiary)",
                borderBottom: "1px solid var(--border-primary)",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "var(--text-secondary)",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "monospace",
              }}
            >
              <span>{isAr ? "نتائج البحث السريع" : isFr ? "Résultats de Recherche Rapide" : "Omnibar Search Results"}</span>
              <span>{searchResults.length} {isAr ? "نتيجة" : "résultats"}</span>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "4px" }}>
                    {isAr ? `فحص النطاق "${searchQuery}"` : `Auditer le domaine "${searchQuery}"`}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    {isAr ? "اضغط Enter لإطلاق الفحص الفوري في المفسّر الأمني" : "Appuyez sur Entrée pour lancer un audit de sécurité complet."}
                  </div>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={handleSearchSubmit}
                    style={{
                      padding: "6px 14px",
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "monospace",
                    }}
                  >
                    <span>{isAr ? "إطلاق الفحص الآن" : "Lancer le Scan"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const Icon = item.icon;
                  const loc = (locale as "ar" | "fr" | "en") || "fr";
                  const itemTitle = item.title[loc] || item.title.fr;
                  const itemSub = item.subtitle[loc] || item.subtitle.fr;

                  const categoryTag =
                    item.category === "sites"
                      ? isAr ? "موقع سيادي" : "SITE ÉTATIQUE"
                      : item.category === "tools"
                      ? isAr ? "أداة أمنية" : "MODULE SOC"
                      : isAr ? "تهديد سيبراني" : "MENACE";

                  const tagColor =
                    item.category === "sites" ? "#0284c7" : item.category === "tools" ? "#6366f1" : "#ef4444";

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSearchResultClick(item.href)}
                      style={{
                        padding: "10px 14px",
                        borderBottom: "0.5px solid var(--border-primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "background 0.15s ease",
                      }}
                      className="hover:bg-[var(--bg-tertiary)]"
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "var(--radius-sm)",
                          background: `${tagColor}15`,
                          color: tagColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {itemTitle}
                          </span>
                          <span
                            style={{
                              fontSize: "8.5px",
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: tagColor,
                              border: `0.5px solid ${tagColor}40`,
                              padding: "1px 5px",
                              borderRadius: "2px",
                              background: `${tagColor}10`,
                            }}
                          >
                            {categoryTag}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {itemSub}
                        </div>
                      </div>

                      <ArrowRight size={13} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "6px 14px",
                background: "var(--bg-tertiary)",
                borderTop: "1px solid var(--border-primary)",
                fontSize: "9.5px",
                color: "var(--text-tertiary)",
                fontFamily: "monospace",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{isAr ? "اضغط Enter للانتقال" : "Appuyez sur Entrée pour valider"}</span>
              <span>ESC pour fermer</span>
            </div>
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {/* Language Switcher */}
        <div className="lang-switcher" style={{ background: "transparent", border: "none", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
          {(["ar", "fr", "en"] as const).map((lang) => (
            <button
              suppressHydrationWarning
              type="button"
              key={lang}
              disabled={isPending}
              className={`lang-btn ${locale === lang ? "active" : ""}`}
              onClick={() => switchLocale(lang)}
              style={{
                background: locale === lang ? "var(--bg-tertiary)" : "transparent",
                color: locale === lang ? "var(--color-accent)" : "var(--text-secondary)",
                fontWeight: locale === lang ? 600 : 500,
                borderRadius: "var(--radius-full)",
                cursor: isPending ? "wait" : "pointer",
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          suppressHydrationWarning
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          title={theme === "dark" ? (isAr ? "الوضع الفاتح" : "Mode Clair") : (isAr ? "الوضع الداكن" : "Mode Sombre")}
          style={{
            background: "transparent",
            border: "none",
            borderRadius: "var(--radius-full)",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {theme === "dark" ? (
            <Sun size={18} strokeWidth={1.5} />
          ) : (
            <Moon size={18} strokeWidth={1.5} />
          )}
        </button>

        {/* Notifications Dropdown with Live Production SOC State */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            suppressHydrationWarning
            type="button"
            className="icon-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
            title={isAr ? "تنبيهات النظام الحية" : "Flux d'Alertes SOC en Direct"}
            style={{
              position: "relative",
              background: "transparent",
              border: "none",
              borderRadius: "var(--radius-full)",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              transform: isLivePulsing ? "scale(1.15)" : "scale(1)",
            }}
          >
            <Bell size={18} strokeWidth={1.5} className={isLivePulsing ? "text-red-500 animate-bounce" : ""} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  minWidth: "14px",
                  height: "14px",
                  background: "#ef4444",
                  borderRadius: "7px",
                  color: "#ffffff",
                  fontSize: "8.5px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 2px",
                  boxShadow: "0 0 6px rgba(239, 68, 68, 0.6)",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotifs && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                insetInlineEnd: 0,
                width: "380px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                zIndex: 100,
                borderRadius: "var(--radius-sm)",
                display: "flex",
                flexDirection: "column",
                animation: "fadeIn 0.15s ease-out",
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-primary)",
                  background: "var(--bg-tertiary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Radio size={14} color="#10b981" className="animate-pulse" />
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "1.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {isAr ? "مركز التنبيهات السيادية" : isFr ? "Centre d'Alertes SOC" : "SOC Alert Feed"}
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "#ef4444",
                        color: "#ffffff",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "2px",
                        fontFamily: "monospace",
                      }}
                    >
                      {unreadCount} {isAr ? "جديد" : "non-lus"}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={markAllAsRead}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-accent)",
                      fontSize: "10.5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 600,
                      fontFamily: "monospace",
                    }}
                  >
                    <CheckCheck size={13} />
                    {isAr ? "تعليم الكل" : isFr ? "Tout marquer lu" : "Mark all read"}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "32px 16px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {isAr ? "✅ لا توجد تنبيهات أمنية معلقة" : isFr ? "✅ Aucune alerte active dans le SOC" : "✅ No active alerts"}
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const loc = (locale as "ar" | "fr" | "en") || "fr";
                    const itemTitle = notif.title[loc] || notif.title.en;
                    const itemDesc = notif.desc[loc] || notif.desc.en;
                    const itemTime = notif.time[loc] || notif.time.en;

                    const iconColor =
                      notif.type === "critical"
                        ? "#ef4444"
                        : notif.type === "warning"
                        ? "#f97316"
                        : notif.type === "ai"
                        ? "var(--color-accent)"
                        : "#10b981";

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "12px 16px",
                          borderBottom: "0.5px solid var(--border-primary)",
                          background: notif.read ? "transparent" : "rgba(239, 68, 68, 0.03)",
                          borderInlineStart: notif.read ? "3px solid transparent" : `3px solid ${iconColor}`,
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                          position: "relative",
                        }}
                        className="hover:bg-[var(--bg-tertiary)] group"
                      >
                        <div style={{ flexShrink: 0, marginTop: "2px", color: iconColor }}>
                          {notif.type === "critical" && <ShieldAlert size={16} />}
                          {notif.type === "warning" && <AlertTriangle size={16} />}
                          {notif.type === "ai" && <Sparkles size={16} />}
                          {notif.type === "success" && <CheckCircle2 size={16} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: notif.read ? 600 : 700,
                              color: "var(--text-primary)",
                              marginBottom: "2px",
                            }}
                          >
                            {itemTitle}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-secondary)",
                              lineHeight: 1.4,
                              marginBottom: "4px",
                            }}
                          >
                            {itemDesc}
                          </div>
                          <div
                            style={{
                              fontSize: "9.5px",
                              color: "var(--text-tertiary)",
                              fontFamily: "monospace",
                            }}
                          >
                            {itemTime}
                          </div>
                        </div>

                        {/* Delete single notification button */}
                        <button
                          suppressHydrationWarning
                          type="button"
                          onClick={(e) => deleteNotification(notif.id, e)}
                          title={isAr ? "حذف التنبيه" : "Supprimer cette notification"}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-tertiary)",
                            padding: "4px",
                            alignSelf: "flex-start",
                            opacity: 0.6,
                            transition: "opacity 0.2s ease, color 0.2s ease",
                          }}
                          className="hover:!opacity-100 hover:!text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              <div
                style={{
                  padding: "8px 16px",
                  background: "var(--bg-tertiary)",
                  borderTop: "1px solid var(--border-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    fontFamily: "monospace",
                  }}
                >
                  SEC.LOG // ANCS LIVE SENTINEL
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    color: "#10b981",
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  ● STREAM ACTIVE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Active User Session & Déconnexion Button in TopBar ────────────── */}
        {currentUser && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingInlineStart: "10px",
              borderInlineStart: "1px solid var(--border-primary)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "4px 8px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background:
                    currentUser.role === "admin"
                      ? "rgba(239, 68, 68, 0.15)"
                      : currentUser.role === "auditor"
                      ? "rgba(2, 132, 199, 0.15)"
                      : "rgba(100, 116, 139, 0.15)",
                  border: `1px solid ${
                    currentUser.role === "admin"
                      ? "#ef4444"
                      : currentUser.role === "auditor"
                      ? "#0284c7"
                      : "#64748b"
                  }`,
                  color:
                    currentUser.role === "admin"
                      ? "#ef4444"
                      : currentUser.role === "auditor"
                      ? "#0284c7"
                      : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9.5px",
                  fontWeight: 800,
                  fontFamily: "monospace",
                }}
              >
                {(currentUser?.fullName || currentUser?.email || "Admin")
                  .toString()
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "AA"}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.1,
                    maxWidth: "190px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentUser?.fullName || currentUser?.email || "Admin ANCS"}
                </span>
                <span
                  style={{
                    fontSize: "8px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color:
                      currentUser.role === "admin"
                        ? "#ef4444"
                        : currentUser.role === "auditor"
                        ? "#0284c7"
                        : "#64748b",
                  }}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Prominent Déconnexion Button */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleLogout}
              title={isAr ? "تسجيل الخروج من الحساب" : locale === "en" ? "Sign Out" : "Se déconnecter de la plateforme"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              className="hover:!text-red-500 hover:!border-red-500/50 hover:!bg-red-500/10"
            >
              <LogOut size={13} />
              <span>{isAr ? "خروج" : locale === "en" ? "Logout" : "Déconnexion"}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
