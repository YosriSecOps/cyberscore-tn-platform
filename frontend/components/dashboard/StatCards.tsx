"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { Globe, ShieldCheck, Bug, Scan } from "lucide-react";
import { getDynamicNationalStats } from "@/lib/dynamic-data";

interface DashboardData {
  totalSites: number;
  averageScore: number;
  criticalAlerts: number;
  scansToday: number;
}

const STAT_KEYS = ["totalSites", "averageScore", "criticalAlerts", "scansToday"] as const;

const DEFAULT_DATA: DashboardData = getDynamicNationalStats(false);

function useCountUp(target: number, duration = 500, enabled = true) {
  const [value, setValue] = useState(target > 0 ? target * 0.7 : 0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target <= 0) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const initialVal = value;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(initialVal + (target - initialVal) * eased);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration, enabled]);

  return value;
}

interface StatMeta {
  label: string;
  value: number;
  loaded: boolean;
  format: (v: number) => string;
  icon: any;
  color: string;
  bgColor: string;
  trend: string;
  trendUp: boolean;
}

function StatCard({ meta }: { meta: StatMeta }) {
  const animated = useCountUp(meta.value, 400, meta.loaded);
  const Icon = meta.icon;

  return (
    <div className="stat-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
      {meta.loaded ? (
        <>
          <div style={{
            width: 56, height: 56, borderRadius: "12px", background: meta.bgColor, color: meta.color,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)" }}>
              <div className="stat-value" suppressHydrationWarning>{meta.format(animated)}</div>
            </div>
            <div className="stat-label" style={{ marginTop: 2, marginBottom: 6 }}>{meta.label}</div>
            <div style={{
              fontSize: "12px", fontWeight: 500,
              color: meta.trendUp ? "var(--color-success)" : "var(--color-critical)"
            }}>
              {meta.trendUp ? "↑" : "↓"} {meta.trend}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "12px" }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-number" />
            <div className="skeleton skeleton-text mt-sm" />
          </div>
        </>
      )}
    </div>
  );
}

export default function StatCards() {
  const t = useTranslations("dashboard");
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    // Dynamically calculate from the live centralized store
    const dynamicStats = getDynamicNationalStats();
    setData(dynamicStats);

    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    fetch(`${API}/api/dashboard/stats`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Network response not ok");
        return r.json();
      })
      .then((stats) => {
        clearTimeout(timeoutId);
        if (isMounted && stats) {
          setData((prev) => ({
            totalSites: stats.total_sites && stats.total_sites > 0 ? stats.total_sites : prev.totalSites,
            averageScore: stats.average_score && stats.average_score > 0 ? stats.average_score : prev.averageScore,
            criticalAlerts: stats.critical_alerts ?? prev.criticalAlerts,
            scansToday: stats.scans_today ?? prev.scansToday,
          }));
        }
      })
      .catch(() => {
        // Dynamic stats already loaded
      })
      .finally(() => {
        if (isMounted) setLoaded(true);
      });

    const handleSync = () => {
      setData(getDynamicNationalStats(true));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cyberscore_scan_completed", handleSync);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cyberscore_scan_completed", handleSync);
    };
  }, []);

  const formatters: Record<string, (v: number) => string> = {
    totalSites: (v) => Math.round(v).toString(),
    averageScore: (v) => v.toFixed(1),
    criticalAlerts: (v) => Math.round(v).toString(),
    scansToday: (v) => Math.round(v).toString(),
  };

  const METADATA: Record<string, any> = {
    totalSites: { icon: Globe, color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)", trend: "12 ce mois-ci", trendUp: true },
    averageScore: { icon: ShieldCheck, color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.1)", trend: "5.3 points", trendUp: true },
    criticalAlerts: { icon: Bug, color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)", trend: "2 depuis hier", trendUp: false },
    scansToday: { icon: Scan, color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.1)", trend: "8 scans", trendUp: false },
  };

  return (
    <div className="stat-grid">
      {STAT_KEYS.map((key) => (
        <StatCard
          key={key}
          meta={{
            label: t(key),
            value: data[key],
            loaded,
            format: formatters[key],
            ...METADATA[key]
          }}
        />
      ))}
    </div>
  );
}
