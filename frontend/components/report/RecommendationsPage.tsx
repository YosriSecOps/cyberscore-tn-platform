/**
 * Page 7 — Strategic Recommendations & Cryptographic Attestation (التوصيات والاستشهاد)
 * Direction Artistique : "Chancellerie"
 * Empreinte SHA-256 & Vérification d'Authenticité
 */
import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";
import { getDomainCryptoAttestation } from "@/lib/crypto-attestation";

interface Props {
  report: ScanReport;
  qrCodeUrl?: string;
}

export default function RecommendationsPage({ report, qrCodeUrl }: Props) {
  const { fullRef: auditRef, sha256Hash, domain } = getDomainCryptoAttestation(report.site);

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
        <Text style={styles.chapterNumber}>CHAPITRE 06</Text>
        <Text style={styles.chapterTitle}>Avis Stratégique & Attestation d&apos;Évaluation</Text>
        <Text style={styles.chapterSubtitle}>Recommandations de gouvernance SSI et certification d&apos;intégrité numérique</Text>
      </View>

      {/* ── Recommandations Stratégiques (Amina AI) ────────────── */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase", marginBottom: 6 }}>
          ORIENTATIONS DE GOUVERNANCE SSI
        </Text>

        {report.recommendations.map((rec, i) => (
          <View key={i} style={{ marginBottom: 6, paddingBottom: 5, borderBottomWidth: i < report.recommendations.length - 1 ? 0.5 : 0, borderBottomColor: COLORS.ruleSubtle }}>
            <Text style={{ fontFamily: "Times-Roman", fontSize: 8.2, lineHeight: 1.4, color: COLORS.inkSecondary, textAlign: "justify" }}>
              <Text style={{ fontFamily: "Times-Bold", color: COLORS.ink }}>{i + 1}. </Text>
              {rec}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Cartouche Formel d'Attestation d'Audit Numérique ───── */}
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.ruleSolid,
          padding: 10,
          marginTop: "auto",
        }}
        wrap={false}
      >
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.ruleSubtle, paddingBottom: 5, marginBottom: 7, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.8, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase" }}>
              ATTESTATION D&apos;ÉVALUATION TECHNIQUE AUTOMATISÉE
            </Text>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 7.2, color: COLORS.muted }}>
              Plateforme Nationale CyberScore TN — Audit d&apos;infrastructure souveraine
            </Text>
          </View>
          <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSolid, paddingHorizontal: 5, paddingVertical: 1.5 }}>
            <Text style={{ fontFamily: "Courier", fontSize: 7.5, color: COLORS.ink }}>
              {auditRef}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ width: "48%" }}>
            <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: COLORS.caption, textTransform: "uppercase" }}>
              SYSTÈME ÉVALUATEUR
            </Text>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 8.5, color: COLORS.ink, marginTop: 1 }}>
              CyberScore TN Engine v3.4
            </Text>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 7, color: COLORS.muted }}>
              Moteur d&apos;inspection non-intrusif (Black-Box)
            </Text>
          </View>

          <View style={{ width: "48%" }}>
            <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: COLORS.caption, textTransform: "uppercase" }}>
              ASSISTANCE IA D&apos;AUDIT
            </Text>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 8.5, color: COLORS.ink, marginTop: 1 }}>
              Amina AI
            </Text>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 7, color: COLORS.muted }}>
              Synthèse & Analyse Prédictive
            </Text>
          </View>
        </View>

        {/* Empreinte Cryptographique SHA-256 de Session & Code QR */}
        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: COLORS.ruleSubtle,
            paddingTop: 5,
            marginBottom: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {qrCodeUrl ? (
            <Image src={qrCodeUrl} style={{ width: 38, height: 38, marginRight: 8 }} />
          ) : null}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.2, color: COLORS.caption, letterSpacing: 0.5 }}>
                EMPREINTE DE SESSION (SHA-256) :
              </Text>
              <Text style={{ fontFamily: "Helvetica", fontSize: 6, color: COLORS.accentRed }}>
                TLP:AMBER+STRICT
              </Text>
            </View>
            <Text style={{ fontFamily: "Courier", fontSize: 6.2, color: COLORS.muted, marginTop: 1.5 }}>
              {sha256Hash}
            </Text>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 6.2, color: COLORS.caption, marginTop: 1.5 }}>
              Scannez ce QR Code pour vérifier l&apos;intégrité numérique du rapport : https://cyberscore.tn/verify/{domain}
            </Text>
          </View>
        </View>

        {/* Clause de réserve formelle & URL de vérification */}
        <View style={{ borderTopWidth: 0.5, borderTopColor: COLORS.ruleSubtle, paddingTop: 4 }}>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 6.8, color: COLORS.caption, lineHeight: 1.3, textAlign: "justify" }}>
            Ce rapport technique reflète l&apos;état observable du système à la date d&apos;exécution ({report.scanDate}). L&apos;authenticité de ce document peut être vérifiée auprès du centre national via la référence {auditRef}.
          </Text>
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
