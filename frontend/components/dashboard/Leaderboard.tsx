"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Eye, ChevronRight } from "lucide-react";
import ReportPreviewModal from "@/components/report/ReportPreviewModal";
import { generateMockReport, ScanReport } from "@/lib/report-data";
import { getDynamicLeaderboard } from "@/lib/dynamic-data";

interface ScanEntry {
  id: number;
  url: string;
  total_score: number | null;
  grade: string | null;
  critical_count: number;
  created_at: string | null;
}

function getInitialLeaderboard(): ScanEntry[] {
  return getDynamicLeaderboard().slice(0, 10).map((s, idx) => ({
    id: idx + 1,
    url: s.cleanUrl,
    total_score: s.score,
    grade: s.grade,
    critical_count: s.criticalCount,
    created_at: null,
  }));
}

function gradeClass(grade: string | null): string {
  if (!grade) return "grade-f";
  const g = grade.replace("+", "").toLowerCase();
  if (g === "a") return "grade-a";
  if (g === "b") return "grade-b";
  if (g === "c") return "grade-c";
  if (g === "d") return "grade-d";
  return "grade-f";
}

function scoreClass(score: number | null): string {
  if (!score) return "";
  if (score >= 80) return "score-good";
  if (score >= 65) return "score-ok";
  return "score-bad";
}

export default function Leaderboard() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const titleText = isAr ? "الترتيب الوطني للمواقع" : isFr ? "Classement National" : "National Leaderboard";
  const subtitleText = isAr ? "تصنيف المواقع حسب مؤشر الحماية السيبرانية (انقر للعرض التفاعلي)" : isFr ? "Classement des sites par score de sécurité (cliquer pour aperçu)" : "Sites ranked by security score (click for preview)";
  const scoreCol = isAr ? "النتيجة" : "SCORE";
  const gradeCol = isAr ? "الرتبة" : isFr ? "NOTE" : "GRADE";
  const critCol = isAr ? "تنبيهات حرجة" : isFr ? "ALERTES CRITIQUES" : "CRITICAL ALERTS";
  const actionCol = isAr ? "معاينة" : isFr ? "APERÇU" : "PREVIEW";

  const [sites, setSites] = useState<ScanEntry[]>(getInitialLeaderboard);
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    function refreshLeaderboard() {
      const live = getDynamicLeaderboard(true).slice(0, 10).map((s, idx) => ({
        id: idx + 1,
        url: s.cleanUrl,
        total_score: s.score,
        grade: s.grade,
        critical_count: s.criticalCount,
        created_at: null,
      }));
      setSites(live);
    }

    refreshLeaderboard();
    window.addEventListener("storage", refreshLeaderboard);
    window.addEventListener("cyberscore_scan_completed", refreshLeaderboard);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API}/api/scans/recent?limit=30`)
      .then((r) => r.json())
      .then((data) => {
        if (data.scans && Array.isArray(data.scans) && data.scans.length > 0) {
          const seen = new Set<string>();
          const uniqueLive: ScanEntry[] = [];

          for (const s of data.scans) {
            if (s.status === "completed" && s.total_score !== null) {
              const cleanUrl = s.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
              if (!seen.has(cleanUrl)) {
                seen.add(cleanUrl);
                uniqueLive.push({
                  id: s.id,
                  url: cleanUrl,
                  total_score: Math.round(s.total_score),
                  grade: s.grade,
                  critical_count: s.critical_count ?? 0,
                  created_at: s.created_at,
                });
              }
            }
          }

          const initial = getDynamicLeaderboard(true).slice(0, 10).map((s, idx) => ({
            id: idx + 1,
            url: s.cleanUrl,
            total_score: s.score,
            grade: s.grade,
            critical_count: s.criticalCount,
            created_at: null,
          }));

          for (const item of initial) {
            const cleanUrl = item.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
            if (!seen.has(cleanUrl)) {
              seen.add(cleanUrl);
              uniqueLive.push(item);
            }
          }

          setSites(uniqueLive);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("storage", refreshLeaderboard);
      window.removeEventListener("cyberscore_scan_completed", refreshLeaderboard);
    };
  }, []);

  const sorted = [...sites].sort(
    (a, b) => (b.total_score ?? 0) - (a.total_score ?? 0)
  );

  const handleRowClick = (site: ScanEntry) => {
    const reportData = generateMockReport(site.url);
    if (site.total_score !== null && site.total_score !== undefined) {
      reportData.score = site.total_score;
    }
    if (site.grade) {
      reportData.grade = site.grade;
    }
    if (site.critical_count !== undefined) {
      reportData.criticalCount = site.critical_count;
    }
    setSelectedReport(reportData);
    setIsModalOpen(true);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="section-header" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "var(--space-md)" }}>
        <div>
          <div className="section-title">{titleText}</div>
          <div className="section-subtitle">{subtitleText}</div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: isAr ? "right" : "left", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>#</th>
              <th style={{ textAlign: isAr ? "right" : "left", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>URL</th>
              <th style={{ width: 75, textAlign: "center", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>{scoreCol}</th>
              <th style={{ width: 65, textAlign: "center", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>{gradeCol}</th>
              <th style={{ width: 110, textAlign: "center", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>{critCol}</th>
              <th style={{ width: 85, textAlign: "center", padding: "8px 8px", color: "var(--text-tertiary)", fontSize: "10px", borderBottom: "1px solid var(--border-secondary)" }}>{actionCol}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((site, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <tr
                  key={site.id || i}
                  onClick={() => handleRowClick(site)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isHovered ? "var(--bg-tertiary)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                  title={`Ouvrir le rapport d'audit interactif de ${site.url}`}
                >
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
                    <span className="text-tabular" style={{ fontWeight: 600, fontSize: "12px", color: i < 3 ? "var(--color-accent)" : "var(--text-secondary)" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
                    <span
                      className="text-mono"
                      style={{
                        fontWeight: 500,
                        fontSize: "13px",
                        color: isHovered ? "var(--color-accent)" : "var(--text-primary)",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {site.url}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
                    <span className={`text-tabular ${scoreClass(site.total_score)}`} style={{ fontWeight: 700, fontSize: "13px" }}>
                      {site.total_score ?? "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
                    <span className={`grade-badge ${gradeClass(site.grade)}`} style={{ fontSize: "11px", minWidth: "24px" }}>
                      {site.grade ?? "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
                    {(site.critical_count ?? 0) > 0 ? (
                      <span style={{ color: "var(--color-critical)", fontWeight: 700, fontSize: "12px" }}>
                        {site.critical_count}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid var(--border-secondary)" }}>
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
