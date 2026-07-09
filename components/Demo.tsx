import Link from "next/link";
import { siteConfig } from "@/site.config";
import { SectionHeading } from "./SectionHeading";
import { ExternalIcon } from "./icons";

export function Demo() {
  const { demos } = siteConfig;
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label="制作イメージ" title="どんなホームページができるの？" />

        {/* 이 LP 자체가 실물 견본이라는 소구 포인트 */}
        <div className="mb-10 rounded-2xl border-2 border-primary/20 bg-primary-light p-6 sm:p-8">
          <p className="leading-relaxed text-slate-800">
            <span className="mb-1 block font-bold text-primary">
              このページが「実物見本」です
            </span>
            {demos.selfSample}
          </p>
        </div>

        <p className="mb-8 text-center leading-relaxed text-slate-600">
          {demos.intro}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demos.items.map((demo) => {
            const isReady = demo.url !== "";
            const card = (
              <div
                className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition ${
                  isReady
                    ? "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"
                    : "border-dashed border-slate-300"
                }`}
              >
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
                    {demo.pattern}
                  </span>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {demo.category}
                  </span>
                </div>
                <h3 className="mb-1 font-bold text-slate-900">{demo.name}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {demo.description}
                </p>
                {isReady ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    デモサイトを見る
                    <ExternalIcon />
                  </span>
                ) : (
                  <span className="inline-block w-fit rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-400">
                    {demos.comingSoonLabel}
                  </span>
                )}
              </div>
            );
            return isReady ? (
              <Link key={demo.name} href={demo.url}>
                {card}
              </Link>
            ) : (
              <div key={demo.name}>{card}</div>
            );
          })}
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">{demos.note}</p>
      </div>
    </section>
  );
}
