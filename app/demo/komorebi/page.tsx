import type { Metadata } from "next";
import { KomorebiWebsite } from "@/components/demo/komorebi/KomorebiWebsite";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "こもれび こどもクリニック｜こどもと、家族と、一歩ずつ。― 制作見本",
  description: "森のともだちが迎える、やさしい小児科ホームページの制作見本。診療のご案内、初診の流れ、診療時間、よくあるご質問をわかりやすく。架空のクリニックです。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/demo/komorebi" },
  openGraph: {
    title: "こもれび こどもクリニック ― こどもと、家族と、一歩ずつ。",
    description: "森のともだちと、はじめての安心。小児科サイトのオリジナルデザイン制作見本。",
    url: "/demo/komorebi",
    images: [{ url: "/demo/komorebi/forest-friends.webp", width: 1536, height: 1024 }],
  },
};

export default function KomorebiDemo() {
  return <KomorebiWebsite map={<MapEmbed query="堺市" title="堺市周辺の地図（実在する医院の所在地ではありません）" zoom={13} />} />;
}
