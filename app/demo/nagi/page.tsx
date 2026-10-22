import type { Metadata } from "next";
import { NagiWebsite } from "@/components/demo/nagi/NagiWebsite";
import { MapEmbed } from "@/components/MapEmbed";
export const metadata: Metadata = {
 title: "旅宿 凪｜庭と、静かな時間。― 宿泊施設サイト制作見本",
 description: "庭を眺める和室、季節の食事、ゆっくり過ごす時間。小さな日本の宿の空気を伝えるホームページ制作見本。架空の宿です。",
 robots: { index: false, follow: true }, alternates: { canonical: "/demo/nagi" },
 openGraph: { title: "旅宿 凪 ― 旅の音が、静かになる。", url: "/demo/nagi", images: [{ url: "/demo/nagi/hero.webp", width: 1536, height: 1024 }] },
};
export default function NagiDemo() { return <NagiWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図表示例（実在の宿の所在地ではありません）" zoom={12}/>}/>; }
