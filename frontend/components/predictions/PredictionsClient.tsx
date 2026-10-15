"use client";

/**
 * PredictionsClient — AI Predictive Analytics (+30 days score forecast)
 * Connected dynamically to PostgreSQL audits via /api/predictions/overview
 * 100% Trilingual (AR / FR / EN) with responsive SVG visualizers
 */

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { getDynamicPredictionsData } from "@/lib/dynamic-data";

const DYNAMIC_PRED = getDynamicPredictionsData(false);

const DEFAULT_SITES = DYNAMIC_PRED.sites.map((s) => ({
  url: s.cleanUrl,
  sector: s.sectorI18n,
  score: s.score,
  predicted: s.predictedScore,
  trend: s.trend,
  confidence: s.confidence,
}));

const DEFAULT_HISTORY = DYNAMIC_PRED.history;
const DEFAULT_RADAR = DYNAMIC_PRED.radarCategories;

const DEFAULT_FACTORS = [
  {
    color: "#ef4444",
    type: "risk",
    label: { en: "SSL certificate expiring in 23 days on monitored domains", fr: "Certificats SSL expirant dans moins de 30j sur les domaines audités", ar: "شهادات SSL تنتهي خلال 30 يومًا على المواقع المراقبة" },
  },
  {
    color: "#22c55e",
    type: "positive",
    label: { en: "HTTP security headers improved on 8 sites this month", fr: "En-têtes HTTP améliorés sur plusieurs ministères ce mois-ci", ar: "تحسين رؤوس HTTP على مواقع حكومية هذا الشهر" },
  },
  {
    color: "#6366f1",
    type: "recommendation",
    label: { en: "Critical CVE mitigation recommended across state infrastructure", fr: "Résorption prioritaire des vulnérabilités critiques recommandée", ar: "توصية بمعالجة الثغرات الحرجة المكتشفة كأولوية قصوى" },
  },
];

// ── Helpers ─────────────────────────────────────────────────

function gradeFromScore(s: number) {
  if (s >= 90) return "A+";
  if (s >= 80) return "A";
  if (s >= 70) return "B";
  if (s >= 60) return "C";
  if (s >= 50) return "D";
  return "F";
}

function colorFromScore(s: number) {
  if (s >= 75) return "#22c55e";
  if (s >= 55) return "#6366f1";
  return "#ef4444";
}

// ── Radar SVG ────────────────────────────────────────────────

