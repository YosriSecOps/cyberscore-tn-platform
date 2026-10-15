"use client";

import dynamic from "next/dynamic";

const ThreatWorldMap = dynamic(() => import("@/components/threats/ThreatWorldMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(11, 17, 32, 0.5)",
      borderRadius: "var(--radius-lg)",
      color: "var(--text-secondary)",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
    }}>
      ◉ INITIALIZING THREAT MAP...
    </div>
  ),
});

export default function ThreatWorldMapWrapper({ locale }: { locale?: string }) {
  return <ThreatWorldMap locale={locale} />;
}
