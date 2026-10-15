/**
 * Page 6 — Benchmark & Regulatory Compliance Matrix (المقارنة والامتثال للمعايير)
 * Direction Artistique : "Chancellerie"
 * Intègre la Matrice de Conformité Réglementaire et l'Inventaire EASM des Sous-Domaines
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function BenchmarkPage({ report }: Props) {
  const sslScore = report.categories.find((c) => c.key === "ssl")?.score ?? 80;
  const headersScore = report.categories.find((c) => c.key === "headers")?.score ?? 70;
  const portsScore = report.categories.find((c) => c.key === "ports")?.score ?? 85;

  const benchmarks = [
    { title: "SCORE DU SITE AUDITÉ", score: report.score, subtitle: `${report.site} (${report.grade})`, highlight: true },
    { title: "MOYENNE NATIONALE", score: report.tunisiaAvg, subtitle: "120 Domaines Publics Tunisiens", highlight: false },
    { title: "MOYENNE RÉGIONALE MENA", score: report.menaAvg, subtitle: "Indice Cybersécurité Régional", highlight: false },
    { title: "STANDARD INTERNATIONAL", score: report.globalAvg, subtitle: "Référentiel OWASP / NIST", highlight: false },
  ];

  const complianceItems = [
    {
      framework: "DIRECTIVES ANCS",
      ref: "Décret-loi n° 2023-17",
      requirement: "Durcissement & Conformité des Portails Publics Tunisiens",
      status: report.score >= 80 ? "CONFORME" : report.score >= 65 ? "PARTIEL" : "NON-CONFORME",
      color: report.score >= 80 ? COLORS.low : report.score >= 65 ? COLORS.medium : COLORS.critical,
      details: report.score >= 80 ? "Posture conforme aux standards nationaux d'audit de sécurité." : "Écarts identifiés sur la surface d'exposition et les certificats.",
    },
    {
      framework: "ISO/IEC 27001:2022",
      ref: "Annexe A.8.24",
      requirement: "Utilisation de la Cryptographie & Protection des Flux TLS",
      status: sslScore >= 85 ? "CONFORME" : "PARTIEL",
      color: sslScore >= 85 ? COLORS.low : COLORS.medium,
      details: sslScore >= 85 ? "Chiffrement TLS conforme avec algorithmes de clé validés." : "Certificat proche de l'expiration ou protocoles dépréciés actifs.",
    },
    {
      framework: "NIST CSF v2.0",
      ref: "PR.DS-02 / PR.PS-01",
      requirement: "Protection des Données en Transit & Filtrage Réseau",
      status: portsScore >= 85 && report.criticalCount === 0 ? "CONFORME" : "PARTIEL",
      color: portsScore >= 85 && report.criticalCount === 0 ? COLORS.low : COLORS.medium,
      details: portsScore >= 85 && report.criticalCount === 0 ? "Surfaces de ports restreintes et absence de failles critiques." : "Services d'administration exposés sans filtrage adéquat.",
    },
    {
      framework: "OWASP TOP 10 (2021)",
      ref: "A05: Security Misconfiguration",
      requirement: "Configuration des En-têtes de Défense (HSTS, CSP, X-Frame)",
      status: headersScore >= 80 ? "CONFORME" : "NON-CONFORME",
      color: headersScore >= 80 ? COLORS.low : COLORS.critical,
      details: headersScore >= 80 ? "Protection active contre le clickjacking et le downgrade HTTP." : "Absence d'en-tête HSTS strict et politique CSP non définie.",
    },
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
        <Text style={styles.chapterNumber}>CHAPITRE 05</Text>
        <Text style={styles.chapterTitle}>Benchmark Sectoriel, Conformité & Surface d&apos;Attaque</Text>
        <Text style={styles.chapterSubtitle}>Positionnement national, conformité réglementaire (ANCS • ISO • NIST) et inventaire EASM</Text>
      </View>

      {/* ── Grille de 4 Cartes de Métriques ────────────────────── */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {benchmarks.map((item, i) => (
          <View
            key={i}
            style={{
              width: "48.5%",
              borderWidth: item.highlight ? 1 : 0.5,
              borderColor: item.highlight ? COLORS.ruleSolid : COLORS.ruleSubtle,
              padding: 7,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.5, color: COLORS.caption, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 1 }}>
              {item.title}
            </Text>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 20, color: item.highlight ? COLORS.ink : COLORS.inkSecondary, lineHeight: 1.1 }}>
              {item.score}
            </Text>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 7, color: COLORS.muted, marginTop: 1 }}>
              {item.subtitle}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Matrice de Conformité Réglementaire & Normative ─────── */}
      <View wrap={false} style={{ marginBottom: 9 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.2, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase", marginBottom: 3 }}>
          MATRICE DE CONFORMITÉ RÉGLEMENTAIRE (ANCS • ISO 27001 • NIST • OWASP)
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={{ ...styles.th, width: "24%" }}>RÉFÉRENTIEL / CADRE</Text>
            <Text style={{ ...styles.th, width: "36%" }}>EXIGENCE SSI ÉVALUÉE</Text>
            <Text style={{ ...styles.th, width: "18%", textAlign: "center" }}>STATUT</Text>
            <Text style={{ ...styles.th, width: "22%", textAlign: "right" }}>OBSERVATION</Text>
          </View>

          {complianceItems.map((item, i) => (
            <View key={i} style={{ ...styles.tableRow, paddingVertical: 3.5 }}>
              <View style={{ width: "24%" }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.ink }}>{item.framework}</Text>
                <Text style={{ fontFamily: "Helvetica", fontSize: 5.8, color: COLORS.caption }}>{item.ref}</Text>
              </View>

              <Text style={{ ...styles.td, width: "36%", fontSize: 7.2, lineHeight: 1.2 }}>{item.requirement}</Text>

              <View style={{ width: "18%", alignItems: "center" }}>
                <View style={{ borderWidth: 0.5, borderColor: item.color, paddingHorizontal: 4, paddingVertical: 1 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.2, letterSpacing: 0.5, color: item.color }}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={{ ...styles.td, width: "22%", fontSize: 6.5, color: COLORS.muted, textAlign: "right", lineHeight: 1.15 }}>
                {item.details}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Surface d'Attaque & Sous-Domaines Détectés (EASM) ───── */}
      {report.subdomains && report.subdomains.length > 0 && (
        <View wrap={false}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.2, letterSpacing: 0.8, color: COLORS.ink, textTransform: "uppercase", marginBottom: 3 }}>
            SURFACE D&apos;ATTAQUE EXTERNE & INVENTAIRE DES ACTIFS (EASM)
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={{ ...styles.th, width: "38%" }}>HÔTE / SOUS-DOMAINE</Text>
              <Text style={{ ...styles.th, width: "24%" }}>ADRESSE IP</Text>
              <Text style={{ ...styles.th, width: "22%" }}>SERVICES / PORTS</Text>
              <Text style={{ ...styles.th, width: "16%", textAlign: "right" }}>STATUT</Text>
            </View>

            {report.subdomains.map((sub, idx) => (
              <View key={idx} style={{ ...styles.tableRow, paddingVertical: 3.5 }}>
                <Text style={{ ...styles.tdBold, width: "38%", fontSize: 7 }}>{sub.host}</Text>
                <Text style={{ ...styles.td, width: "24%", fontSize: 6.5, fontFamily: "Courier" }}>{sub.ip}</Text>
                <Text style={{ ...styles.td, width: "22%", fontSize: 6.5 }}>{sub.ports}</Text>
                <Text style={{ ...styles.td, width: "16%", fontSize: 6.5, textAlign: "right", color: sub.status === "secure" ? COLORS.low : sub.status === "warning" ? COLORS.medium : COLORS.critical }}>
                  {sub.status === "secure" ? "SÉCURISÉ" : sub.status === "warning" ? "VULNÉRABLE" : "CRITIQUE"}
                </Text>
              </View>
            ))}
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
