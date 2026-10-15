/**
 * Page Dédiée Scan Actif — Dette Technique & Obsolescence Logicielle EOL (Agent 2)
 * Direction Artistique : "Chancellerie"
 * Format A4 Strict certifié ANCS avec @react-pdf/renderer
 */
import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport } from "@/lib/report-data";

interface Props {
  report: ScanReport;
}

export default function ObsolescencePdfPage({ report }: Props) {
  const obsolescence = report.softwareObsolescence || [];

  return (
    <Page size="A4" style={styles.page}>
      {/* ── En-tête Commun ─────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerRepublic}>RÉPUBLIQUE TUNISIENNE • CYBERSCORE TN</Text>
        <Text style={styles.headerDocType}>Rapport d&apos;Audit Actif — {report.site}</Text>
        <Text style={styles.headerConfidential}>CONFIDENTIEL</Text>
      </View>

      {/* ── Titre du Chapitre ──────────────────────────────────── */}
      <View style={styles.chapterHeader}>
        <Text style={styles.chapterNumber}>DETTE TECHNIQUE — AGENT 02</Text>
        <Text style={styles.chapterTitle}>Obsolescence Logicielle, Composants en Fin de Vie (EOL) & CVEs</Text>
        <Text style={styles.chapterSubtitle}>
          Identification des technologies périmées, évaluation de l&apos;ancienneté et corrélation des vulnérabilités connues
        </Text>
      </View>

      {/* ── Alerte Dette Technique ─────────────────────────────── */}
      <View
        style={{
          borderWidth: 0.5,
          borderColor: COLORS.critical,
          padding: 8,
          marginBottom: 12,
          backgroundColor: "#FEF2F2",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.critical }}>
            Évaluation de la Dette Technique Critique (Obligation ANCS)
          </Text>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.critical, textTransform: "uppercase" }}>
            {obsolescence.length} Composant(s) EOL Détecté(s)
          </Text>
        </View>
        <Text style={{ fontFamily: "Times-Roman", fontSize: 7.2, color: COLORS.ink, lineHeight: 1.35 }}>
          L&apos;exploitation de serveurs ou de bibliothèques ayant atteint leur fin de vie commerciale (End-Of-Life) constitue une infraction aux règles de durcissement du référentiel national. Les correctifs de sécurité n&apos;étant plus publiés pour ces branches, toute faille découverte devient une vulnérabilité permanente (Permanent 0-Day).
        </Text>
      </View>

      {/* ── Tableau des Composants Obsolètes ────────────────────── */}
      <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSolid, marginBottom: 12 }}>
        {/* En-tête de Table */}
        <View style={{ flexDirection: "row", backgroundColor: "#F3F4F6", borderBottomWidth: 0.5, borderBottomColor: COLORS.ruleSolid, paddingVertical: 4, paddingHorizontal: 6 }}>
          <Text style={{ flex: 2, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Composant & Version Détectée
          </Text>
          <Text style={{ flex: 1.2, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Sortie & Ancienneté
          </Text>
          <Text style={{ flex: 1.3, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Statut Cycle de Vie
          </Text>
          <Text style={{ flex: 3.5, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Exemples de CVEs & Recommandation
          </Text>
        </View>

        {/* Lignes de Table */}
        {obsolescence.length > 0 ? (
          obsolescence.map((obs, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                paddingVertical: 5,
                paddingHorizontal: 6,
                borderBottomWidth: idx < obsolescence.length - 1 ? 0.5 : 0,
                borderBottomColor: COLORS.ruleSubtle,
                backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                alignItems: "flex-start",
              }}
              wrap={false}
            >
              {/* Composant & Empreinte */}
              <View style={{ flex: 2, paddingRight: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.ink }}>
                  {obs.component}
                </Text>
                <Text style={{ fontFamily: "Helvetica", fontSize: 6.8, color: COLORS.critical, marginTop: 1 }}>
                  {obs.detected_string}
                </Text>
              </View>

              {/* Sortie & Âge */}
              <View style={{ flex: 1.2 }}>
                <Text style={{ fontFamily: "Helvetica", fontSize: 7.5, color: COLORS.ink }}>
                  Année : {obs.release_year}
                </Text>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.2, color: COLORS.critical, marginTop: 1 }}>
                  {obs.age_years} ans de retard
                </Text>
              </View>

              {/* Statut EOL */}
              <View style={{ flex: 1.3 }}>
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 6.8,
                    color: COLORS.critical,
                    backgroundColor: "#FEE2E2",
                    paddingVertical: 1,
                    paddingHorizontal: 3,
                    textAlign: "center",
                    borderWidth: 0.5,
                    borderColor: "#FCA5A5",
                  }}
                >
                  {obs.eol_status}
                </Text>
              </View>

              {/* CVEs & Action */}
              <View style={{ flex: 3.5, paddingLeft: 4 }}>
                {obs.sample_cves && obs.sample_cves.length > 0 && (
                  <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: COLORS.inkSecondary, marginBottom: 2 }}>
                    CVEs : {obs.sample_cves.slice(0, 4).join(", ")}
                  </Text>
                )}
                <Text style={{ fontFamily: "Times-Italic", fontSize: 6.8, color: COLORS.muted }}>
                  {obs.recommendation || "Mise à niveau impérative vers la version supportée par l'éditeur."}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ padding: 8, alignItems: "center" }}>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 8, color: COLORS.muted }}>
              Aucune obsolescence logicielle critique répertoriée dans la base d&apos;empreintes.
            </Text>
          </View>
        )}
      </View>

      {/* ── Plan de Remise à Niveau d'Urgence ──────────────────── */}
      <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 6, backgroundColor: "#F8FAFC" }}>
        <Text style={{ fontFamily: "Times-Bold", fontSize: 7.5, color: COLORS.ink, marginBottom: 2 }}>
          Cadre Réglementaire (Décret Gouvernemental 2023-17) :
        </Text>
        <Text style={{ fontFamily: "Times-Roman", fontSize: 7, color: COLORS.muted, lineHeight: 1.35 }}>
          Les institutions publiques et opérateurs d&apos;importance vitale sont tenus de maintenir leurs systèmes d&apos;exploitation et serveurs web sur des branches recevant activement des correctifs du constructeur. Les serveurs identifiés comme obsolètes doivent être inclus dans le plan d&apos;actualisation prioritaire sous 30 jours ouvrés.
        </Text>
      </View>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerMeta}>AGENCE NATIONALE DE LA CYBERSÉCURITÉ • RAPPORT CERTIFIÉ • {report.site}</Text>
        <Text style={styles.footerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
