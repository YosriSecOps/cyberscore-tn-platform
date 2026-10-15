import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import SectorOverviewCards from "@/components/sectors/SectorOverviewCards";
import NationalMapCard from "@/components/sectors/NationalMapCard";
import SitesTable from "@/components/sectors/SitesTable";

const TITLES: Record<string, Record<string, string>> = {
  ar: { sectors: "القطاعات", threats: "التهديدات", predictions: "التنبؤات", badges: "الأوسمة", benchmark: "المقارنة الدولية", history: "السجل", reports: "التقارير" },
  fr: { sectors: "Secteurs", threats: "Menaces", predictions: "Prédictions", badges: "Badges", benchmark: "Benchmark", history: "Historique", reports: "Rapports" },
  en: { sectors: "Sectors", threats: "Threats", predictions: "Predictions", badges: "Badges", benchmark: "Benchmark", history: "History", reports: "Reports" },
};

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = TITLES[locale] || TITLES.en;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title={t.sectors} />
        <div className="page-content">
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
            <SectorOverviewCards />
            <NationalMapCard />
            <SitesTable />
          </div>
        </div>
      </main>
    </div>
  );
}
