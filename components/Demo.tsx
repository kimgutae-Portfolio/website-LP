import { siteConfig, websiteExamples } from "@/site.config";
import { Reveal } from "./Reveal";
import { WebsiteExamples } from "./pricing/WebsiteExamples";
import styles from "./pricing/pricing.module.css";

export function Demo() {
  return (
    <section id="demo" className={styles.demoSection} aria-labelledby="demo-heading">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className={styles.demoIntro}>
          <div><p className={styles.eyebrow}>DESIGN COLLECTION</p><h2 id="demo-heading">こんなホームページを、<br/>あなたのお店にも。</h2></div>
          <p>{siteConfig.demos.intro}</p>
        </Reveal>
        <Reveal><WebsiteExamples examples={websiteExamples} note={siteConfig.demos.examplesNote}/></Reveal>
        <Reveal className={styles.demoConsult}>
          <div><h3>「この雰囲気が好き」から、<br className="sm:hidden"/>はじめましょう。</h3><p>見本をそのまま選ぶ必要はありません。<br/>あなたのお店に合うデザインと、必要な内容を一緒に考えます。</p></div>
          <a href="#price">制作・運用の費用を見る</a>
        </Reveal>
      </div>
    </section>
  );
}