function RadarChart({ categories = DEFAULT_RADAR }: { categories: typeof DEFAULT_RADAR }) {
  const cx = 160, cy = 160, r = 120;
  const n = categories.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep;
    const scaled = (Math.min(100, Math.max(0, value)) / 100) * r;
    return {
      x: cx + scaled * Math.cos(angle),
      y: cy + scaled * Math.sin(angle),
    };
  }

  function getLabelPoint(index: number) {
    const angle = startAngle + index * angleStep;
    const dist = r + 22;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  }

  const actualPoints = categories.map((c, i) => getPoint(i, c.actual));
  const predictedPoints = categories.map((c, i) => getPoint(i, c.predicted));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100].map((pct) => {
    const pts = Array.from({ length: n }, (_, i) => getPoint(i, pct));
    return toPath(pts);
  });

  // Axis lines
  const axes = categories.map((_, i) => {
    const outer = getPoint(i, 100);
    return `M ${cx} ${cy} L ${outer.x.toFixed(1)} ${outer.y.toFixed(1)}`;
  });

  return (
    <svg viewBox="0 0 320 320" width="100%" style={{ maxWidth: 320 }}>
      {/* Grid rings */}
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--border-primary)" strokeWidth={0.5} />
      ))}
      {/* Axis lines */}
      {axes.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--border-primary)" strokeWidth={0.5} />
      ))}
      {/* Actual polygon */}
      <path
        d={toPath(actualPoints)}
        fill="#6366f1"
        fillOpacity={0.15}
        stroke="#6366f1"
        strokeWidth={1.5}
      />
      {/* Predicted polygon */}
      <path
        d={toPath(predictedPoints)}
        fill="#22c55e"
        fillOpacity={0.1}
        stroke="#22c55e"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      {/* Dots - actual */}
      {actualPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#6366f1" />
      ))}
      {/* Dots - predicted */}
      {predictedPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#22c55e" stroke="var(--bg-secondary)" strokeWidth={1} />
      ))}
      {/* Labels */}
      {categories.map((c, i) => {
        const lp = getLabelPoint(i);
        return (
          <text
            key={i}
            x={Math.round(lp.x)}
            y={Math.round(lp.y)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="var(--text-secondary)"
            style={{ textTransform: "uppercase", fontFamily: "monospace", letterSpacing: "1px" }}
          >
            {c.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Score Evolution SVG ───────────────────────────────────────

function ScoreChart({ history = DEFAULT_HISTORY }: { history: typeof DEFAULT_HISTORY }) {
  const W = 800, H = 200;
  const padL = 36, padR = 24, padT = 16, padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minScore = 30, maxScore = 100;

  function px(index: number) {
    return padL + (index / (history.length - 1)) * chartW;
  }
  function py(score: number) {
    return padT + chartH - ((Math.min(100, Math.max(minScore, score)) - minScore) / (maxScore - minScore)) * chartH;
  }

  const historyPoints = history.filter((h) => !h.predicted);
  const predictedPoint = history.find((h) => h.predicted) || { month: "+30d", score: 66, predicted: true };
  const lastHistory = historyPoints[historyPoints.length - 1] || { month: "Aug", score: 64 };
  const lastIdx = history.length - 2;

  const linePath = historyPoints
    .map((h, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(h.score).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${px(lastIdx).toFixed(1)} ${(padT + chartH).toFixed(1)} L ${padL} ${(padT + chartH).toFixed(1)} Z`;

  const predX1 = px(lastIdx);
  const predX2 = px(history.length - 1);
  const predY1 = py(lastHistory.score);
  const predY2 = py(predictedPoint.score);

  // Confidence band (±5 pts)
  const confBandPath = `M ${predX1} ${py(lastHistory.score + 5)} L ${predX2} ${py(predictedPoint.score + 5)} L ${predX2} ${py(predictedPoint.score - 5)} L ${predX1} ${py(lastHistory.score - 5)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {[40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={py(v)} y2={py(v)} stroke="var(--border-primary)" strokeWidth={0.5} />
          <text x={padL - 6} y={py(v)} textAnchor="end" dominantBaseline="middle" fontSize={8} fill="var(--text-secondary)" style={{ fontFamily: "monospace" }}>
            {v}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Actual line */}
      <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={1.5} />

      {/* Confidence band */}
      <path d={confBandPath} fill="#22c55e" fillOpacity={0.06} />

      {/* Predicted line (dashed) */}
      <line
        x1={predX1} y1={predY1}
        x2={predX2} y2={predY2}
        stroke="#22c55e"
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />

      {/* Dots */}
      {historyPoints.map((h, i) => (
        <circle key={i} cx={px(i)} cy={py(h.score)} r={i === lastIdx ? 4 : 2.5} fill="#6366f1" />
      ))}
      <circle cx={predX2} cy={predY2} r={4} fill="#22c55e" stroke="var(--bg-secondary)" strokeWidth={1.5} />

      {/* Predicted label */}
      <text x={predX2} y={predY2 - 10} textAnchor="middle" fontSize={9} fill="#22c55e" style={{ fontFamily: "monospace", fontWeight: 700 }}>
        {predictedPoint.score}
      </text>

      {/* Month labels */}
      {history.map((h, i) => (
        <text
          key={i}
          x={px(i)}
          y={H - 6}
          textAnchor="middle"
          fontSize={8}
          fill={h.predicted ? "#22c55e" : "var(--text-secondary)"}
          style={{ fontFamily: "monospace", letterSpacing: 0 }}
        >
          {h.month}
        </text>
      ))}

      {/* Divider line between real / predicted */}
      <line
        x1={predX1} y1={padT}
        x2={predX1} y2={padT + chartH}
        stroke="var(--border-primary)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={predX1 + 4} y={padT + 8} fontSize={7} fill="var(--text-secondary)" style={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>
        PREDICTED
      </text>
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function PredictionsClient({ locale: propLocale }: { locale?: string }) {
  const nextLocale = useLocale();
  const locale = propLocale || nextLocale || "fr";
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const [sortCol, setSortCol] = useState<"score" | "predicted" | "confidence">("predicted");
  const [sites, setSites] = useState(DEFAULT_SITES);
  const [history, setHistory] = useState(DEFAULT_HISTORY);
  const [radarCategories, setRadarCategories] = useState(DEFAULT_RADAR);
  const [factors, setFactors] = useState(DEFAULT_FACTORS);
  const [aminaAnalysis, setAminaAnalysis] = useState<Record<string, string>>({
    fr: "Sur la base de l'analyse des scans sur 12 mois, la moyenne nationale affiche une tendance haussière continue. Les secteurs clés tirent la progression grâce à la résorption progressive des failles critiques.",
    en: "Based on scans over 12 months, the national average indicates a steady upward forecast trend. Key sectors drive improvement as critical vulnerabilities get patched.",
    ar: "استناداً إلى تحليل عمليات الفحص على مدار 12 شهراً، يُظهر المعدل الوطني اتجاهاً تصاعدياً متوقعاً مع معالجة الثغرات الحرجة."
  });

  const [avgCurrent, setAvgCurrent] = useState(DYNAMIC_PRED.avgCurrent);
  const [avgPredicted, setAvgPredicted] = useState(DYNAMIC_PRED.avgPredicted);
  const [delta, setDelta] = useState(DYNAMIC_PRED.delta);
  const [avgConfidence, setAvgConfidence] = useState(DYNAMIC_PRED.confidencePct);
  const [improvingRatio, setImprovingRatio] = useState(DYNAMIC_PRED.improvingRatio);

  // Fetch dynamic prediction data from PostgreSQL
  useEffect(() => {
    // Refresh dynamically from centralized store
    const dynamicData = getDynamicPredictionsData();
    setAvgCurrent(dynamicData.avgCurrent);
    setAvgPredicted(dynamicData.avgPredicted);
    setDelta(dynamicData.delta);
    setAvgConfidence(dynamicData.confidencePct);
    setImprovingRatio(dynamicData.improvingRatio);

    async function fetchDynamicPredictions() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/predictions/overview`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.average_score === "number") {
            setAvgCurrent(data.average_score);
            setAvgPredicted(data.predicted_score);
            setDelta(data.improvement_pts);
            setAvgConfidence(data.confidence_pct || 86);
            setImprovingRatio(data.improving_ratio || dynamicData.improvingRatio);

            if (Array.isArray(data.sites) && data.sites.length > 0) setSites(data.sites);
            if (Array.isArray(data.history) && data.history.length > 0) setHistory(data.history);
            if (Array.isArray(data.radar_categories) && data.radar_categories.length > 0) setRadarCategories(data.radar_categories);
            if (Array.isArray(data.factors) && data.factors.length > 0) setFactors(data.factors);
            if (data.amina_analysis) setAminaAnalysis(data.amina_analysis);
          }
        }
      } catch {
        // Keep dynamic fallback
      }
    }
    fetchDynamicPredictions();
  }, []);

  const sorted = [...sites].sort((a: any, b: any) => b[sortCol] - a[sortCol]);

  const labels = {
    currentScore:  isAr ? "المعدل الحالي"         : isFr ? "Score moyen actuel"         : "Current Avg. Score",
    predictedScore: isAr ? "المعدل المتوقع +30ي"   : isFr ? "Score prédit +30j"          : "Predicted Score +30d",
    delta:         isAr ? "التحسّن المتوقع"        : isFr ? "Amélioration prévue"        : "Expected Change",
    confidence:    isAr ? "ثقة النموذج"            : isFr ? "Confiance du modèle"        : "Model Confidence",
    improving:     isAr ? "مواقع في تحسّن"         : isFr ? "sites en amélioration"      : "sites improving",
    chartTitle:    isAr ? "تطور المعدل الوطني عبر الزمن" : isFr ? "Évolution du score national" : "National Score Evolution",
    radarTitle:    isAr ? "تحليل الفئات الأمنية (الفعلي vs المتوقع)" : isFr ? "Analyse par catégorie" : "Category Analysis",
    analysisTitle: isAr ? "تحليل الذكاء الاصطناعي — أمينة" : isFr ? "Analyse IA — Amina" : "AI Analysis — Amina",
    factorsTitle:  isAr ? "العوامل الرئيسية الموجهة للتنبؤ" : isFr ? "Facteurs clés prédictifs" : "Key Predictive Factors",
    tableTitle:    isAr ? "تنبؤات الوضع الأمني لكل موقع" : isFr ? "Prédictions par site audité" : "Site-by-Site Predictions",
    colSite:       isAr ? "الموقع"                 : isFr ? "Site"                       : "Site",
    colCurrent:    isAr ? "الحالي"                 : isFr ? "Actuel"                     : "Current",
    colPredicted:  isAr ? "المتوقع +30ي"           : isFr ? "Prédit +30j"                : "Predicted +30d",
    colTrend:      isAr ? "الاتجاه"                : isFr ? "Tendance"                   : "Trend",
    colConf:       isAr ? "الثقة"                  : isFr ? "Confiance"                  : "Confidence",
    trendLabel:    delta > 0 ? (isAr ? "في تحسّن" : isFr ? "EN AMÉLIORATION" : "IMPROVING") : delta < 0 ? (isAr ? "في تراجع" : isFr ? "EN DÉCLIN" : "DECLINING") : (isAr ? "مستقر" : isFr ? "STABLE" : "STABLE"),
    actual:        isAr ? "الفعلي"   : isFr ? "Actuel"  : "Actual",
    predicted2:    isAr ? "المتوقع"  : isFr ? "Prédit"  : "Predicted",
  };

  const trendColor = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#6366f1";

  return (
    <div style={{ padding: "0", textAlign: isAr ? "right" : "left" }}>

      {/* ── Section 1: 4 KPI Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, borderRadius: 0 }}>
        {[
          {
            value: avgCurrent,
            label: labels.currentScore,
            color: colorFromScore(avgCurrent),
            sub: `${gradeFromScore(avgCurrent)} • ${isAr ? "المعدل الوطني العام" : isFr ? "Moyenne Nationale (120 sites)" : "National Avg. (120 sites)"}`,
          },
          {
            value: avgPredicted,
            label: labels.predictedScore,
            color: "#22c55e",
            sub: `${gradeFromScore(avgPredicted)} • ${isAr ? "الهدف التوقعي +30ي" : isFr ? "Cible prévisionnelle +30j" : "+30d Target"}`,
          },
          { value: `${delta > 0 ? "+" : ""}${delta} pts`, label: labels.delta, color: trendColor, sub: labels.trendLabel },
          { value: `${avgConfidence}%`, label: labels.confidence, color: "#6366f1", sub: `${improvingRatio} ${labels.improving}` },
        ].map((kpi, i) => (
          <div key={i} suppressHydrationWarning style={{
            background: "var(--surface-2)",
            padding: "22px",
            border: "0.5px solid var(--border-primary)",
            borderTop: `3px solid ${kpi.color}`,
            borderRadius: 0,
            display: "flex", flexDirection: "column",
          }}>
            <div suppressHydrationWarning style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "-2px", color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
            <div suppressHydrationWarning style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-secondary)", marginTop: "8px", fontWeight: 600 }}>
              {kpi.label}
            </div>
            <div suppressHydrationWarning style={{ marginTop: "auto", paddingTop: "24px", fontSize: "10px", color: kpi.color, fontWeight: 600, fontFamily: "monospace" }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Score Evolution Chart ── */}
      <div style={{ marginTop: "24px", border: "0.5px solid var(--border-primary)", background: "var(--surface-2)", borderRadius: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--border-primary)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-secondary)" }}>
            {labels.chartTitle}
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: 20, height: 1.5, background: "#6366f1" }} />
              <span style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>{labels.actual}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 2" /></svg>
              <span style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>{labels.predicted2}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 20px 8px" }}>
          <ScoreChart history={history} />
        </div>
      </div>

      {/* ── Section 3: Radar + AI Analysis ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: "24px", border: "0.5px solid var(--border-primary)", borderRadius: 0 }}>

        {/* Panel left: Radar */}
        <div style={{ background: "var(--surface-2)", padding: "20px", borderRadius: 0 }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px" }}>
            {labels.radarTitle}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: 12, height: 12, background: "#6366f1", opacity: 0.3, borderRadius: 0 }} />
              <span style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>{labels.actual}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: 12, height: 12, background: "#22c55e", opacity: 0.2, borderRadius: 0 }} />
              <span style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>{labels.predicted2}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart categories={radarCategories} />
          </div>
          {/* Category bars */}
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {radarCategories.map((cat) => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "9px", color: "var(--text-secondary)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", width: "65px" }}>{cat.label}</span>
                <div style={{ flex: 1, height: "2px", background: "var(--border-primary)", borderRadius: 0, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, [isAr ? "right" : "left"]: 0, height: "100%", width: `${cat.actual}%`, background: "#6366f1", borderRadius: 0 }} />
                </div>
                <div style={{ flex: 1, height: "2px", background: "var(--border-primary)", borderRadius: 0, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, [isAr ? "right" : "left"]: 0, height: "100%", width: `${cat.predicted}%`, background: "#22c55e", borderRadius: 0 }} />
                </div>
                <span style={{ fontSize: "9px", color: "#22c55e", fontFamily: "monospace", width: "32px", textAlign: isAr ? "left" : "right" }}>
                  +{cat.predicted - cat.actual}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel right: AI Analysis + Factors */}
        <div style={{ background: "var(--surface-2)", padding: "20px", [isAr ? "borderRight" : "borderLeft"]: "0.5px solid var(--border-primary)", borderRadius: 0 }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{labels.analysisTitle}</span>
            <span style={{ color: trendColor, border: `1px solid ${trendColor}`, padding: "2px 8px", fontSize: "8px", letterSpacing: "1px", borderRadius: 0 }}>
              {labels.trendLabel}
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
            {aminaAnalysis[locale] || aminaAnalysis.fr || aminaAnalysis.en}
          </p>

          {/* 3 Key Factors */}
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px" }}>
            {labels.factorsTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {factors.map((f: any, i: number) => {
              const labelText = typeof f.label === "object" ? (f.label[locale] || f.label.fr || f.label.en) : f.label;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: 3, height: 14, background: f.color, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "11px", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {labelText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 4: Site-by-Site Predictions Table ── */}
      <div style={{ marginTop: "24px", border: "0.5px solid var(--border-primary)", background: "var(--surface-2)", borderRadius: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--border-primary)" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-secondary)" }}>
            {labels.tableTitle}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: isAr ? "right" : "left" }}>
            <thead>
              <tr>
                {[
                  { key: "url", label: labels.colSite },
                  { key: "score", label: labels.colCurrent },
                  { key: "predicted", label: labels.colPredicted },
                  { key: "trend", label: labels.colTrend },
                  { key: "confidence", label: labels.colConf },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => ["score", "predicted", "confidence"].includes(col.key) && setSortCol(col.key as any)}
                    style={{
                      padding: "10px 16px",
                      textAlign: isAr ? "right" : "left",
                      fontSize: "9px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      borderBottom: "1px solid var(--border-primary)",
                      fontWeight: 400,
                      cursor: ["score", "predicted", "confidence"].includes(col.key) ? "pointer" : "default",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s: any, idx: number) => {
                const isPositive = s.predicted > s.score;
                const isNegative = s.predicted < s.score;
                const trendBadgeColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#6366f1";
                const sectorLabel = typeof s.sector === "object" ? (s.sector[locale] || s.sector.fr || s.sector.en) : s.sector;

                return (
                  <tr key={idx} style={{ borderBottom: idx === sorted.length - 1 ? "none" : "0.5px solid var(--border-primary)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: "12px", color: "var(--text-primary)" }}>{s.url}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{sectorLabel}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: colorFromScore(s.score) }}>
                      {s.score}
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: isPositive ? "#22c55e" : isNegative ? "#ef4444" : "var(--text-primary)" }}>
                      {s.predicted}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 7px", fontSize: "9px", letterSpacing: "1px",
                        textTransform: "uppercase", borderRadius: "3px",
                        background: `${trendBadgeColor}15`, color: trendBadgeColor, fontWeight: 700,
                        border: `1px solid ${trendBadgeColor}30`
                      }}>
                        {s.trend === "up" ? (isAr ? "↑ تصاعدي" : "↑ UP") : s.trend === "down" ? (isAr ? "↓ تراجعي" : "↓ DOWN") : (isAr ? "→ مستقر" : "→ STABLE")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {Math.round(s.confidence * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
