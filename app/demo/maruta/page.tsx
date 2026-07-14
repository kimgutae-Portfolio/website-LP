import type { Metadata } from "next";
import { DemoCredit, DemoShell, DemoSocialLinks } from "@/components/demo/DemoShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  MarutaDishIllust,
  MarutaHeroIllust,
  MarutaOwnerIllust,
} from "@/components/demo/illustrations";
import { MapEmbed } from "@/components/MapEmbed";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "お食事処 吉田（デモサイト）",
  robots: { index: false },
};

/**
 * デモC: 飲食店 — 個性・こだわりパターン
 * 縦書きの見出し×判子マーク×左罫線見出しの「日本の老舗」型レイアウト
 */

const news = [
  ["2026.07.07", "鱧（はも）の湯引き、はじめました。夏の間だけのお楽しみです。"],
  ["2026.07.02", "7月の定休日は毎週水曜です。祝前日は満席になりやすいため、ご予約をおすすめします。"],
  ["2026.06.25", "お持ち帰り（出汁巻き・炊き込みご飯）はじめました。お電話でご予約ください。"],
];

// 예약 링크: 실제 고객 사이트에서는 사용 중인 예약 서비스(食べログ・ホットペッパー 등)의
// 자기 가게 페이지 URL로 교체하는 자리. 데모에서는 예약 사이트 톱으로 연결.
const reserveUrl = "https://tabelog.com/";

const kanjiNumbers = ["壱", "弐", "参"];

const recommends = [
  {
    name: "炭火焼き 本日の魚",
    price: "¥1,320",
    text: "毎朝市場で仕入れる旬の魚を、備長炭でじっくりと。",
    dish: "fish",
  },
  {
    name: "吉田の出汁巻き",
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

/* 左罫線つき見出し (このデモ共通の見出しスタイル) */
function BarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 border-l-4 border-amber-400 pl-4 text-2xl font-black text-stone-100">
      {children}
    </h2>
  );
}

export default function MarutaDemo() {
  return (
    <DemoShell>
      <div className="bg-stone-900 text-stone-100" style={{ fontSize: "17px" }}>
        {/* ヒーロー: 縦書きの見出し + 判子マーク */}
        <section className="px-5 pb-14 pt-12 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-4xl grid-cols-[1fr_auto] items-start gap-7 sm:gap-14">
            <div className="animate-fade-up">
              <p className="mb-4 text-sm font-bold tracking-[0.3em] text-amber-400">
                堺・炭火と季節料理
              </p>
              {/* 히어로 배너 캐러셀: 사진 여러 장을 자동 전환하는 견본 */}
              <HeroCarousel
                className="h-52 w-full rounded-2xl sm:h-72"
                slides={[
                  <MarutaHeroIllust key="sakana" className="h-full w-full" />,
                  <MarutaDishIllust key="tamago" dish="tamago" className="h-full w-full" />,
                  <MarutaDishIllust key="rice" dish="rice" className="h-full w-full" />,
                ]}
              />
              <p className="mt-6 max-w-xl leading-loose text-stone-300">
                お食事処 吉田は、カウンター8席の小さな店です。
                その日いちばんの魚と、あたたかい家庭の味を。
              </p>
              <a
                href={reserveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block rounded-full bg-amber-400 px-8 py-3.5 text-lg font-black text-stone-900 shadow-md transition hover:bg-amber-300"
              >
                ご予約はこちらから
              </a>
            </div>
            <div
              className="animate-fade-up flex flex-col items-center gap-6 pt-1"
              style={{ animationDelay: "200ms" }}
            >
              <h1
                style={{ writingMode: "vertical-rl" }}
                className="text-3xl font-black leading-snug tracking-[0.18em] sm:text-5xl"
              >
                炭火と、季節のさかな。
              </h1>
              <span
                style={{ writingMode: "vertical-rl" }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-red-600/90 text-xl font-black tracking-widest text-red-500"
              >
                吉田
              </span>
            </div>
          </div>
        </section>

        {/* お知らせ */}
        <section className="mx-auto max-w-2xl px-5 py-14 sm:py-16">
          <Reveal>
          <BarHeading>お知らせ</BarHeading>
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
          </Reveal>
        </section>

        {/* おすすめ */}
        <section className="bg-stone-950 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <Reveal>
              <BarHeading>おすすめの一品</BarHeading>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {recommends.map((item, i) => (
                <Reveal
                  key={item.name}
                  delay={i * 100}
                  className="relative overflow-hidden rounded-2xl bg-stone-800"
                >
                  <span className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-lg font-black text-stone-900">
                    {kanjiNumbers[i]}
                  </span>
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
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-stone-500">
              ※価格はすべて税込です
            </p>
          </div>
        </section>

        {/* こだわり: 横並び */}
        <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <Reveal>
          <BarHeading>店主のこだわり</BarHeading>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <MarutaOwnerIllust className="block h-32 w-32 shrink-0 rounded-full" />
            <div className="text-center sm:text-left">
              <p className="leading-loose text-stone-300">
                派手なことはできませんが、出汁と炭火だけは誰にも負けません。
                一人でやっている小さな店です。ゆっくり飲みに来てください。
              </p>
              <p className="mt-4 text-sm font-bold text-stone-400">店主・吉田 健一</p>
            </div>
          </div>
          </Reveal>
        </section>

        {/* 店舗情報 */}
        <section className="bg-stone-950 py-14 sm:py-20">
          <Reveal className="mx-auto max-w-xl px-5">
            <BarHeading>店舗情報</BarHeading>
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
              title="お食事処 吉田周辺の地図"
              className="mt-6 block h-56 w-full rounded-2xl"
            />
            <p className="mt-2 text-xs text-stone-500">
              ※デモサイトのため、堺市周辺の地図を表示しています
            </p>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-xl px-5">
            <h2 className="text-xl font-bold">ご予約・お問い合わせ</h2>
            <a
              href={reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-amber-400 px-10 py-4 text-lg font-black text-stone-900 shadow-md transition hover:bg-amber-300"
            >
              ネット予約はこちらから
            </a>
            <p className="mt-2 text-xs text-stone-500">
              ※デモサイトのため、予約サイトのトップページへ移動します
            </p>
            <p className="mt-6 text-sm text-stone-400">お電話でのご予約</p>
            <p className="mt-1 text-3xl font-black tracking-wide text-amber-400">
              072-000-0000
            </p>
            <p className="mt-2 text-sm text-stone-400">
              営業時間内にお電話ください（水曜定休）
            </p>
          </Reveal>
        </section>

        <footer className="border-t border-stone-800 py-8 text-center text-sm text-stone-500">
          <DemoSocialLinks className="mb-4" />
          © 2026 お食事処 吉田（架空の店舗）
          <DemoCredit />
        </footer>
      </div>
    </DemoShell>
  );
}
