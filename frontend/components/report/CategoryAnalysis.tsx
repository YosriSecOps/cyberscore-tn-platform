/**
 * Page 3 — Category Analysis & Sovereign Certificate Audit (التحليل بالفئات والشهادات السيادية)
 * Direction Artistique : "Chancellerie"
 * Intègre l'Audit de l'Infrastructure de Clé Publique TunTrust / ANCE
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function CategoryAnalysis({ report }: Props) {
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
        <Text style={styles.chapterNumber}>CHAPITRE 02</Text>
        <Text style={styles.chapterTitle}>Analyse Détaillée par Pilier Technique & PKI Souveraine</Text>
        <Text style={styles.chapterSubtitle}>Évaluation des 6 couches d&apos;audit et conformité de l&apos;infrastructure de clé publique TunTrust</Text>
      </View>

      {/* ── Grille des 6 Catégories ────────────────────────────── */}
      <View style={{ flexDirection: "column", gap: 6 }}>
        {report.categories.map((cat, i) => {
          const isSatisfactory = cat.score >= cat.globalAvg;
          const scorePercent = (cat.score / cat.maxScore) * 100;

          return (
            <View
              key={i}
              style={{
                borderWidth: 0.5,
                borderColor: COLORS.ruleSubtle,
                padding: 6,
              }}
              wrap={false}
            >
              {/* Ligne Titre & Score */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 2 }}>
                <Text style={{ fontFamily: "Times-Bold", fontSize: 9, color: COLORS.ink }}>
                  {i + 1}. {cat.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontFamily: "Times-Bold", fontSize: 9, color: isSatisfactory ? COLORS.ink : COLORS.accentRed }}>
                    {cat.score}
                  </Text>
                  <Text style={{ fontFamily: "Times-Roman", fontSize: 7.2, color: COLORS.muted }}>
                    / {cat.maxScore} (Moy. {cat.globalAvg})
                  </Text>
                </View>
              </View>

              {/* Jauge Fine à Filet (1.5pt) */}
              <View style={{ height: 1.5, backgroundColor: COLORS.ruleLight, marginVertical: 2.5 }}>
                <View
                  style={{
                    height: 1.5,
                    width: `${Math.min(100, Math.max(5, scorePercent))}%`,
                    backgroundColor: isSatisfactory ? COLORS.ink : COLORS.accentRed,
                  }}
                />
              </View>

              {/* Constat & Prescription Technique */}
              <View style={{ marginTop: 2 }}>
                <Text style={{ fontFamily: "Times-Roman", fontSize: 7.5, color: COLORS.inkSecondary, lineHeight: 1.3 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.5, color: COLORS.caption }}>CONSTAT : </Text>
                  {cat.technicalReason}
                </Text>
                <Text style={{ fontFamily: "Times-Roman", fontSize: 7.5, color: COLORS.ink, marginTop: 1, lineHeight: 1.3 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.5, color: COLORS.accentNavy }}>PRESCRIPTION : </Text>
                  {cat.solution} <Text style={{ color: COLORS.muted }}>(Délai estimé : ~{cat.estimatedTime})</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Cartouche de Souveraineté & Autorité de Certification TunTrust (Point B) ── */}
      {report.certificateInfo && (
        <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSolid, padding: 5, marginTop: 6 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.5, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase" }}>
              AUDIT DE L&apos;INFRASTRUCTURE DE CLÉ PUBLIQUE (PKI / X.509 SOUVERAINE)
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6, color: COLORS.low }}>
              SOUVERAINETÉ TUNISIE : CONFORME
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontFamily: "Times-Roman", fontSize: 7, color: COLORS.inkSecondary, width: "55%" }}>
              <Text style={{ fontFamily: "Times-Bold", color: COLORS.ink }}>Autorité Émettrice : </Text>{report.certificateInfo.authority}
            </Text>
            <Text style={{ fontFamily: "Courier", fontSize: 6.5, color: COLORS.ink, width: "45%", textAlign: "right" }}>
              {report.certificateInfo.keyLength} • {report.certificateInfo.signatureAlgorithm}
            </Text>
          </View>
        </View>
      )}

      {/* ── Pied de Page ──────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerMeta}>CyberScore TN — Rapport d&apos;Audit Officiel • {report.site}</Text>
        <Text style={styles.footerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
