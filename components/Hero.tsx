import { siteConfig } from "@/site.config";
import { LineCta } from "./LineCta";
import { CheckIcon } from "./icons";
import { jaPhrases } from "./jaText";

// 히어로 우측: 스마트폰 목업 (이미지 없이 CSS로 구성 — "스마트폰에서 완벽"의 시각화)
function PhoneMockup() {
  return (
    <div className="animate-float relative mx-auto w-[240px] sm:w-[260px]">
      <div className="rounded-[2.2rem] border-[10px] border-slate-800 bg-white shadow-2xl">
        <div className="overflow-hidden rounded-[1.6rem]">
          {/* 미니 히어로 */}
          <div className="bg-primary px-4 pb-5 pt-4 text-white">
            <div className="mb-3 h-2 w-14 rounded-full bg-white/50" />
            <div className="mb-1.5 h-3 w-full rounded-full bg-white/90" />
            <div className="mb-4 h-3 w-3/4 rounded-full bg-white/90" />
            <div className="h-7 w-28 rounded-full bg-line" />
          </div>
          {/* 미니 콘텐츠 */}
          <div className="space-y-3 px-4 py-4">
            <div className="flex gap-2">
              <div className="h-14 flex-1 rounded-lg bg-slate-100" />
              <div className="h-14 flex-1 rounded-lg bg-slate-100" />
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200" />
            <div className="h-2.5 w-5/6 rounded-full bg-slate-200" />
            <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
            <div className="mx-auto h-8 w-32 rounded-full bg-primary" />
          </div>
        </div>
      </div>
      <span className="absolute -right-3 top-6 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-md">
        スマホ最適化
      </span>
    </div>
  );
}

export function Hero() {
  const { hero } = siteConfig;
  return (
    <section id="top" className="bg-gradient-to-b from-primary-light to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="animate-fade-up mb-5 flex flex-wrap gap-2">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white px-3 py-1 text-sm font-bold text-primary"
              >
                <CheckIcon className="h-3.5 w-3.5" />
                {badge}
              </span>
            ))}
          </div>
          <h1
            className="animate-fade-up text-3xl font-bold leading-snug text-slate-900 sm:text-4xl sm:leading-snug"
            style={{ animationDelay: "100ms" }}
          >
            <span className="mb-1 block text-primary">
              {jaPhrases(hero.catchTop)}
            </span>
            {jaPhrases(hero.catchMain)}
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: "200ms" }}
          >
            {jaPhrases(hero.sub, 17)}
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "300ms" }}
          >
            <LineCta />
            <a
              href="#price"
              className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-3.5 text-lg font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              料金を見る
            </a>
          </div>
          <p
            className="animate-fade-up mt-5 text-sm text-slate-500"
            style={{ animationDelay: "400ms" }}
          >
            {jaPhrases("月額5,500円（税込）・初期費用0円。", 20)}
            {siteConfig.pricing.campaign.enabled && (
              <span className="inline-block font-bold text-accent">
                {" "}
                {siteConfig.pricing.campaign.label}
              </span>
            )}
          </p>
        </div>
        <div className="animate-fade-up hidden sm:block" style={{ animationDelay: "250ms" }}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
