import { siteConfig } from "@/site.config";
import { LineIcon } from "./icons";

const navItems = [
  { href: "#price", label: "料金" },
  { href: "#flow", label: "制作の流れ" },
  { href: "#faq", label: "よくある質問" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="text-lg font-bold text-primary">
          {siteConfig.meta.siteName}
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex" aria-label="ページ内リンク">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={siteConfig.line.addFriendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-line px-4 py-2 text-sm font-bold text-white transition hover:bg-line-dark"
          >
            <LineIcon className="h-4 w-4" />
            相談する
          </a>
        </div>
      </div>
    </header>
  );
}
