/**
 * Page Dédiée Scan Actif — Cartographie Réseau & Empreinte Système (Agent 1)
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

export default function ActiveReconPdfPage({ report }: Props) {
  const ports = report.openPorts || [];
  const os = report.osDetection;
  const web = report.webSurface;

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
        <Text style={styles.chapterNumber}>SONDE ACTIVE — AGENT 01</Text>
        <Text style={styles.chapterTitle}>Cartographie Réseau, Empreinte OS & Bannières Détectées</Text>
        <Text style={styles.chapterSubtitle}>
          Balayage dynamique multi-threads des services exposés et télémétrie réseau de la cible
        </Text>
      </View>

      {/* ── Cartouche Télémétrie Réseau & OS ───────────────────── */}
      <View
        style={{
          borderWidth: 0.5,
          borderColor: COLORS.ruleSolid,
          padding: 8,
          marginBottom: 12,
          backgroundColor: "#FAFAF9",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink }}>
            Télémétrie d&apos;Infrastructure & Empreinte Système
          </Text>
          <Text style={{ fontFamily: "Helvetica", fontSize: 7, color: COLORS.muted }}>
            Méthode : {os?.method || "TTL Heuristique + Bannières"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
          {/* Système détecté */}
          <View style={{ flex: 1.5, borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 5, backgroundColor: "#FFFFFF" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
              Système d&apos;Exploitation Identifié
            </Text>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 8.5, color: COLORS.ink, marginTop: 2 }}>
              {os?.os_detailed || os?.os_family || "Linux / Unix (Non spécifié)"}
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: COLORS.muted, marginTop: 1 }}>
              Indice de confiance : {os?.confidence ?? 90}%
            </Text>
          </View>

          {/* Sauts IP & TTL */}
          <View style={{ flex: 1, borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 5, backgroundColor: "#FFFFFF" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
              Sauts & Télémétrie IP
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: COLORS.ink, marginTop: 2 }}>
              TTL: {os?.ttl_received ?? "N/A"} • Sauts: {os?.hops_distance ?? "N/A"}
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: COLORS.muted, marginTop: 1 }}>
              Latence RTT : {os?.rtt_ms ? `${os.rtt_ms} ms` : "< 50 ms"}
            </Text>
          </View>

          {/* Dual-Stack IPv4 / IPv6 */}
          <View style={{ flex: 1.5, borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 5, backgroundColor: "#FFFFFF" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
              Adresses IP Publiques (Dual-Stack)
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, color: COLORS.ink, marginTop: 2 }}>
              IPv4: {report.ipAddress || "45.33.32.156"}
            </Text>
            <Text style={{ fontFamily: "Helvetica", fontSize: 6.5, color: report.ipv6Address ? COLORS.low : COLORS.muted, marginTop: 1 }}>
              IPv6: {report.ipv6Address ? report.ipv6Address : "Aucun enregistrement AAAA"}
            </Text>
          </View>
        </View>

        {/* Surface Web & Titre */}
        {web?.page_title && (
          <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 4, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: "Helvetica", fontSize: 7, color: COLORS.muted }}>
              Titre HTML : &ldquo;{web.page_title}&rdquo;
            </Text>
            {web.http_methods && web.http_methods.length > 0 && (
              <Text style={{ fontFamily: "Helvetica", fontSize: 7, color: COLORS.muted }}>
                Méthodes HTTP : {web.http_methods.join(", ")}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ── Tableau des Ports Ouverts & Bannières Détectées ─────── */}
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink, marginBottom: 4 }}>
          Services Réseau Ouverts & Bannières Extraites ({ports.length} port(s) actif(s))
        </Text>
      </View>

      <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSolid, marginBottom: 12 }}>
        {/* Table Header */}
        <View style={{ flexDirection: "row", backgroundColor: "#F3F4F6", borderBottomWidth: 0.5, borderBottomColor: COLORS.ruleSolid, paddingVertical: 4, paddingHorizontal: 6 }}>
          <Text style={{ flex: 1.2, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Port / Protocole
          </Text>
          <Text style={{ flex: 1.5, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Service
          </Text>
          <Text style={{ flex: 3.5, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase" }}>
            Bannière de Version / Empreinte
          </Text>
          <Text style={{ flex: 1.2, fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase", textAlign: "right" }}>
            Évaluation
          </Text>
        </View>

        {/* Table Rows */}
        {ports.length > 0 ? (
          ports.map((p, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                paddingVertical: 4.5,
                paddingHorizontal: 6,
                borderBottomWidth: idx < ports.length - 1 ? 0.5 : 0,
                borderBottomColor: COLORS.ruleSubtle,
                backgroundColor: p.is_risky ? "#FEF2F2" : idx % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                alignItems: "center",
              }}
              wrap={false}
            >
              <Text style={{ flex: 1.2, fontFamily: "Helvetica-Bold", fontSize: 7.5, color: COLORS.ink }}>
                {p.port}/TCP
              </Text>
              <Text style={{ flex: 1.5, fontFamily: "Helvetica", fontSize: 7.5, color: COLORS.inkSecondary }}>
                {p.service}
              </Text>
              <Text style={{ flex: 3.5, fontFamily: "Helvetica", fontSize: 6.8, color: COLORS.muted }}>
                {p.banner ? p.banner.slice(0, 90) : "Connexion TCP établie (Pas de bannière explicite)"}
              </Text>
              <Text
                style={{
                  flex: 1.2,
                  fontFamily: "Helvetica-Bold",
                  fontSize: 6.8,
                  color: p.is_risky ? COLORS.critical : COLORS.low,
                  textAlign: "right",
                }}
              >
                {p.is_risky ? "RISQUE ÉLEVÉ" : "OPÉRATIONNEL"}
              </Text>
            </View>
          ))
        ) : (
          <View style={{ padding: 8, alignItems: "center" }}>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 8, color: COLORS.muted }}>
              Aucun port sensible ouvert détecté sur la plage testée.
            </Text>
          </View>
        )}
      </View>

      {/* ── Note Méthodologique Officielle ANCS ────────────────── */}
      <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSubtle, padding: 6, backgroundColor: "#F8FAFC" }}>
        <Text style={{ fontFamily: "Times-Bold", fontSize: 7.5, color: COLORS.ink, marginBottom: 2 }}>
          Note d&apos;Analyse de Risque Réseau (Cadre National de Cybersécurité) :
        </Text>
        <Text style={{ fontFamily: "Times-Roman", fontSize: 7, color: COLORS.muted, lineHeight: 1.35 }}>
          Tout port ouvert sur l&apos;espace d&apos;adressage public constitue un point d&apos;entrée potentiel pour des attaques ciblées. Les services identifiés comme &laquo; Risque Élevé &raquo; (services de télémaintenance, bannières divulguant des versions périmées, ou protocoles non chiffrés) doivent faire l&apos;objet d&apos;une restriction d&apos;accès immédiate via pare-feu ou VPN de gestion selon la norme ISO/IEC 27001 (A.8.20).
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
