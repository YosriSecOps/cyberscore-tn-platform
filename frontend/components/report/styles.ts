/**
 * CyberScore TN — PDF Report Shared Styles
 * Direction Artistique : "Chancellerie"
 * Palette : Ivoire (#FBF8F2), Encre (#1A1A18), Sépia (#6B645A), Rouge Tunisie (#C1272D)
 * Style institutionnel d'État, filets nets, zéro arrondi, typographie éditoriale.
 */

import { StyleSheet, Font } from "@react-pdf/renderer";

// ── Color Tokens (Chancellerie — Haute Lisibilité Impression) ──────────

export const COLORS = {
  // Fond & Encre — Calibré pour impression papier A4 haute netteté
  paper: "#FFFFFF", // Blanc pur : aucune trame d'arrière-plan à l'impression
  ink: "#111111", // Noir profond d'imprimerie
  inkSecondary: "#252320", // Noir secondaire dense (contraste maximal)
  muted: "#35322D", // Anthracite soutenu (au lieu de gris délavé) : lisibilité absolue
  caption: "#3E3B36", // Gris sombre dense pour libellés et en-têtes (parfaitement lisible sur papier)

  // Accent Souverain (utilisé avec parcimonie)
  accentRed: "#B91C1C",
  accentNavy: "#0F1E36",

  // Filets & Bordures (filets bien définis et continus à l'impression)
  ruleSolid: "#111111",
  ruleSubtle: "#7E7970", // Filets nets qui ne s'effacent pas sur imprimante laser/jet d'encre
  ruleLight: "#A8A297",

  // Niveaux de Sévérité (contrastés pour impression N&B et couleur)
  critical: "#991B1B",
  high: "#C2410C",
  medium: "#854D0E",
  low: "#166534",
  info: "#1E40AF",
};

// ── Shared Styles ────────────────────────────────────────

export const styles = StyleSheet.create({
  // Page A4 Strict
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 38,
    fontFamily: "Times-Roman",
    fontSize: 9,
    lineHeight: 1.45,
    color: COLORS.ink,
    backgroundColor: COLORS.paper,
  },

  // ── Header Commun (Pages 2 à 7) ──────────────────────────
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ruleSolid,
  },
  headerRepublic: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: COLORS.ink,
    textTransform: "uppercase",
  },
  headerDocType: {
    fontFamily: "Times-Italic",
    fontSize: 8,
    color: COLORS.muted,
  },
  headerConfidential: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.8,
    color: COLORS.accentRed,
    textTransform: "uppercase",
  },

  // ── Footer Commun ────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 22,
    left: 38,
    right: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.ruleSubtle,
    paddingTop: 6,
  },
  footerMeta: {
    fontFamily: "Helvetica",
    fontSize: 6.8,
    color: COLORS.muted,
    letterSpacing: 0.4,
  },
  footerPageNum: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.2,
    color: COLORS.ink,
  },

  // ── Titres & Chapitres ───────────────────────────────────
  chapterHeader: {
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.ruleSolid,
  },
  chapterNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.5,
    color: COLORS.accentRed,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  chapterTitle: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  chapterSubtitle: {
    fontFamily: "Times-Italic",
    fontSize: 8.5,
    color: COLORS.muted,
    marginTop: 2,
  },

  // ── Cadres & Boîtes (Zero Border Radius) ─────────────────
  framedBox: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.ruleSolid,
    padding: 12,
    marginBottom: 12,
  },
  subtleBox: {
    backgroundColor: COLORS.paper,
    borderWidth: 0.5,
    borderColor: COLORS.ruleSubtle,
    padding: 10,
    marginBottom: 10,
  },
  quoteBox: {
    borderLeftWidth: 2.5,
    borderLeftColor: COLORS.ink,
    paddingLeft: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },

  // ── Tableaux Institutionnels ─────────────────────────────
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.ruleSolid,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ruleSolid,
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.ruleSolid,
    paddingVertical: 5,
    backgroundColor: COLORS.paper,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.ruleSubtle,
    paddingVertical: 5.5,
    alignItems: "center",
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.8,
    color: COLORS.ink,
    textTransform: "uppercase",
  },
  td: {
    fontFamily: "Times-Roman",
    fontSize: 8.5,
    color: COLORS.inkSecondary,
  },
  tdBold: {
    fontFamily: "Times-Bold",
    fontSize: 8.5,
    color: COLORS.ink,
  },
  tdMono: {
    fontFamily: "Courier",
    fontSize: 7.8,
    color: COLORS.ink,
  },

  // ── Badges de Sévérité (Filet fin, sans fond) ────────────
  severityBadge: {
    borderWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  severityText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.8,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // ── Snippets Code / Monospace ────────────────────────────
  codeBlock: {
    fontFamily: "Courier",
    fontSize: 7.2,
    lineHeight: 1.35,
    color: COLORS.ink,
    borderWidth: 0.5,
    borderColor: COLORS.ruleSubtle,
    padding: 8,
    backgroundColor: "#F5F5F5",
    marginVertical: 4,
  },
});
