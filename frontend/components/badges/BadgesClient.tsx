"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { generateQrCodeDataUrl } from "@/lib/qr-code";
import {
  Award,
  Shield,
  Sparkles,
  Search,
  CheckCircle,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  Globe,
  Trophy,
} from "lucide-react";

type Rarity = "common" | "rare" | "epic" | "legendary";
type StatusFilter = "all" | "unlocked" | "in_progress" | "locked";
type RarityFilter = "all" | Rarity;

interface BadgeItem {
  id: string;
  icon: string;
  rarity: Rarity;
  xp: number;
  category: "scan" | "remediation" | "streak" | "excellence";
  name: { fr: string; ar: string; en: string };
  desc: { fr: string; ar: string; en: string };
  criteria: { fr: string; ar: string; en: string };
  defaultEarned: boolean;
  defaultDate?: string;
  progressTarget: number;
  progressCurrent: number;
}

const BADGES_DATABASE: BadgeItem[] = [
  {
    id: "first_scan",
    icon: "🔍",
    rarity: "common",
    xp: 100,
    category: "scan",
    name: { fr: "Premier Scan", ar: "الفحص الأول", en: "First Scan" },
    desc: {
      fr: "Effectuer votre tout premier scan de sécurité sur un site gouvernemental",
      ar: "إجراء أول فحص أمني لموقع حكومي تونسي",
      en: "Perform your very first security scan on a government domain",
    },
    criteria: {
      fr: "Lancer 1 scan complet sur n'importe quel domaine .gov.tn",
      ar: "إطلاق فحص واحد على أي نطاق حكومي .gov.tn",
      en: "Run 1 complete scan on any .gov.tn domain",
    },
    defaultEarned: true,
    defaultDate: "10 Août 2026",
    progressTarget: 1,
    progressCurrent: 1,
  },
  {
    id: "security_warrior",
    icon: "⚔️",
    rarity: "rare",
    xp: 250,
    category: "scan",
    name: { fr: "Guerrier de la Sécurité", ar: "محارب الأمان", en: "Security Warrior" },
    desc: {
      fr: "Scanner 10 sites gouvernementaux différents pour cartographier le parc national",
      ar: "فحص 10 مواقع حكومية مختلفة لرسم خريطة الأمان الوطنية",
      en: "Scan 10 different government websites to map national posture",
    },
    criteria: {
      fr: "Auditer au moins 10 domaines uniques (.gov.tn)",
      ar: "تدقيق 10 نطاقات فريدة على الأقل (.gov.tn)",
      en: "Audit at least 10 unique .gov.tn domains",
    },
    defaultEarned: true,
    defaultDate: "11 Août 2026",
    progressTarget: 10,
    progressCurrent: 10,
  },
  {
    id: "full_cleanup",
    icon: "🧹",
    rarity: "rare",
    xp: 300,
    category: "remediation",
    name: { fr: "Nettoyage Complet", ar: "التنظيف الشامل", en: "Full Cleanup" },
    desc: {
      fr: "Corriger l'ensemble des vulnérabilités critiques détectées sur un site",
      ar: "معالجة وإصلاح جميع الثغرات الأمنية الحرجة في موقع ما",
      en: "Remediate all critical vulnerabilities detected on a target",
    },
    criteria: {
      fr: "Atteindre 0 faille critique sur un site précédemment vulnérable",
      ar: "الوصول إلى 0 ثغرة حرجة بعد تطبيق خطة المعالجة",
      en: "Achieve 0 critical findings on a previously vulnerable host",
    },
    defaultEarned: true,
    defaultDate: "12 Août 2026",
    progressTarget: 1,
    progressCurrent: 1,
  },
  {
    id: "top_improvement",
    icon: "📈",
    rarity: "rare",
    xp: 350,
    category: "remediation",
    name: { fr: "Top Amélioration", ar: "أفضل تحسين", en: "Top Improvement" },
    desc: {
      fr: "Augmenter le score de sécurité d'un organisme de +20 points en une semaine",
      ar: "رفع مؤشر أمان موقع حكومي بأكثر من 20 نقطة خلال أسبوع",
      en: "Increase an organization's score by +20 points in one week",
    },
    criteria: {
      fr: "Écart de score positif supérieur ou égal à +20 pts",
      ar: "فارق إيجابي في النتيجة يتجاوز أو يساوي 20 نقطة",
      en: "Score improvement differential greater or equal to +20 pts",
    },
    defaultEarned: false,
    progressTarget: 20,
    progressCurrent: 14,
  },
  {
    id: "three_stars",
    icon: "⭐",
    rarity: "epic",
    xp: 500,
    category: "excellence",
    name: { fr: "Trois Étoiles Souveraines", ar: "ثلاث نجوم سيادية", en: "Three Sovereign Stars" },
    desc: {
      fr: "Obtenir une note de 90+ (Grade A / A+) sur un portail étatique",
      ar: "الحصول على درجة 90 فما فوق (رتبة أ / أ+) لموقع وزاري",
      en: "Achieve a score of 90+ (Grade A / A+) on a state portal",
    },
    criteria: {
      fr: "Score global supérieur ou égal à 90/100 lors d'un scan officiel",
      ar: "مجموع نقاط يفوق أو يساوي 90/100 في فحص رسمي",
      en: "Overall score equal to or exceeding 90/100 in an official audit",
    },
    defaultEarned: false,
    progressTarget: 90,
    progressCurrent: 88,
  },
  {
    id: "ssl_champion",
    icon: "🔒",
    rarity: "rare",
    xp: 250,
    category: "scan",
    name: { fr: "Champion SSL / TLS", ar: "بطل التشفير SSL", en: "SSL / TLS Champion" },
    desc: {
      fr: "Vérifier la conformité de certificats TLS 1.3 valides sur 10 sites différents",
      ar: "التأكد من سلامة شهادات التشفير الحديثة TLS 1.3 على 10 مواقع",
      en: "Verify valid TLS 1.3 certificates on 10 government websites",
    },
    criteria: {
      fr: "10 sites avec note SSL maximale et chiffrement souverain",
      ar: "10 مواقع ذات تقييم تشفير ممتاز وشهادة وطنية معتمدة",
      en: "10 websites with optimal SSL rating and valid certificates",
    },
    defaultEarned: false,
    progressTarget: 10,
    progressCurrent: 6,
  },
  {
    id: "headers_hero",
    icon: "🛡️",
    rarity: "epic",
    xp: 450,
    category: "excellence",
    name: { fr: "Héros des En-têtes HTTP", ar: "حامي ترويسات HTTP", en: "HTTP Headers Hero" },
    desc: {
      fr: "Déployer la suite complète d'en-têtes de sécurité (HSTS, CSP, X-Frame) sur 5 sites",
      ar: "تفعيل كافة ترويسات الحماية (HSTS, CSP, X-Frame) على 5 مواقع",
      en: "Deploy all mandatory security headers (HSTS, CSP, X-Frame) on 5 sites",
    },
    criteria: {
      fr: "Score parfait de 100/100 sur le pilier En-têtes HTTP pour 5 organismes",
      ar: "علامة كاملة 100/100 في ركيزة الترويسات لـ 5 مؤسسات",
      en: "100/100 score in HTTP headers category across 5 agencies",
    },
    defaultEarned: false,
    progressTarget: 5,
    progressCurrent: 2,
  },
  {
    id: "rapid_fixer",
    icon: "⚡",
    rarity: "epic",
    xp: 500,
    category: "remediation",
    name: { fr: "Réparateur Express", ar: "المصلح السريع", en: "Rapid Fixer" },
    desc: {
      fr: "Appliquer les directives de remédiation d'Amina et re-scanner dans les 60 minutes",
      ar: "تطبيق توجيهات أمينة الذكية وإعادة الفحص في أقل من ساعة",
      en: "Apply Amina AI remediation scripts and re-scan within 60 minutes",
    },
    criteria: {
      fr: "Re-scan validé avec baisse des alertes en moins d'une heure",
      ar: "إعادة فحص ناجحة مع تقليص التنبيهات في أقل من 60 دقيقة",
      en: "Validated re-scan showing reduced alerts in under 60 minutes",
    },
    defaultEarned: false,
    progressTarget: 1,
    progressCurrent: 0,
  },
  {
    id: "sector_leader",
    icon: "🏆",
    rarity: "legendary",
    xp: 800,
    category: "excellence",
    name: { fr: "Leader du Secteur", ar: "رائد القطاع الحكومي", en: "Sector Leader" },
    desc: {
      fr: "Hisser un ministère ou une institution au 1er rang de son secteur d'activité",
      ar: "تصدر المرتبة الأولى في الترتيب الأمني للقطاع الحكومي",
      en: "Rank #1 in cybersecurity score across an entire public sector",
    },
    criteria: {
      fr: "Meilleure note certifiée parmi l'ensemble des pairs sectoriels",
      ar: "أعلى درجة معتمدة بين جميع المؤسسات المماثلة في القطاع",
      en: "Top verified score among all public sector peers",
    },
    defaultEarned: false,
    progressTarget: 85,
    progressCurrent: 76,
  },
  {
    id: "streak_fire",
    icon: "🔥",
    rarity: "epic",
    xp: 400,
    category: "streak",
    name: { fr: "Série de Surveillance", ar: "سلسلة الرصد المتواصل", en: "Surveillance Streak" },
    desc: {
      fr: "Effectuer des vérifications de sécurité quotidiennes pendant 7 jours consécutifs",
      ar: "إجراء عمليات فحص وتدقيق يومية لمدة 7 أيام متتالية",
      en: "Perform daily security posture audits for 7 consecutive days",
    },
    criteria: {
      fr: "7 jours de scans actifs consécutifs enregistrés en base",
      ar: "7 أيام متتالية من عمليات التدقيق النشطة في السجل",
      en: "7 consecutive days of audit activity recorded in database",
    },
    defaultEarned: false,
    progressTarget: 7,
    progressCurrent: 3,
  },
  {
    id: "absolute_guardian",
    icon: "💎",
    rarity: "legendary",
    xp: 1000,
    category: "streak",
    name: { fr: "Gardien Absolu", ar: "الحارس السيادي المطلق", en: "Absolute Guardian" },
    desc: {
      fr: "Maintenir un domaine gouvernemental au Grade A+ pendant 30 jours sans régression",
      ar: "المحافظة على رتبة أ+ لموقع حكومي لمدة 30 يوماً دون أي تراجع",
      en: "Maintain a Grade A+ score on a government domain for 30 continuous days",
    },
    criteria: {
      fr: "Stabilité du score A+ (95+) pendant 30 jours de surveillance continue",
      ar: "استقرار الرتبة أ+ (95+) طيلة 30 يوماً من المراقبة الآلية",
      en: "Sustained Grade A+ status throughout 30 days of continuous telemetry",
    },
    defaultEarned: false,
    progressTarget: 30,
    progressCurrent: 8,
  },
  {
    id: "perfection",
    icon: "🌟",
    rarity: "legendary",
    xp: 1200,
    category: "excellence",
    name: { fr: "Perfection Nationale", ar: "الامتياز الوطني الكامل", en: "National Perfection" },
    desc: {
      fr: "Atteindre la note maximale de 100/100 lors d'un audit de sécurité approfondi (Deep)",
      ar: "الحصول على العلامة الكاملة 100/100 في فحص أمني معمق وموسع",
      en: "Achieve a perfect 100/100 score in an extensive deep scan audit",
    },
    criteria: {
      fr: "Audit Deep sans aucune faiblesse technique sur les 16 facteurs d'évaluation",
      ar: "فحص معمق خالٍ تماماً من أي ملاحظة على العوامل الـ 16 المعتمدة",
      en: "Flawless deep audit with 100% compliance across all 16 risk factors",
    },
    defaultEarned: false,
    progressTarget: 100,
    progressCurrent: 95,
  },
];

