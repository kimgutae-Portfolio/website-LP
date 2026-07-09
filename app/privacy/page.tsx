import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: `プライバシーポリシー｜${siteConfig.meta.siteName}`,
  robots: { index: false },
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "基本方針",
    body: [
      `${siteConfig.meta.siteName}（以下「当方」）は、お問い合わせなどを通じてお預かりする個人情報を、個人情報保護法および関連法令に従い、適切に取り扱います。`,
    ],
  },
  {
    heading: "取得する情報",
    body: [
      "お問い合わせフォームおよびLINEでのご相談を通じて、お名前、店舗名・屋号、ご連絡先（メールアドレス・電話番号）、ご相談内容を取得します。",
    ],
  },
  {
    heading: "利用目的",
    body: [
      "取得した個人情報は、次の目的にのみ利用します。",
      "・お問い合わせ・ご相談への回答、ご連絡のため",
      "・サービスのご提供、お見積り・ご契約手続きのため",
      "・サービスに関する重要なお知らせのため",
    ],
  },
  {
    heading: "第三者への提供",
    body: [
      "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。",
    ],
  },
  {
    heading: "業務委託先での取り扱い",
    body: [
      "当サイトの運用にあたり、サーバー・フォーム送信等の外部サービス（ホスティング、メール配信など）を利用する場合があります。その場合も、適切に個人情報が保護されるよう管理します。",
    ],
  },
  {
    heading: "開示・訂正・削除のご請求",
    body: [
      "ご本人からの個人情報の開示・訂正・削除のご請求には、ご本人であることを確認のうえ、速やかに対応します。",
    ],
  },
  {
    heading: "お問い合わせ窓口",
    body: [
      `本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォーム、LINE、またはメール（${siteConfig.contact.email}）にてご連絡ください。（運営者: ${siteConfig.footer.operator}）`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">
          プライバシーポリシー
        </h1>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-2 text-lg font-bold text-slate-900">
                {section.heading}
              </h2>
              {section.body.map((line) => (
                <p key={line} className="leading-relaxed text-slate-700">
                  {line}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-slate-500">制定日: 2026年7月9日</p>
        <p className="mt-8">
          <Link href="/" className="font-bold text-primary underline underline-offset-4">
            ← トップページへ戻る
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
