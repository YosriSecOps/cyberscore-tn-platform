import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ScannerClient from "@/components/scanner/ScannerClient";

export default async function ScanPage({
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
        <TopBar title={locale === "ar" ? "الماسح الأمني" : locale === "fr" ? "Scanner de Sécurité" : "Security Scanner"} />
        <div className="page-content">
          <ScannerClient />
        </div>
      </main>
    </div>
  );
}
