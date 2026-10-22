import type { Metadata } from "next";
import { SekkaWebsite } from "@/components/demo/sekka/SekkaWebsite";
export const metadata: Metadata = {
 title: "SEKKA｜セッカ精工 ― 精密金属加工の企業サイト制作見本",
 description: "金属の質感と、現場の考え方を伝える製造業ホームページの制作見本。加工紹介、製品例、品質管理、会社案内。架空の企業です。",
 robots: { index: false, follow: true }, alternates: { canonical: "/demo/sekka" },
 openGraph: { title: "SEKKA PRECISION ― 精度は、信頼になる。", url: "/demo/sekka", images: [{ url: "/demo/sekka/hero.webp", width: 1536, height: 1024 }] },
};
export default function SekkaDemo() { return <SekkaWebsite/>; }
