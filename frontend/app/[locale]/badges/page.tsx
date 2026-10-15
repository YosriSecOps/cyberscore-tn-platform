import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BadgesClient from "@/components/badges/BadgesClient";

export default async function BadgesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const titleText =
    locale === "ar"
      ? "الأوسمة وشارات الثقة السيادية"
      : locale === "fr"
      ? "Badges d'Excellence & Sceau de Confiance"
      : "Achievements & Sovereign Trust Seals";

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title={titleText} />
        <div className="page-content">
          <BadgesClient />
        </div>
      </main>
    </div>
  );
}
