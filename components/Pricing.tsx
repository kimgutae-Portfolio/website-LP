import { siteConfig } from "@/site.config";
import { SectionHeading } from "./SectionHeading";
import { CheckIcon } from "./icons";
import { LineCta } from "./LineCta";

export function Pricing() {
  const { pricing } = siteConfig;
  const { mainPlan, campaign } = pricing;

  return (
    <section id="price" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label="料金" title="わかりやすい、ひとつの月額プラン" />

        {/* 메인 플랜 카드 */}
        <div className="relative mx-auto max-w-2xl rounded-3xl border-2 border-primary bg-white p-7 shadow-lg sm:p-10">
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
        </div>

        {/* 옵션 (간단 언급 + 상위 플랜 확장 여지를 둔 레이아웃) */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {pricing.options.map((option) => (
            <div
              key={option.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="mb-1 font-bold text-slate-900">{option.name}</h4>
              <p className="mb-3 font-bold text-primary">{option.price}</p>
              <p className="text-sm leading-relaxed text-slate-600">
                {option.description}
              </p>
            </div>
          ))}
        </div>

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
