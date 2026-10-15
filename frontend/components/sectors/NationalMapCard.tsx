"use client";

import React, { useState, useEffect } from "react";
import TunisiaMap, { GovernorateData } from "@/components/dashboard/TunisiaMap";
import { getDynamicGovernorateScores } from "@/lib/dynamic-data";

export default function NationalMapCard() {
  const [govData, setGovData] = useState<GovernorateData[]>(() => getDynamicGovernorateScores(false));

  useEffect(() => {
    setGovData(getDynamicGovernorateScores(true));

    const handleSync = () => {
      setGovData(getDynamicGovernorateScores(true));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cyberscore_scan_completed", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cyberscore_scan_completed", handleSync);
    };
  }, []);

  return (
    <div className="card" style={{ marginBottom: "var(--space-2xl)" }}>
      <div className="card-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <h3 className="card-title" style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>
          CARTE NATIONALE DE CYBERSÉCURITÉ
        </h3>
      </div>
      
      <div style={{ display: "flex", flexWrap: "wrap", position: "relative" }}>
        {/* Map Container */}
        <div style={{ flex: "1 1 450px", minHeight: "550px", display: "flex", justifyContent: "center", position: "relative", padding: "var(--space-md)" }}>
          <div style={{ width: "100%", maxWidth: "320px", height: "550px" }}>
            <TunisiaMap data={govData} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ width: "200px", padding: "var(--space-xl)", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "var(--space-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontSize: "12px", color: "var(--text-secondary)" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--color-success)" }} />
            <span>80-100 · Élevé</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontSize: "12px", color: "var(--text-secondary)" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--color-info)" }} />
            <span>65-79 · Correct</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontSize: "12px", color: "var(--text-secondary)" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--color-warning)" }} />
            <span>50-64 · Modéré</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontSize: "12px", color: "var(--text-secondary)" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "var(--color-danger)" }} />
            <span>&lt;50 · Faible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
