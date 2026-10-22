import type { Metadata } from "next";
import { SumitokiWebsite } from "@/components/demo/sumitoki/SumitokiWebsite";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "炭と季 SUMITOKI｜炭の香り、季節のつづき。― 飲食店サイト制作見本",
  description: "旬の食材と炭火料理を楽しむ小さなビストロを想定した、まちのWebの飲食店ホームページ制作見本。料理、店内、SNS投稿、外部予約サイトへの導線をご覧いただけます。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/demo/sumitoki" },
  openGraph: {
    title: "炭と季 SUMITOKI ― 炭の香り、季節のつづき。",
    description: "写真と余韻で伝える、飲食店のホームページ制作見本。",
    url: "/demo/sumitoki",
    images: [{ url: "/demo/sumitoki/hero-no-people.webp", width: 1600, height: 1000 }],
  },
};

export default function SumitokiDemo() { return <SumitokiWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図（デモ）" zoom={13} />} />; }
