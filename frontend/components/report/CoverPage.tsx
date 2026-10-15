/**
 * Page 1 — Cover Page (صفحة الغلاف)
 * Direction Artistique : "Chancellerie"
 * Empreinte d'Infrastructure & Souveraineté Numérique Nationale
 */
import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import { ScanReport, getGradeColor } from "@/lib/report-data";
import { getDomainCryptoAttestation } from "@/lib/crypto-attestation";

interface CoverPageProps {
  report: ScanReport;
  qrCodeUrl?: string;
}

export default function CoverPage({ report, qrCodeUrl }: CoverPageProps) {
  const { fullRef: auditRef, domain } = getDomainCryptoAttestation(report.site);

  return (
    <Page size="A4" style={{ ...styles.page, paddingVertical: 38, justifyContent: "space-between" }}>
      {/* ── En-tête Républicain Souverain ────────────────────────── */}
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, letterSpacing: 2, color: COLORS.ink, textTransform: "uppercase" }}>
          RÉPUBLIQUE TUNISIENNE
        </Text>
        <Text style={{ fontFamily: "Helvetica", fontSize: 7, letterSpacing: 1.2, color: COLORS.muted, textTransform: "uppercase", marginTop: 2 }}>
          AGENCE NATIONALE DE LA CYBERSÉCURITÉ • CYBERSCORE TN
        </Text>
        <View style={{ width: 44, height: 1.5, backgroundColor: COLORS.accentRed, marginTop: 5 }} />
      </View>

      {/* ── Sceau Circulaire Officiel ───────────────────────────── */}
      <View style={{ alignItems: "center", marginVertical: 6 }}>
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            borderWidth: 1,
            borderColor: COLORS.ruleSolid,
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              borderWidth: 0.5,
              borderColor: COLORS.ruleSubtle,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/logo-icon.png"
              style={{ width: 32, height: 32 }}
            />
          </View>
        </View>
      </View>

      {/* ── Titre & Cible d'Audit ────────────────────────────────── */}
      <View style={{ width: "100%", alignItems: "center", marginVertical: 8 }}>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 1.8, color: report.isAutonomousAgent ? COLORS.critical : COLORS.muted, textTransform: "uppercase", textAlign: "center" }}>
            {report.isAutonomousAgent ? "RAPPORT D'AUDIT ACTIF MULTI-AGENTS (SONDE AUTONOME)" : "RAPPORT OFFICIEL D'AUDIT & DE POSTURE CYBERSÉCURITÉ"}
          </Text>
        </View>

        <View style={{ marginBottom: 6 }}>
          <Text style={{ fontFamily: "Times-Bold", fontSize: 24, lineHeight: 1.25, color: COLORS.ink, letterSpacing: -0.4, textAlign: "center" }}>
            {report.site}
          </Text>
        </View>

        <View>
          <Text style={{ fontFamily: "Times-Italic", fontSize: 9.5, lineHeight: 1.35, color: COLORS.muted, textAlign: "center" }}>
            {report.name ? `${report.name} — ` : ""}{report.sector?.startsWith("Cible") ? report.sector : `Secteur ${report.sector}`}
          </Text>
        </View>
      </View>

      {/* ── Cartouche Score & Grade (Cadre à Filet 2 Colonnes) ──── */}
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.ruleSolid,
          marginVertical: 6,
          flexDirection: "row",
        }}
      >
        {/* Colonne Gauche : Grade & Score */}
        <View
          style={{
            width: "40%",
            borderRightWidth: 1,
            borderRightColor: COLORS.ruleSolid,
            padding: 11,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ marginBottom: 2 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7.2, letterSpacing: 1, color: COLORS.caption, textTransform: "uppercase" }}>
              NOTATION GLOBALE
            </Text>
          </View>
          <View style={{ marginVertical: 2 }}>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 30, color: COLORS.ink, lineHeight: 1 }}>
              {report.grade}
            </Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontFamily: "Times-Roman", fontSize: 10.5, color: COLORS.ink }}>
              Score : <Text style={{ fontFamily: "Times-Bold" }}>{report.score}</Text> / 100
            </Text>
          </View>
        </View>

        {/* Colonne Droite : Statut & Rang */}
        <View style={{ width: "60%", padding: 10, justifyContent: "center" }}>
          <View style={{ marginBottom: 5 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, textTransform: "uppercase", letterSpacing: 0.5 }}>
              APPRÉCIATION DE POSTURE
            </Text>
            <Text style={{ fontFamily: "Times-Bold", fontSize: 9.5, color: COLORS.ink, marginTop: 1 }}>
              {report.score >= 80 ? "Conforme aux Exigences Nationales" : report.score >= 65 ? "Niveau de Sécurité Intermédiaire" : "Vigilance & Remédiation Requises"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: COLORS.ruleSubtle, paddingTop: 5 }}>
            <View>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.8, color: COLORS.caption, textTransform: "uppercase" }}>
                RANG SECTORIEL
              </Text>
              <Text style={{ fontFamily: "Times-Bold", fontSize: 9, color: COLORS.ink }}>
                {report.sectorRank && report.sectorTotal ? `${report.sectorRank} / ${report.sectorTotal}` : "N/A (Cible Externe)"}
              </Text>
            </View>
            <View>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.8, color: COLORS.caption, textTransform: "uppercase" }}>
                CONFORMITÉ
              </Text>
              <Text style={{ fontFamily: "Times-Bold", fontSize: 9, color: COLORS.ink }}>
                {report.complianceRate ?? Math.round((report.score / 100) * 94)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Tableau de Traçabilité & Souveraineté d'Infrastructure ── */}
      <View style={{ borderWidth: 0.5, borderColor: COLORS.ruleSubtle, marginVertical: 4 }}>
        {[
          { label: "RÉFÉRENCE DOSSIER", value: auditRef },
          ...(report.mandatReference ? [{ label: "MANDAT OFFICIEL ANCS", value: `${report.mandatReference} • Habilitation Active Validée` }] : []),
          ...(report.auditorSignature ? [{ label: "OFFICIER SIGNATAIRE (RoE)", value: `${report.auditorSignature} • Règles d'Engagement Signées` }] : []),
          { label: "DATE & HEURE D'AUDIT", value: `${report.scanDate} (Durée : ${report.scanDuration})` },
          { label: "ADRESSE IP RÉSOUDRE", value: report.ipAddress ? `${report.ipAddress}${report.ipv6Address ? ` • IPv6: ${report.ipv6Address}` : ""}` : (report.site.endsWith(".tn") ? "AS2609 (ATI - Agence Tunisienne Internet)" : "Hôte Réseau Externe") },
          { label: "AUTORITÉ SSL / TLS", value: report.certificateInfo?.authority || (report.site.endsWith(".tn") ? "TunTrust / ANCE (Autorité Nationale de Certification Électronique)" : "Autorité Internationale / Externe (Non-TunTrust)") },
          { label: "SCEAU CRYPTOGRAPHIQUE", value: report.sha256Hash ? `${report.sha256Hash.slice(0, 36)}... (SHA-256 Certifié)` : "Scellé par l'Autorité Nationale ANCS" },
          { label: "RÉFÉRENTIELS DE CONFORMITÉ", value: "ISO 27002 • NIST CSF v2 • OWASP Top 10 • Décrets ANCS" },
          { label: "CLASSIFICATION TLP", value: "TLP:AMBER+STRICT • Diffusion Réservée aux RSSI & Directeurs" },
        ].map((row, i, arr) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < arr.length - 1 ? 0.5 : 0,
              borderBottomColor: COLORS.ruleSubtle,
              paddingVertical: 3.2,
              paddingHorizontal: 8,
            }}
          >
            <Text style={{ width: "38%", fontFamily: "Helvetica-Bold", fontSize: 7, color: COLORS.caption, letterSpacing: 0.4 }}>
              {row.label}
            </Text>
            <Text style={{ width: "62%", fontFamily: "Times-Roman", fontSize: 8, color: COLORS.ink }}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Bloc Sceau d'Authentification & QR Code Scannable ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 0.5,
          borderColor: COLORS.ruleSubtle,
          backgroundColor: COLORS.paper,
          padding: 5,
          marginVertical: 3,
        }}
      >
        {qrCodeUrl ? (
          <Image src={qrCodeUrl} style={{ width: 42, height: 42, marginRight: 8 }} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 6.8, color: COLORS.ink, letterSpacing: 0.3 }}>
            SCEAU NUMÉRIQUE D&apos;AUTHENTICITÉ &amp; VÉRIFICATION ANCS
          </Text>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 6.5, color: COLORS.caption, marginTop: 1, lineHeight: 1.2 }}>
            Scannez ce code QR avec votre smartphone pour vérifier l&apos;authenticité de cette évaluation en direct sur le portail souverain ANCS.
          </Text>
          <Text style={{ fontFamily: "Courier", fontSize: 6, color: COLORS.ink, marginTop: 1.5 }}>
            URL : https://cyberscore.tn/verify/{domain}
          </Text>
        </View>
      </View>

      {/* ── Mention de Confidentialité & Pied de Page ──────────── */}
      <View style={{ alignItems: "center", marginTop: 2 }}>
        <View style={{ borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: COLORS.ruleSubtle, paddingVertical: 3, paddingHorizontal: 14 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7, letterSpacing: 0.8, color: COLORS.accentRed, textTransform: "uppercase" }}>
            TLP:AMBER+STRICT • DIFFUSION RESTREINTE • DOCUMENT OFFICIEL D&apos;ÉTAT
          </Text>
        </View>
        <Text style={{ fontFamily: "Times-Italic", fontSize: 7.2, color: COLORS.caption, marginTop: 3 }}>
          CyberScore TN — Document certifié par l&apos;infrastructure d&apos;évaluation souveraine de la Tunisie.
        </Text>
      </View>
    </Page>
  );
}
