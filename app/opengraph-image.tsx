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

const BADGE = "「こうしたい」を、自由につくる。";
const PRICE_LABEL_1 = "制作初期費用";
const PRICE_VALUE_1 = `${siteConfig.pricing.initialCost}円〜`;
const PRICE_LABEL_2 = "月額運用費";
const PRICE_VALUE_2 = `${siteConfig.pricing.monthlyFrom}円〜`;
const PRICE_TAX = `（${siteConfig.pricing.priceTaxNote}）`;
const SUB = "初期0円は基本構成の場合。追加ページ・演出・機能は別途お見積り。";
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

  const { primary } = siteConfig.theme;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 64px",
          background: "#173f3b",
          fontFamily: "NotoSansJP",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 700,
            color: "#f4f6e9",
          }}
        >
          {BADGE}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            padding: "30px 0",
            borderTop: "1px solid #719189",
            borderBottom: "1px solid #719189",
          }}
        >
          {[[PRICE_LABEL_1, PRICE_VALUE_1], [PRICE_LABEL_2, PRICE_VALUE_2]].map(([label,value])=>(
            <div key={label} style={{display:"flex",flexDirection:"column",flex:1}}>
              <span style={{fontSize:25,color:"#c5d8c5",fontWeight:700}}>{label}</span>
              <div style={{display:"flex",alignItems:"baseline",marginTop:9,gap:10}}><span style={{fontSize:78,fontWeight:900,letterSpacing:-3,color:"#f5f6ec"}}>{value}</span><span style={{fontSize:17}}>{PRICE_TAX}</span></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 25, fontWeight: 700, color: "#c5d8c5" }}>
          {SUB}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            justifyContent: "space-between",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              background: "#ffffff",
              color: primary,
              padding: "8px 20px",
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
