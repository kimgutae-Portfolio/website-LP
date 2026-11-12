import type { Metadata } from "next";
import { SuiWebsite } from "@/components/demo/sui/SuiWebsite";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "sui hair atelier｜切った日よりも、その先の毎日を。― 美容室サイト制作見本",
  description: "店内の雰囲気と、髪のお悩みから選べるメニュー・料金を紹介する美容室サイトの制作見本。外部予約サイトとLINEへの導線を備えた、架空のヘアサロンです。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/demo/sui" },
  openGraph: {
    title: "sui hair atelier ― 切った日よりも、その先の毎日を。",
    description: "サロンの空間と、髪のお悩みからメニューを選べる美容室サイトの制作見本。",
    url: "/demo/sui",
    images: [{ url: "/demo/sui/interior.webp", width: 1536, height: 1024, alt: "自然光が入るsui hair atelierの店内イメージ" }],
  },
};

export default function SuiDemo() {
  return <SuiWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図（実在するサロンの所在地ではありません）" zoom={13}/>} />;
}
