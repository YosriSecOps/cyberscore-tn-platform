import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans_Arabic, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import "../../styles/globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const RTL_LOCALES = ["ar"];

export const metadata: Metadata = {
  title: "CyberScore TN — منصة تقييم الأمن السيبراني",
  description:
    "AI-Powered Cybersecurity Scoring Platform for Tunisian Government Websites",
  icons: {
    icon: [
      { url: "/images/logo-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo-icon.png" },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, cookieStore] = await Promise.all([
    getMessages(),
    cookies(),
  ]);
  const theme = cookieStore.get("cyberscore_theme")?.value === "light" ? "light" : "dark";
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  const fontClass =
    locale === "ar"
      ? `${notoArabic.variable} ${notoArabic.className}`
      : `${inter.variable} ${inter.className}`;

  return (
    <html lang={locale} dir={dir} data-theme={theme} suppressHydrationWarning>
      <body className={`${fontClass} soc-theme`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
