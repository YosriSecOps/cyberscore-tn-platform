"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Search,
  Building2,
  ShieldAlert,
  TrendingUp,
  Award,
  Globe,
  Clock,
  FileText,
  Settings,
  Bot,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/lib/api";

const ICON_SIZE = 16;
const ICON_STROKE = 1.5;

const NAV_ITEMS = [
  { key: "commandCenter", href: "/", icon: LayoutDashboard },
  { key: "scanner", href: "/scan", icon: Search },
  { key: "sectors", href: "/sectors", icon: Building2 },
  { key: "threats", href: "/threats", icon: ShieldAlert },
  { key: "predictions", href: "/predictions", icon: TrendingUp },
  { key: "assistant", href: "/assistant", icon: Bot },
  { key: "badges", href: "/badges", icon: Award },
  { key: "benchmark", href: "/benchmark", icon: Globe },
];

const NAV_SECONDARY = [
  { key: "history", href: "/history", icon: Clock },
  { key: "reports", href: "/reports", icon: FileText },
  { key: "admin", href: "/admin", icon: Settings },
];

export default function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isAr = pathname.startsWith("/ar");
  const isEn = pathname.startsWith("/en");

  // Dynamic Gamification State
  const [xpData, setXpData] = useState({
    currentXp: 2450,
    nextThreshold: 3000,
    prevThreshold: 1000,
    levelName: isAr ? "متقدم" : isEn ? "ADVANCED" : "AVANCÉ",
    levelLabel: isAr ? "المستوى" : isEn ? "LEVEL" : "NIVEAU",
    progressPct: 72,
  });

  // Active Authenticated User & Role State
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    email: string;
    fullName: string;
    role: "admin" | "auditor" | "viewer";
    organization: string;
  }>({
    id: 1,
    email: "admin@cyberscore.tn",
    fullName: "Admin ANCS",
    role: "admin",
    organization: "Agence Nationale CyberSécurité (ANCS)",
  });

  useEffect(() => {
    try {
      // 0. Read authenticated user
      const rawUser = localStorage.getItem("cyberscore_user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed) {
          const safeName = parsed.fullName || parsed.full_name || parsed.name || (parsed.email ? parsed.email.split("@")[0] : "Admin ANCS");
          const safeOrg = typeof parsed.organization === "string" ? parsed.organization : parsed.organization_name || "Agence Nationale CyberSécurité (ANCS)";
          const safeRole = parsed.role === "admin" || parsed.role === "auditor" || parsed.role === "viewer" ? parsed.role : "admin";
          setCurrentUser({
            id: parsed.id || 1,
            email: parsed.email || "admin@cyberscore.tn",
            fullName: safeName,
            role: safeRole,
            organization: safeOrg,
          });
        }
      }

      let earnedXp = currentUser?.role === "admin" ? 4200 : currentUser?.role === "auditor" ? 2450 : 850;

      // 1. Read real scan history to add XP dynamically (+150 XP per completed scan)
      const scanHistoryRaw = localStorage.getItem("cyberscore_scan_history");
      if (scanHistoryRaw) {
        const history = JSON.parse(scanHistoryRaw);
        if (Array.isArray(history)) {
          earnedXp += history.length * 150;
        }
      }

      // 2. Read custom user XP if stored
      const customXp = localStorage.getItem("cyberscore_user_xp");
      if (customXp) {
        earnedXp = parseInt(customXp, 10) || earnedXp;
      }

      // 3. Compute level tier
      let lvlName = isAr ? "مبتدئ" : isEn ? "NOVICE" : "DÉBUTANT";
      let prevThresh = 0;
      let nextThresh = 1000;

      if (earnedXp >= 5000) {
        lvlName = isAr ? "خبير أمني (SOC Élite)" : isEn ? "SOC ELITE" : "ÉLITE SOC";
        prevThresh = 5000;
        nextThresh = 10000;
      } else if (earnedXp >= 3500) {
        lvlName = isAr ? "خبير" : isEn ? "EXPERT" : "EXPERT";
        prevThresh = 3500;
        nextThresh = 5000;
      } else if (earnedXp >= 2000) {
        lvlName = isAr ? "متقدم" : isEn ? "ADVANCED" : "AVANCÉ";
        prevThresh = 2000;
        nextThresh = 3500;
      } else if (earnedXp >= 1000) {
        lvlName = isAr ? "متوسط" : isEn ? "INTERMEDIATE" : "INTERMÉDIAIRE";
        prevThresh = 1000;
        nextThresh = 2000;
      }

      const tierRange = nextThresh - prevThresh;
      const progressInTier = Math.max(0, earnedXp - prevThresh);
      const pct = Math.min(100, Math.round((progressInTier / tierRange) * 100));

      setXpData({
        currentXp: earnedXp,
        nextThreshold: nextThresh,
        prevThreshold: prevThresh,
        levelName: lvlName,
        levelLabel: isAr ? "المستوى" : isEn ? "LEVEL" : "NIVEAU",
        progressPct: pct,
      });
    } catch {}
  }, [pathname, isAr, isEn, currentUser.role]);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(ar|fr|en)/, "") || "/";
    return cleanPath === href;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    window.location.href = `/${isAr ? "ar" : isEn ? "en" : "fr"}/login`;
  };

  const roleColor =
    currentUser.role === "admin" ? "#ef4444" : currentUser.role === "auditor" ? "#0284c7" : "#64748b";

  const roleTag =
    currentUser.role === "admin"
      ? isAr ? "مدير عام ANCS" : "ADMIN ANCS"
      : currentUser.role === "auditor"
      ? isAr ? "مدقق RSSI" : "AUDITEUR"
      : isAr ? "ملاحظ عام" : "OBSERVATEUR";

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand" style={{ padding: "8px 10px 0px 10px", marginBottom: "4px", display: "block" }}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="CyberScore TN"
            width={200}
            height={90}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
            priority
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title" style={{ padding: "8px var(--space-lg) var(--space-sm)" }}>
          {isAr ? "القائمة الرئيسية" : "MAIN"}
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <span className="nav-item-icon">
                <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              </span>
              <span>{t(item.key)}</span>
            </Link>
          );
        })}

        <div className="nav-section-title">
          {isAr ? "أدوات" : "TOOLS"}
        </div>
        {NAV_SECONDARY.map((item) => {
          const Icon = item.icon;
          const isRestrictedAdmin = item.key === "admin" && currentUser.role !== "admin";
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              style={{ position: "relative" }}
            >
              <span className="nav-item-icon">
                <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              </span>
              <span>{t(item.key)}</span>
              {isRestrictedAdmin && (
                <span
                  style={{
                    insetInlineEnd: "8px",
                    position: "absolute",
                    fontSize: "8px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    border: "0.5px solid var(--border-primary)",
                    padding: "1px 4px",
                    borderRadius: "2px",
                    background: "var(--bg-tertiary)",
                  }}
                >
                  {isAr ? "مقيد" : "RESTREINT"}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "0 0 4px 0", borderTop: "0.5px solid var(--border-primary)", marginTop: "auto" }}>
        {/* Dynamic XP / Level — Command Center Style with direct Link to /badges */}
        <Link
          href="/badges"
          title={isAr ? "عرض أوسمة التميز ومستوى الكفاءة" : "Consulter vos badges d'excellence SOC"}
          style={{
            display: "block",
            padding: "10px 14px",
            borderBottom: "0.5px solid var(--border-primary)",
            textDecoration: "none",
            color: "inherit",
            transition: "background 0.2s ease",
          }}
          className="hover:bg-[var(--bg-tertiary)]"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "8.5px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-secondary)" }}>
              {xpData.levelLabel}
            </span>
            <span style={{ fontSize: "8.5px", letterSpacing: "1px", color: "var(--color-accent)", fontFamily: "monospace", fontWeight: 700 }}>
              {xpData.levelName}
            </span>
          </div>
          <div style={{ width: "100%", height: "3px", background: "var(--border-primary)", position: "relative", borderRadius: "1.5px", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${xpData.progressPct}%`,
                background: "var(--color-accent)",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "8.5px", color: "var(--text-secondary)", fontFamily: "monospace" }}>
              XP {xpData.currentXp.toLocaleString()}
            </span>
            <span style={{ fontSize: "8.5px", color: "var(--text-secondary)", fontFamily: "monospace" }}>
              {xpData.nextThreshold.toLocaleString()}
            </span>
          </div>
        </Link>

        {/* Authenticated User Session Card with RBAC Badge */}
        <div
          style={{
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--radius-sm)",
                background: `${roleColor}20`,
                border: `1px solid ${roleColor}50`,
                color: roleColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 800,
                fontFamily: "monospace",
                flexShrink: 0,
              }}
            >
              {(currentUser?.fullName || currentUser?.email || "Admin")
                .toString()
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "AA"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentUser?.fullName || currentUser?.email || "Admin ANCS"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                <span
                  style={{
                    fontSize: "8px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: roleColor,
                    background: `${roleColor}15`,
                    border: `0.5px solid ${roleColor}40`,
                    padding: "0 4px",
                    borderRadius: "2px",
                  }}
                >
                  {roleTag}
                </span>
              </div>
            </div>
          </div>

          <button
            suppressHydrationWarning
            type="button"
            onClick={handleLogout}
            title={isAr ? "تسجيل الخروج" : isEn ? "Sign Out" : "Déconnexion"}
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "5px 8px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 600,
              transition: "all 0.15s ease",
            }}
            className="hover:!text-red-500 hover:!border-red-500/50 hover:!bg-red-500/10"
          >
            <LogOut size={13} />
            <span>{isAr ? "خروج" : isEn ? "Exit" : "Déconnexion"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
