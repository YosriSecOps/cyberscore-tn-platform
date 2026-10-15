"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { generateQrCodeDataUrl } from "@/lib/qr-code";
import {
  X,
  FileDown,
  Printer,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Server,
  Code,
  Globe,
  Sparkles,
  Award,
  Layers,
  FileText,
  Zap,
  Network,
  Cpu,
} from "lucide-react";
import { ScanReport, getGradeColor, getSeverityConfig } from "@/lib/report-data";
import ReportGenerator from "./ReportGenerator";
import { getDomainCryptoAttestation } from "@/lib/crypto-attestation";

interface ReportPreviewModalProps {
  report: ScanReport;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportPreviewModal({ report, isOpen, onClose }: ReportPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // ── Dynamic page structure for autonomous scans ──────────────
  const hasActiveRecon = Boolean(report.isAutonomousAgent || (report.openPorts && report.openPorts.length > 0));
  const hasObsolescence = Boolean(report.softwareObsolescence && report.softwareObsolescence.length > 0);
  const activePageCount = (hasActiveRecon ? 1 : 0) + (hasObsolescence ? 1 : 0);
  const totalPages = 7 + activePageCount;

  useEffect(() => {
    let isMounted = true;
    const cleanDomain = report.site.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    generateQrCodeDataUrl(`https://cyberscore.tn/verify/${cleanDomain}`, {
      width: 160,
      margin: 1,
      darkColor: "#0A192F",
      lightColor: "#FFFFFF",
    }).then((url) => {
      if (isMounted) setQrCodeUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [report.site]);

  if (!isOpen) return null;

  const gradeColor = getGradeColor(report.grade);
  const totalVulns = report.criticalCount + report.highCount + report.mediumCount + report.lowCount;

  // Build dynamic page list — insert active scan pages after Synthèse Exécutive
  const pageTitles: Array<{ num: number; title: string; icon: React.ReactNode; contentId: string }> = [];
  let pageNum = 1;
  pageTitles.push({ num: pageNum++, title: "Page de Garde & Métadonnées", icon: <Award size={14} />, contentId: "cover" });
  pageTitles.push({ num: pageNum++, title: "Synthèse Exécutive & Score", icon: <Shield size={14} />, contentId: "executive" });
  if (hasActiveRecon) {
    pageTitles.push({ num: pageNum++, title: "Reconnaissance Réseau & Ports", icon: <Network size={14} />, contentId: "active-recon" });
  }
  if (hasObsolescence) {
    pageTitles.push({ num: pageNum++, title: "Obsolescence Logicielle & CVEs", icon: <Cpu size={14} />, contentId: "obsolescence" });
  }
  pageTitles.push({ num: pageNum++, title: "Analyse par Piliers & Catégories", icon: <Layers size={14} />, contentId: "categories" });
  pageTitles.push({ num: pageNum++, title: "Cartographie des Vulnérabilités", icon: <AlertTriangle size={14} />, contentId: "vulns" });
  pageTitles.push({ num: pageNum++, title: "Plan d'Action & Snippets Code", icon: <Code size={14} />, contentId: "action" });
  pageTitles.push({ num: pageNum++, title: "Benchmark & Positionnement", icon: <Globe size={14} />, contentId: "benchmark" });
  pageTitles.push({ num: pageNum++, title: "Recommandations IA & Sceau ANCS", icon: <Sparkles size={14} />, contentId: "recommendations" });

  const currentContentId = pageTitles.find(p => p.num === currentPage)?.contentId ?? "cover";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(2, 8, 18, 0.78)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          height: "92vh",
          background: "#081421",
          border: "1px solid #1B2A38",
          borderRadius: "14px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(14, 165, 233, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. Navy Modal Header (#0D1B2A) ───────────────────────── */}
        <div
          style={{
            padding: "16px 26px",
            borderBottom: "1px solid #1B2A38",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0D1B2A",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: `${gradeColor}20`,
                border: `1.5px solid ${gradeColor}`,
                color: gradeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "15px",
                fontFamily: "monospace",
              }}
            >
              {report.grade}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#F1F5F9", margin: 0, letterSpacing: "-0.3px" }}>
                  {report.site}
                </h3>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(14, 165, 233, 0.12)",
                    color: "#38BDF8",
                    fontFamily: "monospace",
                    border: "1px solid rgba(14, 165, 233, 0.3)",
                    fontWeight: 600,
                  }}
                >
                  {report.sector}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#22C55E",
                    fontFamily: "monospace",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                    fontWeight: 600,
                  }}
                >
                  ● RAPPORT CERTIFIÉ
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "3px" }}>
                ANCS AUDIT ENGINE v3.4 • {report.scanDate} • Score: <strong style={{ color: "#F1F5F9" }}>{report.score}/100</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ReportGenerator reportData={report} variant="compact" />

            <button
              onClick={() => window.print()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "6px",
                border: "1px solid #1B2A38",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#CBD5E1",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
            >
              <Printer size={14} />
              <span>Imprimer</span>
            </button>

            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #1B2A38",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#94A3B8",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                e.currentTarget.style.color = "#EF4444";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Main Body: Dark Navy Sidebar + Dark Report Canvas ───── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          
          {/* ── 2. Dark Navy Report Sidebar (#101D2D) ─────────────── */}
          <div
            style={{
              width: "270px",
              borderRight: "1px solid #1B2A38",
              background: "#101D2D",
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#64748B", fontFamily: "monospace", padding: "4px 8px", marginBottom: "4px", fontWeight: 700 }}>
              SOMMAIRE DU RAPPORT
            </div>
            
            {pageTitles.map((p) => {
              const isActive = currentPage === p.num;
              return (
                <button
                  key={p.num}
                  onClick={() => setCurrentPage(p.num)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: isActive ? "1px solid rgba(14, 165, 233, 0.55)" : "1px solid transparent",
                    borderLeft: isActive ? "3px solid #0EA5E9" : "1px solid transparent",
                    background: isActive ? "rgba(14, 165, 233, 0.10)" : "transparent",
                    color: isActive ? "#38BDF8" : "#94A3B8",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: isActive ? 700 : 500,
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                      e.currentTarget.style.color = "#F1F5F9";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#94A3B8";
                    }
                  }}
                >
                  <span style={{ fontSize: "10.5px", fontFamily: "monospace", color: isActive ? "#0EA5E9" : "#64748B", fontWeight: 700 }}>
                    0{p.num}
                  </span>
                  <span style={{ color: isActive ? "#38BDF8" : "#64748B" }}>{p.icon}</span>
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.title}
                  </span>
                </button>
              );
            })}

            {/* ── 3. Security Severity Panel (CVSS v3.1 Panel) ─────── */}
            <div
              style={{
                marginTop: "auto",
                padding: "14px",
                background: "#07111C",
                border: "1px solid #1B2A38",
                borderRadius: "10px",
              }}
            >
              <div style={{ fontSize: "10.5px", color: "#94A3B8", fontFamily: "monospace", marginBottom: "10px", fontWeight: 700, letterSpacing: "0.8px" }}>
                CVSS v3.1 SEVERITY
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
                <div style={{ padding: "6px 8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "6px", fontSize: "10px", color: "#EF4444", fontWeight: 700 }}>
                  🔴 {report.criticalCount < 10 ? `0${report.criticalCount}` : report.criticalCount} CRITIQUES
                </div>
                <div style={{ padding: "6px 8px", background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)", borderRadius: "6px", fontSize: "10px", color: "#F97316", fontWeight: 700 }}>
                  🟠 {report.highCount < 10 ? `0${report.highCount}` : report.highCount} HAUTES
                </div>
                <div style={{ padding: "6px 8px", background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: "6px", fontSize: "10px", color: "#EAB308", fontWeight: 700 }}>
                  🟡 {report.mediumCount < 10 ? `0${report.mediumCount}` : report.mediumCount} MOYENNES
                </div>
                <div style={{ padding: "6px 8px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "6px", fontSize: "10px", color: "#22C55E", fontWeight: 700 }}>
                  🟢 {report.lowCount < 10 ? `0${report.lowCount}` : report.lowCount} FAIBLES
                </div>
              </div>

              <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace", lineHeight: 1.4, borderTop: "1px solid #1B2A38", paddingTop: "8px" }}>
                {totalVulns} vulnérabilités • <strong style={{ color: report.criticalCount > 0 ? "#EF4444" : "#22C55E" }}>{report.criticalCount} immédiates</strong>
              </div>
            </div>
          </div>

          {/* ── 4. Dark Report Canvas (#020812) ───────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "36px 44px",
              background: "#020812",
              position: "relative",
            }}
          >
            {/* ══════════════════════════════════════════════════════════
                PAGE: PAGE DE GARDE INSTITUTIONNELLE
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "cover" && (
              <div style={{ maxWidth: "740px", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Government Header */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    background: "#07111C",
                    border: "1px solid #1B2A38",
                    borderRadius: "999px",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    fontFamily: "monospace",
                    color: "#E2E8F0",
                    marginBottom: "28px",
                  }}
                >
                  <span>🇹🇳</span>
                  <span>RÉPUBLIQUE TUNISIENNE • ANCS</span>
                </div>

                {/* 3D Shield Logo */}
                <div style={{ position: "relative", marginBottom: "18px" }}>
                  <div style={{ position: "absolute", inset: -15, background: "radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)", filter: "blur(20px)" }} />
                  <Image src="/images/logo-icon.png" alt="CyberScore TN" width={110} height={110} priority style={{ position: "relative", zIndex: 2 }} />
                </div>

                <div style={{ fontSize: "11.5px", letterSpacing: "3px", textTransform: "uppercase", color: "#38BDF8", fontFamily: "monospace", fontWeight: 700, marginBottom: "8px" }}>
                  RAPPORT OFFICIEL D'AUDIT DE CYBERSÉCURITÉ
                </div>

                <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px", margin: "0 0 24px 0" }}>
                  {report.site}
                </h1>

                {/* Score & Dual Grade Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    padding: "20px 32px",
                    background: "#07111C",
                    border: `1.5px solid ${gradeColor}`,
                    borderRadius: "14px",
                    boxShadow: `0 10px 30px ${gradeColor}20`,
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: `${gradeColor}15`,
                      border: `3px solid ${gradeColor}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: gradeColor,
                      fontWeight: 800,
                      fontSize: "28px",
                      fontFamily: "monospace",
                    }}
                  >
                    {report.grade}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>
                      {report.score} <span style={{ fontSize: "16px", color: "#64748B" }}>/ 100</span>
                    </div>
                    <div style={{ fontSize: "12px", color: gradeColor, fontWeight: 700, marginTop: "4px" }}>
                      Notation : {report.score >= 80 ? "Excellente Posture" : report.score >= 65 ? "Niveau Satisfaisant" : "Nécessite Remédiation"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                      Rang Sectoriel : #{report.sectorRank} sur {report.sectorTotal} institutions
                    </div>
                  </div>
                </div>

                {/* Metadata Table */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "540px",
                    background: "#07111C",
                    border: "1px solid #1B2A38",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "28px",
                  }}
                >
                  {[
                    { label: "Type d'Analyse", value: `${report.scanType} (16 Facteurs)` },
                    { label: "Date & Heure d'Audit", value: report.scanDate },
                    { label: "Durée d'Analyse", value: report.scanDuration },
                    { label: "Secteur Institutionnel", value: report.sector },
                    { label: "Analyste / Système", value: "IA Amina • ANCS CyberScore Core Engine" },
                    { label: "Référentiels Conformité", value: "OWASP Top 10 • NIST CSF v2 • ISO 27002" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "11px 18px",
                        borderBottom: i < 5 ? "1px solid #1B2A38" : "none",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "#94A3B8", fontFamily: "monospace" }}>{row.label}</span>
                      <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* QR Code Certification Seal */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 18px",
                    background: "#07111C",
                    border: "1px solid #1B2A38",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "520px",
                    marginBottom: "16px",
                    textAlign: "left",
                  }}
                >
                  {qrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrCodeUrl}
                      alt="ANCS QR Verification"
                      width={52}
                      height={52}
                      style={{ borderRadius: "4px", background: "#FFFFFF", padding: "2px" }}
                    />
                  ) : null}
                  <div>
                    <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "0.5px" }}>
                      SCEAU NUMÉRIQUE D&apos;AUTHENTICITÉ ANCS
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#94A3B8", marginTop: "2px" }}>
                      Scannez ce QR Code avec un smartphone pour vérifier en direct la conformité de ce rapport.
                    </div>
                    <div style={{ fontSize: "10px", color: "#38BDF8", fontFamily: "monospace", marginTop: "3px" }}>
                      PORTAIL : https://cyberscore.tn/verify/{report.site}
                    </div>
                  </div>
                </div>

                {/* Confidentiality Box */}
                <div
                  style={{
                    padding: "10px 20px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    color: "#F87171",
                    fontFamily: "monospace",
                    letterSpacing: "0.5px",
                  }}
                >
                  ⚠️ DIFFUSION RESTREINTE • DOCUMENT OFFICIEL DESTINÉ AU RSSI DE L'ORGANISME AUDITÉ
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PAGE: SYNTHÈSE EXÉCUTIVE
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "executive" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Shield size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Synthèse Exécutive</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Vue d'ensemble stratégique et priorités d'action pour la direction</p>
                  </div>
                </div>

                {/* Executive Summary Quote Banner */}
                <div
                  style={{
                    padding: "18px 22px",
                    background: "#07111C",
                    borderLeft: "4px solid #0EA5E9",
                    borderTop: "1px solid #1B2A38",
                    borderRight: "1px solid #1B2A38",
                    borderBottom: "1px solid #1B2A38",
                    borderRadius: "0 10px 10px 0",
                    fontSize: "13.5px",
                    lineHeight: 1.6,
                    color: "#E2E8F0",
                    marginBottom: "24px",
                  }}
                >
                  <strong style={{ color: "#38BDF8" }}>Synthèse : </strong>
                  {report.summaryPhrase}
                </div>

                {/* 3 Pillars Grid (Good / Bad / Priority) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div
                    style={{
                      padding: "18px",
                      background: "#07111C",
                      border: "1px solid #1B2A38",
                      borderTop: "3px solid #22C55E",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22C55E", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
                      <CheckCircle2 size={16} />
                      Points Forts Validés
                    </div>
                    <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                      {report.whatWorksWell}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#07111C",
                      border: "1px solid #1B2A38",
                      borderTop: "3px solid #EF4444",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#EF4444", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
                      <AlertTriangle size={16} />
                      Faiblesses Critiques Détectées
                    </div>
                    <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                      {report.whatNeedsWork}
                    </p>
                  </div>
                </div>

                {/* Top Priority Action */}
                <div
                  style={{
                    padding: "20px",
                    background: "#07111C",
                    border: "1px solid #1B2A38",
                    borderLeft: "4px solid #F59E0B",
                    borderRadius: "0 10px 10px 0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <Zap size={22} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ color: "#F59E0B", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                      ACTION N°1 PRIORITAIRE IMMÉDIATE :
                    </div>
                    <p style={{ fontSize: "12.5px", color: "#F1F5F9", lineHeight: 1.5, margin: 0 }}>
                      {report.topPriority}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PAGE: RECONNAISSANCE RÉSEAU & PORTS (SCAN ACTIF)
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "active-recon" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Network size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Cartographie Réseau & Empreinte Système</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Agent 1 — Ports ouverts, bannières de service, télémétrie OS & IPv6</p>
                  </div>
                </div>

                {/* OS & Network Telemetry Card */}
                <div style={{ padding: "20px", background: "#07111C", border: "1px solid #1B2A38", borderRadius: "10px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", fontFamily: "monospace", fontWeight: 700, marginBottom: "14px" }}>
                    TÉLÉMÉTRIE D&apos;INFRASTRUCTURE & EMPREINTE SYSTÈME
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    {/* OS Detection */}
                    <div style={{ padding: "14px", background: "#0B1726", borderRadius: "8px", border: "1px solid #1B2A38" }}>
                      <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "6px" }}>Système d&apos;Exploitation</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#F1F5F9" }}>
                        {report.osDetection?.os_detailed || report.osDetection?.os_family || "Linux / Unix"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#38BDF8", marginTop: "4px" }}>
                        Confiance : {report.osDetection?.confidence ?? 90}%
                      </div>
                    </div>
                    {/* TTL & Hops */}
                    <div style={{ padding: "14px", background: "#0B1726", borderRadius: "8px", border: "1px solid #1B2A38" }}>
                      <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "6px" }}>Sauts & Télémétrie IP</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#F1F5F9" }}>
                        TTL: {report.osDetection?.ttl_received ?? "N/A"} • Hops: {report.osDetection?.hops_distance ?? "N/A"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                        RTT : {report.osDetection?.rtt_ms ? `${report.osDetection.rtt_ms} ms` : "< 50 ms"}
                      </div>
                    </div>
                    {/* IPv4 / IPv6 */}
                    <div style={{ padding: "14px", background: "#0B1726", borderRadius: "8px", border: "1px solid #1B2A38" }}>
                      <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "6px" }}>Adresses IP Publiques</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F1F5F9" }}>
                        IPv4: {report.ipAddress || "Non résolu"}
                      </div>
                      <div style={{ fontSize: "11px", color: report.ipv6Address ? "#22C55E" : "#64748B", marginTop: "4px" }}>
                        IPv6: {report.ipv6Address || "Aucun enregistrement AAAA"}
                      </div>
                    </div>
                  </div>

                  {/* Web Surface */}
                  {report.webSurface?.page_title && (
                    <div style={{ padding: "10px 14px", background: "#0B1726", borderRadius: "6px", border: "1px solid #1B2A38", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#94A3B8" }}>Titre HTML : &ldquo;{report.webSurface.page_title}&rdquo;</span>
                      {report.webSurface.http_methods && report.webSurface.http_methods.length > 0 && (
                        <span style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>Méthodes : {report.webSurface.http_methods.join(", ")}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Open Ports Table */}
                <div style={{ padding: "20px", background: "#07111C", border: "1px solid #1B2A38", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", fontFamily: "monospace", fontWeight: 700, marginBottom: "14px" }}>
                    SERVICES RÉSEAU OUVERTS & BANNIÈRES ({(report.openPorts || []).length} PORT(S))
                  </div>

                  {/* Table Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "80px 120px 1fr 120px", gap: "1px", background: "#1B2A38", borderRadius: "6px 6px 0 0", overflow: "hidden" }}>
                    {["Port", "Service", "Bannière / Empreinte", "Évaluation"].map((h) => (
                      <div key={h} style={{ padding: "8px 12px", background: "#0B1726", fontSize: "10px", color: "#64748B", fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase" }}>
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Table Rows */}
                  {(report.openPorts || []).length > 0 ? (
                    (report.openPorts || []).map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "80px 120px 1fr 120px",
                          gap: "1px",
                          background: "#1B2A38",
                        }}
                      >
                        <div style={{ padding: "10px 12px", background: p.is_risky ? "rgba(239, 68, 68, 0.08)" : idx % 2 === 0 ? "#020812" : "#07111C", fontSize: "13px", fontWeight: 700, color: "#F1F5F9", fontFamily: "monospace" }}>
                          {p.port}/TCP
                        </div>
                        <div style={{ padding: "10px 12px", background: p.is_risky ? "rgba(239, 68, 68, 0.08)" : idx % 2 === 0 ? "#020812" : "#07111C", fontSize: "12px", color: "#CBD5E1" }}>
                          {p.service}
                        </div>
                        <div style={{ padding: "10px 12px", background: p.is_risky ? "rgba(239, 68, 68, 0.08)" : idx % 2 === 0 ? "#020812" : "#07111C", fontSize: "11px", color: "#94A3B8", fontFamily: "monospace", wordBreak: "break-all" }}>
                          {p.banner ? p.banner.slice(0, 100) : "TCP établie (pas de bannière)"}
                        </div>
                        <div style={{ padding: "10px 12px", background: p.is_risky ? "rgba(239, 68, 68, 0.08)" : idx % 2 === 0 ? "#020812" : "#07111C", fontSize: "11px", fontWeight: 700, color: p.is_risky ? "#EF4444" : "#22C55E", textAlign: "center" }}>
                          {p.is_risky ? "⚠ RISQUE" : "✓ OK"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "16px", textAlign: "center", fontSize: "12px", color: "#64748B", fontStyle: "italic" }}>
                      Aucun port sensible détecté sur la plage testée.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PAGE: OBSOLESCENCE LOGICIELLE & CVEs (SCAN ACTIF)
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "obsolescence" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Cpu size={22} color="#EF4444" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Dette Technique & Obsolescence EOL</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Agent 2 — Composants en fin de vie, ancienneté & CVEs critiques</p>
                  </div>
                </div>

                {/* EOL Alert Banner */}
                <div style={{ padding: "16px 20px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: "10px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#EF4444" }}>⚠ Évaluation de la Dette Technique Critique</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444", fontFamily: "monospace", padding: "3px 10px", background: "rgba(239, 68, 68, 0.15)", borderRadius: "4px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                      {(report.softwareObsolescence || []).length} COMPOSANT(S) EOL
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#F87171", lineHeight: 1.5, margin: 0 }}>
                    Les serveurs ou bibliothèques en fin de vie ne reçoivent plus de correctifs de sécurité. Toute faille découverte devient une vulnérabilité permanente (Permanent 0-Day).
                  </p>
                </div>

                {/* Obsolescence Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(report.softwareObsolescence || []).map((obs, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "18px 22px",
                        background: "#07111C",
                        border: "1px solid #1B2A38",
                        borderRadius: "10px",
                        borderLeft: "4px solid #EF4444",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontSize: "15px", fontWeight: 800, color: "#F1F5F9" }}>{obs.component}</div>
                          <div style={{ fontSize: "11px", color: "#EF4444", fontFamily: "monospace", marginTop: "2px" }}>{obs.detected_string}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "10px", padding: "3px 10px", background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", borderRadius: "4px", fontWeight: 700, fontFamily: "monospace", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                            {obs.eol_status}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ padding: "8px 12px", background: "#0B1726", borderRadius: "6px", border: "1px solid #1B2A38" }}>
                          <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Année de Sortie</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9", marginTop: "2px" }}>{obs.release_year}</div>
                        </div>
                        <div style={{ padding: "8px 12px", background: "#0B1726", borderRadius: "6px", border: "1px solid #1B2A38" }}>
                          <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Ancienneté</div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#EF4444", marginTop: "2px" }}>{obs.age_years} ans de retard</div>
                        </div>
                      </div>

                      {obs.sample_cves && obs.sample_cves.length > 0 && (
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "6px" }}>
                          <strong style={{ color: "#CBD5E1" }}>CVEs connues :</strong> {obs.sample_cves.slice(0, 4).join(", ")}
                          {obs.cve_count && obs.cve_count > 4 && <span style={{ color: "#64748B" }}> (+{obs.cve_count - 4} autres)</span>}
                        </div>
                      )}

                      <div style={{ fontSize: "11.5px", color: "#38BDF8" }}>
                        <strong>Recommandation :</strong> {obs.recommendation || "Mise à niveau impérative vers la version supportée."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PAGE: ANALYSE PAR CATÉGORIES & PILIERS
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "categories" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Layers size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Analyse Détaillée par Pilier</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Évaluation des couches techniques et écarts par rapport aux moyennes</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {report.categories.map((cat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "18px 22px",
                        background: "#07111C",
                        border: "1px solid #1B2A38",
                        borderRadius: "10px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9" }}>{cat.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: cat.score >= 75 ? "#22C55E" : cat.score >= 60 ? "#0EA5E9" : "#EF4444", fontFamily: "monospace" }}>
                            {cat.score} / {cat.maxScore}
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748B" }}>(Moyenne : {cat.globalAvg})</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: "6px", width: "100%", background: "#0B1726", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                        <div style={{ height: "100%", width: `${(cat.score / cat.maxScore) * 100}%`, background: cat.score >= 75 ? "#22C55E" : cat.score >= 60 ? "#0EA5E9" : "#EF4444", borderRadius: "3px" }} />
                      </div>

                      <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.5 }}>
                        <strong style={{ color: "#CBD5E1" }}>Constat technique :</strong> {cat.technicalReason}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#38BDF8", marginTop: "4px" }}>
                        <strong>Solution préconisée :</strong> {cat.solution} (Délai : ~{cat.estimatedTime})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PAGE: CARTOGRAPHIE DES VULNÉRABILITÉS (PREMIUM CARDS)
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "vulns" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <AlertTriangle size={22} color="#EF4444" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Cartographie des Failles</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Inventaire exhaustif des vulnérabilités classées par score CVSS</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {report.vulnerabilities.map((vuln, i) => {
                    const isCritical = vuln.severity === "critical";
                    const isHigh = vuln.severity === "high";
                    const tagColor = isCritical ? "#EF4444" : isHigh ? "#F97316" : "#EAB308";
                    const tagLabel = isCritical ? "🔴 CRITIQUE" : isHigh ? "🟠 HAUTE" : "🟡 MOYENNE";

                    return (
                      <div
                        key={i}
                        style={{
                          background: "#07111C",
                          border: "1px solid #1B2A38",
                          borderTop: `3px solid ${tagColor}`,
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Top Bar: Severity tag + CVSS score */}
                        <div
                          style={{
                            padding: "12px 18px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(11, 23, 38, 0.6)",
                            borderBottom: "1px solid #1B2A38",
                          }}
                        >
                          <span style={{ fontSize: "11px", fontWeight: 800, color: tagColor, fontFamily: "monospace" }}>
                            {tagLabel}
                          </span>
                          <span style={{ fontSize: "12px", color: tagColor, fontFamily: "monospace", fontWeight: 700 }}>
                            CVSS v3.1 : {vuln.cvss} {vuln.cve && `• ${vuln.cve}`}
                          </span>
                        </div>

                        <div style={{ padding: "18px 20px" }}>
                          {/* Vulnerability Title */}
                          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 10px 0" }}>
                            {vuln.name}
                          </h3>

                          {/* Description */}
                          <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                            {vuln.description}
                          </p>

                          {/* Scénario d'Exploitation Box */}
                          <div
                            style={{
                              padding: "12px 14px",
                              background: "#0B1726",
                              borderLeft: `3px solid ${tagColor}`,
                              borderTop: "1px solid #1B2A38",
                              borderRight: "1px solid #1B2A38",
                              borderBottom: "1px solid #1B2A38",
                              borderRadius: "0 8px 8px 0",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ fontSize: "10.5px", fontWeight: 700, color: tagColor, textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>
                              ⚠ SCÉNARIO D'EXPLOITATION
                            </div>
                            <div style={{ fontSize: "12px", color: "#CBD5E1", lineHeight: 1.45 }}>
                              {vuln.attackScenario}
                            </div>
                          </div>

                          {/* Correctif Recommandé Box */}
                          <div
                            style={{
                              padding: "12px 14px",
                              background: "#0B1726",
                              borderLeft: "3px solid #0EA5E9",
                              borderTop: "1px solid #1B2A38",
                              borderRight: "1px solid #1B2A38",
                              borderBottom: "1px solid #1B2A38",
                              borderRadius: "0 8px 8px 0",
                              marginBottom: "16px",
                            }}
                          >
                            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#0EA5E9", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>
                              ✓ CORRECTIF RECOMMANDÉ
                            </div>
                            <div style={{ fontSize: "12px", color: "#38BDF8", lineHeight: 1.45 }}>
                              {vuln.fix}
                            </div>
                          </div>

                          {/* Footer Meta Grid */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingTop: "12px",
                              borderTop: "1px solid #1B2A38",
                              fontSize: "11px",
                            }}
                          >
                            <div style={{ color: "#94A3B8" }}>
                              RESPONSABLE : <strong style={{ color: "#F1F5F9" }}>{vuln.responsible}</strong>
                            </div>
                            <div style={{ color: "#94A3B8" }}>
                              ESTIMATION : <strong style={{ color: "#38BDF8" }}>~{vuln.estimatedTime}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PLAN D'ACTION & SNIPPETS DE CODE
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "action" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Code size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Plan d&apos;Action & Correctifs Code</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>
                      {report.remediationRoadmap?.length ? "Feuille de route priorisée et commandes exécutables immédiates" : "Directives prêtes à déployer sur serveurs web et configurations"}
                    </p>
                  </div>
                </div>

                {report.remediationRoadmap && report.remediationRoadmap.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {report.remediationRoadmap.map((step) => (
                      <div
                        key={step.step_number}
                        style={{
                          padding: "18px",
                          background: "#07111C",
                          border: "1px solid #1B2A38",
                          borderLeft: step.severity === "critical" ? "4px solid #EF4444" : "4px solid #0EA5E9",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9" }}>
                            Étape {step.step_number} : {step.title}
                          </span>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {step.estimated_score_gain > 0 && (
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#10B981", background: "rgba(16, 185, 129, 0.12)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                                +{step.estimated_score_gain} pts
                              </span>
                            )}
                            <span style={{ fontSize: "10px", fontWeight: 800, color: step.severity === "critical" ? "#EF4444" : "#F97316", textTransform: "uppercase" }}>
                              [{step.severity}]
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: "12px", color: "#94A3B8", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                          {step.description}
                        </p>
                        {step.commands && (
                          <div
                            style={{
                              background: "#020812",
                              border: "1px solid #1B2A38",
                              borderRadius: "6px",
                              padding: "12px 14px",
                              fontFamily: "monospace",
                              fontSize: "11.5px",
                              color: "#38BDF8",
                              overflowX: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {step.commands}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    {report.vulnerabilities.filter((v) => v.fixCode).map((vuln, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "18px",
                          background: "#07111C",
                          border: "1px solid #1B2A38",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#38BDF8" }}>
                            {i + 1}. Correctif : {vuln.name}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "monospace" }}>
                            Temps estimé : {vuln.estimatedTime}
                          </span>
                        </div>

                        <div
                          style={{
                            background: "#020812",
                            border: "1px solid #1B2A38",
                            borderRadius: "6px",
                            padding: "12px 14px",
                            fontFamily: "monospace",
                            fontSize: "11.5px",
                            color: "#22D3EE",
                            overflowX: "auto",
                            whiteSpace: "pre",
                          }}
                        >
                          {vuln.fixCode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                BENCHMARK NATIONAL & POSITIONNEMENT
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "benchmark" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Globe size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Benchmark & Positionnement</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Comparaison par rapport aux moyennes nationales, régionales et internationales</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                  {[
                    { title: "Score du Site Audité", score: report.score, color: gradeColor, desc: `${report.site} (${report.grade})` },
                    { title: "Moyenne Nationale Tunisie", score: report.tunisiaAvg, color: "#0EA5E9", desc: "120 domaines publics supervisés" },
                    { title: "Moyenne Régionale MENA", score: report.menaAvg, color: "#38BDF8", desc: "Indice cybersécurité régionale" },
                    { title: "Moyenne Mondiale (Gov)", score: report.globalAvg, color: "#94A3B8", desc: "Benchmark international OWASP" },
                  ].map((bench, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "22px",
                        background: "#07111C",
                        border: "1px solid #1B2A38",
                        borderTop: `3px solid ${bench.color}`,
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "8px" }}>{bench.title}</div>
                      <div style={{ fontSize: "36px", fontWeight: 800, color: bench.color, fontFamily: "monospace", lineHeight: 1 }}>
                        {bench.score}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>{bench.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                RECOMMANDATIONS IA & SCEAU OFFICIEL ANCS
                ══════════════════════════════════════════════════════════ */}
            {currentContentId === "recommendations" && (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1B2A38", paddingBottom: "12px" }}>
                  <Sparkles size={22} color="#0EA5E9" />
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Avis Stratégique IA & Certification ANCS</h2>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: "2px 0 0 0" }}>Feuille de route souveraine rédigée par l'analyste virtuel Amina AI</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                  {report.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px 20px",
                        background: "#07111C",
                        border: "1px solid #1B2A38",
                        borderLeft: "3px solid #0EA5E9",
                        borderRadius: "0 8px 8px 0",
                        fontSize: "12.5px",
                        lineHeight: 1.6,
                        color: "#E2E8F0",
                      }}
                    >
                      {rec}
                    </div>
                  ))}
                </div>

                {/* Official Stamp Box */}
                <div
                  style={{
                    padding: "24px",
                    background: "#07111C",
                    border: "1px solid #1B2A38",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#F1F5F9" }}>
                      Agence Nationale de la Cybersécurité (ANCS)
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                      Certificat d'Audit Numérique • Référence : {getDomainCryptoAttestation(report.site).fullRef}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrCodeUrl}
                        alt="ANCS QR Verification"
                        width={60}
                        height={60}
                        style={{ borderRadius: "6px", background: "#FFFFFF", padding: "3px" }}
                      />
                    ) : null}
                    <div
                      style={{
                        border: "2px solid #22C55E",
                        borderRadius: "50%",
                        width: "72px",
                        height: "72px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#22C55E",
                        fontSize: "9px",
                        fontWeight: 800,
                        textAlign: "center",
                        fontFamily: "monospace",
                        transform: "rotate(-12deg)",
                      }}
                    >
                      <span>ANCS</span>
                      <span>AUDITED</span>
                      <span>2026</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 5. Bottom Pagination Navigation (#0D1B2A) ────────────── */}
        <div
          style={{
            padding: "12px 26px",
            borderTop: "1px solid #1B2A38",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0D1B2A",
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #1B2A38",
              background: currentPage === 1 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)",
              color: currentPage === 1 ? "#475569" : "#F1F5F9",
              fontSize: "12px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={16} />
            <span>Page Précédente</span>
          </button>

          <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#94A3B8" }}>
            Page <span style={{ color: "#38BDF8", fontWeight: 700 }}>{currentPage}</span> sur {totalPages} : {pageTitles[currentPage - 1]?.title ?? ""}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #1B2A38",
              background: currentPage === totalPages ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)",
              color: currentPage === totalPages ? "#475569" : "#F1F5F9",
              fontSize: "12px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            <span>Page Suivante</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
