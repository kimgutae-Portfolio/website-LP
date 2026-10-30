import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleMeasurement } from "@/components/analytics/GoogleMeasurement";
import { siteConfig } from "@/site.config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  metadataBase: new URL(siteConfig.meta.url),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    url: siteConfig.meta.url,
    siteName: siteConfig.meta.siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.meta.siteName}｜堺市のホームページ制作`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: ["/opengraph-image"],
  },
  ...(siteConfig.meta.googleSiteVerification
    ? { verification: { google: siteConfig.meta.googleSiteVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // site.config.ts의 테마 색을 CSS 변수로 주입 (globals.css의 @theme inline과 연결)
  const themeVars = {
    "--sc-primary": siteConfig.theme.primary,
    "--sc-primary-dark": siteConfig.theme.primaryDark,
    "--sc-primary-light": siteConfig.theme.primaryLight,
    "--sc-accent": siteConfig.theme.accent,
  } as React.CSSProperties;

  return (
    <html lang="ja" style={themeVars}>
      <body className={`${notoSansJP.className} ${notoSansJP.variable} bg-white text-slate-800 antialiased`}>
        {/* JS 미작동 환경에서 스크롤 리빌 요소가 숨겨진 채 남지 않도록 하는 폴백 */}
        <noscript>
          <style>{`.reveal,.reveal[data-reveal="wipe"]>*,.reveal [data-gallery-card]>*{--reveal-progress:1!important;opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}`}</style>
        </noscript>
        {children}
        <GoogleMeasurement />
        <Analytics />
      </body>
    </html>
  );
}
