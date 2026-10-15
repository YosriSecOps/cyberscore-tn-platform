"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import {
  Globe2,
  ShieldCheck,
  BarChart3,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { getDynamicBenchmarkTunisia } from "@/lib/dynamic-data";

interface CountryBenchmark {
  code: string;
  name: { fr: string; ar: string; en: string };
  score: number;
  sitesCount: number;
  isLocal?: boolean;
  categories: {
    ssl: number;
    headers: number;
    dns: number;
    ports: number;
    cookies: number;
    csp: number;
  };
}

const PEER_COUNTRIES: CountryBenchmark[] = [
  {
    code: "AE",
    name: { fr: "Émirats Arabes Unis", ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
    score: 91,
    sitesCount: 120,
    categories: { ssl: 95, headers: 90, dns: 88, ports: 92, cookies: 89, csp: 87 },
  },
  {
    code: "SA",
    name: { fr: "Arabie Saoudite", ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
    score: 88,
    sitesCount: 200,
    categories: { ssl: 92, headers: 85, dns: 90, ports: 88, cookies: 86, csp: 82 },
  },
  {
    code: "FR",
    name: { fr: "France", ar: "فرنسا", en: "France" },
    score: 86,
    sitesCount: 850,
    categories: { ssl: 90, headers: 88, dns: 82, ports: 85, cookies: 84, csp: 80 },
  },
  {
    code: "JO",
    name: { fr: "Jordanie", ar: "الأردن", en: "Jordan" },
    score: 82,
    sitesCount: 80,
    categories: { ssl: 85, headers: 80, dns: 78, ports: 82, cookies: 80, csp: 75 },
  },
  {
    code: "MA",
    name: { fr: "Maroc", ar: "المغرب", en: "Morocco" },
    score: 76,
    sitesCount: 150,
    categories: { ssl: 80, headers: 72, dns: 74, ports: 78, cookies: 75, csp: 68 },
  },
  {
    code: "EG",
    name: { fr: "Égypte", ar: "مصر", en: "Egypt" },
    score: 74,
    sitesCount: 180,
    categories: { ssl: 78, headers: 70, dns: 72, ports: 75, cookies: 73, csp: 65 },
  },
  {
    code: "DZ",
    name: { fr: "Algérie", ar: "الجزائر", en: "Algeria" },
    score: 68,
    sitesCount: 130,
    categories: { ssl: 72, headers: 60, dns: 65, ports: 70, cookies: 68, csp: 55 },
  },
  {
    code: "LY",
    name: { fr: "Libye", ar: "ليبيا", en: "Libya" },
    score: 55,
    sitesCount: 40,
    categories: { ssl: 60, headers: 45, dns: 50, ports: 55, cookies: 52, csp: 40 },
  },
];

const GLOBAL_BENCHMARK_AVG = {
  score: 78,
  categories: { ssl: 85, headers: 75, dns: 72, ports: 80, cookies: 78, csp: 70 },
};

const PILLAR_METADATA: Record<string, { fr: string; ar: string; en: string }> = {
  ssl: { fr: "Chiffrement SSL / TLS", ar: "التشفير وبروتوكول SSL/TLS", en: "SSL / TLS Encryption" },
  headers: { fr: "En-têtes HTTP de Sécurité", ar: "ترويسات الحماية HTTP", en: "HTTP Security Headers" },
  dns: { fr: "Résolution & Sécurité DNS", ar: "أمان نظام النطاقات DNS", en: "DNS Security & Records" },
  ports: { fr: "Exposition des Ports Réseau", ar: "حماية المنافذ والشبكة", en: "Network Ports Surface" },
  cookies: { fr: "Politique de Cookies (Flags)", ar: "سياسة ملفات تعريف الارتباط", en: "Cookies Policy & Flags" },
  csp: { fr: "Content Security Policy (CSP)", ar: "سياسة أمان المحتوى CSP", en: "Content Security Policy" },
};

function getStatusBadge(score: number) {
  if (score >= 80) return { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)", color: "#10b981" };
  if (score >= 65) return { bg: "rgba(2, 132, 199, 0.1)", border: "rgba(2, 132, 199, 0.25)", color: "#0284c7" };
  if (score >= 50) return { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)", color: "#f59e0b" };
  return { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.25)", color: "#ef4444" };
}

export default function BenchmarkPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [tunisiaData, setTunisiaData] = useState<CountryBenchmark>(() => getDynamicBenchmarkTunisia(false));

  useEffect(() => {
    // Initial sync on client mount with potential on-demand user scans
    setTunisiaData(getDynamicBenchmarkTunisia(true));

    const handleSync = () => {
      setTunisiaData(getDynamicBenchmarkTunisia(true));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cyberscore_scan_completed", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cyberscore_scan_completed", handleSync);
    };
  }, []);

  const allCountries: CountryBenchmark[] = [
    ...PEER_COUNTRIES,
    tunisiaData,
  ];

  const sortedCountries = [...allCountries].sort((a, b) => b.score - a.score);
  const tunisiaRank = sortedCountries.findIndex((c) => c.isLocal) + 1;
  const totalCountries = allCountries.length;
  const deltaGlobal = tunisiaData.score - GLOBAL_BENCHMARK_AVG.score;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar
          title={
            isAr
              ? "مرصد المقارنة الدولية (Benchmark)"
              : isFr
              ? "Benchmark International & Étalonnage"
              : "International Benchmark & Baseline"
          }
        />
        <div className="page-content">
          {/* ── Top Overview Metric Cards ───────────────────────── */}
          <div
            className="animate-fade-in"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-lg)",
              marginBottom: "var(--space-xl)",
            }}
          >
            {/* 1. Tunisia Regional Rank */}
            <div
              className="card"
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: isAr ? undefined : "3px solid var(--color-accent)",
                borderRight: isAr ? "3px solid var(--color-accent)" : undefined,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {isAr ? "الترتيب الإقليمي للمنظومة" : isFr ? "Position Nationale" : "National Standing"}
                  </span>
                  <span className="soc-font-mono" style={{ fontSize: "10px", padding: "2px 6px", background: "var(--bg-tertiary)", color: "var(--text-secondary)", borderRadius: "2px" }}>
                    MENA // FR
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span className="soc-font-mono" style={{ fontSize: "36px", fontWeight: 800, color: "var(--color-accent)" }}>
                    #{tunisiaRank}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    / {totalCountries} {isAr ? "دول مرجعية" : isFr ? "pays étalons" : "benchmark peers"}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-tertiary)", marginTop: "10px" }}>
                {isAr ? "المصدر : مؤشر ITU GCI وتقارير SecurityScorecard" : isFr ? "Référentiel : ITU Global Cybersecurity Index & ANCS" : "Baseline: ITU GCI & SecurityScorecard Reports"}
              </div>
            </div>

            {/* 2. Tunisia vs Global Average */}
            <div
              className="card"
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {isAr ? "تونس مقابل المعدل العالمي" : isFr ? "Score Tunisie vs Standard Mondial" : "Tunisia vs Global Average"}
                  </span>
                  <Activity size={14} color="var(--text-tertiary)" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div>
                    <span className="soc-font-mono" style={{ fontSize: "28px", fontWeight: 800, color: "#0284c7" }}>
                      {tunisiaData.score}
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>
                      TN .gov.tn
                    </div>
                  </div>
                  <span style={{ fontSize: "14px", color: "var(--text-tertiary)", fontWeight: 700 }}>VS</span>
                  <div>
                    <span className="soc-font-mono" style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-secondary)" }}>
                      {GLOBAL_BENCHMARK_AVG.score}
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>
                      {isAr ? "المعدل الدولي" : isFr ? "Moyenne Monde" : "Global Mean"}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                {deltaGlobal >= 0 ? (
                  <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={13} />
                    <span>+{deltaGlobal} {isAr ? "نقطة فوق المعدل" : "points au-dessus"}</span>
                  </span>
                ) : (
                  <span style={{ fontSize: "11.5px", color: "#f59e0b", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingDown size={13} />
                    <span>{deltaGlobal} {isAr ? "نقطة تحت المعدل العالمي" : "points en dessous de la moyenne"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 3. Official Domains Coverage */}
            <div
              className="card"
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {isAr ? "حجم العينة الوطنية المدققة" : isFr ? "Périmètre d'Audit National" : "National Audit Perimeter"}
                  </span>
                  <FileCheck size={14} color="var(--text-tertiary)" />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span className="soc-font-mono" style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {tunisiaData.sitesCount}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {isAr ? "موقعاً رسمياً" : isFr ? "portails gouvernementaux" : "official portals"}
                  </span>
                </div>
              </div>
              <div className="soc-font-mono" style={{ fontSize: "11.5px", color: "var(--text-tertiary)", marginTop: "10px" }}>
                100% .gov.tn // CIMEF & ATI
              </div>
            </div>
          </div>

          {/* ── Main Two-Column Analytics Layout ────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "var(--space-xl)", alignItems: "start" }}>
            {/* Column 1: Country Leaderboard Table */}
            <div className="card animate-fade-in" style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe2 size={16} color="var(--color-accent)" />
                  <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {isAr ? "الترتيب المقارن للدول" : isFr ? "Classement Comparatif par Pays" : "Country Benchmark Ranking"}
                  </h3>
                </div>
                <span className="soc-font-mono" style={{ fontSize: "10.5px", color: "var(--text-tertiary)" }}>
                  {isAr ? "اضغط للمقارنة الفردية" : isFr ? "Cliquer pour comparer" : "Click to compare"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {sortedCountries.map((country, i) => {
                  const isExpanded = expandedCountry === country.code;
                  const statusStyle = getStatusBadge(country.score);
                  const countryName = country.name[locale as "fr" | "ar" | "en"] || country.name.fr;

                  return (
                    <div key={country.code} style={{ borderBottom: "1px solid var(--border-primary)" }}>
                      <div
                        onClick={() => setExpandedCountry(isExpanded ? null : country.code)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "12px 20px",
                          background: country.isLocal
                            ? "rgba(2, 132, 199, 0.06)"
                            : isExpanded
                            ? "var(--bg-secondary)"
                            : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Rank index */}
                        <span className="soc-font-mono" style={{ fontSize: "12px", fontWeight: 800, color: country.isLocal ? "var(--color-accent)" : "var(--text-tertiary)", minWidth: "20px" }}>
                          #{i + 1}
                        </span>

                        {/* Country ISO code badge */}
                        <span
                          className="soc-font-mono"
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: "2px",
                            background: country.isLocal ? "rgba(2, 132, 199, 0.15)" : "var(--bg-tertiary)",
                            color: country.isLocal ? "#0284c7" : "var(--text-secondary)",
                            border: country.isLocal ? "1px solid rgba(2, 132, 199, 0.3)" : "1px solid var(--border-primary)",
                          }}
                        >
                          {country.code}
                        </span>

                        {/* Country Name */}
                        <span
                          style={{
                            flex: 1,
                            fontSize: "12.5px",
                            fontWeight: country.isLocal ? 800 : 600,
                            color: country.isLocal ? "var(--color-accent)" : "var(--text-primary)",
                          }}
                        >
                          {countryName}
                        </span>

                        {/* Clean Single-Tone Solid Score Bar */}
                        <div style={{ width: "110px", height: "5px", borderRadius: "3px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${country.score}%`,
                              borderRadius: "3px",
                              background: statusStyle.color,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>

                        {/* Score Metric */}
                        <span
                          className="soc-font-mono"
                          style={{
                            fontSize: "13px",
                            fontWeight: 800,
                            minWidth: "35px",
                            textAlign: isAr ? "left" : "right",
                            color: statusStyle.color,
                          }}
                        >
                          {country.score}
                        </span>

                        {isExpanded ? <ChevronUp size={14} color="var(--text-tertiary)" /> : <ChevronDown size={14} color="var(--text-tertiary)" />}
                      </div>

                      {/* Expanded Comparative Breakdown */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: "14px 20px 18px",
                            background: "var(--bg-secondary)",
                            borderTop: "1px dashed var(--border-primary)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {country.isLocal
                                ? (isAr ? "مقارنة تونس بالمعدل العالمي" : isFr ? "Tunisie vs Standard Mondial" : "Tunisia vs Global Baseline")
                                : (isAr ? `مقارنة ${countryName} بتونس` : isFr ? `${countryName} vs Tunisie` : `${countryName} vs Tunisia`)}
                            </span>
                            <span className="soc-font-mono" style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                              {country.sitesCount} {isAr ? "موقعاً" : "sites"}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {Object.entries(PILLAR_METADATA).map(([key, labelObj]) => {
                              const countryVal = country.categories[key as keyof typeof country.categories];
                              const compareVal = country.isLocal
                                ? GLOBAL_BENCHMARK_AVG.categories[key as keyof typeof GLOBAL_BENCHMARK_AVG.categories]
                                : tunisiaData.categories[key as keyof typeof tunisiaData.categories];
                              const diff = countryVal - compareVal;
                              const label = labelObj[locale as "fr" | "ar" | "en"] || labelObj.fr;

                              return (
                                <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11.5px" }}>
                                  <span style={{ width: "160px", color: "var(--text-secondary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {label}
                                  </span>

                                  {/* Progress bar */}
                                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${countryVal}%`, borderRadius: "2px", background: getStatusBadge(countryVal).color }} />
                                  </div>

                                  {/* Country value */}
                                  <span className="soc-font-mono" style={{ width: "26px", textAlign: "right", fontWeight: 700, color: "var(--text-primary)" }}>
                                    {countryVal}
                                  </span>

                                  <span style={{ fontSize: "10.5px", color: "var(--text-tertiary)" }}>vs</span>

                                  {/* Compare value */}
                                  <span className="soc-font-mono" style={{ width: "26px", textAlign: "right", fontWeight: 700, color: "var(--text-secondary)" }}>
                                    {compareVal}
                                  </span>

                                  {/* Delta pill */}
                                  <span
                                    className="soc-font-mono"
                                    style={{
                                      width: "48px",
                                      textAlign: "center",
                                      fontSize: "10px",
                                      padding: "1px 4px",
                                      borderRadius: "2px",
                                      fontWeight: 700,
                                      background: diff >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                                      color: diff >= 0 ? "#10b981" : "#ef4444",
                                    }}
                                  >
                                    {diff >= 0 ? `+${diff}` : `${diff}`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Comparative Breakdown by Pillar */}
            <div className="card animate-fade-in" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-primary)", paddingBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <BarChart3 size={16} color="#0284c7" />
                  <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {isAr ? "مقارنة تونس بالمعدل العالمي حسب المجال" : isFr ? "Tunisie vs Standard Mondial par Pilier" : "Tunisia vs Global Standard by Category"}
                  </h3>
                </div>
              </div>

              {/* Clean SOBER Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  marginBottom: "20px",
                  padding: "8px 14px",
                  background: "var(--bg-primary)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#0284c7" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {isAr ? "تونس (المعدل الوطني)" : isFr ? "Tunisie (.gov.tn)" : "Tunisia (.gov.tn)"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#94a3b8" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                    {isAr ? "المعدل الدولي (Global Baseline)" : isFr ? "Moyenne Mondiale (Baseline)" : "Global Baseline"}
                  </span>
                </div>
              </div>

              {/* Pillars Vertical Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {Object.entries(PILLAR_METADATA).map(([key, labelObj]) => {
                  const tn = tunisiaData.categories[key as keyof typeof tunisiaData.categories];
                  const global = GLOBAL_BENCHMARK_AVG.categories[key as keyof typeof GLOBAL_BENCHMARK_AVG.categories];
                  const diff = tn - global;
                  const label = labelObj[locale as "fr" | "ar" | "en"] || labelObj.fr;

                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {label}
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span className="soc-font-mono" style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                            <strong style={{ color: "#0284c7" }}>{tn}</strong> vs {global}
                          </span>
                          <span
                            className="soc-font-mono"
                            style={{
                              fontSize: "10px",
                              padding: "1px 5px",
                              borderRadius: "2px",
                              fontWeight: 800,
                              background: diff >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                              color: diff >= 0 ? "#10b981" : "#ef4444",
                            }}
                          >
                            {diff >= 0 ? `+${diff}` : `${diff}`}
                          </span>
                        </div>
                      </div>

                      {/* Dual Clean Comparative Bars */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {/* Tunisia Bar */}
                        <div style={{ height: "6px", borderRadius: "3px", background: "var(--bg-primary)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${tn}%`,
                              borderRadius: "3px",
                              background: "#0284c7",
                              transition: "width 0.8s ease",
                            }}
                          />
                        </div>

                        {/* Global Bar */}
                        <div style={{ height: "4px", borderRadius: "2px", background: "var(--bg-primary)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${global}%`,
                              borderRadius: "2px",
                              background: "#94a3b8",
                              transition: "width 0.8s ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
