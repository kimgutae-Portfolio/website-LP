/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/site.config";
import { ContactForm } from "./ContactForm";
import { LineCta } from "./LineCta";
import { Reveal } from "./Reveal";

export function Cta() {
  const { contact, line } = siteConfig;
  return (
    <section id="contact" className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
            {contact.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
            {contact.sub}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LINE 상담 카드 (주요 CTA) */}
          <Reveal className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg sm:p-10">
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              {contact.lineCardTitle}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              {contact.lineCardText}
            </p>
            {/* QR: config에 이미지 지정 시 표시, 없으면 placeholder */}
            {line.qrImage ? (
              <img
                src={line.qrImage}
                alt="LINE友だち追加QRコード"
                width={160}
                height={160}
                className="mb-6 h-40 w-40 rounded-xl border border-slate-200"
              />
            ) : (
              <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-bold text-slate-400">
                QRコード
                <br />
                準備中
              </div>
            )}
            <LineCta label="LINEで友だち追加" />
          </Reveal>

          {/* 문의 폼 카드 */}
          <Reveal delay={120} className="rounded-3xl bg-white p-8 shadow-lg sm:p-10">
            <h3 className="mb-6 text-center text-lg font-bold text-slate-900">
              {contact.formTitle}
            </h3>
            <ContactForm />
          </Reveal>
        </div>

        <p className="mt-8 text-center text-sm text-white/80">
          メールでのご相談も受け付けています：{" "}
          <a
            href={`mailto:${contact.email}`}
            className="font-bold text-white underline underline-offset-4"
          >
            {contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}
