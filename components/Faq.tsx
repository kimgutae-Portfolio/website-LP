import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <section id="faq" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading label="FAQ" title="よくある質問" />
        <Reveal className="space-y-3">
          {siteConfig.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold text-slate-900 sm:p-6">
                <span className="flex gap-3">
                  <span className="shrink-0 text-primary">Q.</span>
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary transition-transform group-open:rotate-45"
                >
                  ＋
                </span>
              </summary>
              <div className="flex gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
                <span className="shrink-0 font-bold text-accent">A.</span>
                <p className="leading-relaxed text-slate-700">{item.a}</p>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
