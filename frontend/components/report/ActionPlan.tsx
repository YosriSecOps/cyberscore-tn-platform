/**
 * Page 5 — Action Plan & Code Directives (خطة العمل المقترحة)
 * Direction Artistique : "Chancellerie"
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function ActionPlan({ report }: Props) {
  const codeVulns = report.vulnerabilities.filter((v) => v.fixCode);

  return (
    <Page size="A4" style={styles.page}>
      {/* ── En-tête Commun ─────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerRepublic}>RÉPUBLIQUE TUNISIENNE • CYBERSCORE TN</Text>
        <Text style={styles.headerDocType}>Rapport d&apos;Audit — {report.site}</Text>
        <Text style={styles.headerConfidential}>CONFIDENTIEL</Text>
      </View>

      {/* ── Titre du Chapitre ──────────────────────────────────── */}
      <View style={styles.chapterHeader}>
        <Text style={styles.chapterNumber}>CHAPITRE 04</Text>
        <Text style={styles.chapterTitle}>Plan de Remédiation & Directives de Configuration</Text>
        <Text style={styles.chapterSubtitle}>Snippets de code et paramètres à déployer directement sur les serveurs</Text>
      </View>

      {/* ── Liste des Directives Techniques (Roadmap Active ou Snippets Classiques) ── */}
      <View style={{ flexDirection: "column", gap: 8 }}>
        {report.remediationRoadmap && report.remediationRoadmap.length > 0 ? (
          report.remediationRoadmap.slice(0, 4).map((step, i) => (
            <View
              key={i}
              style={{
                borderWidth: 0.5,
                borderColor: COLORS.ruleSolid,
                padding: 7,
                backgroundColor: step.severity === "critical" ? "#FEF2F2" : "#FAFAF9",
              }}
              wrap={false}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <Text style={{ fontFamily: "Times-Bold", fontSize: 8.5, color: COLORS.ink }}>
                  Étape {step.step_number} : {step.title}
                </Text>
                <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                  {step.estimated_score_gain > 0 && (
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.8, color: COLORS.low }}>
                      +{step.estimated_score_gain} pts
                    </Text>
                  )}
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontSize: 6.5,
                      color: step.severity === "critical" ? COLORS.critical : COLORS.high,
                      textTransform: "uppercase",
                    }}
                  >
                    [{step.severity}]
                  </Text>
                </View>
              </View>

              <Text style={{ fontFamily: "Times-Roman", fontSize: 7.2, color: COLORS.inkSecondary, marginBottom: 3 }}>
                {step.description}
              </Text>

              {/* Commandes CLI Exécutables */}
              {step.commands && (
                <View style={{ ...styles.codeBlock, padding: 4, backgroundColor: "#0F172A" }}>
                  <Text style={{ fontFamily: "Courier", fontSize: 6.5, color: "#38BDF8" }}>
                    {step.commands}
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          codeVulns.map((vuln, i) => (
            <View
              key={i}
              style={{
                borderWidth: 0.5,
                borderColor: COLORS.ruleSolid,
                padding: 9,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink }}>
                  {i + 1}. Directive Technique : {vuln.name}
                </Text>
                <Text style={{ fontFamily: "Helvetica", fontSize: 6.8, color: COLORS.caption }}>
                  CIBLE : {vuln.responsible.toUpperCase()}
                </Text>
              </View>

              <Text style={{ fontFamily: "Times-Roman", fontSize: 7.8, color: COLORS.inkSecondary, marginBottom: 4 }}>
                {vuln.fix}
              </Text>

              {/* Snippet Code Box */}
              <View style={styles.codeBlock}>
                <Text>{vuln.fixCode}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ── Table de Contrôle de Déploiement ───────────────────── */}
      <View style={{ marginTop: 10 }} wrap={false}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase", marginBottom: 4 }}>
          GRILLE DE SUIVI & DE VALIDATION DES CORRECTIFS
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={{ ...styles.th, width: "10%", textAlign: "center" }}>ÉTAT</Text>
            <Text style={{ ...styles.th, width: "50%" }}>ACTION DE SÉCURISATION</Text>
            <Text style={{ ...styles.th, width: "25%" }}>RESPONSABLE</Text>
            <Text style={{ ...styles.th, width: "15%", textAlign: "right" }}>DÉLAI</Text>
          </View>

          {report.vulnerabilities.slice(0, 4).map((v, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={{ ...styles.td, width: "10%", textAlign: "center", fontFamily: "Courier" }}>[  ]</Text>
              <Text style={{ ...styles.tdBold, width: "50%" }}>{v.name}</Text>
              <Text style={{ ...styles.td, width: "25%", color: COLORS.muted }}>{v.responsible}</Text>
              <Text style={{ ...styles.td, width: "15%", textAlign: "right", color: COLORS.muted }}>{v.estimatedTime}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Pied de Page ──────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerMeta}>CyberScore TN — Rapport d&apos;Audit Officiel • {report.site}</Text>
        <Text style={styles.footerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
