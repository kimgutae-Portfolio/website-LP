import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表記｜${siteConfig.meta.siteName}`,
  robots: { index: false },
};

// 계약은 대면(방문)으로 체결하므로 통신판매 표기 의무는 없을 가능성이 높지만,
// 영업처의 신뢰 확인용으로 페이지는 유지. 所在地・電話는 청구 시 개시 방식(개인사업자 통례).
const rows: [string, string][] = [
  ["販売事業者名", siteConfig.footer.operator],
  ["運営責任者", siteConfig.footer.operator],
  ["所在地", "個人事業のため省略します（請求があった場合、遅滞なく開示します）"],
  ["電話番号", "個人事業のため省略します（請求があった場合、遅滞なく開示します）"],
  ["メールアドレス", siteConfig.contact.email],
  ["販売価格", "月額5,500円（税込）ほか、サービス紹介ページに表示する価格"],
  ["商品代金以外の必要料金", "インターネット接続にかかる通信費はお客様のご負担となります"],
  [
    "支払方法・支払時期",
    "銀行振込。請求書を発行しますので、記載の期日までにお支払いください。",
  ],
  ["サービスの提供時期", "ご契約後、ヒアリング・原稿確認を経て最短3日で公開"],
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
            ← トップページへ戻る
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
