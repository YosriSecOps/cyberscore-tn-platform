"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface AlertItem {
  site: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  time: string;
}

const DEFAULT_ALERTS: AlertItem[] = [
  { site: "finances.gov.tn", type: "AUDIT TERMINÉ", severity: "high", time: "2m" },
  { site: "interieur.gov.tn", type: "MISSING HSTS", severity: "high", time: "15m" },
  { site: "education.gov.tn", type: "XSS DETECTED", severity: "critical", time: "1h" },
  { site: "diplomatie.gov.tn", type: "SCAN COMPLETE", severity: "info", time: "2h" },
  { site: "sante.gov.tn", type: "WEAK CSP", severity: "medium", time: "3h" },
];

export default function AlertFeed() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isAr = locale === "ar";
  const viewAllText = isAr ? "عرض الكل" : locale === "fr" ? "Voir tout" : "View all";
  const titleText = isAr ? "التنبيهات الأخيرة" : locale === "fr" ? "Alertes Récentes" : "Recent Alerts";

  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS);

  useEffect(() => {
    async function fetchRecentAlerts() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/scans/recent?limit=6`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.scans) && data.scans.length > 0) {
            // Deduplicate by site so each target appears at most once in recent feed
            const seen = new Set<string>();
            const distinctScans = data.scans.filter((s: any) => {
              const domain = (s.url || "").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
              if (!domain || seen.has(domain)) return false;
              seen.add(domain);
              return true;
            });

            const liveAlerts: AlertItem[] = distinctScans.map((s: any) => {
              const cleanSite = s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
              const isCrit = (s.critical_count ?? 0) > 0;
              const sev: AlertItem["severity"] = isCrit ? "critical" : s.grade === "A" ? "info" : s.grade === "B" ? "low" : "high";
              const type = isCrit ? (isAr ? "ثغرة حرجة" : "ALERTE CRITIQUE") : s.grade === "A" ? (isAr ? "مطابق (A)" : "CONFORME (A)") : `${isAr ? "اكتمل الفحص" : "AUDIT TERMINE"} (${s.grade})`;

              // Calculate relative time
              let timeStr = isAr ? "مؤخراً" : "Récemment";
              if (s.created_at) {
                const diffMs = Date.now() - new Date(s.created_at).getTime();
                const diffMin = Math.floor(diffMs / 60000);
                if (diffMin < 1) timeStr = isAr ? "الآن" : "À l'instant";
                else if (diffMin < 60) timeStr = `${diffMin}m`;
                else {
                  const diffHours = Math.floor(diffMin / 60);
                  if (diffHours < 24) timeStr = `${diffHours}h`;
                  else timeStr = `${Math.floor(diffHours / 24)}j`;
                }
              }

              return {
                site: cleanSite,
                type,
                severity: sev,
                time: timeStr,
              };
            });

            setAlerts(liveAlerts);
          }
        }
      } catch {
        // Fallback to defaults
      }
    }

    fetchRecentAlerts();
  }, [isAr]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="section-header" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="section-title">{titleText}</div>
        <Link
          href={`/${locale}/threats`}
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-secondary)",
            padding: "4px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "var(--color-accent)";
            e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border-secondary)";
          }}
        >
          {viewAllText}
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {alerts.map((alert, i) => (
          <Link
            key={i}
            href={`/${locale}/scan?site=${encodeURIComponent(alert.site)}`}
            className="alert-row"
            style={{
              padding: "10px 8px",
              borderBottom: i === alerts.length - 1 ? "none" : "1px solid var(--border-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
              e.currentTarget.style.transform = isAr ? "translateX(-4px)" : "translateX(4px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
            title={`Inspecter ${alert.site} sur le scanner`}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: `var(--color-${alert.severity})`,
                flexShrink: 0,
              }}
            />
            <span
              className="alert-site text-mono"
              style={{
                flex: "0 0 160px",
                fontWeight: 500,
                color: "var(--text-primary)",
                fontSize: "13px",
              }}
            >
              {alert.site}
            </span>
            <span style={{ flex: 1, textAlign: isAr ? "left" : "right" }}>
              <span
                className={`severity-tag ${alert.severity}`}
                style={{ fontSize: "10px", padding: "2px 8px" }}
              >
                {alert.type}
              </span>
            </span>
            <span
              className="alert-time"
              style={{
                minWidth: "32px",
                textAlign: isAr ? "left" : "right",
                color: "var(--text-tertiary)",
                fontSize: "11px",
              }}
            >
              {alert.time}
            </span>
            <ChevronRight
              size={14}
              color="var(--text-tertiary)"
              style={{
                marginLeft: isAr ? "0" : "6px",
                marginRight: isAr ? "6px" : "0",
                transform: isAr ? "rotate(180deg)" : "none",
                transition: "transform 0.15s ease",
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