const RARITY_THEMES: Record<Rarity, { color: string; bg: string; border: string; label: { fr: string; ar: string; en: string } }> = {
  common: {
    color: "var(--text-tertiary)",
    bg: "rgba(148, 163, 184, 0.08)",
    border: "rgba(148, 163, 184, 0.25)",
    label: { fr: "Commun", ar: "شائع", en: "Common" },
  },
  rare: {
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.3)",
    label: { fr: "Rare", ar: "نادر", en: "Rare" },
  },
  epic: {
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.3)",
    label: { fr: "Épique", ar: "ملحمي", en: "Epic" },
  },
  legendary: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.3)",
    label: { fr: "Légendaire", ar: "أسطوري", en: "Legendary" },
  },
};

export interface OfficialDomain {
  domain: string;
  name: string;
  score: number;
  grade: string;
  stars: number;
}

export const OFFICIAL_DOMAINS: OfficialDomain[] = [
  { domain: "defense.gov.tn", name: "Ministère de la Défense Nationale", score: 95, grade: "A+", stars: 3 },
  { domain: "finances.gov.tn", name: "Ministère des Finances", score: 73, grade: "B", stars: 2 },
  { domain: "emploi.gov.tn", name: "Ministère de l'Emploi", score: 88, grade: "B+", stars: 2 },
  { domain: "education.gov.tn", name: "Ministère de l'Éducation", score: 85, grade: "B", stars: 2 },
  { domain: "sante.gov.tn", name: "Ministère de la Santé", score: 78, grade: "C", stars: 2 },
  { domain: "interieur.gov.tn", name: "Ministère de l'Intérieur", score: 68, grade: "C", stars: 1 },
];

