import type { Metadata } from "next";
import { KasaneWebsite } from "@/components/demo/kasane/KasaneWebsite";

export const metadata: Metadata = {
  title: "KASANE｜株式会社かさね ― コーポレートサイト デザインデモ",
  description:
    "想いを重ね、街の、その先へ。建築・空間デザイン会社を想定した、まちのWebのコーポレートサイト制作見本です。",
  robots: { index: false, follow: true },
  alternates: { canonical: "/demo/kasane" },
  openGraph: {
    title: "KASANE ― 想いを重ね、街の、その先へ。",
    description: "建築・空間デザイン会社のコーポレートサイト制作見本。",
    url: "/demo/kasane",
    images: [{ url: "/demo/kasane/hero-no-people.webp", width: 1600, height: 900 }],
  },
};

export default function KasaneDemo() {
  return <KasaneWebsite />;
}
