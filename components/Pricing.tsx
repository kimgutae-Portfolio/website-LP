import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { CheckIcon } from "./icons";
import { LineCta } from "./LineCta";

export function Pricing() {
  const { pricing } = siteConfig;
  const { mainPlan, secondPlan, campaign } = pricing;

  return (
    <section id="price" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label="料金" title="わかりやすい料金プラン" />

        {/* 메인 플랜 카드 */}
        <Reveal className="relative mx-auto max-w-2xl rounded-3xl border-2 border-primary bg-white p-7 shadow-lg sm:p-10">
          {campaign.enabled && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-5 py-1.5 text-sm font-bold text-white shadow-md">
              {campaign.label}
            </span>
          )}
          <h3 className="mb-6 text-center text-xl font-bold text-slate-900">
            {mainPlan.name}
          </h3>
          <div className="mb-2 flex items-end justify-center gap-1.5">
            <span className="text-lg font-bold text-slate-600">月額</span>
            <span className="text-5xl font-black tracking-tight text-primary sm:text-6xl">
              {mainPlan.priceMonthly}
            </span>
            <span className="pb-1 text-lg font-bold text-slate-600">
              円<span className="text-sm">（{mainPlan.priceTaxNote}）</span>
            </span>
          </div>
          <p className="mb-8 text-center text-lg font-bold text-accent">
            {mainPlan.initialCost}
          </p>
          <ul className="mb-8 space-y-3.5">
            {mainPlan.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mb-8 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600">
            {mainPlan.conditions}
          </p>
          <div className="text-center">
            <LineCta />
          </div>
        </Reveal>

        {/* 화살표 연결 표시 (장식선은 모바일에서 숨겨 줄바꿈 깨짐 방지) */}
        <Reveal className="mx-auto my-6 flex max-w-2xl items-center justify-center gap-2 text-slate-400">
          <span className="hidden h-px w-10 bg-slate-300 sm:block" />
          <span className="text-center text-sm font-medium">
            ページを増やしたい・機能を追加したい方へ
          </span>
          <span className="hidden h-px w-10 bg-slate-300 sm:block" />
        </Reveal>

        {/* 2단계 플랜 카드 (초기비용 청구형) */}
        <Reveal className="relative mx-auto max-w-2xl rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-700 px-5 py-1.5 text-sm font-bold text-white shadow-md">
            {secondPlan.badge}
          </span>
          <h3 className="mb-6 text-center text-xl font-bold text-slate-900">
            {secondPlan.name}
          </h3>
          {/* 라벨을 위로 분리 — 모바일 폭에서 가격 행이 밀려 깨지는 것 방지 */}
          <p className="mb-1 text-center text-lg font-bold text-slate-600">
            初期費用
          </p>
          <div className="mb-1 flex items-end justify-center gap-1.5">
            <span className="text-5xl font-black tracking-tight text-slate-800 sm:text-6xl">
              {secondPlan.initialCost}
            </span>
            <span className="pb-1 text-lg font-bold text-slate-600">
              円〜<span className="text-sm">（{secondPlan.priceTaxNote}）</span>
            </span>
          </div>
          <p className="mb-2 text-center text-sm text-slate-500">
            {secondPlan.initialCostNote}
          </p>
          <p className="mb-8 text-center text-lg font-bold text-primary">
            {secondPlan.monthlyNote}
          </p>
          <ul className="mb-8 space-y-3.5">
            {secondPlan.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mb-8 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600">
            {secondPlan.conditions}
          </p>
          <div className="text-center">
            <LineCta />
          </div>
        </Reveal>

        <ul className="mx-auto mt-8 max-w-4xl space-y-1 text-sm text-slate-500">
          {pricing.notes.map((note) => (
            <li key={note}>※ {note}</li>
          ))}
          {campaign.enabled && <li>{campaign.note}</li>}
        </ul>
      </div>
    </section>
  );
}
