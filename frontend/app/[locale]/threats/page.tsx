import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ThreatsStatCards from "@/components/threats/ThreatsStatCards";
import ThreatWorldMapWrapper from "@/components/threats/ThreatWorldMapWrapper";

export default async function ThreatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title={locale === "ar" ? "استخبارات ورصد التهديدات" : locale === "fr" ? "Surveillance des Menaces" : "Threat Intelligence"} />
        <div className="page-content">
          <ThreatsStatCards />
          <div className="card animate-fade-in" style={{ marginBlockStart: "var(--space-lg)", animationDelay: "300ms" }}>
            <div className="card-header">
              <h3 className="card-title">{locale === "ar" ? "مصادر التهديدات السيبرانية" : locale === "fr" ? "Sources des Menaces Globales" : "Global Threat Sources"}</h3>
            </div>
            <ThreatWorldMapWrapper locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
