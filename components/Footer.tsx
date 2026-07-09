import Link from "next/link";
import { siteConfig } from "@/site.config";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-10 text-slate-300">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <p className="mb-4 text-sm">運営者: {siteConfig.footer.operator}</p>
        <nav
          aria-label="フッターリンク"
          className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          <Link href="/tokushoho" className="underline underline-offset-4 transition hover:text-white">
            特定商取引法に基づく表記
          </Link>
          <a
            href={siteConfig.owner.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition hover:text-white"
          >
            {siteConfig.footer.portfolioLabel}
          </a>
        </nav>
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {siteConfig.meta.siteName}
        </p>
      </div>
    </footer>
  );
}
