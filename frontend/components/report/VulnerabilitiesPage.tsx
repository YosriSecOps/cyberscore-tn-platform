/**
 * Page 4 — Vulnerabilities & Raw Evidence (التقرير التفصيلي للثغرات والأدلة الفنية)
 * Direction Artistique : "Chancellerie"
 * Intègre les Preuves Techniques Brutes (Evidence Capture)
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function VulnerabilitiesPage({ report }: Props) {
  const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...report.vulnerabilities].sort((a, b) => (order[a.severity] ?? 99) - (order[b.severity] ?? 99));

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
        <Text style={styles.chapterNumber}>CHAPITRE 03</Text>
        <Text style={styles.chapterTitle}>Cartographie des Vulnérabilités & Preuves d&apos;Audit</Text>
        <Text style={styles.chapterSubtitle}>
          Inventaire exhaustif des {sorted.length} vulnérabilités, scénarios d&apos;exploitation et preuves techniques capturées (CVSS v3.1)
        </Text>
      </View>

      {/* ── Liste des Vulnérabilités (wrap={false} par carte) ───── */}
      <View style={{ flexDirection: "column", gap: 8 }}>
        {sorted.map((vuln, i) => {
          const isCritical = vuln.severity === "critical";
          const isHigh = vuln.severity === "high";
          const sevColor = isCritical ? COLORS.critical : isHigh ? COLORS.high : COLORS.medium;
          const sevLabel = isCritical ? "CRITIQUE" : isHigh ? "HAUTE" : "MOYENNE";

          return (
            <View
              key={i}
              style={{
                borderWidth: 1,
                borderColor: COLORS.ruleSolid,
                padding: 8,
                backgroundColor: COLORS.paper,
              }}
              wrap={false}
            >
              {/* En-tête de carte : Sévérité & CVSS */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: COLORS.ruleSubtle, marginBottom: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ borderWidth: 0.5, borderColor: sevColor, paddingHorizontal: 4, paddingVertical: 1 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.5, letterSpacing: 0.6, color: sevColor }}>
                      {sevLabel}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: "Helvetica", fontSize: 6.8, color: COLORS.caption, letterSpacing: 0.4 }}>
                    RÉF. {vuln.category.toUpperCase()} {vuln.cve ? `• ${vuln.cve}` : ""}
                  </Text>
                </View>

                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, color: sevColor }}>
                  CVSS v3.1 : {vuln.cvss} / 10
                </Text>
              </View>

              {/* Titre & Description */}
              <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink, marginBottom: 2 }}>
                {vuln.name}
              </Text>
              <Text style={{ fontFamily: "Times-Roman", fontSize: 7.8, color: COLORS.inkSecondary, lineHeight: 1.3, marginBottom: 4 }}>
                {vuln.description}
              </Text>

              {/* Scénario d'Exploitation (Filet Gauche Fin) */}
              <View style={{ borderLeftWidth: 1.5, borderLeftColor: sevColor, paddingLeft: 6, marginVertical: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.2, color: sevColor, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  SCÉNARIO D&apos;EXPLOITATION POTENTIEL :
                </Text>
                <Text style={{ fontFamily: "Times-Italic", fontSize: 7.5, color: COLORS.ink, lineHeight: 1.3, marginTop: 1 }}>
                  {vuln.attackScenario}
                </Text>
              </View>

              {/* Preuve Technique Brute (Evidence Capture) */}
              {vuln.evidence && (
                <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSubtle, backgroundColor: "#F5EFE6", padding: 4, marginVertical: 3 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 5.8, color: COLORS.caption, letterSpacing: 0.5, marginBottom: 1 }}>
                    PREUVE TECHNIQUE CAPTURÉE EN DIRECT (EVIDENCE D&apos;AUDIT) :
                  </Text>
                  <Text style={{ fontFamily: "Courier", fontSize: 6.5, color: COLORS.ink, lineHeight: 1.25 }}>
                    {vuln.evidence}
                  </Text>
                </View>
              )}

              {/* Correctif Recommandé */}
              <View style={{ borderLeftWidth: 1.5, borderLeftColor: COLORS.ink, paddingLeft: 6, marginVertical: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.2, color: COLORS.ink, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  MESURE CORRECTIVE :
                </Text>
                <Text style={{ fontFamily: "Times-Roman", fontSize: 7.5, color: COLORS.ink, lineHeight: 1.3, marginTop: 1 }}>
                  {vuln.fix}
                </Text>
              </View>

              {/* Pied de Carte : Métadonnées de Remédiation */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: COLORS.ruleSubtle, paddingTop: 3, marginTop: 3 }}>
                <Text style={{ fontFamily: "Helvetica", fontSize: 6.2, color: COLORS.caption }}>
                  RESPONSABLE : <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.ink }}>{vuln.responsible.toUpperCase()}</Text>
                </Text>
                <Text style={{ fontFamily: "Helvetica", fontSize: 6.2, color: COLORS.caption }}>
                  DÉLAI ESTIMÉ : <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.ink }}>~{vuln.estimatedTime}</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Pied de Page ──────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerMeta}>CyberScore TN — Rapport d&apos;Audit Officiel • {report.site}</Text>
        <Text style={styles.footerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
