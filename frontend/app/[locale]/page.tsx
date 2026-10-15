import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import StatCards from "@/components/dashboard/StatCards";
import SectorHealth from "@/components/dashboard/SectorHealth";
import AlertFeed from "@/components/dashboard/AlertFeed";
import Leaderboard from "@/components/dashboard/Leaderboard";
import AlertDistribution from "@/components/dashboard/AlertDistribution";

export default async function CommandCenter({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        <div className="page-content">
          {/* KPI Stats */}
          <StatCards />

          {/* Two-column grid: Sector Health + Alert Feed */}
          <div className="dashboard-grid mt-2xl">
            <div className="card">
              <SectorHealth />
            </div>
            <div className="card">
              <AlertFeed />
            </div>
          </div>

          {/* Bottom Grid: Leaderboard + Alert Distribution */}
          <div className="dashboard-grid mt-2xl" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <div className="card">
              <Leaderboard />
            </div>
            <div className="card">
              <AlertDistribution />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
