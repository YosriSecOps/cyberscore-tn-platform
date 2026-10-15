/**
 * CyberScore TN — Sovereign Audit Trail Event Bus
 * Records and persists system, administrator, and auditor actions in real-time.
 * Compliant with Décret-loi n° 2023-17 & ISO 27001 traceability requirements.
 */

export interface AuditItem {
  id: string | number;
  timestamp: string;
  user: string;
  action: {
    ar: string;
    fr: string;
    en: string;
  };
  target: string;
  severity: "info" | "warning" | "critical";
}

export const AUDIT_STORAGE_KEY = "cyberscore_audit_trail";

export const INITIAL_AUDITS: AuditItem[] = [
  {
    id: 1,
    timestamp: "12:04:12",
    user: "yosri.hamdouni",
    action: {
      ar: "تعديل إعدادات التنبيه التلقائي",
      fr: "Modification de la politique d'alerte",
      en: "Updated automated alert policy threshold",
    },
    target: "GLOBAL_CONFIG",
    severity: "warning",
  },
  {
    id: 2,
    timestamp: "11:45:00",
    user: "amina.dridi",
    action: {
      ar: "تصدير التقرير الوطني للأمن السيبراني",
      fr: "Export du rapport de conformité Q3",
      en: "Exported Q3 Cybersecurity Report PDF",
    },
    target: "REPORT_GEN_#489",
    severity: "info",
  },
  {
    id: 3,
    timestamp: "09:30:22",
    user: "SYSTEM_DAEMON",
    action: {
      ar: "إطلاق الفحص الدوري الأسبوعي (120 موقع)",
      fr: "Exécution du scan planifié hebdomadaire",
      en: "Triggered weekly automated national scan",
    },
    target: "BATCH_SCAN_#342",
    severity: "info",
  },
  {
    id: 4,
    timestamp: "Hier 18:20",
    user: "mohamed.trabelsi",
    action: {
      ar: "إضافة نطاق جديد للمراقبة النشطة",
      fr: "Ajout de nouveau domaine sous surveillance",
      en: "Added new monitored domain: douane.gov.tn",
    },
    target: "douane.gov.tn",
    severity: "warning",
  },
  {
    id: 5,
    timestamp: "Hier 14:10",
    user: "yosri.hamdouni",
    action: {
      ar: "إيقاف حساب مستخدم غير نشط",
      fr: "Désactivation du compte utilisateur",
      en: "Deactivated inactive user account",
    },
    target: "sarra.ba@justice.gov.tn",
    severity: "critical",
  },
];

/**
 * Retrieve persistent audit logs from localStorage or fallback to defaults
 */
export function getAuditLogs(): AuditItem[] {
  if (typeof window === "undefined") return INITIAL_AUDITS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_AUDITS;
}

/**
 * Record a new sovereign audit event and notify active subscribers in real-time
 */
export function recordAuditLog(payload: {
  user?: string;
  action: { ar: string; fr: string; en: string };
  target: string;
  severity?: "info" | "warning" | "critical";
  timestamp?: string;
}): AuditItem {
  if (typeof window === "undefined") {
    return {
      id: Date.now(),
      timestamp: "00:00:00",
      user: payload.user || "admin",
      action: payload.action,
      target: payload.target,
      severity: payload.severity || "info",
    };
  }

  let actor = payload.user;
  if (!actor) {
    try {
      const raw = localStorage.getItem("cyberscore_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        actor = parsed.email ? parsed.email.split("@")[0] : parsed.fullName || "yosri.hamdouni";
      }
    } catch {}
  }
  if (!actor) actor = "yosri.hamdouni";

  const now = new Date();
  const timeStr =
    payload.timestamp ||
    now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const newEntry: AuditItem = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: timeStr,
    user: actor,
    action: payload.action,
    target: payload.target,
    severity: payload.severity || "info",
  };

  try {
    const existing = getAuditLogs();
    const updated = [newEntry, ...existing].slice(0, 50);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  window.dispatchEvent(new CustomEvent("cyberscore_new_audit", { detail: newEntry }));
  return newEntry;
}

/**
 * Reset audit logs to initial baseline (useful for live defense demo)
 */
export function resetAuditLogs(): AuditItem[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDITS));
    } catch {}
    window.dispatchEvent(new CustomEvent("cyberscore_new_audit", { detail: null }));
  }
  return INITIAL_AUDITS;
}