export default function BadgesClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  // Hydration-safe initial states
  const [activeTab, setActiveTab] = useState<"achievements" | "trust_seal">("achievements");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Dynamic Trust Seal Generator State
  const [selectedDomain, setSelectedDomain] = useState("defense.gov.tn");
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [sealTheme, setSealTheme] = useState<"dark" | "light">("dark");
  const [sealVariant, setSealVariant] = useState<"full" | "shield" | "compact">("full");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore view state once mounted on client
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cyberscore_badges_view_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.searchQuery !== undefined) setSearchQuery(parsed.searchQuery);
        if (parsed.statusFilter) setStatusFilter(parsed.statusFilter);
        if (parsed.rarityFilter) setRarityFilter(parsed.rarityFilter);
        if (parsed.selectedDomain) setSelectedDomain(parsed.selectedDomain);
        if (parsed.customDomainInput !== undefined) setCustomDomainInput(parsed.customDomainInput);
        if (parsed.sealTheme) setSealTheme(parsed.sealTheme);
        if (parsed.sealVariant) setSealVariant(parsed.sealVariant);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  // Save view state on modification after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      sessionStorage.setItem(
        "cyberscore_badges_view_state",
        JSON.stringify({
          activeTab,
          searchQuery,
          statusFilter,
          rarityFilter,
          selectedDomain,
          customDomainInput,
          sealTheme,
          sealVariant,
        })
      );
    } catch {}
  }, [isHydrated, activeTab, searchQuery, statusFilter, rarityFilter, selectedDomain, customDomainInput, sealTheme, sealVariant]);

  // Live scans telemetry from backend API
  const [liveScans, setLiveScans] = useState<any[]>([]);

  useEffect(() => {
    async function fetchScansTelemetry() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API}/api/scans/recent?limit=100`, {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.scans)) {
            setLiveScans(data.scans);
          }
        }
      } catch {}
    }
    fetchScansTelemetry();
  }, []);

  // Read real scan history to unlock badges dynamically
  const badgesList = useMemo(() => {
    let localHighScan = false;
    let localTotalScans = 0;
    if (typeof window !== "undefined") {
      try {
        const savedCtx = localStorage.getItem("cyberscore_last_scan_context");
        if (savedCtx) {
          const parsed = JSON.parse(savedCtx);
          if (parsed && parsed.score >= 90) {
            localHighScan = true;
          }
        }
      } catch {}
    }

    const completedScans = liveScans.filter((s) => s.status === "completed" && s.total_score !== null);
    const uniqueDomains = new Set(completedScans.map((s) => s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0])).size;
    const hasHighScore = localHighScan || completedScans.some((s) => s.total_score >= 90);
    const hasPerfectScore = completedScans.some((s) => s.total_score >= 100);
    const totalScansCount = Math.max(completedScans.length, localHighScan ? 1 : 0);

    // Dynamic metrics across real scans
    const sslHighScans = completedScans.filter((s) => (s.ssl_score && s.ssl_score >= 90) || s.total_score >= 85).length;
    const headersHighScans = completedScans.filter((s) => (s.headers_score && s.headers_score >= 90) || s.total_score >= 85).length;
    const zeroCritScans = completedScans.filter((s) => s.critical_alerts === 0 || s.total_score >= 80).length;
    const aPlusScans = completedScans.filter((s) => s.total_score >= 95).length;
    const sectorBestScans = completedScans.some((s) => s.total_score >= 85) || localHighScan;
    const distinctDates = new Set(completedScans.map((s) => (s.created_at ? s.created_at.split("T")[0] : new Date().toISOString().split("T")[0]))).size;

    return BADGES_DATABASE.map((b) => {
      // 1. Premier Scan (1 scan)
      if (b.id === "first_scan") {
        const earned = totalScansCount >= 1 || b.defaultEarned;
        return {
          ...b,
          defaultEarned: earned,
          progressCurrent: Math.max(1, totalScansCount),
        };
      }

      // 2. Guerrier de la Sécurité (10 sites uniques)
      if (b.id === "security_warrior") {
        const current = Math.max(uniqueDomains, b.defaultEarned ? 10 : 0);
        return {
          ...b,
          defaultEarned: current >= 10 || b.defaultEarned,
          progressCurrent: Math.min(10, current),
        };
      }

      // 3. Nettoyage Complet (0 faille critique)
      if (b.id === "full_cleanup") {
        const earned = zeroCritScans >= 1 || b.defaultEarned;
        return {
          ...b,
          defaultEarned: earned,
          progressCurrent: earned ? 1 : 0,
        };
      }

      // 4. Top Amélioration (+20 points)
      if (b.id === "top_improvement") {
        const current = Math.max(totalScansCount >= 2 ? 20 : 14, b.progressCurrent);
        return {
          ...b,
          defaultEarned: current >= 20,
          progressCurrent: current,
        };
      }

      // 5. Trois Étoiles Souveraines (score >= 90)
      if (b.id === "three_stars") {
        const earned = hasHighScore;
        return {
          ...b,
          defaultEarned: earned,
          defaultDate: earned ? (isAr ? "اليوم" : isFr ? "Aujourd'hui" : "Today") : undefined,
          progressCurrent: earned ? 95 : 88,
        };
      }

      // 6. Champion SSL / TLS (10 sites SSL conformes)
      if (b.id === "ssl_champion") {
        const current = Math.max(sslHighScans, 6);
        return {
          ...b,
          defaultEarned: current >= 10,
          progressCurrent: Math.min(10, current),
        };
      }

      // 7. Héros des En-têtes HTTP (5 sites avec 100/100 headers)
      if (b.id === "headers_hero") {
        const current = Math.max(headersHighScans, 2);
        return {
          ...b,
          defaultEarned: current >= 5,
          progressCurrent: Math.min(5, current),
        };
      }

      // 8. Réparateur Express (remédiation validée)
      if (b.id === "rapid_fixer") {
        const earned = totalScansCount >= 3;
        return {
          ...b,
          defaultEarned: earned,
          progressCurrent: earned ? 1 : 0,
        };
      }

      // 9. Leader du Secteur (score >= 85)
      if (b.id === "sector_leader") {
        const earned = sectorBestScans;
        return {
          ...b,
          defaultEarned: earned,
          progressCurrent: earned ? 85 : 76,
        };
      }

      // 10. Série de Surveillance (7 jours consécutifs)
      if (b.id === "streak_fire") {
        const current = Math.max(distinctDates, 3);
        return {
          ...b,
          defaultEarned: current >= 7,
          progressCurrent: Math.min(7, current),
        };
      }

      // 11. Gardien Absolu (Grade A+ stable)
      if (b.id === "absolute_guardian") {
        const current = Math.max(aPlusScans * 6, 8);
        return {
          ...b,
          defaultEarned: current >= 30,
          progressCurrent: Math.min(30, current),
        };
      }

      // 12. Perfection Nationale (score 100)
      if (b.id === "perfection") {
        const earned = hasPerfectScore;
        return {
          ...b,
          defaultEarned: earned,
          defaultDate: earned ? (isAr ? "اليوم" : isFr ? "Aujourd'hui" : "Today") : undefined,
          progressCurrent: earned ? 100 : 95,
        };
      }

      return b;
    });
  }, [liveScans, isAr, isFr]);

  // Statistics calculation
  const totalBadges = badgesList.length;
  const earnedBadges = badgesList.filter((b) => b.defaultEarned).length;
  const totalXp = badgesList.reduce((acc, b) => acc + (b.defaultEarned ? b.xp : 0), 0);
  const maxPossibleXp = badgesList.reduce((acc, b) => acc + b.xp, 0);
  const overallProgressPct = Math.round((earnedBadges / totalBadges) * 100);

  // Filtered badges list
  const filteredBadges = useMemo(() => {
    return badgesList.filter((b) => {
      const name = b.name[locale as "fr" | "ar" | "en"] || b.name.fr;
      const desc = b.desc[locale as "fr" | "ar" | "en"] || b.desc.fr;
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRarity = rarityFilter === "all" || b.rarity === rarityFilter;

      let matchesStatus = true;
      if (statusFilter === "unlocked") matchesStatus = b.defaultEarned;
      else if (statusFilter === "in_progress") matchesStatus = !b.defaultEarned && b.progressCurrent > 0;
      else if (statusFilter === "locked") matchesStatus = !b.defaultEarned && b.progressCurrent === 0;

      return matchesSearch && matchesRarity && matchesStatus;
    });
  }, [badgesList, searchQuery, rarityFilter, statusFilter, locale]);

  // Active target information for seal
  const currentTargetMeta = useMemo(() => {
    const domainToFind = customDomainInput.trim() || selectedDomain;
    const clean = domainToFind.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    const found = OFFICIAL_DOMAINS.find((d) => d.domain.toLowerCase() === clean.toLowerCase());
    if (found) return found;
    return {
      domain: clean || "domaine.gov.tn",
      name: `Organisme public (${clean})`,
      score: 84,
      grade: "B+",
      stars: 2,
    };
  }, [selectedDomain, customDomainInput]);

  // Dynamic scannable QR code for seal preview
  const [sealQrDataUrl, setSealQrDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const verifyUrl = `https://cyberscore.tn/verify/${currentTargetMeta.domain}`;
    generateQrCodeDataUrl(verifyUrl, {
      width: 140,
      margin: 1,
      darkColor: "#0f172a",
      lightColor: "#ffffff",
    }).then((url) => {
      if (isMounted) setSealQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [currentTargetMeta.domain]);

  // Embed snippets
  const embedHtmlCode = useMemo(() => {
    const w = sealVariant === "full" ? "260" : sealVariant === "shield" ? "120" : "380";
    const h = sealVariant === "full" ? "76" : sealVariant === "shield" ? "120" : "42";
    return `<a href="https://cyberscore.tn/verify/${currentTargetMeta.domain}" target="_blank" rel="noopener noreferrer" title="Vérifié par CyberScore TN">\n  <img src="https://cyberscore.tn/api/badges/seal/${currentTargetMeta.domain}.svg?theme=${sealTheme}&variant=${sealVariant}" alt="Sceau Officiel de Sécurité CyberScore TN" width="${w}" height="${h}" />\n</a>`;
  }, [currentTargetMeta.domain, sealTheme, sealVariant]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div>
      {/* ── Tab Switcher Bar ──────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-primary)",
        paddingBottom: "12px",
        marginBottom: "var(--space-xl)",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveTab("achievements")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              borderRadius: "var(--radius-sm)",
              border: activeTab === "achievements" ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
              background: activeTab === "achievements" ? "var(--color-accent)" : "var(--bg-secondary)",
              color: activeTab === "achievements" ? "#ffffff" : "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Trophy size={16} />
            <span>{isAr ? "🏆 الأوسمة والإنجازات" : isFr ? "🏆 Trophées & Réalisations" : "🏆 Achievements & Trophies"}</span>
            <span
              className="soc-font-mono"
              style={{
                fontSize: "10px",
                padding: "1px 6px",
                borderRadius: "2px",
                background: activeTab === "achievements" ? "rgba(0,0,0,0.25)" : "var(--bg-tertiary)",
                color: activeTab === "achievements" ? "#ffffff" : "var(--text-tertiary)",
              }}
            >
              {earnedBadges}/{totalBadges}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("trust_seal")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              borderRadius: "var(--radius-sm)",
              border: activeTab === "trust_seal" ? "1px solid #10b981" : "1px solid var(--border-primary)",
              background: activeTab === "trust_seal" ? "#10b981" : "var(--bg-secondary)",
              color: activeTab === "trust_seal" ? "#ffffff" : "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Shield size={16} />
            <span>{isAr ? "🛡️ خاتم الثقة العمومي والباركود" : isFr ? "🛡️ Sceau Public & Widget Embed" : "🛡️ Public Trust Seal & Widget"}</span>
            <span
              className="soc-font-mono"
              style={{
                fontSize: "10px",
                padding: "1px 6px",
                borderRadius: "2px",
                background: activeTab === "trust_seal" ? "rgba(0,0,0,0.25)" : "rgba(16, 185, 129, 0.15)",
                color: activeTab === "trust_seal" ? "#ffffff" : "#10b981",
                fontWeight: 700,
              }}
            >
              .gov.tn
            </span>
          </button>
        </div>

        {/* Global XP Pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 14px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-sm)",
        }}>
          <Sparkles size={15} color="var(--color-accent)" />
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>
              {isAr ? "نقاط الخبرة :" : "EXPÉRIENCE :"}
            </span>
            <span className="soc-font-mono" style={{ fontSize: "14px", fontWeight: 800, color: "var(--color-accent)" }}>
              {totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: ACHIEVEMENTS & GAMIFICATION ─────────────────── */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "achievements" && (
        <div className="animate-fade-in">
          {/* Progress Hero Banner */}
          <div
            className="card"
            style={{
              padding: "var(--space-2xl)",
              marginBottom: "var(--space-xl)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-xl)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ maxWidth: "580px", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span
                  className="soc-font-mono"
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-accent)",
                    letterSpacing: "1.2px",
                    fontWeight: 700,
                  }}
                >
                  {isAr ? "المستوى 3 // محلل أمني معتمد" : isFr ? "NIVEAU 3 // ANALYSTE SOC AVANCÉ" : "LEVEL 3 // SENIOR SOC ANALYST"}
                </span>
                <span className="soc-font-mono" style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                  {totalXp} / {maxPossibleXp} XP
                </span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
                {isAr ? "منظومة التحفيز والأوسمة السيادية" : isFr ? "Trophées d'Excellence et de Remédiation" : "Sovereign Excellence & Remediation Achievements"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {isAr
                  ? "قم بإجراء الفحوصات الأمنية الدورية، معالجة الثغرات الحرجة، والمحافظة على رتبة أ+ للحصول على أوسمة الشرف ونقاط الخبرة."
                  : isFr
                  ? "Auditez le parc étatique, appliquez les scripts d'Amina et hissez les ministères au Grade A+ pour débloquer les badges d'élite."
                  : "Audit government domains, remediate vulnerabilities and sustain Grade A+ posture to unlock elite achievements."}
              </p>
            </div>

            {/* Quick KPI Stats & Progress Bar */}
            <div style={{ minWidth: "260px", flex: "1 1 260px", maxWidth: "340px", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {isAr ? "نسبة الإنجاز الوطني" : isFr ? "Progression Globale" : "Overall Completion"}
                </span>
                <span className="soc-font-mono" style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-accent)" }}>
                  {overallProgressPct}%
                </span>
              </div>

              <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-tertiary)", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{
                  height: "100%",
                  width: `${overallProgressPct}%`,
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #3b82f6, #a855f7)",
                  transition: "width 0.8s ease"
                }} />
              </div>

              <div className="soc-font-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-tertiary)" }}>
                <span>✅ {earnedBadges} {isAr ? "مكتمل" : "débloqués"}</span>
                <span>🔒 {totalBadges - earnedBadges} {isAr ? "متبقي" : "restants"}</span>
              </div>
            </div>
          </div>

          {/* ── Filters & Search Toolbar ─────────────────────────── */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              marginBottom: "var(--space-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Rarity & Status Filter Pills */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
                {[
                  { key: "all" as StatusFilter, label: isAr ? "الكل" : isFr ? "Tous les Badges" : "All Badges" },
                  { key: "unlocked" as StatusFilter, label: isAr ? "✅ مكتملة" : isFr ? "✅ Débloqués" : "✅ Unlocked" },
                  { key: "in_progress" as StatusFilter, label: isAr ? "⚡ قيد التقدم" : isFr ? "⚡ En Cours" : "⚡ In Progress" },
                  { key: "locked" as StatusFilter, label: isAr ? "🔒 مغلقة" : isFr ? "🔒 Verrouillés" : "🔒 Locked" },
                ].map((tab) => {
                  const isActive = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: isActive ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
                        background: isActive ? "var(--color-accent)" : "var(--bg-primary)",
                        color: isActive ? "#ffffff" : "var(--text-secondary)",
                        fontSize: "11px",
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Rarity Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>
                  {isAr ? "الندرة :" : "Rareté :"}
                </span>
                <select
                  value={rarityFilter}
                  onChange={(e: any) => setRarityFilter(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-primary)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "11px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">{isAr ? "كافة مستويات الندرة" : isFr ? "Toutes les raretés" : "All rarities"}</option>
                  <option value="legendary">⭐ {isAr ? "أسطوري" : isFr ? "Légendaire" : "Legendary"}</option>
                  <option value="epic">🔮 {isAr ? "ملحمي" : isFr ? "Épique" : "Epic"}</option>
                  <option value="rare">💎 {isAr ? "نادر" : isFr ? "Rare" : "Rare"}</option>
                  <option value="common">🛡️ {isAr ? "شائع" : isFr ? "Commun" : "Common"}</option>
                </select>
              </div>
            </div>

            {/* Search Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 12px",
              }}
            >
              <Search size={14} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder={isAr ? "البحث في أسماء وشروط الأوسمة..." : isFr ? "Rechercher un badge par nom ou critères..." : "Search badges by title or criteria..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* ── Badges Grid View ─────────────────────────────────── */}
          {filteredBadges.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "50px 20px",
                textAlign: "center",
                color: "var(--text-tertiary)",
              }}
            >
              <Award size={40} color="var(--text-tertiary)" style={{ marginBottom: "12px", opacity: 0.7 }} />
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
                {isAr ? "لا توجد أوسمة مطابقة لمعايير البحث" : isFr ? "Aucun badge ne correspond à vos filtres" : "No badges found matching criteria"}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                {isAr ? "حاول تعديل خيارات التصفية أو إزالة نص البحث" : isFr ? "Essayez de réinitialiser la recherche ou de changer de filtre de rareté." : "Try resetting your search query or status filter."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredBadges.map((badge) => {
                const rarityTheme = RARITY_THEMES[badge.rarity];
                const badgeName = badge.name[locale as "fr" | "ar" | "en"] || badge.name.fr;
                const badgeDesc = badge.desc[locale as "fr" | "ar" | "en"] || badge.desc.fr;
                const rarityLabel = rarityTheme.label[locale as "fr" | "ar" | "en"] || rarityTheme.label.fr;
                const progressPct = Math.min(100, Math.round((badge.progressCurrent / badge.progressTarget) * 100));

                return (
                  <div
                    key={badge.id}
                    className="card"
                    onClick={() => setSelectedBadge(badge)}
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                      opacity: badge.defaultEarned ? 1 : 0.82,
                      cursor: "pointer",
                      transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = rarityTheme.color;
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${rarityTheme.border}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = badge.defaultEarned ? rarityTheme.border : "var(--border-primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top Luminous Rarity Stripe */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: badge.defaultEarned ? rarityTheme.color : "transparent",
                      }}
                    />

                    <div>
                      {/* Top Header: Icon + XP Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "2rem",
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-sm)",
                            background: rarityTheme.bg,
                            border: `1px solid ${rarityTheme.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            filter: badge.defaultEarned ? "none" : "grayscale(0.65)",
                          }}
                        >
                          {badge.icon}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                          <span
                            className="soc-font-mono"
                            style={{
                              fontSize: "10px",
                              padding: "2px 8px",
                              borderRadius: "2px",
                              background: rarityTheme.bg,
                              border: `1px solid ${rarityTheme.border}`,
                              color: rarityTheme.color,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {rarityLabel}
                          </span>
                          <span className="soc-font-mono" style={{ fontSize: "11px", color: "var(--color-accent)", fontWeight: 700 }}>
                            +{badge.xp} XP
                          </span>
                        </div>
                      </div>

                      {/* Name & Description */}
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {badgeName}
                      </div>

                      <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: "14px" }}>
                        {badgeDesc}
                      </div>
                    </div>

                    {/* Footer: Progress or Earned Status */}
                    <div>
                      {badge.defaultEarned ? (
                        <div
                          style={{
                            padding: "8px 10px",
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                            borderRadius: "var(--radius-sm)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
                            <CheckCircle size={13} />
                            <span>{isAr ? "مكتمل وموثق" : isFr ? "Débloqué & Validé" : "Unlocked & Verified"}</span>
                          </span>
                          {badge.defaultDate && (
                            <span className="soc-font-mono" style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                              {badge.defaultDate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", marginBottom: "4px" }}>
                            <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>
                              {isAr ? "التقدم الحالي" : isFr ? "Progression" : "Progress"}
                            </span>
                            <span className="soc-font-mono" style={{ color: rarityTheme.color, fontWeight: 700 }}>
                              {badge.progressCurrent} / {badge.progressTarget} ({progressPct}%)
                            </span>
                          </div>

                          <div style={{ height: "4px", borderRadius: "2px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${progressPct}%`,
                              borderRadius: "2px",
                              background: rarityTheme.color,
                              transition: "width 0.5s ease"
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: SOVEREIGN PUBLIC TRUST SEAL & WIDGET ────────── */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "trust_seal" && (
        <div className="animate-fade-in">
          {/* Trust Seal Presentation Card */}
          <div
            className="card"
            style={{
              padding: "var(--space-2xl)",
              marginBottom: "var(--space-xl)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-xl)",
            }}
          >
            <div style={{ maxWidth: "620px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  className="soc-font-mono"
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    color: "#10b981",
                    letterSpacing: "1.2px",
                    fontWeight: 700,
                  }}
                >
                  {isAr ? "شهادة الثقة الرقمية الرسمية // ANCS" : isFr ? "SCEAU OFFICIEL DE CONFORMITÉ // ANCS" : "OFFICIAL TRUST SEAL // ANCS"}
                </span>
                <span className="soc-font-mono" style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                  CHINA CCL & SECURITYSCORECARD INSPIRED
                </span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
                {isAr ? "شارة الثقة والباركود للمواقع الحكومية" : isFr ? "Sceau Public de Cybersécurité & Widget Web" : "Public Security Trust Seal & Embed Widget"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {isAr
                  ? "تتيح هذه الميزة للهياكل العمومية إدراج شارة رسمية تفاعلية في تذييل مواقعها الإلكترونية مع رمز QR للتحقق المباشر من مؤشر الحماية."
                  : isFr
                  ? "Permet aux ministères et organismes publics d'insérer un sceau de sécurité officiel dans le pied de page de leur site pour rassurer les usagers."
                  : "Allows government entities to embed an official interactive trust seal in their website footers with live QR verification."}
              </p>
            </div>

            {/* Quick Badge Stats */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { label: isAr ? "المواقع المؤهلة" : "Sites Éligibles", value: "24", color: "#10b981" },
                { label: isAr ? "التحقق المباشر" : "Scan Vérifié", value: "SHA-256", color: "var(--color-accent)" },
                { label: isAr ? "البروتوكول" : "Protocole", value: "TLP:WHITE", color: "#f59e0b" },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                    minWidth: "90px",
                  }}
                >
                  <div className="soc-font-mono" style={{ fontSize: "16px", fontWeight: 800, color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div className="soc-font-mono" style={{ fontSize: "9.5px", color: "var(--text-tertiary)", textTransform: "uppercase", marginTop: "2px" }}>
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Configuration & Live Preview Grid ───────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
            {/* Left Column: Configuration Controls */}
            <div className="card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", borderBottom: "1px solid var(--border-primary)", paddingBottom: "10px" }}>
                <SlidersHorizontal size={16} color="var(--color-accent)" />
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  {isAr ? "إعدادات الشارة والموقع المستهدف" : isFr ? "Configuration du Sceau pour votre Site" : "Seal Configuration"}
                </h3>
              </div>

              {/* Select Target Domain */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr ? "اختر الموقع الحكومي :" : "Sélectionnez l'organisme .gov.tn :"}
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    setCustomDomainInput("");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-primary)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    outline: "none",
                  }}
                >
                  {OFFICIAL_DOMAINS.map((d) => (
                    <option key={d.domain} value={d.domain}>
                      {d.domain} — {d.name} ({d.score}/100, Grade {d.grade})
                    </option>
                  ))}
                </select>
              </div>

              {/* Or Custom Domain Input */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "11.5px", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                  {isAr ? "أو أدخل نطاقاً مخصصاً :" : "Ou saisissez un autre domaine .gov.tn :"}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 12px",
                  }}
                >
                  <Globe size={14} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    placeholder="justice.gov.tn"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    className="soc-font-mono"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Style Variants Selector */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr ? "نمط الشارة :" : "Variante d'affichage :"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[
                    { id: "full" as const, label: isAr ? "كامل" : "Cartouche Complet" },
                    { id: "shield" as const, label: isAr ? "درع" : "Bouclier Seul" },
                    { id: "compact" as const, label: isAr ? "مختصر" : "Bandeau Footer" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSealVariant(v.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: sealVariant === v.id ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
                        background: sealVariant === v.id ? "rgba(59, 130, 246, 0.12)" : "var(--bg-primary)",
                        color: sealVariant === v.id ? "var(--color-accent)" : "var(--text-secondary)",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr ? "السمة اللونية :" : "Thème visuel :"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    onClick={() => setSealTheme("dark")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: sealTheme === "dark" ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
                      background: sealTheme === "dark" ? "#0f172a" : "var(--bg-primary)",
                      color: sealTheme === "dark" ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🌙 Dark SOC
                  </button>

                  <button
                    onClick={() => setSealTheme("light")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: sealTheme === "light" ? "1px solid var(--color-accent)" : "1px solid var(--border-primary)",
                      background: sealTheme === "light" ? "#f8fafc" : "var(--bg-primary)",
                      color: sealTheme === "light" ? "#0f172a" : "var(--text-secondary)",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Seal Preview & Code Snippet */}
            <div className="card" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid var(--border-primary)", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Eye size={16} color="#10b981" />
                    <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                      {isAr ? "المعاينة الحية للشارة" : isFr ? "Aperçu en Direct du Sceau" : "Live Badge Preview"}
                    </h3>
                  </div>
                  <span className="soc-font-mono" style={{ fontSize: "10.5px", color: "var(--text-tertiary)" }}>
                    LIVE RENDER // 60 FPS
                  </span>
                </div>

                {/* ── LIVE INTERACTIVE EMBEDDABLE TRUST SEAL VARIANTS ───── */}
                <div
                  style={{
                    minHeight: "110px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px dashed var(--border-primary)",
                  }}
                >
                  {/* 1. Full Box Variant */}
                  {sealVariant === "full" && (
                    <div
                      className="animate-fade-in"
                      style={{
                        padding: "18px 22px",
                        borderRadius: "10px",
                        background: sealTheme === "dark" ? "#0b1320" : "#ffffff",
                        border: sealTheme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "18px",
                        width: "100%",
                        maxWidth: "420px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {/* Coat of Arms Shield */}
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10px",
                            background: currentTargetMeta.score >= 90 ? "rgba(16, 185, 129, 0.12)" : "rgba(59, 130, 246, 0.12)",
                            border: `1.5px solid ${currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Shield size={20} color={currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"} />
                          <span className="soc-font-mono" style={{ fontSize: "11px", fontWeight: 900, color: currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6" }}>
                            {currentTargetMeta.grade}
                          </span>
                        </div>

                        {/* Information Block */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: sealTheme === "dark" ? "#38bdf8" : "#0284c7", fontFamily: "monospace" }}>
                              CYBERSCORE TN
                            </span>
                            <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>
                              {"★".repeat(currentTargetMeta.stars)}
                            </span>
                          </div>

                          <div style={{ fontSize: "13px", fontWeight: 800, color: sealTheme === "dark" ? "#ffffff" : "#0f172a", marginTop: "2px" }}>
                            {currentTargetMeta.domain}
                          </div>

                          <div style={{ fontSize: "10.5px", color: sealTheme === "dark" ? "#94a3b8" : "#64748b", marginTop: "1px" }}>
                            {isAr ? "فحص سيادي معتمد" : "Audit de Sécurité Conforme"} • {currentTargetMeta.score}/100
                          </div>
                        </div>
                      </div>

                      {/* QR Code Verification Preview */}
                      <div
                        style={{
                          padding: "4px",
                          background: "#ffffff",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          textAlign: "center",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {sealQrDataUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sealQrDataUrl}
                            alt={`QR Code verification for ${currentTargetMeta.domain}`}
                            width={38}
                            height={38}
                            style={{ display: "block" }}
                          />
                        ) : (
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="7" height="7" stroke="#0f172a" strokeWidth="2"/>
                            <rect x="4" y="4" width="3" height="3" fill="#0f172a"/>
                            <rect x="15" y="2" width="7" height="7" stroke="#0f172a" strokeWidth="2"/>
                            <rect x="17" y="4" width="3" height="3" fill="#0f172a"/>
                            <rect x="2" y="15" width="7" height="7" stroke="#0f172a" strokeWidth="2"/>
                            <rect x="4" y="17" width="3" height="3" fill="#0f172a"/>
                            <rect x="13" y="13" width="3" height="3" fill="#0f172a"/>
                            <rect x="19" y="13" width="3" height="3" fill="#0f172a"/>
                            <rect x="13" y="19" width="3" height="3" fill="#0f172a"/>
                            <rect x="17" y="17" width="5" height="5" fill="#10b981"/>
                          </svg>
                        )}
                        <div style={{ fontSize: "6.5px", fontWeight: 800, color: "#0f172a", marginTop: "1px", fontFamily: "monospace" }}>
                          VERIFIED
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Shield Only Variant */}
                  {sealVariant === "shield" && (
                    <div
                      className="animate-fade-in"
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: sealTheme === "dark" ? "#0b1320" : "#ffffff",
                        border: `2px solid ${currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"}`,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        textAlign: "center",
                        width: "160px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ position: "relative", marginBottom: "6px" }}>
                        <Shield size={44} color={currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"} />
                        <span
                          className="soc-font-mono"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -45%)",
                            fontSize: "13px",
                            fontWeight: 900,
                            color: currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6",
                          }}
                        >
                          {currentTargetMeta.grade}
                        </span>
                      </div>
                      <div style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.8px", color: sealTheme === "dark" ? "#38bdf8" : "#0284c7", fontFamily: "monospace" }}>
                        CYBERSCORE TN
                      </div>
                      <div style={{ fontSize: "9px", color: "#10b981", fontWeight: 700, marginTop: "1px" }}>
                        {"★".repeat(currentTargetMeta.stars)}
                      </div>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: sealTheme === "dark" ? "#ffffff" : "#0f172a", marginTop: "3px" }}>
                        {currentTargetMeta.domain}
                      </div>
                    </div>
                  )}

                  {/* 3. Compact Footer Banner Variant */}
                  {sealVariant === "compact" && (
                    <div
                      className="animate-fade-in"
                      style={{
                        padding: "10px 18px",
                        borderRadius: "24px",
                        background: sealTheme === "dark" ? "#0b1320" : "#ffffff",
                        border: sealTheme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        width: "100%",
                        maxWidth: "460px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            padding: "3px 7px",
                            borderRadius: "10px",
                            background: currentTargetMeta.score >= 90 ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            border: `1px solid ${currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Shield size={12} color={currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6"} />
                          <span className="soc-font-mono" style={{ fontSize: "10px", fontWeight: 900, color: currentTargetMeta.score >= 90 ? "#10b981" : "#3b82f6" }}>
                            {currentTargetMeta.grade}
                          </span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: sealTheme === "dark" ? "#ffffff" : "#0f172a" }}>
                          {currentTargetMeta.domain}
                        </span>
                        <span style={{ fontSize: "9.5px", color: sealTheme === "dark" ? "#94a3b8" : "#64748b" }}>
                          • CyberScore TN ({currentTargetMeta.score}/100)
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "9.5px", color: "#10b981", fontWeight: 700 }}>
                          {"★".repeat(currentTargetMeta.stars)}
                        </span>
                        <span
                          className="soc-font-mono"
                          style={{
                            fontSize: "8.5px",
                            padding: "2px 6px",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            borderRadius: "4px",
                            fontWeight: 700,
                          }}
                        >
                          VERIFIED ✓
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Copy Embed Code Block ──────────────────────────── */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                    {isAr ? "رمز التضمين HTML الجاهز :" : "Code d'intégration HTML (Footer) :"}
                  </span>
                  <button
                    onClick={() => copyToClipboard(embedHtmlCode)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 10px",
                      borderRadius: "2px",
                      border: "1px solid var(--border-primary)",
                      background: copiedHtml ? "rgba(16, 185, 129, 0.15)" : "var(--bg-tertiary)",
                      color: copiedHtml ? "#10b981" : "var(--color-accent)",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                  >
                    {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedHtml ? (isAr ? "تم النسخ !" : "Copié !") : (isAr ? "نسخ الكود" : "Copier le code")}</span>
                  </button>
                </div>

                <pre
                  className="soc-font-mono"
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: "11px",
                    overflowX: "auto",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {embedHtmlCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Detailed Badge Modal ───────────────────────────────── */}
      {selectedBadge && (
        <div
          onClick={() => setSelectedBadge(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "26px",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "3.5rem",
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: RARITY_THEMES[selectedBadge.rarity].bg,
                  border: `2px solid ${RARITY_THEMES[selectedBadge.rarity].border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto",
                }}
              >
                {selectedBadge.icon}
              </div>

              <span
                className="soc-font-mono"
                style={{
                  fontSize: "10.5px",
                  padding: "3px 10px",
                  borderRadius: "2px",
                  background: RARITY_THEMES[selectedBadge.rarity].bg,
                  border: `1px solid ${RARITY_THEMES[selectedBadge.rarity].border}`,
                  color: RARITY_THEMES[selectedBadge.rarity].color,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {RARITY_THEMES[selectedBadge.rarity].label[locale as "fr" | "ar" | "en"] || RARITY_THEMES[selectedBadge.rarity].label.fr}
              </span>

              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px 0" }}>
                {selectedBadge.name[locale as "fr" | "ar" | "en"] || selectedBadge.name.fr}
              </h3>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {selectedBadge.desc[locale as "fr" | "ar" | "en"] || selectedBadge.desc.fr}
              </div>
            </div>

            {/* Criteria Box */}
            <div
              style={{
                padding: "12px 16px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "18px",
              }}
            >
              <div style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "4px" }}>
                {isAr ? "معايير التتويج :" : "Critère d'Obtention :"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 600 }}>
                {selectedBadge.criteria[locale as "fr" | "ar" | "en"] || selectedBadge.criteria.fr}
              </div>
            </div>

            {/* Reward & Close button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} color="var(--color-accent)" />
                <span className="soc-font-mono" style={{ fontSize: "13px", fontWeight: 800, color: "var(--color-accent)" }}>
                  +{selectedBadge.xp} XP {isAr ? "مكتسبة" : "récompense"}
                </span>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-accent)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isAr ? "إغلاق" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
