import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LineCta } from "@/components/LineCta";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary-light px-5 text-center">
      <Logo className="mb-8" />
      <p className="text-6xl font-black text-primary">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">
        ページが見つかりませんでした
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-slate-600">
        お探しのページは、移動または削除された可能性があります。
        お探しの内容が見つからない場合は、LINEでお気軽にお尋ねください。
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-3.5 text-lg font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          トップページへ戻る
        </Link>
        <LineCta label="LINEで相談する" />
      </div>
    </main>
  );
}
