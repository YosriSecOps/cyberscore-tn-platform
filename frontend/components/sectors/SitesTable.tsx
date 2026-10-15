"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import ReportPreviewModal from "@/components/report/ReportPreviewModal";
import { generateMockReport, ScanReport } from "@/lib/report-data";
import { getDynamicMonitoredSites } from "@/lib/dynamic-data";

interface SiteData {
  id: string;
  name: string;
  url: string;
  sector: string;
  score: number;
  grade?: string;
  criticalCount?: number;
  trend: "up" | "down" | "flat";
  lastScan: string;
}

function getInitialSites(): SiteData[] {
  return getDynamicMonitoredSites(true).map((s) => ({
    id: s.id,
    name: s.name,
    url: s.cleanUrl,
    sector: s.sectorKey,
    score: s.score,
    grade: s.grade,
    criticalCount: s.criticalCount,
    trend: s.trend,
    lastScan: s.lastScan,
  }));
}

const Sparkline = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  const color = trend === "up" ? "var(--color-success)" : trend === "down" ? "var(--color-danger)" : "var(--text-tertiary)";
  const path = trend === "up" 
    ? "M0,15 L10,12 L20,14 L30,5 L40,8" 
    : trend === "down" 
    ? "M0,5 L10,8 L20,6 L30,15 L40,12" 
    : "M0,10 L10,10 L20,10 L30,10 L40,10";

  return (
    <svg width="40" height="20" viewBox="0 0 40 20" style={{ overflow: "visible" }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const SECTOR_LABELS: Record<string, { fr: string; ar: string; en: string }> = {
  "ministries": { fr: "Ministères", ar: "الوزارات", en: "Ministries" },
  "institutions": { fr: "Institutions Publiques", ar: "الهيئات والمؤسسات الوطنية", en: "Public Institutions" },
  "local": { fr: "Collectivités Locales", ar: "الجماعات المحلية", en: "Local Authorities" },
  "enterprises": { fr: "Entreprises Publiques", ar: "المنشآت والشركات العمومية", en: "Public Enterprises" }
};

export default function SitesTable() {
  return (
    <Suspense fallback={<div className="card" style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--text-secondary)" }}>Chargement des données...</div>}>
      <SitesTableInner />
    </Suspense>
  );
}

function SitesTableInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const filterParam = searchParams.get("sector") || "all";
  
  const [sectorFilter, setSectorFilter] = useState(filterParam);
  const [sortAsc, setSortAsc] = useState(false);
  const [sites, setSites] = useState<SiteData[]>(getInitialSites);
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    function refreshSites() {
      setSites(getInitialSites());
    }

    refreshSites();
    window.addEventListener("storage", refreshSites);
    window.addEventListener("cyberscore_scan_completed", refreshSites);

    async function fetchLiveSites() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/scans/recent?limit=50`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.scans) && data.scans.length > 0) {
            const seen = new Set<string>();
            const liveMerged: SiteData[] = [];

            for (const s of data.scans) {
              if (s.status === "completed" && s.total_score !== null) {
                const domain = s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
                if (!seen.has(domain)) {
                  seen.add(domain);
                  let sec = "ministries";
                  let name = domain;

                  if (domain.startsWith("commune-") || domain.startsWith("municipalite-")) {
                    sec = "local";
                    name = `Commune ${domain.replace("commune-", "").replace(".gov.tn", "")}`;
                  } else if (domain.includes("steg") || domain.includes("sonede") || domain.includes("poste") || domain.endsWith(".com.tn")) {
                    sec = "enterprises";
                    name = domain.toUpperCase();
                  } else if (domain.includes("ansi") || domain.includes("bct") || domain.includes("isie") || domain.includes(".nat.tn")) {
                    sec = "institutions";
                    name = domain.toUpperCase();
                  } else {
                    name = `Ministère (${domain.replace(".gov.tn", "")})`;
                  }

                  let timeStr = "Récemment";
                  if (s.created_at) {
                    const diffMin = Math.floor((Date.now() - new Date(s.created_at).getTime()) / 60000);
                    if (diffMin < 60) timeStr = `il y a ${diffMin}m`;
                    else if (diffMin < 1440) timeStr = `il y a ${Math.floor(diffMin / 60)}h`;
                    else timeStr = `il y a ${Math.floor(diffMin / 1440)}j`;
                  }

                  liveMerged.push({
                    id: String(s.id),
                    name,
                    url: domain,
                    sector: sec,
                    score: Math.round(s.total_score),
                    grade: s.grade,
                    criticalCount: s.critical_count ?? 0,
                    trend: s.total_score >= 75 ? "up" : "down",
                    lastScan: timeStr,
                  });
                }
              }
            }

            // Fill with dynamic list for un-audited sites
            const initialSites = getInitialSites();
            for (const d of initialSites) {
              if (!seen.has(d.url.toLowerCase())) {
                seen.add(d.url.toLowerCase());
                liveMerged.push(d);
              }
            }

            setSites(liveMerged);
          }
        }
      } catch {
        // Fallback to default
      }
    }

    fetchLiveSites();

    return () => {
      window.removeEventListener("storage", refreshSites);
      window.removeEventListener("cyberscore_scan_completed", refreshSites);
    };
  }, []);

  useEffect(() => {
    setSectorFilter(filterParam);
  }, [filterParam]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSectorFilter(val);
    if (val === "all") {
      router.push("?", { scroll: false });
    } else {
      router.push(`?sector=${val}`, { scroll: false });
    }
  };

  const filteredSites = sectorFilter === "all" ? sites : sites.filter(s => s.sector === sectorFilter);
  const sortedSites = [...filteredSites].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  const handleRowClick = (site: SiteData) => {
    const rep = generateMockReport(site.url);
    rep.score = site.score;
    if (site.grade) rep.grade = site.grade;
    if (site.criticalCount !== undefined) rep.criticalCount = site.criticalCount;
    setSelectedReport(rep);
    setIsModalOpen(true);
  };

  return (
    <div id="sites-table" className="card" style={{ padding: 0, overflow: "hidden", scrollMarginTop: "100px" }}>
      {/* Header & Filters */}
      <div style={{ padding: "var(--space-xl)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-primary)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>
          {isAr ? `جميع المواقع (${filteredSites.length})` : `Tous les sites (${filteredSites.length})`}
        </h3>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <select 
            value={sectorFilter}
            onChange={handleFilterChange}
            style={{ 
              padding: "8px 12px", borderRadius: "6px", 
              border: "1px solid var(--border-primary)", 
              background: "var(--bg-primary)", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="all">{isAr ? "جميع القطاعات" : "Tous les secteurs"}</option>
            <option value="ministries">{isAr ? "الوزارات" : "Ministères"}</option>
            <option value="institutions">{isAr ? "الهيئات والمؤسسات الوطنية" : "Institutions Publiques"}</option>
            <option value="local">{isAr ? "الجماعات المحلية" : "Collectivités Locales"}</option>
            <option value="enterprises">{isAr ? "المنشآت والشركات العمومية" : "Entreprises Publiques"}</option>
          </select>
          <button 
            onClick={() => setSortAsc(!sortAsc)}
            style={{ 
            display: "flex", alignItems: "center", gap: "8px", 
            padding: "8px 12px", borderRadius: "6px", 
            border: "1px solid var(--border-primary)", 
            background: "var(--bg-primary)", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" 
          }}>
            {isAr ? "النتيجة" : "Score"} {sortAsc ? (isAr ? "تصاعدي" : "croissant") : (isAr ? "تنازلي" : "décroissant")} {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: isAr ? "right" : "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-primary)", color: "var(--text-tertiary)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>
              <th style={{ padding: "12px var(--space-xl)", fontWeight: 600 }}>{isAr ? "الموقع" : "Site"}</th>
              <th style={{ padding: "12px var(--space-md)", fontWeight: 600 }}>{isAr ? "القطاع" : "Secteur"}</th>
              <th style={{ padding: "12px var(--space-md)", fontWeight: 600, textAlign: "center" }}>{isAr ? "النتيجة" : "Score"}</th>
              <th style={{ padding: "12px var(--space-md)", fontWeight: 600, textAlign: "center" }}>{isAr ? "المؤشر" : "Tendance"}</th>
              <th style={{ padding: "12px var(--space-md)", fontWeight: 600, textAlign: "center" }}>{isAr ? "معاينة" : "Aperçu"}</th>
              <th style={{ padding: "12px var(--space-xl)", fontWeight: 600, textAlign: isAr ? "left" : "right" }}>{isAr ? "آخر فحص" : "Dernier Scan"}</th>
            </tr>
          </thead>
          <tbody>
            {sortedSites.map((site) => {
              const isHovered = hoveredId === site.id;
              const sectorLabel = SECTOR_LABELS[site.sector] ? (isAr ? SECTOR_LABELS[site.sector].ar : isFr ? SECTOR_LABELS[site.sector].fr : SECTOR_LABELS[site.sector].en) : site.sector;

              return (
                <tr 
                  key={site.id} 
                  onClick={() => handleRowClick(site)}
                  onMouseEnter={() => setHoveredId(site.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ 
                    borderBottom: "1px solid var(--border-primary)",
                    cursor: "pointer",
                    backgroundColor: isHovered ? "var(--bg-tertiary)" : "transparent",
                    transition: "background 0.15s ease"
                  }}
                  title={`Cliquer pour ouvrir le rapport d'audit de ${site.url}`}
                >
                  <td style={{ padding: "12px var(--space-xl)" }}>
                    <div style={{ fontWeight: 600, color: isHovered ? "var(--color-accent)" : "var(--text-primary)", transition: "color 0.15s" }}>{site.name}</div>
                    <div style={{ color: "var(--text-tertiary)", fontSize: "11px", fontFamily: "var(--font-mono)", marginTop: "2px" }}>{site.url}</div>
                  </td>
                  <td style={{ padding: "12px var(--space-md)" }}>
                    <span style={{ 
                      padding: "4px 8px", borderRadius: "4px", background: "rgba(59, 130, 246, 0.1)", color: "var(--color-info)", fontSize: "11px", fontWeight: 600 
                    }}>
                      {sectorLabel}
                    </span>
                  </td>
                  <td style={{ padding: "12px var(--space-md)", textAlign: "center", fontWeight: 700, color: site.score >= 80 ? "var(--color-success)" : site.score >= 65 ? "var(--color-info)" : site.score >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>
                    {site.score}
                  </td>
                  <td style={{ padding: "12px var(--space-md)", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Sparkline trend={site.trend} />
                    </div>
                  </td>
                  <td style={{ padding: "12px var(--space-md)", textAlign: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(site);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 500,
                        background: isHovered ? "var(--color-accent-muted)" : "var(--bg-secondary)",
                        border: "1px solid var(--border-primary)",
                        color: isHovered ? "var(--color-accent)" : "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Eye size={12} />
                      <span>{isAr ? "تقرير" : "PDF"}</span>
                    </button>
                  </td>
                  <td style={{ padding: "12px var(--space-xl)", textAlign: isAr ? "left" : "right", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    {site.lastScan}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
