import { setRequestLocale } from "next-intl/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AdminClient from "@/components/admin/AdminClient";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title={locale === "ar" ? "مركز إدارة النظام والسياسات" : "Administration & Gouvernance"} />
        <AdminClient locale={locale} />
      </main>
    </div>
  );
}

