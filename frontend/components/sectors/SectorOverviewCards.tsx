"use client";

import React, { useEffect, useState } from "react";
import { Landmark, Building2, Map, Factory, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { getDynamicSectorBreakdown } from "@/lib/dynamic-data";

interface SectorStats {
  id: string;
  nameKey: string;
  icon: React.ReactNode;
  sitesCount: number;
  avgScore: number;
  distribution: { eleve: number; modere: number; faible: number };
  trend: { value: number; isUp: boolean };
}

function getDynamicSectorStats(fromStorage: boolean = true): SectorStats[] {
  const breakdown = getDynamicSectorBreakdown(fromStorage);
  const icons: Record<string, React.ReactNode> = {
    ministries: <Landmark size={20} strokeWidth={1.5} />,
    institutions: <Building2 size={20} strokeWidth={1.5} />,
    local: <Map size={20} strokeWidth={1.5} />,
    enterprises: <Factory size={20} strokeWidth={1.5} />,
  };

  return breakdown.map((b) => ({
    id: b.key,
    nameKey: b.key,
    icon: icons[b.key],
    sitesCount: b.sitesCount,
    avgScore: b.avgScore,
    distribution: b.distribution,
    trend: b.trend,
  }));
}

export default function SectorOverviewCards() {
  const t = useTranslations("sectors");
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [sectors, setSectors] = useState<SectorStats[]>(() => getDynamicSectorStats(false));

  useEffect(() => {
    setSectors(getDynamicSectorStats(true));
    async function fetchLiveSectorStats() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/scans/recent?limit=50`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.scans) && data.scans.length > 0) {
            // Group completed scans by domain/sector
            const ministryScores: number[] = [];
            const institutionScores: number[] = [];
            const localScores: number[] = [];
            const enterpriseScores: number[] = [];

            const seen = new Set<string>();

            for (const s of data.scans) {
              if (s.status === "completed" && s.total_score !== null) {
                const domain = s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
                if (!seen.has(domain)) {
                  seen.add(domain);
                  const sc = Math.round(s.total_score);

                  if (domain.startsWith("commune-") || domain.startsWith("municipalite-") || domain.includes("gov.tn/regions")) {
                    localScores.push(sc);
                  } else if (domain.includes("steg") || domain.includes("sonede") || domain.includes("poste.tn") || domain.includes("tunisair") || domain.includes("sncft") || domain.endsWith(".com.tn")) {
                    enterpriseScores.push(sc);
                  } else if (domain.includes("ansi.tn") || domain.includes("bct.gov.tn") || domain.includes("isie") || domain.includes("inlucc") || domain.includes("rns.tn") || domain.includes(".nat.tn")) {
                    institutionScores.push(sc);
                  } else {
                    // Default to Ministries for .gov.tn
                    ministryScores.push(sc);
                  }
                }
              }
            }

            setSectors((prev) =>
              prev.map((sec) => {
                let relevantScores: number[] = [];
                if (sec.id === "ministries") relevantScores = ministryScores;
                else if (sec.id === "institutions") relevantScores = institutionScores;
                else if (sec.id === "local") relevantScores = localScores;
                else if (sec.id === "enterprises") relevantScores = enterpriseScores;

                if (relevantScores.length === 0) return sec;

                const avg = Math.round(relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length);
                const eleveCount = relevantScores.filter((s) => s >= 80).length;
                const modereCount = relevantScores.filter((s) => s >= 60 && s < 80).length;
                const faibleCount = relevantScores.filter((s) => s < 60).length;
                const total = relevantScores.length;

                return {
                  ...sec,
                  avgScore: avg,
                  distribution: {
                    eleve: Math.round((eleveCount / total) * 100),
                    modere: Math.round((modereCount / total) * 100),
                    faible: Math.round((faibleCount / total) * 100),
                  },
                };
              })
            );
          }
        }
      } catch {
        // Fallback gracefully to default
      }
    }

    fetchLiveSectorStats();

    const handleSync = () => {
      setSectors(getDynamicSectorStats(true));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cyberscore_scan_completed", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cyberscore_scan_completed", handleSync);
    };
  }, []);

  return (
    <div style={{ marginBottom: "var(--space-2xl)" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "var(--space-md)" }}>
        {isAr ? "نظرة عامة حسب القطاع" : "VUE PAR SECTEUR"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-lg)" }}>
        {sectors.map((sector) => (
          <div 
            key={sector.id} 
            className="card" 
            onClick={() => {
              router.push(`?sector=${sector.id}`, { scroll: false });
              document.getElementById("sites-table")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ 
              padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)",
              cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {/* Header: Icon + Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                {sector.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {t(sector.nameKey)}
                </h3>
                <div suppressHydrationWarning style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {sector.sitesCount} {isAr ? "موقع" : "sites"} — {isAr ? "المعدل" : "Avg"}: <span style={{ fontWeight: 700, color: sector.avgScore >= 80 ? "var(--color-success)" : sector.avgScore >= 65 ? "var(--color-info)" : sector.avgScore >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>{sector.avgScore}/100</span>
                </div>
              </div>
            </div>

            {/* Segmented Bar */}
            <div style={{ marginTop: "var(--space-sm)" }}>
              <div style={{ display: "flex", height: "6px", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ width: `${sector.distribution.eleve}%`, background: "var(--color-success)" }} />
                <div style={{ width: `${sector.distribution.modere}%`, background: "var(--color-warning)" }} />
                <div style={{ width: `${sector.distribution.faible}%`, background: "var(--color-danger)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-tertiary)" }}>
                <span>{sector.distribution.eleve}% <span style={{ color: "var(--text-secondary)" }}>{isAr ? "مرتفع" : "élevé"}</span></span>
                <span>{sector.distribution.modere}% <span style={{ color: "var(--text-secondary)" }}>{isAr ? "معتدل" : "modéré"}</span></span>
                <span>{sector.distribution.faible}% <span style={{ color: "var(--text-secondary)" }}>{isAr ? "ضعيف" : "faible"}</span></span>
              </div>
            </div>

            {/* Footer Trend */}
            <div style={{ marginTop: "auto", paddingTop: "var(--space-sm)", borderTop: "1px solid var(--border-secondary)", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <span style={{ 
                color: sector.trend.isUp ? "var(--color-success)" : "var(--color-danger)", 
                display: "flex", alignItems: "center", gap: "2px", fontWeight: 600,
                background: sector.trend.isUp ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                padding: "2px 6px", borderRadius: "4px"
              }}>
                {sector.trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {sector.trend.isUp ? "+" : "-"}{sector.trend.value} pts / trim.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
