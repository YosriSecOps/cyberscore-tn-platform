"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import TunisiaMap, { GovernorateData } from "./TunisiaMap";
import { getDynamicSectorBreakdown, getDynamicGovernorateScores } from "@/lib/dynamic-data";

function scoreClass(score: number): string {
  if (score >= 80) return "score-good";
  if (score >= 65) return "score-ok";
  return "score-bad";
}

export default function SectorHealth() {
  const t = useTranslations("sectors");
  const dt = useTranslations("dashboard");
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const [sectors, setSectors] = useState(() =>
    getDynamicSectorBreakdown(false).map((s) => ({
      key: s.key,
      score: s.avgScore,
      count: s.sitesCount,
    }))
  );

  const [govData, setGovData] = useState<GovernorateData[]>(() => getDynamicGovernorateScores(false));

  useEffect(() => {
    setSectors(
      getDynamicSectorBreakdown(true).map((s) => ({
        key: s.key,
        score: s.avgScore,
        count: s.sitesCount,
      }))
    );
    setGovData(getDynamicGovernorateScores(true));

    const handleSync = () => {
      setSectors(
        getDynamicSectorBreakdown(true).map((s) => ({
          key: s.key,
          score: s.avgScore,
          count: s.sitesCount,
        }))
      );
      setGovData(getDynamicGovernorateScores(true));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cyberscore_scan_completed", handleSync);

    async function fetchLiveSectorScores() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/scans/recent?limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.scans) && data.scans.length > 0) {
            const completedScans = data.scans.filter((s: any) => s.status === "completed" && s.total_score !== null);
            if (completedScans.length > 0) {
              const avg = Math.round(completedScans.reduce((sum: number, s: any) => sum + s.total_score, 0) / completedScans.length);
              setSectors((prev) =>
                prev.map((sec) => (sec.key === "ministries" ? { ...sec, score: avg } : sec))
              );
            }
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchLiveSectorScores();

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cyberscore_scan_completed", handleSync);
    };
  }, []);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="section-header" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="section-title">{dt("sectorHealth")}</div>
          <div className="section-subtitle">{dt("nationalOverview")}</div>
        </div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 9px",
          borderRadius: "12px",
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.25)",
          fontSize: "11px",
          color: "var(--color-success)",
          fontWeight: 600,
          marginTop: "4px"
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
          }} />
          <span>{isAr ? "متزامن لحظياً" : isFr ? "En direct" : "Live Sync"}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-xl)", flex: 1, paddingBottom: "10px" }}>
        {/* Real Tunisia Map */}
        <div style={{ flex: "0 0 150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", minHeight: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TunisiaMap data={govData} />
          </div>
        </div>

        {/* Bars */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-lg)", paddingTop: "var(--space-sm)" }}>
          {sectors.map((sector) => (
            <div key={sector.key} className="sector-row" style={{ padding: 0 }}>
              <span className="sector-name" style={{ flex: "0 0 150px", fontWeight: 500 }}>
                {t(sector.key)}
              </span>
              <div className="sector-bar-container" style={{ height: "6px", borderRadius: "3px" }}>
                <div
                  className="sector-bar-fill"
                  style={{ width: `${sector.score}%`, borderRadius: "3px" }}
                />
              </div>
              <span className={`sector-score ${scoreClass(sector.score)}`} style={{ minWidth: "48px" }}>
                {sector.score} <span style={{ fontSize: "10px", color: "var(--text-tertiary)", fontWeight: 400 }}>/100</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
