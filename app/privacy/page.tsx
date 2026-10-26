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
        <section id="measurement" className="mt-8 scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">アクセス解析・広告の効果測定</h2>
          <p className="leading-relaxed text-slate-700">当サイトでは、同意いただいた場合に限り、Google LLCのGoogle アナリティクスを利用します。Cookieなどを通じて閲覧ページ、参照元、広告のキャンペーン情報、端末情報、LINEボタンのクリックを収集し、サイト改善および広告効果の確認に利用します。Googleによって国外のサーバーで処理される場合があります。</p>
          <p className="leading-relaxed text-slate-700">LINEボタンのクリックは、友だち追加や実際の相談の完了を意味しません。お名前、メールアドレス、お問い合わせ内容、LINEでの会話内容を、この測定イベントに送信することはありません。広告のパーソナライズおよびGoogle シグナルによるデータ収集は無効にしています。</p>
          <p className="leading-relaxed text-slate-700">Googleの測定タグは許可前には読み込みません。許可・拒否の選択はこのブラウザに90日間保存し、ページ下部の「アクセス解析の設定」からいつでも変更できます。拒否しても、LINEやお問い合わせフォームなどは利用できます。ブラウザの設定や広告ブロックにより計測されない場合があるため、計測数は実際の利用数と一致しないことがあります。</p>
          <p className="leading-relaxed text-slate-700">このほか、サイトの基本的な利用状況の把握にVercel Web Analyticsを利用しています。同サービスはCookieを使用せず、上記Googleの測定設定とは別に動作します。</p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li><a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Googleが収集した情報を使用する仕組み</a></li>
            <li><a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Google プライバシー ポリシー</a></li>
            <li><a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Vercel Web Analyticsのプライバシーについて</a></li>
          </ul>
        </section>
        <p className="mt-10 text-sm text-slate-500">制定日: 2026年7月9日</p>
        <p className="mt-2 text-sm text-slate-500">改定日: 2026年10月26日</p>
        <p className="mt-8">
          <Link href="/" className="font-bold text-primary underline underline-offset-4">
            トップページへ戻る
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
