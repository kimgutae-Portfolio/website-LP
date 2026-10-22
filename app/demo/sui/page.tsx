import type { Metadata } from "next";
import { SuiWebsite } from "@/components/demo/sui/SuiWebsite";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "sui hair atelier｜似合う、の先に。あなたらしい髪を。― 美容室サイト制作見本",
  description: "スタイルの写真と、丁寧なカウンセリングの考え方を伝える美容室ホームページの制作見本。LOOKBOOK、メニュー、サロン、初めての方へのご案内。架空のヘアサロンです。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/demo/sui" },
  openGraph: {
    title: "sui hair atelier ― 似合う、の先に。あなたらしい髪を。",
    description: "写真、余白、髪のディテールで伝える、ヘアサロンのオリジナルデザイン制作見本。",
    url: "/demo/sui",
    images: [{ url: "/demo/sui/hero.webp", width: 1600, height: 900 }],
  },
};

export default function SuiDemo() {
  return <SuiWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図（実在するサロンの所在地ではありません）" zoom={13}/>} />;
}
