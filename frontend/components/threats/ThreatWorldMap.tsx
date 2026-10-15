"use client";

/**
 * ThreatWorldMap — Animated cyber war room world map + threat dashboard
 * Shows attack origins with glowing points and animated attack lines to Tunisia
 * Connected to Live PostgreSQL Scans, Hybrid Real CVEs & CTI Feeds
 * 100% Trilingual (AR / FR / EN) with instant reactive language switching & refined cyber palette
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Eye, Shield, AlertTriangle, ExternalLink, Globe } from "lucide-react";
import ReportPreviewModal from "@/components/report/ReportPreviewModal";
import { generateMockReport, ScanReport } from "@/lib/report-data";

// ── Types ────────────────────────────────────────────────

interface ThreatSource {
  country: string;
  countryAr: string;
  countryFr: string;
  lat: number;
  lng: number;
  attacks: number;
  typeFr: string;
  typeAr: string;
  typeEn: string;
  severity: "critical" | "high" | "medium" | "low";
  flag: string;
}

interface ThreatFeedEntry {
  ip: string;
  country: string;
  flag: string;
  target: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
  score?: number;
  grade?: string;
}

interface CVECard {
  id: string;
  rawTitle: any;
  rawDesc: any;
  cvss: number;
  severity: "critical" | "high" | "medium" | "low";
  target?: string;
  isRealFinding?: boolean;
}

// ── Data ─────────────────────────────────────────────────

const TUNISIA = { lat: 33.8869, lng: 9.5375 };

const THREAT_SOURCES: ThreatSource[] = [
  { country: "Russia", countryFr: "Russie", countryAr: "روسيا", lat: 55.7558, lng: 37.6173, attacks: 847, typeFr: "APT / Force Brute", typeAr: "هجمات موجهة / تخمين", typeEn: "APT / Brute Force", severity: "critical", flag: "🇷🇺" },
  { country: "China", countryFr: "Chine", countryAr: "الصين", lat: 39.9042, lng: 116.4074, attacks: 623, typeFr: "Espionnage / SQLi", typeAr: "تجسس / حقن SQL", typeEn: "Espionage / SQLi", severity: "critical", flag: "🇨🇳" },
  { country: "North Korea", countryFr: "Corée du Nord", countryAr: "كوريا الشمالية", lat: 39.0392, lng: 125.7625, attacks: 312, typeFr: "Ransomware / Rançongiciel", typeAr: "برمجيات الفدية", typeEn: "Ransomware", severity: "high", flag: "🇰🇵" },
  { country: "Iran", countryFr: "Iran", countryAr: "إيران", lat: 35.6892, lng: 51.3890, attacks: 256, typeFr: "DDoS / Wiper", typeAr: "حجب الخدمة / مسح", typeEn: "DDoS / Wiper", severity: "high", flag: "🇮🇷" },
  { country: "USA", countryFr: "États-Unis", countryAr: "أمريكا", lat: 38.9072, lng: -77.0369, attacks: 189, typeFr: "Scanners / Reconnaissance", typeAr: "مسح / استطلاع", typeEn: "Scanner / Recon", severity: "medium", flag: "🇺🇸" },
  { country: "Brazil", countryFr: "Brésil", countryAr: "البرازيل", lat: -15.7975, lng: -47.8919, attacks: 134, typeFr: "Botnets / Zombies", typeAr: "شبكات بوتنت", typeEn: "Botnet", severity: "medium", flag: "🇧🇷" },
  { country: "India", countryFr: "Inde", countryAr: "الهند", lat: 28.6139, lng: 77.2090, attacks: 98, typeFr: "Hameçonnage / Phishing", typeAr: "تصيد احتيالي", typeEn: "Phishing", severity: "medium", flag: "🇮🇳" },
  { country: "Nigeria", countryFr: "Nigéria", countryAr: "نيجيريا", lat: 9.0579, lng: 7.4951, attacks: 87, typeFr: "Arnaque BEC / Phishing", typeAr: "احتيال مالي / تصيد", typeEn: "BEC / Phishing", severity: "low", flag: "🇳🇬" },
  { country: "Turkey", countryFr: "Turquie", countryAr: "تركيا", lat: 39.9334, lng: 32.8597, attacks: 76, typeFr: "XSS / Injections SQL", typeAr: "حقن نصوص XSS", typeEn: "XSS / SQLi", severity: "medium", flag: "🇹🇷" },
  { country: "Germany", countryFr: "Allemagne", countryAr: "ألمانيا", lat: 52.5200, lng: 13.4050, attacks: 45, typeFr: "Scan de Ports", typeAr: "فحص المنافذ", typeEn: "Port Scan", severity: "low", flag: "🇩🇪" },
  { country: "Ukraine", countryFr: "Ukraine", countryAr: "أوكرانيا", lat: 50.4501, lng: 30.5234, attacks: 156, typeFr: "Serveurs C2 Malware", typeAr: "سيرفرات تحكم C2", typeEn: "Malware C2", severity: "high", flag: "🇺🇦" },
  { country: "Vietnam", countryFr: "Vietnam", countryAr: "فيتنام", lat: 21.0285, lng: 105.8542, attacks: 67, typeFr: "Minage Illégal Cryptomonnaie", typeAr: "تعدين خبيث", typeEn: "Cryptojacking", severity: "low", flag: "🇻🇳" },
];

const DEFAULT_TARGETS = [
  "finances.gov.tn", "pm.gov.tn", "defense.tn", "interieur.gov.tn",
  "sante.gov.tn", "education.gov.tn", "justice.gov.tn", "diplomatie.gov.tn",
  "transport.gov.tn", "agriculture.gov.tn", "bct.gov.tn", "steg.com.tn"
];

const ATTACK_TYPES = [
  { en: "Brute Force SSH", fr: "Force Brute SSH", ar: "تخمين كلمات المرور SSH" },
  { en: "SQL Injection", fr: "Injection SQL", ar: "حقن قواعد البيانات SQL" },
  { en: "XSS Reflected", fr: "Faille XSS Réfléchie", ar: "ثغرة البرمجة عبر المواقع XSS" },
  { en: "DDoS SYN Flood", fr: "Attaque DDoS SYN Flood", ar: "هجوم حجب الخدمة DDoS" },
  { en: "Port Scan Recon", fr: "Reconnaissance de Ports", ar: "استطلاع وفحص المنافذ" },
  { en: "Phishing Attempt", fr: "Tentative de Phishing", ar: "محاولة تصيد احتيالي" },
  { en: "Malware C2", fr: "Serveur C2 Malveillant", ar: "اتصال بخادم تحكم خبيث" },
  { en: "Directory Traversal", fr: "Traversée de Répertoires", ar: "اجتياز المسارات والمجلدات" },
  { en: "CVE Exploit", fr: "Exploitation de Faille CVE", ar: "استغلال ثغرة أمنية CVE" },
  { en: "Credential Stuffing", fr: "Bourrage d'Identifiants", ar: "حشو بيانات الاعتماد" },
  { en: "HSTS Downgrade", fr: "Dégradation HTTPS / HSTS", ar: "تجريد تشفير HTTPS" },
  { en: "Unsecured SSL", fr: "Certificat SSL Vulnérable", ar: "شهادة أمان غير محمية" },
];

const DEFAULT_CVES: CVECard[] = [
  {
    id: "CVE-2024-3400",
    rawTitle: {
      fr: "Injection de Commande PAN-OS",
      ar: "حقن أوامر غير مصرح به في PAN-OS",
      en: "PAN-OS Command Injection",
    },
    rawDesc: {
      fr: "Injection de commande non authentifiée dans la passerelle GlobalProtect de Palo Alto Networks permettant l'exécution de code arbitraire avec privilèges root.",
      ar: "ثغرة حقن أوامر غير مصرح بها في بوابات GlobalProtect تتيح للمهاجمين تنفيذ تعليمات برمجية بصلاحيات الجذر (Root).",
      en: "Unauthenticated command injection in Palo Alto Networks PAN-OS GlobalProtect gateway enabling arbitrary code execution with root privileges.",
    },
    cvss: 10.0,
    severity: "critical",
    target: "defense.tn",
    isRealFinding: false,
  },
  {
    id: "CVE-2024-21762",
    rawTitle: {
      fr: "Écriture Hors Limites FortiOS SSL VPN",
      ar: "كتابة خارج الحدود في بروتوكول FortiOS VPN",
      en: "FortiOS Out-of-Bounds Write",
    },
    rawDesc: {
      fr: "Vulnérabilité critique d'écriture hors limites dans le démon SSL VPN de FortiOS permettant l'exécution de code à distance sans authentification.",
      ar: "ثغرة حرجة تتيح تنفيذ تعليمات برمجية عن بُعد عبر طلبات HTTP مصممة خصيصاً دون الحاجة لتسجيل الدخول.",
      en: "Critical out-of-bounds write vulnerability in FortiOS SSL VPN daemon allowing remote code execution via specially crafted HTTP requests.",
    },
    cvss: 9.8,
    severity: "critical",
    target: "finances.gov.tn",
    isRealFinding: false,
  },
  {
    id: "CVE-2023-46805",
    rawTitle: {
      fr: "Contournement d'Authentification Ivanti",
      ar: "تجاوز المصادقة في بوابات Ivanti Secure",
      en: "Ivanti Connect Secure Auth Bypass",
    },
    rawDesc: {
      fr: "Contournement d'authentification dans les passerelles Ivanti Connect Secure et Policy Secure permettant l'accès aux ressources internes protégées.",
      ar: "تجاوز آليات التحقق والمصادقة في أجهزة Ivanti مما يتيح الوصول للموارد الحكومية الداخلية المحمية.",
      en: "Authentication bypass in Ivanti Connect Secure and Policy Secure gateways allowing unauthorized access to restricted resources.",
    },
    cvss: 8.2,
    severity: "high",
    target: "sante.gov.tn",
    isRealFinding: false,
  },
];

// Sleek Modern Cyber Palette (Replacing loud orange with Cyber Indigo/Sky)
const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444", // Crimson Ruby
  high: "#6366f1",     // Cyber Indigo
  medium: "#0ea5e9",   // Electric Sky Blue
  low: "#64748b",      // Slate Grey
};

// ── Robust i18n Parser Helper ────────────────────────────

function parseI18nText(raw: any, locale: string): string {
  if (!raw) return "";
  
  if (typeof raw === "object") {
    return raw[locale] || raw.fr || raw.ar || raw.en || "";
  }

  if (typeof raw === "string") {
    let str = raw.trim();

    // Check if the string contains a JSON object inside
    const jsonMatch = str.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed[locale] || parsed.fr || parsed.ar || parsed.en || str;
        }
      } catch {
        const match = str.match(new RegExp(`"${locale}"\\s*:\\s*"([^"]+)"`));
        if (match && match[1]) return match[1];
        const frMatch = str.match(/"fr"\s*:\\s*"([^"]+)"/);
        if (frMatch && frMatch[1]) return frMatch[1];
        const arMatch = str.match(/"ar"\s*:\\s*"([^"]+)"/);
        if (arMatch && arMatch[1]) return arMatch[1];
      }
    }

    // Clean any lingering JSON artifacts
    str = str.replace(/\{"ar":\s*"[\s\S]*?",\s*"fr":\s*"([\s\S]*?)",\s*"en":\s*"[\s\S]*?"\}/g, "$1");
    return str;
  }

  return String(raw);
}

// ── Helpers ──────────────────────────────────────────────

function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height / 2);
  return { x, y };
}

function randomIP() {
  return `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function timeAgo(locale: string) {
  const secs = Math.floor(Math.random() * 60) + 1;
  if (locale === "ar") return `منذ ${secs} ث`;
  if (locale === "fr") return `il y a ${secs}s`;
  return `${secs}s ago`;
}

function generateFeedEntry(targetsList: string[] = DEFAULT_TARGETS, locale: string = "fr"): ThreatFeedEntry {
  const src = THREAT_SOURCES[Math.floor(Math.random() * THREAT_SOURCES.length)];
  const target = targetsList[Math.floor(Math.random() * targetsList.length)] || "finances.gov.tn";
  const attackObj = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  const attackName = locale === "ar" ? attackObj.ar : locale === "fr" ? attackObj.fr : attackObj.en;
  const countryName = locale === "ar" ? src.countryAr : locale === "fr" ? src.countryFr : src.country;

  return {
    ip: randomIP(),
    country: countryName,
    flag: src.flag,
    target: target,
    type: attackName,
    severity: src.severity,
    time: timeAgo(locale),
  };
}

// ── Canvas Map Drawing ───────────────────────────────────

function drawWorldOutline(ctx: CanvasRenderingContext2D, w: number, h: number, locale: string) {
  // Grid lines
  ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
  ctx.lineWidth = 0.5;
  for (let lng = -180; lng <= 180; lng += 30) {
    const { x } = latLngToXY(0, lng, w, h);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let lat = -60; lat <= 80; lat += 20) {
    const { y } = latLngToXY(lat, 0, w, h);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Continent outlines
  ctx.fillStyle = "rgba(56, 189, 248, 0.06)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
  ctx.lineWidth = 1;

  const drawPoly = (coords: [number, number][]) => {
    ctx.beginPath();
    coords.forEach(([lat, lng], i) => {
      const { x, y } = latLngToXY(lat, lng, w, h);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();
  };

  // North America
  drawPoly([[70,-170],[72,-140],[70,-100],[60,-95],[55,-80],[48,-55],[30,-82],[25,-80],[20,-105],[15,-90],[30,-115],[48,-125],[60,-140],[65,-168]]);
  // South America
  drawPoly([[12,-75],[5,-77],[-5,-80],[-15,-75],[-23,-70],[-35,-58],[-52,-70],[-55,-68],[-42,-63],[-22,-40],[-5,-35],[5,-52],[10,-67]]);
  // Europe
  drawPoly([[70,-10],[72,30],[68,45],[60,50],[55,42],[50,40],[45,42],[42,30],[36,28],[38,-8],[43,-9],[48,-5],[55,-8],[62,-7]]);
  // Africa
  drawPoly([[37,-10],[35,10],[32,32],[30,33],[22,37],[12,44],[2,42],[-5,40],[-12,44],[-25,35],[-35,25],[-34,18],[-25,15],[-15,12],[-5,8],[5,-5],[5,-10],[15,-17],[25,-15],[35,-5]]);
  // Asia
  drawPoly([[72,50],[75,100],[70,140],[65,170],[55,135],[50,130],[40,120],[35,105],[25,90],[8,80],[5,100],[0,105],[-8,115],[-5,120],[10,120],[22,115],[30,122],[40,130],[42,140],[50,140],[55,160],[45,145],[35,140],[20,105],[25,68],[30,50],[40,45],[50,55],[60,60],[68,55]]);
  // Australia
  drawPoly([[-12,130],[-15,140],[-20,148],[-28,153],[-35,150],[-38,145],[-35,137],[-32,133],[-25,115],[-20,114],[-15,125]]);

  // Tunisia highlight
  const tn = latLngToXY(TUNISIA.lat, TUNISIA.lng, w, h);
  const gradient = ctx.createRadialGradient(tn.x, tn.y, 0, tn.x, tn.y, 22);
  gradient.addColorStop(0, "rgba(56, 189, 248, 0.8)");
  gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.2)");
  gradient.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(tn.x, tn.y, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath(); ctx.arc(tn.x, tn.y, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = locale === "ar" ? "right" : "left";
  const label = locale === "ar" ? "🇹🇳 تونس" : "TUNISIA 🇹🇳";
  ctx.fillText(label, locale === "ar" ? tn.x - 12 : tn.x + 12, tn.y + 4);
}

// ── Attack Particle ──────────────────────────────────────

interface AttackParticle {
  source: ThreatSource;
  targetDomain: string;
  progress: number;
  speed: number;
  active: boolean;
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════

export default function ThreatWorldMap({ locale: propLocale }: { locale?: string }) {
  const router = useRouter();
  const nextLocale = useLocale();
  const locale = propLocale || nextLocale || "fr";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AttackParticle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [selectedThreat, setSelectedThreat] = useState<ThreatSource | null>(null);
  const [feedEntries, setFeedEntries] = useState<ThreatFeedEntry[]>([]);
  const [liveTargets, setLiveTargets] = useState<string[]>(DEFAULT_TARGETS);
  const [cvesList, setCvesList] = useState<CVECard[]>(DEFAULT_CVES);
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAr = locale === "ar";
  const isFr = locale === "fr";

  // Fetch real scanned targets and real detected CVEs from DB
  useEffect(() => {
    async function fetchThreatIntelligenceData() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        // 1. Fetch recent targets
        const scansRes = await fetch(`${API}/api/scans/recent?limit=30`);
        if (scansRes.ok) {
          const scansData = await scansRes.json();
          if (scansData && Array.isArray(scansData.scans) && scansData.scans.length > 0) {
            const domains: string[] = [];
            for (const s of scansData.scans) {
              if (s.url) {
                const dom = s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
                if (!domains.includes(dom)) domains.push(dom);
              }
            }
            if (domains.length > 0) {
              setLiveTargets(domains);
            }
          }
        }

        // 2. Fetch live detected CVEs / findings
        const statsRes = await fetch(`${API}/api/threats/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData && Array.isArray(statsData.detected_cves) && statsData.detected_cves.length > 0) {
            const mapped: CVECard[] = statsData.detected_cves.map((c: any) => ({
              id: c.id,
              rawTitle: c.title || c.name,
              rawDesc: c.description,
              cvss: c.cvss,
              severity: c.severity,
              target: c.target,
              isRealFinding: true,
            }));

            // Merge real findings with reference CVEs up to 6 items
            const merged = [...mapped, ...DEFAULT_CVES].slice(0, 6);
            setCvesList(merged);
          }
        }
      } catch {
        // Keep default
      }
    }
    fetchThreatIntelligenceData();
  }, []);

  // Initialize feed with live targets and update when locale changes
  useEffect(() => {
    const initial = Array.from({ length: 5 }, () => generateFeedEntry(liveTargets, locale));
    setFeedEntries(initial);

    const interval = setInterval(() => {
      setFeedEntries((prev) => {
        const newEntry = generateFeedEntry(liveTargets, locale);
        newEntry.time = isAr ? "الآن" : isFr ? "à l'instant" : "just now";
        return [newEntry, ...prev.slice(0, 4)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [liveTargets, locale, isAr, isFr]);

  // ── Canvas Animation ────────────────────────────────────

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "rgba(11, 17, 32, 0.95)");
    bgGrad.addColorStop(1, "rgba(11, 17, 32, 0.98)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    drawWorldOutline(ctx, w, h, locale);

    const tunisiaXY = latLngToXY(TUNISIA.lat, TUNISIA.lng, w, h);

    // Threat source points
    THREAT_SOURCES.forEach((threat) => {
      const pos = latLngToXY(threat.lat, threat.lng, w, h);
      const color = SEVERITY_COLORS[threat.severity];
      const pulse = 0.6 + Math.sin(Date.now() * 0.003 + threat.lat) * 0.4;
      const baseRadius = 8 + threat.attacks / 120;

      // Outer glow
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, baseRadius * 2.5);
      glow.addColorStop(0, color + "50");
      glow.addColorStop(0.4, color + "25");
      glow.addColorStop(1, color + "00");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseRadius * 2.5 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Middle ring
      ctx.strokeStyle = color + "60";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseRadius * pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Core dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // White center
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Country label
      ctx.fillStyle = color + "cc";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      const cLabel = isAr ? threat.countryAr : isFr ? threat.countryFr : threat.country;
      ctx.fillText(cLabel.toUpperCase(), pos.x, pos.y - baseRadius - 4);
    });

    // Spawn particles with real targets
    if (Math.random() < 0.045) {
      const src = THREAT_SOURCES[Math.floor(Math.random() * THREAT_SOURCES.length)];
      const targetDom = liveTargets[Math.floor(Math.random() * liveTargets.length)] || "finances.gov.tn";
      particlesRef.current.push({
        source: src,
        targetDomain: targetDom,
        progress: 0,
        speed: 0.003 + Math.random() * 0.005,
        active: true,
      });
    }

    // Attack lines
    particlesRef.current.forEach((particle) => {
      if (!particle.active) return;
      const src = latLngToXY(particle.source.lat, particle.source.lng, w, h);
      const color = SEVERITY_COLORS[particle.source.severity];
      const midX = (src.x + tunisiaXY.x) / 2;
      const midY = Math.min(src.y, tunisiaXY.y) - 40 - Math.abs(src.x - tunisiaXY.x) * 0.15;

      const trailStart = Math.max(0, particle.progress - 0.12);
      ctx.strokeStyle = color + "60";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let t = trailStart; t <= particle.progress; t += 0.01) {
        const x = (1-t)*(1-t)*src.x + 2*(1-t)*t*midX + t*t*tunisiaXY.x;
        const y = (1-t)*(1-t)*src.y + 2*(1-t)*t*midY + t*t*tunisiaXY.y;
        if (t === trailStart) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const headT = particle.progress;
      const headX = (1-headT)*(1-headT)*src.x + 2*(1-headT)*headT*midX + headT*headT*tunisiaXY.x;
      const headY = (1-headT)*(1-headT)*src.y + 2*(1-headT)*headT*midY + headT*headT*tunisiaXY.y;
      const headGlow = ctx.createRadialGradient(headX, headY, 0, headX, headY, 6);
      headGlow.addColorStop(0, color);
      headGlow.addColorStop(1, color + "00");
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(headX, headY, 6, 0, Math.PI * 2);
      ctx.fill();

      if (particle.progress >= 1) {
        const flash = ctx.createRadialGradient(tunisiaXY.x, tunisiaXY.y, 0, tunisiaXY.x, tunisiaXY.y, 25);
        flash.addColorStop(0, color + "60");
        flash.addColorStop(1, color + "00");
        ctx.fillStyle = flash;
        ctx.beginPath();
        ctx.arc(tunisiaXY.x, tunisiaXY.y, 25, 0, Math.PI * 2);
        ctx.fill();
        particle.active = false;
      }
      particle.progress += particle.speed;
    });

    particlesRef.current = particlesRef.current.filter((p) => p.active);

    // HUD
    ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = isAr ? "right" : "left";
    const hudTitle = isAr ? "◉ بث التهديدات المباشرة" : "◉ LIVE THREAT TELEMETRY";
    ctx.fillText(hudTitle, isAr ? w - 15 : 15, 20);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "9px monospace";
    const hudSubtitle = isAr
      ? `${THREAT_SOURCES.length} مصادر مراقبة • ${liveTargets.length} أهداف نشطة`
      : `${THREAT_SOURCES.length} SOURCES TRACKED • ACTIVE TARGETS: ${liveTargets.length} SITES`;
    ctx.fillText(hudSubtitle, isAr ? w - 15 : 15, 34);

    // Scan line
    const scanY = (Date.now() * 0.05) % h;
    const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
    scanGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
    scanGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.03)");
    scanGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 2, w, 4);

    animFrameRef.current = requestAnimationFrame(animate);
  }, [liveTargets, locale, isAr, isFr]);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = Math.max(420, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  // Click detection
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (const threat of THREAT_SOURCES) {
      const pos = latLngToXY(threat.lat, threat.lng, canvas.width, canvas.height);
      const dist = Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2);
      if (dist < 25) {
        setSelectedThreat((prev) => prev?.country === threat.country ? null : threat);
        return;
      }
    }
    setSelectedThreat(null);
  }, []);

  const handleInspectTarget = (targetUrl: string) => {
    const rep = generateMockReport(targetUrl);
    setSelectedReport(rep);
    setIsModalOpen(true);
  };

  // Sort threats for bar chart
  const sortedThreats = [...THREAT_SOURCES].sort((a, b) => b.attacks - a.attacks).slice(0, 6);
  const maxAttacks = sortedThreats[0]?.attacks || 1;

  return (
    <div>
      {/* ── Map Section ──────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Stats bar */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <StatPill icon="🔴" label={isAr ? "هجمات مباشرة" : isFr ? "ATTAQUES EN DIRECT" : "LIVE ATTACKS"} value={String(Math.floor(Math.random() * 8) + 12)} color="#ef4444" />
            <StatPill icon="📡" label={isAr ? "إجمالي التهديدات" : isFr ? "TOTAL SUIVI" : "TOTAL TRACKED"} value={THREAT_SOURCES.reduce((s, t) => s + t.attacks, 0).toLocaleString()} />
            <StatPill icon="🌍" label={isAr ? "مصادر الهجوم" : isFr ? "PAYS SOURCES" : "SOURCES"} value={String(THREAT_SOURCES.length)} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-info)", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-info)", display: "inline-block" }} />
            <span>{isAr ? `${liveTargets.length} مواقع تحت المراقبة النشطة` : isFr ? `${liveTargets.length} cibles étatiques actives` : `${liveTargets.length} active state targets`}</span>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            width: "100%", height: "420px",
            borderRadius: "var(--radius-lg, 12px)",
            border: "1px solid rgba(56, 189, 248, 0.1)",
            cursor: "crosshair",
          }}
        />

        {/* Selected threat info panel */}
        {selectedThreat && (
          <div style={{
            position: "absolute", top: 12, [isAr ? "left" : "right"]: 12,
            background: "rgba(11, 17, 32, 0.95)",
            border: `1px solid ${SEVERITY_COLORS[selectedThreat.severity]}40`,
            borderLeft: isAr ? "none" : `3px solid ${SEVERITY_COLORS[selectedThreat.severity]}`,
            borderRight: isAr ? `3px solid ${SEVERITY_COLORS[selectedThreat.severity]}` : "none",
            borderRadius: "var(--radius-md, 8px)",
            padding: "16px 20px",
            backdropFilter: "blur(12px)",
            boxShadow: `0 8px 32px ${SEVERITY_COLORS[selectedThreat.severity]}15`,
            minWidth: "240px", maxWidth: "300px",
            zIndex: 10,
            textAlign: isAr ? "right" : "left",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{selectedThreat.flag}</span>
                <strong style={{ color: "#ffffff", fontSize: "15px" }}>
                  {isAr ? selectedThreat.countryAr : isFr ? selectedThreat.countryFr : selectedThreat.country}
                </strong>
              </div>
              <span style={{
                fontSize: "10px", padding: "2px 8px", borderRadius: "4px",
                background: SEVERITY_COLORS[selectedThreat.severity] + "20",
                color: SEVERITY_COLORS[selectedThreat.severity],
                textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700,
              }}>
                {selectedThreat.severity}
              </span>
            </div>
            <div style={{ display: "grid", gap: "8px", fontSize: "12px", fontFamily: "monospace" }}>
              <InfoRow label={isAr ? "النوع" : isFr ? "TYPE" : "TYPE"} value={isAr ? selectedThreat.typeAr : isFr ? selectedThreat.typeFr : selectedThreat.typeEn} />
              <InfoRow label={isAr ? "الهجمات" : isFr ? "ATTAQUES" : "ATTACKS"} value={String(selectedThreat.attacks)} color={SEVERITY_COLORS[selectedThreat.severity]} />
              <InfoRow label="LAT/LNG" value={`${selectedThreat.lat.toFixed(2)}°, ${selectedThreat.lng.toFixed(2)}°`} />
            </div>
            <button
              onClick={() => setSelectedThreat(null)}
              style={{
                marginTop: "12px", width: "100%", padding: "6px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px", color: "#94a3b8", cursor: "pointer",
                fontSize: "11px", fontFamily: "monospace",
              }}
            >
              ✕ {isAr ? "إغلاق" : isFr ? "FERMER" : "CLOSE"}
            </button>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", marginTop: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {Object.entries(SEVERITY_COLORS).map(([level, color]) => {
            const levelLabel = level === "critical" ? (isAr ? "حرج" : isFr ? "Critique" : "Critical")
              : level === "high" ? (isAr ? "عالي" : isFr ? "Élevé" : "High")
              : level === "medium" ? (isAr ? "متوسط" : isFr ? "Moyen" : "Medium")
              : (isAr ? "منخفض" : isFr ? "Faible" : "Low");
            return (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                <span style={{ color: "var(--text-secondary, #475569)", fontSize: "10px", fontFamily: "monospace", textTransform: "uppercase" }}>{levelLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dashboard Grid: Feed + Bar Chart ─────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: "16px", border: "0.5px solid var(--border-primary)", borderRadius: 0 }}>

        {/* ── 1. LIVE THREAT FEED ─────────────────────────── */}
        <div style={{ background: "var(--surface-2)", padding: "20px", borderRadius: 0 }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: 6, height: 6, borderRadius: 0, background: "#ef4444", animation: "pulse 2s ease-in-out infinite" }} />
            {isAr ? "تغذية التهديدات المباشرة (انقر للمعاينة)" : isFr ? "FLUX D'ATTAQUES EN DIRECT (CLIQUER POUR AUDIT)" : "LIVE THREAT FEED (CLICK TO PREVIEW)"}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: isAr ? "right" : "left" }}>
              <thead>
                <tr>
                  {[
                    isAr ? "المصدر" : isFr ? "IP Source" : "IP Source",
                    isAr ? "الهدف" : isFr ? "Cible" : "Target",
                    isAr ? "النوع" : isFr ? "Vecteur" : "Type",
                    isAr ? "الخطورة" : isFr ? "Sév." : "Sev.",
                    isAr ? "معاينة" : isFr ? "Action" : "Action",
                    isAr ? "التوقيت" : "T"
                  ].map((h) => (
                    <th key={h} style={{ padding: "8px 4px", textAlign: isAr ? "right" : "left", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-primary)", fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feedEntries.map((entry, i) => (
                  <tr 
                    key={i} 
                    onClick={() => handleInspectTarget(entry.target)}
                    style={{ 
                      animation: i === 0 ? "fadeIn 0.5s ease" : undefined,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    title={`Inspecter l'audit et la posture de ${entry.target}`}
                  >
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--text-primary)" }}>{entry.ip}</div>
                      <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>{entry.country} {entry.flag}</div>
                    </td>
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)", color: "#6366f1", fontSize: "11px", fontWeight: 600 }}>
                      {entry.target}
                    </td>
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)", color: "var(--text-secondary)", fontSize: "11px" }}>
                      {entry.type}
                    </td>
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 8px", fontSize: "9px", letterSpacing: "1px", borderRadius: "3px", textTransform: "uppercase",
                        ...(entry.severity === "critical" ? { background: "#ef4444", color: "#ffffff" } :
                           entry.severity === "high" ? { background: "#6366f1", color: "#ffffff" } :
                           entry.severity === "medium" ? { color: "#0ea5e9", border: "1px solid #0ea5e9" } :
                           { color: "var(--text-muted)", border: "1px solid var(--border-primary)" })
                      }}>{entry.severity}</span>
                    </td>
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectTarget(entry.target);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 500,
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--color-accent)",
                          cursor: "pointer",
                        }}
                      >
                        <Eye size={11} />
                        <span>{isAr ? "تقرير" : isFr ? "Audit" : "Audit"}</span>
                      </button>
                    </td>
                    <td style={{ padding: "10px 4px", borderBottom: i === feedEntries.length - 1 ? "none" : "0.5px solid var(--border-primary)", color: "var(--text-muted)", fontSize: "10px" }}>{entry.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 2. TOP ATTACKING COUNTRIES ──────────────────── */}
        <div style={{ background: "var(--surface-2)", padding: "20px", [isAr ? "borderRight" : "borderLeft"]: "0.5px solid var(--border-primary)", borderRadius: 0 }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "1px", alignItems: "flex-end", height: "8px" }}>
              <div style={{ width: "2px", height: "40%", background: "#0ea5e9", borderRadius: 0 }} />
              <div style={{ width: "2px", height: "70%", background: "#ef4444", borderRadius: 0 }} />
              <div style={{ width: "2px", height: "100%", background: "#6366f1", borderRadius: 0 }} />
            </div>
            {isAr ? "أكثر الدول المهاجمة" : isFr ? "PRINCIPAUX PAYS ATTAQUANTS" : "TOP ATTACKING COUNTRIES"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sortedThreats.map((threat) => {
              const color = ["Russia", "China"].includes(threat.country) ? "#ef4444" :
                            ["North Korea", "Iran"].includes(threat.country) ? "#6366f1" : "#0ea5e9";
              const cName = isAr ? threat.countryAr : isFr ? threat.countryFr : threat.country;
              return (
                <div key={threat.country} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ width: "95px", display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>{threat.country.substring(0,2)}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-primary)" }}>{cName}</span>
                  </div>
                  <div style={{ flex: 1, height: "2px", background: "var(--border-primary)", borderRadius: 0, position: "relative" }}>
                    <div style={{
                      position: "absolute", top: 0, [isAr ? "right" : "left"]: 0, height: "100%",
                      width: `${(threat.attacks / maxAttacks) * 100}%`,
                      background: color, borderRadius: 0,
                      transition: "width 1s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, fontFamily: "monospace", color: color }}>
                    {threat.attacks}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. HYBRID CRITICAL CVEs ─────────────────────────────── */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
            {isAr ? "ثغرات CVE حرجة متطابقة مع نتائج الفحص" : isFr ? "CVES CRITIQUES & VULNÉRABILITÉS DÉTECTÉES" : "CRITICAL CVES & ACTIVE VULNERABILITIES DETECTED"}
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "monospace" }}>
            {isAr ? "محدث تلقائياً حسب عمليات الفحص" : isFr ? "Synchronisé avec les audits récents" : "Synced with recent audits"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
          {cvesList.map((cve, idx) => {
            const color = SEVERITY_COLORS[cve.severity] || "#6366f1";
            const localizedTitle = parseI18nText(cve.rawTitle, locale) || cve.id;
            const localizedDesc = parseI18nText(cve.rawDesc, locale) || "";
            const cleanTarget = cve.target ? cve.target.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] : "";

            return (
              <div
                key={`${cve.id}-${idx}`}
                onClick={() => cleanTarget && handleInspectTarget(cleanTarget)}
                style={{
                  padding: "18px 20px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-primary)",
                  borderTop: `3px solid ${color}`,
                  borderRadius: "var(--radius-md, 8px)",
                  display: "flex",
                  flexDirection: "column",
                  cursor: cleanTarget ? "pointer" : "default",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: isAr ? "right" : "left",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (cleanTarget) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 10px 25px -5px ${color}20, 0 8px 10px -6px ${color}10`;
                    e.currentTarget.style.borderColor = `${color}60`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (cleanTarget) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                  }
                }}
                title={cleanTarget ? `Cliquer pour ouvrir le rapport d'audit de ${cleanTarget}` : undefined}
              >
                {/* Top header row: ID + Badges + Severity */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {cve.id}
                    </span>
                    {cve.isRealFinding ? (
                      <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.12)", color: "#16a34a", fontWeight: 600, border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                        {isAr ? "فحص مباشر" : isFr ? "Audit Réel" : "Live Audit"}
                      </span>
                    ) : (
                      <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.12)", color: "#6366f1", fontWeight: 600, border: "1px solid rgba(99, 102, 241, 0.25)" }}>
                        {isAr ? "مرجع CTI" : isFr ? "Référentiel CTI" : "CTI Reference"}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: "9px", padding: "2px 8px", borderRadius: "4px",
                    background: `${color}18`, color: color,
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
                    border: `1px solid ${color}35`,
                  }}>
                    {cve.severity}
                  </span>
                </div>

                {/* Title */}
                <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)", marginBottom: "6px", lineHeight: 1.4 }}>
                  {localizedTitle}
                </div>

                {/* Target domain pill */}
                {cleanTarget && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#6366f1", marginBottom: "10px", fontFamily: "monospace", fontWeight: 600 }}>
                    <Globe size={11} />
                    <span>{cleanTarget}</span>
                  </div>
                )}

                {/* Description */}
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "14px", flex: 1 }}>
                  {localizedDesc}
                </p>

                {/* CVSS Score Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>
                    {isAr ? "درجة الخطورة CVSS" : "CVSS SCORE"}
                  </span>
                  <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700, color: color }}>
                    {cve.cvss.toFixed(1)} <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 400 }}>/ 10</span>
                  </span>
                </div>
                <div style={{ height: "4px", background: "var(--bg-tertiary, rgba(0,0,0,0.06))", borderRadius: "2px", width: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", top: 0, [isAr ? "right" : "left"]: 0, height: "100%",
                    width: `${Math.min(100, (cve.cvss / 10) * 100)}%`,
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                    borderRadius: "2px",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Report Preview Modal */}
      {selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────

function StatPill({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "12px" }}>{icon}</span>
      <span style={{ color: "var(--text-secondary, #475569)", fontSize: "11px", fontFamily: "monospace" }}>
        {label}: <strong style={{ color: color || "var(--text-primary, #1e293b)" }}>{value}</strong>
      </span>
    </div>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: color || "#e2e8f0", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
