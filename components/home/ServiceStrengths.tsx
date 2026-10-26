import { siteConfig } from "@/site.config";
import styles from "./hero.module.css";

export function ServiceStrengths() {
  const { hero } = siteConfig;
  return <section id="home-strengths" className={styles.details} aria-label="まちのWebのホームページ制作の特徴">
    <div className={styles.detailsInner}>
      <div className={styles.supportIntro}><p>{hero.sub}</p><p>堺市を拠点に。ご希望の方には、訪問でのご相談も。</p></div>
      <div className={styles.strengths}>
        {hero.strengths.map(item => <div className={styles.strength} key={item.label}><p>{item.label}</p><h2>{item.title}</h2><p>{item.text}</p></div>)}
      </div>
    </div>
  </section>;
}
