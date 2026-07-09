/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/site.config";
import { SectionHeading } from "./SectionHeading";
import { ExternalIcon, PersonIcon } from "./icons";

export function Owner() {
  const { owner } = siteConfig;
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading label="運営者" title="ご相談は、堺在住の私が直接承ります" />
        <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-start sm:p-10">
          {/* 얼굴 사진: config에 경로 지정 시 표시, 없으면 placeholder */}
          {owner.photo ? (
            <img
              src={owner.photo}
              alt={`${owner.name}の写真`}
              width={128}
              height={128}
              className="h-32 w-32 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <PersonIcon className="h-14 w-14" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-primary">{owner.title}</p>
            <p className="mb-1 text-xl font-bold text-slate-900">{owner.name}</p>
            <p className="mb-4 text-sm text-slate-500">{siteConfig.meta.siteName}</p>
            <p className="mb-6 leading-relaxed text-slate-700">{owner.message}</p>
            <a
              href={owner.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-primary underline underline-offset-4 transition hover:text-primary-dark"
            >
              {owner.portfolioLabel}
              <ExternalIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
