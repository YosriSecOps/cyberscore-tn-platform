import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import PredictionsClient from "@/components/predictions/PredictionsClient";

export default async function PredictionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title={locale === "ar" ? "التحليلات الاستشرافية والتنبؤات" : locale === "fr" ? "Prédictions Cyber & Tendances" : "Cyber Predictions & Trends"} />
        <div className="page-content">
          <PredictionsClient locale={locale} />
        </div>
      </main>
    </div>
  );
}
