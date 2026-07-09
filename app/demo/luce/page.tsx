import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import { DemoShell } from "@/components/demo/DemoShell";
import {
  LuceHeroIllust,
  LuceStylistIllust,
} from "@/components/demo/illustrations";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "hair salon LUCE（デモサイト）",
  robots: { index: false },
};

/**
 * デモB: 美容室 — 上品・洗練パターン
 * 明朝体（Noto Serif JP）×余白のエディトリアル型レイアウト。
 * 全面写真の上に名刺カードを重ねるヒーローで、他パターンと構造を変えている。
 */
const serif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const news = [
  ["2026.07.05", "夏季休業のお知らせ：8月13日（木）〜15日（土）はお休みをいただきます。"],
  ["2026.06.20", "7月限定でヘッドスパが¥2,200に。ご予約時に「HPを見た」とお伝えください。"],
  ["2026.06.01", "ホームページを公開しました。ご予約はLINEからどうぞ。"],
];

const menu = [
  ["カット", "¥4,400"],
  ["カット + カラー", "¥9,900"],
  ["カット + パーマ", "¥11,000"],
  ["トリートメント", "¥3,300"],
  ["ヘッドスパ（20分）", "¥2,750"],
];

const info = [
  ["住所", "大阪府堺市◯◯区◯◯町4-5-6"],
  ["営業時間", "9:30〜19:00（最終受付 18:00）"],
  ["定休日", "毎週月曜・第2火曜"],
  ["座席", "セット面3席（半個室1席）"],
];

export default function LuceDemo() {
  return (
    <DemoShell>
      <div
        className={`${serif.className} bg-[#faf7f2] text-stone-800`}
        style={{ fontSize: "17px" }}
      >
        {/* ヒーロー: 全面イラスト + 重なる名刺カード */}
        <section className="pb-14 sm:pb-16">
          <LuceHeroIllust className="block h-64 w-full sm:h-80" />
          <div className="relative mx-auto -mt-16 max-w-md border border-stone-200 bg-white px-8 py-9 text-center shadow-sm">
            <p className="text-xs font-bold tracking-[0.35em] text-rose-400">
              HAIR SALON
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-[0.3em] text-stone-900">
              LUCE
            </h1>
            <p className="mt-5 text-sm leading-loose text-stone-500">
              髪を整えると、気持ちも整う。
              <br />
              堺の小さな隠れ家サロンです。
            </p>
          </div>
        </section>

        {/* お知らせ */}
        <section className="pb-14 sm:pb-16">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="mb-8 text-center text-sm font-bold tracking-[0.3em] text-rose-400">
              NEWS
            </h2>
            <ul>
              {news.map(([date, text]) => (
                <li
                  key={date}
                  className="flex flex-col gap-1 border-b border-dotted border-stone-300 py-4 last:border-b-0 sm:flex-row sm:gap-6"
                >
                  <time className="shrink-0 text-sm font-bold tracking-wider text-rose-400">
                    {date}
                  </time>
                  <p className="text-[15px] leading-relaxed text-stone-600">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* コンセプト */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <h2 className="mb-6 text-sm font-bold tracking-[0.3em] text-rose-400">
              CONCEPT
            </h2>
            <p className="leading-loose text-stone-600">
              マンツーマンの完全予約制。
              周りを気にせず、ゆっくりと過ごしていただけます。
              骨格と髪質に合わせた「扱いやすいスタイル」で、
              毎朝のセットを楽にします。
            </p>
          </div>
        </section>

        {/* メニュー */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="mb-10 text-center text-sm font-bold tracking-[0.3em] text-rose-400">
              MENU
            </h2>
            <ul>
              {menu.map(([name, price]) => (
                <li
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-dotted border-stone-300 py-4"
                >
                  <span className="font-medium text-stone-800">{name}</span>
                  <span className="shrink-0 text-stone-600">{price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-xs text-stone-400">
              ※すべて税込価格です
            </p>
          </div>
        </section>

        {/* スタイリスト: 横並びカード */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="mb-10 text-center text-sm font-bold tracking-[0.3em] text-rose-400">
              STYLIST
            </h2>
            <div className="flex flex-col items-center gap-8 border border-stone-200 bg-[#faf7f2] p-8 text-center sm:flex-row sm:p-10 sm:text-left">
              <LuceStylistIllust className="block h-36 w-36 shrink-0 rounded-full" />
              <div>
                <p className="text-xs tracking-[0.25em] text-rose-400">OWNER STYLIST</p>
                <p className="mt-1 text-lg font-bold text-stone-900">佐藤 ひかり</p>
                <p className="mt-3 text-[15px] leading-loose text-stone-500">
                  都内サロンで10年勤務ののち、地元の堺で開業。
                  「おまかせ」も大歓迎です。なりたい雰囲気を一緒に見つけましょう。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 店舗情報 */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="mb-10 text-center text-sm font-bold tracking-[0.3em] text-rose-400">
              INFORMATION
            </h2>
            <dl>
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="flex gap-6 border-b border-stone-200 py-4 last:border-b-0"
                >
                  <dt className="w-24 shrink-0 text-sm font-bold text-stone-500">
                    {label}
                  </dt>
                  <dd className="text-[15px] text-stone-700">{value}</dd>
                </div>
              ))}
            </dl>
            <MapEmbed
              query="大阪府堺市"
              title="hair salon LUCE周辺の地図"
              className="mt-6 block h-56 w-full"
            />
            <p className="mt-2 text-xs text-stone-400">
              ※デモサイトのため、堺市周辺の地図を表示しています
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-14 text-center sm:py-16">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="text-xl font-bold text-stone-900">
              ご予約は、LINEでどうぞ
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-stone-500">
              メッセージで「希望日時・メニュー」をお送りください。
              その日のうちにお返事します。
            </p>
            <span className="mt-6 inline-block rounded-full bg-line px-10 py-4 text-lg font-bold text-white shadow-md">
              LINEで予約する
            </span>
            <p className="mt-3 text-xs text-stone-400">
              ※デモサイトのため、ボタンは動作しません
            </p>
          </div>
        </section>

        <footer className="bg-stone-900 py-6 text-center text-sm text-stone-400">
          © 2026 hair salon LUCE（架空の店舗）
        </footer>
      </div>
    </DemoShell>
  );
}
