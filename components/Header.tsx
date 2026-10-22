import { siteConfig } from "@/site.config";
import { LineIcon } from "./icons";
import { Logo } from "./Logo";
import styles from "./home/home.module.css";
import { MobileNavigation } from "./home/MobileNavigation";

const navItems = [
  { href: "#demo", label: "制作見本" },
  { href: "#price", label: "費用の目安" },
  { href: "#flow", label: "制作の流れ" },
  { href: "#column", label: "コラム" },
  { href: "#faq", label: "よくある質問" },
];

export function Header({homeHref=""}:{homeHref?:string}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href={`${homeHref}#top`} aria-label={siteConfig.meta.siteName}>
          <Logo />
        </a>
        <div className={styles.headerLinks}>
          <nav className={styles.headerNav} aria-label="ページ内リンク">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={`${homeHref}${item.href}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={siteConfig.line.addFriendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.headerAction}
          >
            <LineIcon />
            <span className={styles.desktopAction}>ご相談はこちら</span><span className={styles.mobileAction}>相談</span>
          </a>
          <MobileNavigation items={navItems} homeHref={homeHref}/>
        </div>
      </div>
    </header>
  );
}
