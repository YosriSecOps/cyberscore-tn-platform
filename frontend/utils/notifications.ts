/**
 * CyberScore TN — Production Notification Event Bus
 * Dispatches live SOC security events across all components in real-time.
 */

export interface NotificationPayload {
  id?: string;
  type: "critical" | "warning" | "success" | "ai";
  title: { ar: string; fr: string; en: string };
  desc: { ar: string; fr: string; en: string };
  time?: { ar: string; fr: string; en: string };
  read?: boolean;
  href?: string;
}

export const NOTIFS_STORAGE_KEY = "cyberscore_notifications_state";

export function dispatchCyberNotification(payload: NotificationPayload) {
  if (typeof window === "undefined") return;

  const notif = {
    id: payload.id || `notif-${Date.now()}`,
    type: payload.type,
    title: payload.title,
    desc: payload.desc,
    time: payload.time || {
      ar: "الآن",
      fr: "À l'instant",
      en: "Just now",
    },
    read: false,
    href: payload.href || "/",
  };

  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [notif, ...(Array.isArray(existing) ? existing : [])].slice(0, 20);
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  window.dispatchEvent(new CustomEvent("cyberscore_new_notif", { detail: notif }));
}
