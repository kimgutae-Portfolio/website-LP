import type { Metadata } from "next";
import { MichiruWebsite } from "@/components/demo/michiru/MichiruWebsite";
import { MapEmbed } from "@/components/MapEmbed";
export const metadata: Metadata = {
 title: "みちる英語教室｜「話してみたい」が、はじまり。― 英語教室サイト制作見本",
 description: "小さな発見から、英語をじぶんの言葉に。コース、時間割、教室の考え方、体験案内をわかりやすく伝える架空の英語教室サイトです。",
 robots: { index: false, follow: true }, alternates: { canonical: "/demo/michiru" },
 openGraph: { title: "みちる英語教室 ― 「話してみたい」が、はじまり。", url: "/demo/michiru", images: [{ url: "/demo/michiru/hero-no-people.webp", width: 1536, height: 1024 }] },
};
export default function MichiruDemo() { return <MichiruWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図表示例（実在の教室の所在地ではありません）" zoom={12}/>}/>; }
