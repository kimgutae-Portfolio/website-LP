import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Flow() {
  return (
    <section id="flow" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label="制作の流れ" title="公開まで、かんたん3ステップ" />
        <ol className="grid gap-6 sm:grid-cols-3">
          {siteConfig.flow.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 120}
              className="relative rounded-2xl border border-slate-200 bg-white p-7 pt-9 shadow-sm"
            >
              <span className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-black text-white shadow-md">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              {step.highlight && (
                // 지역 밀착 차별화 포인트 강조
                <p className="mb-2 inline-block rounded-md bg-accent/10 px-2.5 py-1 text-sm font-bold text-accent">
                  {step.highlight}
                </p>
              )}
              <p className="text-[15px] leading-relaxed text-slate-600">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
