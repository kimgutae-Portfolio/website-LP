import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表記｜${siteConfig.meta.siteName}`,
  robots: { index: false },
};

// 相談方法にかかわらず、公開する料金と取引条件をサイト設定と一致させる。
const rows: [string, string][] = [
  ["販売事業者名", siteConfig.footer.operator],
  ["運営責任者", siteConfig.footer.operator],
  ["所在地", "個人事業のため省略します（請求があった場合、遅滞なく開示します）"],
  ["電話番号", "個人事業のため省略します（請求があった場合、遅滞なく開示します）"],
  ["メールアドレス", siteConfig.contact.email],
  ["販売価格", `制作初期費用${siteConfig.pricing.initialCost}円〜・月額運用費${siteConfig.pricing.monthlyFrom}円〜（${siteConfig.pricing.priceTaxNote}）。${siteConfig.pricing.basicScope}追加ページ・独自のデザインや演出・フォーム・機能開発などは別途お見積りします。月額費用も運用範囲に応じて事前にお見積りし、合意後に制作します。`],
  ["商品代金以外の必要料金", "インターネット接続にかかる通信費はお客様のご負担となります。外部サービス利用料が必要な場合は、お見積り時にご案内します。"],
  [
    "支払方法・支払時期",
    "銀行振込。請求書を発行しますので、記載の期日までにお支払いください。",
  ],
  ["サービスの提供時期", "ご契約後、ヒアリング・原稿・デザインの確認を経て公開します。公開時期は制作内容に応じて事前にご案内します。"],
  [
    "解約について",
    "最低契約期間は3ヶ月です。以降はいつでも解約いただけます。解約後はサイトの公開を停止します（データのお引き渡しは有償で承ります）。",
  ],
];

export default function TokushohoPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">
          特定商取引法に基づく表記
        </h1>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-[15px]">
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label} className="border-b border-slate-200 last:border-b-0">
                  <th className="w-40 bg-slate-50 p-4 align-top font-bold text-slate-700 sm:w-52">
                    {label}
                  </th>
                  <td className="p-4 leading-relaxed text-slate-700">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
