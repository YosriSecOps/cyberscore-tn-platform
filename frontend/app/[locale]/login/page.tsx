import { setRequestLocale } from "next-intl/server";
import AuthGateway from "@/components/auth/AuthGateway";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthGateway locale={locale} initialTab="login" />;
}
