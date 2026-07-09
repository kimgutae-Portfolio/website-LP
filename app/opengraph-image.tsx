import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

/**
 * OG 이미지 (LINE·메일로 링크 공유 시 미리보기 카드)
 * 빌드 시 정적 생성됨. 일본어 글리프는 Google Fonts에서
 * 사용 문자만 서브셋으로 받아와 렌더링 (satori는 woff2 미지원 → UA 없이 fetch하면 ttf 반환)
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.meta.siteName;

const BADGE = "堺市の店舗・事業所向けホームページ制作";
const PRICE_LABEL_1 = "初期費用";
const PRICE_VALUE_1 = "0円";
const PRICE_LABEL_2 = "・月額";
const PRICE_VALUE_2 = "5,500円";
const PRICE_TAX = "（税込）";
const SUB = "制作から、更新・管理までまるごとおまかせ";
const SITE_NAME = "まちのWeb";
const DOMAIN = "machinowebs.com";

async function loadGoogleFont(weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error("OG font load failed");
  return (await fetch(match[1])).arrayBuffer();
}

export default async function OgImage() {
  const allText =
    BADGE + PRICE_LABEL_1 + PRICE_VALUE_1 + PRICE_LABEL_2 + PRICE_VALUE_2 + PRICE_TAX + SUB + SITE_NAME + DOMAIN;
  const [bold, black] = await Promise.all([
    loadGoogleFont(700, allText),
    loadGoogleFont(900, allText),
  ]);

  const { primary, primaryDark, accent } = siteConfig.theme;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
          fontFamily: "NotoSansJP",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            background: accent,
            borderRadius: 9999,
            padding: "12px 36px",
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 44,
          }}
        >
          {BADGE}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontWeight: 900,
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 56 }}>{PRICE_LABEL_1}</span>
          <span style={{ fontSize: 110, color: "#ffe27a" }}>{PRICE_VALUE_1}</span>
          <span style={{ fontSize: 56 }}>{PRICE_LABEL_2}</span>
          <span style={{ fontSize: 110, color: "#ffe27a" }}>{PRICE_VALUE_2}</span>
          <span style={{ fontSize: 40 }}>{PRICE_TAX}</span>
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, opacity: 0.95 }}>
          {SUB}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 64,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              background: "#ffffff",
              color: primary,
              borderRadius: 16,
              padding: "8px 24px",
              fontWeight: 900,
            }}
          >
            {SITE_NAME}
          </span>
          <span style={{ opacity: 0.85 }}>{DOMAIN}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoSansJP", data: bold, weight: 700 },
        { name: "NotoSansJP", data: black, weight: 900 },
      ],
    },
  );
}
