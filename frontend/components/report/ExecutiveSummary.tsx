/**
 * Page 2 — Executive Summary (الملخص التنفيذي)
 * Direction Artistique : "Chancellerie"
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function ExecutiveSummary({ report }: Props) {
  const severities = [
    { label: "CRITIQUE", count: report.criticalCount, priority: "Immédiate (< 24h)", color: COLORS.critical },
    { label: "HAUTE", count: report.highCount, priority: "Prioritaire (Sous 7 jours)", color: COLORS.high },
    { label: "MOYENNE", count: report.mediumCount, priority: "Planifiée (Sous 30 jours)", color: COLORS.medium },
    { label: "FAIBLE", count: report.lowCount, priority: "Maintenance courante", color: COLORS.low },
  ];

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
        <Text style={styles.chapterNumber}>CHAPITRE 01</Text>
        <Text style={styles.chapterTitle}>Synthèse Exécutive & Matrice de Risque</Text>
        <Text style={styles.chapterSubtitle}>Vue d&apos;ensemble stratégique et priorités d&apos;action pour la direction</Text>
      </View>

      {/* ── Cartouche de Synthèse Décisionnelle ────────────────── */}
      <View style={styles.quoteBox}>
        <Text style={{ fontFamily: "Times-Italic", fontSize: 9.5, lineHeight: 1.55, color: COLORS.ink }}>
          « {report.summaryPhrase} »
        </Text>
      </View>

      {/* ── Matrice des Risques Détectés (Tableau à Filets Nets) ─ */}
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase", marginBottom: 6 }}>
        TABLEAU DE SYNTHÈSE DES NIVEAUX DE RISQUE
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={{ ...styles.th, width: "30%" }}>NIVEAU DE SÉVÉRITÉ</Text>
          <Text style={{ ...styles.th, width: "25%", textAlign: "center" }}>ANOMALIES DÉTECTÉES</Text>
          <Text style={{ ...styles.th, width: "45%" }}>DÉLAI D&apos;ACTION RECOMMANDÉ</Text>
        </View>

        {severities.map((s, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={{ width: "30%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.8, color: s.color, letterSpacing: 0.5 }}>
                {s.label}
              </Text>
            </View>
            <Text style={{ ...styles.tdBold, width: "25%", textAlign: "center", fontSize: 10 }}>
              {s.count}
            </Text>
            <Text style={{ ...styles.td, width: "45%" }}>
              {s.priority}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Grille Forces vs Faiblesses (Deux Cadres à Filet Plein) ─ */}
      <View style={{ flexDirection: "row", gap: 12, marginVertical: 8 }}>
        {/* Points Forts */}
        <View style={{ flex: 1, borderWidth: 0.5, borderColor: COLORS.ruleSubtle, borderLeftWidth: 2, borderLeftColor: COLORS.low, padding: 10 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.6, color: COLORS.low, textTransform: "uppercase", marginBottom: 4 }}>
            POINTS FORTS VALIDÉS
          </Text>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 8.5, color: COLORS.inkSecondary, lineHeight: 1.45 }}>
            {report.whatWorksWell}
          </Text>
        </View>

        {/* Faiblesses */}
        <View style={{ flex: 1, borderWidth: 0.5, borderColor: COLORS.ruleSubtle, borderLeftWidth: 2, borderLeftColor: COLORS.critical, padding: 10 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.6, color: COLORS.critical, textTransform: "uppercase", marginBottom: 4 }}>
            FAIBLESSES CRITIQUES
          </Text>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 8.5, color: COLORS.inkSecondary, lineHeight: 1.45 }}>
            {report.whatNeedsWork}
          </Text>
        </View>
      </View>

      {/* ── Action N°1 Prioritaire Immédiate ───────────────────── */}
      <View style={{ borderWidth: 1, borderColor: COLORS.ruleSolid, borderLeftWidth: 3, borderLeftColor: COLORS.accentRed, padding: 12, marginTop: 8 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 1, color: COLORS.accentRed, textTransform: "uppercase", marginBottom: 3 }}>
          MESURE D&apos;URGENCE N°1 RECOMMANDÉE PAR LE SYSTÈME
        </Text>
        <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink, lineHeight: 1.45 }}>
          {report.topPriority}
        </Text>
      </View>

      {/* ── Pied de Page ──────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerMeta}>CyberScore TN — Rapport d&apos;Audit Officiel • {report.site}</Text>
        <Text style={styles.footerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
