import type { Metadata } from "next";
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
 * 余白を活かした落ち着いたトーン・メニューと料金が主役のレイアウト
 */

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
      <div className="bg-[#faf7f2] text-stone-800" style={{ fontSize: "17px" }}>
        {/* ヒーロー */}
        <section className="px-5 pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
          <p className="mb-4 text-xs font-bold tracking-[0.35em] text-rose-400">
            HAIR SALON
          </p>
          <h1 className="text-4xl font-light tracking-[0.25em] text-stone-900 sm:text-5xl">
            LUCE
          </h1>
          <p className="mx-auto mt-6 max-w-md leading-loose text-stone-500">
            髪を整えると、気持ちも整う。
            <br />
            堺の小さな隠れ家サロンです。
          </p>
          <LuceHeroIllust className="mx-auto mt-10 block h-56 w-full max-w-3xl sm:h-72" />
        </section>

        {/* お知らせ */}
        <section className="bg-white py-14 sm:py-16">
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
        <section className="mx-auto max-w-2xl px-5 py-14 text-center sm:py-16">
          <h2 className="mb-6 text-sm font-bold tracking-[0.3em] text-rose-400">
            CONCEPT
          </h2>
          <p className="leading-loose text-stone-600">
            マンツーマンの完全予約制。
            周りを気にせず、ゆっくりと過ごしていただけます。
            骨格と髪質に合わせた「扱いやすいスタイル」で、
            毎朝のセットを楽にします。
          </p>
        </section>

        {/* メニュー */}
        <section className="bg-white py-14 sm:py-20">
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

        {/* スタイリスト */}
        <section className="mx-auto max-w-2xl px-5 py-14 text-center sm:py-20">
          <h2 className="mb-10 text-sm font-bold tracking-[0.3em] text-rose-400">
            STYLIST
          </h2>
          <LuceStylistIllust className="mx-auto block h-36 w-36 rounded-full" />
          <p className="mt-5 font-bold text-stone-900">store owner / 佐藤 ひかり</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-loose text-stone-500">
            都内サロンで10年勤務ののち、地元の堺で開業。
            「おまかせ」も大歓迎です。なりたい雰囲気を一緒に見つけましょう。
          </p>
        </section>

        {/* 店舗情報 */}
        <section className="bg-white py-14 sm:py-20">
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
        <section className="py-14 text-center sm:py-16">
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
