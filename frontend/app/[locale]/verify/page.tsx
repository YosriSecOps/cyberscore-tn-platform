"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Shield,
  Award,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { OFFICIAL_DOMAINS, OfficialDomain } from "@/components/badges/BadgesClient";

export default function VerifyIndexPage() {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const [inputDomain, setInputDomain] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDomain.trim()) return;
    const clean = inputDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    router.push(`/${locale}/verify/${clean}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #0c1c2e 0%, #030712 70%)",
        color: "#F8FAFC",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        paddingBottom: "60px",
      }}
    >
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(3, 7, 18, 0.85)",
          backdropFilter: "blur(12px)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href={`/${locale}/badges`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#F8FAFC",
          }}
        >
          <ShieldCheck size={24} color="#10B981" />
          <span style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "1px" }}>
            CYBERSCORE TN
          </span>
        </Link>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#E2E8F0" }}>
            RÉPUBLIQUE TUNISIENNE • ANCS
          </div>
          <div style={{ fontSize: "10px", color: "#64748B" }}>
            PORTAIL OFFICIEL DE VÉRIFICATION NUMÉRIQUE
          </div>
        </div>
      </header>

      {/* ── Main Hero ──────────────────────────────────────────── */}
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 20px 0", textAlign: "center" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.15)",
            border: "2px solid #10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
          }}
        >
          <ShieldCheck size={32} color="#10B981" />
        </div>

        <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#FFFFFF", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          {isAr ? "بوابة التحقق الوطني من صحة التدقيق" : "Portail National de Vérification des Sceaux"}
        </h1>

        <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 32px" }}>
          {isAr
            ? "تحقق من سلامة وصحة شارة الأمان السيبرانية أو امسح رمز الـ QR الموجود في التقرير الرسمي الصادر عن الوكالة الوطنية للأمن السيبراني."
            : "Vérifiez l'authenticité d'un sceau de confiance CyberScore TN ou saisissez l'URL d'un organisme public pour consulter son attestation de sécurité officielle."}
        </p>

        {/* Input form */}
        <form onSubmit={handleVerify} style={{ display: "flex", gap: "10px", maxWidth: "520px", margin: "0 auto 40px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              color="#64748B"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              placeholder="ex: sante.gov.tn, defense.tn, finances.gov.tn"
              style={{
                width: "100%",
                padding: "12px 14px 12px 40px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "#10B981",
              border: "none",
              color: "#022C22",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{isAr ? "تحقق" : "Vérifier"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Popular Sovereignty Portals List */}
        <div style={{ textAlign: "left", background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            {isAr ? "أمثلة لمواقع وطنية تم التحقق منها" : "Exemples d'Attestations Officielles Vérifiables"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {OFFICIAL_DOMAINS.slice(0, 4).map((item: OfficialDomain) => (
              <Link
                key={item.domain}
                href={`/${locale}/verify/${item.domain}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "rgba(2, 6, 23, 0.6)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  textDecoration: "none",
                  color: "#F8FAFC",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{item.domain}</div>
                  <div style={{ fontSize: "11px", color: "#64748B" }}>Score: {item.score}/100</div>
                </div>
                <div
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#10B981",
                    fontWeight: 800,
                    fontSize: "11px",
                  }}
                >
                  {item.grade}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
