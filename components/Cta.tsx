/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/site.config";
import { ContactForm } from "./ContactForm";
import { LineCta } from "./LineCta";
import { Reveal } from "./Reveal";
import styles from "./home/details.module.css";

export function Cta() {
  const { contact, line } = siteConfig;
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <div className={styles.contactIntro}>
          <div><p className={styles.eyebrow}>あなたの事業の、次の一歩を。</p><h2 id="contact-heading">
            {contact.heading}
          </h2></div>
          <p>
            {contact.sub}
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* LINE 상담 카드 (주요 CTA) */}
          <Reveal className={styles.lineCard}>
            <span className={styles.cardLabel}>いつものLINEで</span><h3>
              {contact.lineCardTitle}
            </h3>
            <p>
              {contact.lineCardText}
            </p>
            {/* QR: config에 이미지 지정 시 표시, 없으면 placeholder */}
            {line.qrImage ? (
              <img
                src={line.qrImage}
                alt="LINE友だち追加QRコード"
                width={160}
                height={160}
                className={styles.qrCode}
              />
            ) : (
              <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-bold text-slate-400">
                QRコード
                <br />
                準備中
              </div>
            )}
            <LineCta label="LINEで友だち追加" placement="contact" />
          </Reveal>

          {/* 문의 폼 카드 */}
          <Reveal delay={120} className={styles.formCard}>
            <span className={styles.cardLabel}>文章で、ゆっくり相談</span><h3>
              {contact.formTitle}
            </h3>
            <ContactForm />
          </Reveal>
        </div>

        <p className={styles.contactEmail}>
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
