/**
 * CyberScore TN — PDF Report Generator (Orchestrator)
 * Assembles all 7 pages and provides download button with full i18n support (AR, FR, EN).
 */
"use client";

import React, { useState, useCallback } from "react";
import { Document, pdf } from "@react-pdf/renderer";
import { useLocale } from "next-intl";
import { FileDown, Loader2 } from "lucide-react";
import { ScanReport, generateMockReport } from "@/lib/report-data";
import { generateQrCodeDataUrl } from "@/lib/qr-code";
import { recordAuditLog } from "@/utils/auditLogger";
import CoverPage from "./CoverPage";
import ExecutiveSummary from "./ExecutiveSummary";
import ActiveReconPdfPage from "./ActiveReconPdfPage";
import ObsolescencePdfPage from "./ObsolescencePdfPage";
import CategoryAnalysis from "./CategoryAnalysis";
import VulnerabilitiesPage from "./VulnerabilitiesPage";
import ActionPlan from "./ActionPlan";
import BenchmarkPage from "./BenchmarkPage";
import RecommendationsPage from "./RecommendationsPage";

// ── PDF Document ─────────────────────────────────────────

function CyberScoreReport({ report, qrCodeUrl }: { report: ScanReport; qrCodeUrl?: string }) {
  const hasActiveRecon = Boolean(report.isAutonomousAgent || (report.openPorts && report.openPorts.length > 0));
  const hasObsolescence = Boolean(report.softwareObsolescence && report.softwareObsolescence.length > 0);

  return (
    <Document
      title={`CyberScore TN — Rapport d'Audit — ${report.site}`}
      author="ANCS Sovereign Audit Engine — CyberScore TN"
      subject={`Rapport officiel de cybersécurité pour ${report.site} — Score: ${report.score}/100`}
      keywords="cybersécurité, audit, sécurité, gouvernement, tunisie, ancs"
    >
      <CoverPage report={report} qrCodeUrl={qrCodeUrl} />
      <ExecutiveSummary report={report} />
      {hasActiveRecon && <ActiveReconPdfPage report={report} />}
      {hasObsolescence && <ObsolescencePdfPage report={report} />}
      <CategoryAnalysis report={report} />
      <VulnerabilitiesPage report={report} />
      <ActionPlan report={report} />
      <BenchmarkPage report={report} />
      <RecommendationsPage report={report} qrCodeUrl={qrCodeUrl} />
    </Document>
  );
}

// ── Download Button Component ────────────────────────────

interface ReportGeneratorProps {
  siteUrl?: string;
  reportData?: ScanReport;
  variant?: "button" | "compact" | "icon";
}

export default function ReportGenerator({ siteUrl, reportData, variant = "button" }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  let locale = "fr";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    locale = useLocale();
  } catch {
    locale = "fr";
  }

  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const btnLabel = isAr ? "تحميل تقرير PDF" : isFr ? "Télécharger PDF" : "Download PDF";
  const generatingLabel = isAr ? "جاري إنشاء PDF..." : isFr ? "Génération PDF..." : "Generating PDF...";
  const tooltipLabel = isAr ? "تحميل تقرير التدقيق الرسمي (PDF)" : isFr ? "Télécharger le rapport d'audit officiel (PDF)" : "Download Official Audit Report (PDF)";

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const report = reportData || generateMockReport(siteUrl || "sante.gov.tn");
      const cleanDomain = report.site.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
      const verifyUrl = `https://cyberscore.tn/verify/${cleanDomain}`;
      let qrCodeUrl = "";
      try {
        qrCodeUrl = await generateQrCodeDataUrl(verifyUrl, {
          width: 160,
          margin: 1,
          errorCorrectionLevel: "M",
          darkColor: "#0A192F",
          lightColor: "#FFFFFF",
        });
      } catch (qrErr) {
        console.warn("QR code generation fallback:", qrErr);
      }

      const blob = await pdf(<CyberScoreReport report={report} qrCodeUrl={qrCodeUrl} />).toBlob();

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CyberScore_TN_${report.site.replace(/\./g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record PDF Export into Sovereign Audit Trail
      recordAuditLog({
        action: {
          fr: "Export du rapport officiel d'audit PDF certifié ANCS",
          ar: "تصدير تقرير التدقيق الأمني الرسمي المعتمد PDF",
          en: "Exported official certified security audit PDF report",
        },
        target: report.site,
        severity: "info",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, reportData, siteUrl]);

  if (variant === "icon") {
    return (
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        title={tooltipLabel}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #D9E3EC",
          background: "#FFFFFF",
          color: isGenerating ? "#94A3B8" : "#0284C7",
          cursor: isGenerating ? "wait" : "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          if (!isGenerating) {
            e.currentTarget.style.background = "#F0F9FF";
            e.currentTarget.style.borderColor = "#0EA5E9";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#FFFFFF";
          e.currentTarget.style.borderColor = "#D9E3EC";
        }}
      >
        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        title={tooltipLabel}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "7px 12px",
          borderRadius: "6px",
          border: "1px solid #0EA5E9",
          background: isGenerating ? "#F1F5F9" : "#0EA5E9",
          color: isGenerating ? "#64748B" : "#FFFFFF",
          fontSize: "11px",
          fontWeight: 700,
          cursor: isGenerating ? "wait" : "pointer",
          transition: "all 0.15s ease",
          boxShadow: isGenerating ? "none" : "0 2px 6px rgba(14, 165, 233, 0.25)",
        }}
        onMouseOver={(e) => {
          if (!isGenerating) {
            e.currentTarget.style.background = "#0284C7";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#0EA5E9";
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            <span>{isAr ? "جاري..." : "PDF..."}</span>
          </>
        ) : (
          <>
            <FileDown size={13} />
            <span>PDF</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      title={tooltipLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        background: isGenerating ? "#E2E8F0" : "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
        color: isGenerating ? "#64748B" : "#FFFFFF",
        fontSize: "12.5px",
        fontWeight: 700,
        cursor: isGenerating ? "wait" : "pointer",
        transition: "all 0.2s",
        boxShadow: isGenerating ? "none" : "0 4px 14px rgba(14, 165, 233, 0.35)",
      }}
      onMouseOver={(e) => {
        if (!isGenerating) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {isGenerating ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          <span>{generatingLabel}</span>
        </>
      ) : (
        <>
          <FileDown size={15} />
          <span>{btnLabel}</span>
        </>
      )}
    </button>
  );
}
