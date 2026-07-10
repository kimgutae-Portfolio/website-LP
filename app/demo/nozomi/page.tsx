import type { Metadata } from "next";
import { DemoShell, DemoSocialLinks } from "@/components/demo/DemoShell";
import { NozomiHeroIllust } from "@/components/demo/illustrations";
import { MapEmbed } from "@/components/MapEmbed";

export const metadata: Metadata = {
  title: "デイサービスのぞみ（デモサイト）",
  robots: { index: false },
};

/**
 * デモA: 介護施設 — 安心・信頼パターン
 * 左寄せ2カラムのヒーロー、カード中心の「情報整理型」レイアウト
 */

const news = [
  ["2026.07.01", "お知らせ", "7月の営業日のご案内。祝日（7/20 海の日）も通常どおり営業します。"],
  ["2026.06.16", "イベント", "夏祭りレクリエーションを開催しました。写真を掲示板に貼り出しています。"],
  ["2026.06.02", "お知らせ", "見学は随時受け付けています。お電話でお気軽にご予約ください。"],
];

const features = [
  {
    title: "送迎つきで安心",
    text: "ご自宅まで専用車でお迎えにあがります。車いすのままご乗車いただけます。",
  },
  {
    title: "無理のない機能訓練",
    text: "理学療法士監修のプログラムで、お一人おひとりのペースに合わせて体を動かします。",
  },
  {
    title: "季節のレクリエーション",
    text: "書道、園芸、季節の行事など。笑顔になれる時間を大切にしています。",
  },
];

const schedule = [
  ["9:00", "お迎え・健康チェック"],
  ["10:00", "入浴・機能訓練"],
  ["12:00", "昼食・休憩"],
  ["14:00", "レクリエーション"],
  ["16:00", "おやつ・お送り"],
];

const overview = [
  ["名称", "デイサービスのぞみ"],
  ["住所", "大阪府堺市◯◯区◯◯町1-2-3"],
  ["営業日", "月曜〜土曜（日曜・年末年始休み）"],
  ["定員", "1日25名"],
  ["電話", "072-000-0000"],
];

const chips = ["送迎あり", "入浴・機能訓練", "見学いつでも歓迎"];

export default function NozomiDemo() {
  return (
    <DemoShell>
      <div className="bg-white text-slate-800" style={{ fontSize: "17px" }}>
        {/* ヘッダー */}
        <header className="border-b border-sky-100 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <p className="text-lg font-bold text-sky-700">デイサービスのぞみ</p>
            <a
              href="#contact"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              見学のご予約
            </a>
          </div>
        </header>

        {/* ヒーロー: 左寄せ2カラム */}
        <section className="bg-sky-50">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:grid-cols-[1.1fr_1fr] sm:py-20">
            <div>
              <p className="mb-3 text-sm font-bold tracking-widest text-sky-600">
                堺市の通所介護（デイサービス）
              </p>
              <h1 className="text-3xl font-bold leading-snug text-slate-900 sm:text-4xl">
                家族のように、
                <br />
                あたたかく。
              </h1>
              <p className="mt-5 max-w-xl leading-relaxed text-slate-600">
                デイサービスのぞみは、ご利用者さまの「できること」を大切にする、
                定員25名の小さなデイサービスです。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-bold text-sky-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <a
                href="#contact"
                className="mt-8 inline-block rounded-full bg-sky-600 px-8 py-4 text-lg font-bold text-white shadow-md transition hover:bg-sky-700"
              >
                見学のご予約はこちら
              </a>
            </div>
            <NozomiHeroIllust className="block h-56 w-full rounded-2xl sm:h-72" />
          </div>
        </section>

        {/* お知らせ */}
        <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
            お知らせ
          </h2>
          <ul className="overflow-hidden rounded-2xl border border-slate-200">
            {news.map(([date, tag, text]) => (
              <li
                key={date}
                className="flex flex-col gap-1.5 border-b border-slate-200 p-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex shrink-0 items-center gap-3">
                  <time className="text-sm font-bold text-sky-600">{date}</time>
                  <span className="rounded-full bg-sky-50 px-3 py-0.5 text-xs font-bold text-sky-700">
                    {tag}
                  </span>
                </span>
                <p className="text-[15px] leading-relaxed text-slate-700">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 特徴 */}
        <section className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
            のぞみの3つの特徴
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="rounded-2xl bg-sky-50 p-6">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-bold text-slate-900">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 一日の流れ */}
        <section className="bg-sky-50 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              一日の流れ
            </h2>
            <ol className="space-y-0">
              {schedule.map(([time, label], i) => (
                <li key={time} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-16 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                      {time}
                    </span>
                    {i < schedule.length - 1 && (
                      <span className="w-0.5 flex-1 bg-sky-200" />
                    )}
                  </div>
                  <p className="pb-7 pt-1.5 font-medium text-slate-700">{label}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 施設概要 */}
        <section className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
            施設概要
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-[15px]">
              <tbody>
                {overview.map(([label, value]) => (
                  <tr key={label} className="border-b border-slate-200 last:border-b-0">
                    <th className="w-28 bg-sky-50 p-4 font-bold text-slate-700">{label}</th>
                    <td className="p-4 text-slate-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MapEmbed
            query="大阪府堺市"
            title="デイサービスのぞみ周辺の地図"
            className="mt-5 block h-56 w-full rounded-2xl"
          />
          <p className="mt-2 text-xs text-slate-400">
            ※デモサイトのため、堺市周辺の地図を表示しています
          </p>
        </section>

        {/* CTA */}
        <section id="contact" className="bg-sky-600 py-14 text-center sm:py-16">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="text-2xl font-bold text-white">
              見学・ご相談は、お気軽にどうぞ
            </h2>
            <p className="mt-3 text-white/85">
              ケアマネジャーさまからのお問い合わせも歓迎です。
            </p>
            <p className="mt-6 text-3xl font-black tracking-wide text-white">
              072-000-0000
            </p>
            <p className="mt-1 text-sm text-white/75">受付時間 9:00〜17:00（月〜土）</p>
          </div>
        </section>

        <footer className="bg-slate-900 py-8 text-center text-sm text-slate-400">
          <DemoSocialLinks className="mb-4" />
          © 2026 デイサービスのぞみ（架空の店舗）
        </footer>
      </div>
    </DemoShell>
  );
}
