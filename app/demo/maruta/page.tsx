import type { Metadata } from "next";
import { DemoShell } from "@/components/demo/DemoShell";
import {
  MarutaDishIllust,
  MarutaHeroIllust,
  MarutaOwnerIllust,
} from "@/components/demo/illustrations";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "お食事処 まる田（デモサイト）",
  robots: { index: false },
};

/**
 * デモC: 飲食店 — 個性・こだわりパターン
 * 濃色ベース×力強い見出しで、料理と店主のこだわりを主役にするレイアウト
 */

const news = [
  ["2026.07.07", "鱧（はも）の湯引き、はじめました。夏の間だけのお楽しみです。"],
  ["2026.07.02", "7月の定休日は毎週水曜です。祝前日は満席になりやすいため、ご予約をおすすめします。"],
  ["2026.06.25", "お持ち帰り（出汁巻き・炊き込みご飯）はじめました。お電話でご予約ください。"],
];

const recommends = [
  {
    name: "炭火焼き 本日の魚",
    price: "¥1,320",
    text: "毎朝市場で仕入れる旬の魚を、備長炭でじっくりと。",
    dish: "fish",
  },
  {
    name: "まる田の出汁巻き",
    price: "¥660",
    text: "注文を受けてから一本ずつ巻く、名物の出汁巻き玉子。",
    dish: "tamago",
  },
  {
    name: "季節の炊き込みご飯",
    price: "¥550",
    text: "土鍋で炊き上げる、季節の味。売り切れ御免です。",
    dish: "rice",
  },
] as const;

const info = [
  ["住所", "大阪府堺市◯◯区◯◯町7-8-9"],
  ["営業時間", "17:00〜23:00（L.O. 22:00）"],
  ["定休日", "毎週水曜"],
  ["席数", "カウンター8席・座敷12席"],
  ["電話", "072-000-0000"],
];

export default function MarutaDemo() {
  return (
    <DemoShell>
      <div className="bg-stone-900 text-stone-100" style={{ fontSize: "17px" }}>
        {/* ヒーロー */}
        <section className="px-5 pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-amber-400">
            堺・炭火と季節料理
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            炭火と、
            <br className="sm:hidden" />
            季節のさかな。
          </h1>
          <p className="mx-auto mt-6 max-w-md leading-loose text-stone-300">
            お食事処 まる田は、カウンター8席の小さな店です。
            その日いちばんの魚と、あたたかい家庭の味を。
          </p>
          <MarutaHeroIllust className="mx-auto mt-10 block h-56 w-full max-w-3xl rounded-2xl sm:h-72" />
        </section>

        {/* お知らせ */}
        <section className="mx-auto max-w-2xl px-5 py-14 sm:py-16">
          <h2 className="mb-8 text-center text-2xl font-black text-amber-400">
            お知らせ
          </h2>
          <ul>
            {news.map(([date, text]) => (
              <li
                key={date}
                className="flex flex-col gap-1 border-b border-stone-800 py-4 last:border-b-0 sm:flex-row sm:gap-6"
              >
                <time className="shrink-0 text-sm font-bold tracking-wider text-amber-400">
                  {date}
                </time>
                <p className="text-[15px] leading-relaxed text-stone-300">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* おすすめ */}
        <section className="bg-stone-950 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="mb-10 text-center text-2xl font-black text-amber-400">
              おすすめの一品
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {recommends.map((item) => (
                <div key={item.name} className="overflow-hidden rounded-2xl bg-stone-800">
                  <MarutaDishIllust dish={item.dish} className="block h-36 w-full" />
                  <div className="p-5">
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <h3 className="font-bold">{item.name}</h3>
                      <span className="shrink-0 font-bold text-amber-400">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-stone-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-stone-500">
              ※価格はすべて税込です
            </p>
          </div>
        </section>

        {/* こだわり */}
        <section className="mx-auto max-w-2xl px-5 py-14 text-center sm:py-20">
          <h2 className="mb-6 text-2xl font-black text-amber-400">店主のこだわり</h2>
          <MarutaOwnerIllust className="mx-auto block h-32 w-32 rounded-full" />
          <p className="mt-6 leading-loose text-stone-300">
            派手なことはできませんが、出汁と炭火だけは誰にも負けません。
            一人でやっている小さな店です。ゆっくり飲みに来てください。
          </p>
          <p className="mt-4 text-sm font-bold text-stone-400">店主・丸田 健一</p>
        </section>

        {/* 店舗情報 */}
        <section className="bg-stone-950 py-14 sm:py-20">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="mb-10 text-center text-2xl font-black text-amber-400">
              店舗情報
            </h2>
            <dl>
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="flex gap-6 border-b border-stone-800 py-4 last:border-b-0"
                >
                  <dt className="w-24 shrink-0 text-sm font-bold text-stone-500">
                    {label}
                  </dt>
                  <dd className="text-[15px] text-stone-200">{value}</dd>
                </div>
              ))}
            </dl>
            <MapEmbed
              query="大阪府堺市"
              title="お食事処 まる田周辺の地図"
              className="mt-6 block h-56 w-full rounded-2xl"
            />
            <p className="mt-2 text-xs text-stone-500">
              ※デモサイトのため、堺市周辺の地図を表示しています
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 text-center sm:py-16">
          <div className="mx-auto max-w-xl px-5">
            <h2 className="text-xl font-bold">ご予約・お問い合わせ</h2>
            <p className="mt-4 text-3xl font-black tracking-wide text-amber-400">
              072-000-0000
            </p>
            <p className="mt-2 text-sm text-stone-400">
              営業時間内にお電話ください（水曜定休）
            </p>
          </div>
        </section>

        <footer className="border-t border-stone-800 py-6 text-center text-sm text-stone-500">
          © 2026 お食事処 まる田（架空の店舗）
        </footer>
      </div>
    </DemoShell>
  );
}
