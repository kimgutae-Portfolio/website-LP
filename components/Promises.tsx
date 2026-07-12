import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { BoltIcon, ChartIcon, LineIcon } from "./icons";

const iconMap = {
  line: LineIcon,
  chart: ChartIcon,
  bolt: BoltIcon,
} as const;

/** 차별화 소구 섹션: 공지 무제한 / 월 리포트 / 시스템 확장(업셀 복선) */
export function Promises() {
  const { promises } = siteConfig;
  return (
    <section className="bg-primary-light py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label={promises.label} title={promises.title} />
        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {promises.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="rounded-2xl bg-white p-7 shadow-sm"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
