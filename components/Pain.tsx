import { siteConfig } from "@/site.config";
import { SectionHeading } from "./SectionHeading";

export function Pain() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label="お悩み" title="こんなお悩み、ありませんか？" />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {siteConfig.pains.map((pain, i) => (
            <div
              key={pain.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1.5 font-bold text-slate-900">{pain.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  {pain.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-bold text-primary">
          {siteConfig.painsClosing}
        </p>
      </div>
    </section>
  );
}
