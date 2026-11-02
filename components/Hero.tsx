import { siteConfig, websiteExamples } from "@/site.config";
import { HeroExperience } from "./home/HeroExperience";
import { HeroShowcase } from "./home/HeroShowcase";
import { LineIcon } from "./icons";
import styles from "./home/hero.module.css";

export function Hero() {
  const { hero, pricing, line } = siteConfig;
  const examples = ["/demo/sumitoki", "/demo/sui", "/demo/kasane", "/demo/michiru"].map(href => {
    const example = websiteExamples.find(item => item.url === href)!;
    return { name: example.displayName ?? example.name, category: example.category, href: example.url, image: example.previewImage ?? example.image };
  });
  return <HeroExperience><div className={styles.main}>
    <div className={styles.copy} data-hero-copy>
      <p className={styles.eyebrow}><span/>堺市を拠点に、全国からのご相談も。</p>
      <h1 id="home-hero-heading"><span>{hero.catchTop}</span><span>{hero.catchMain}</span></h1>
      <p className={styles.statement}>{hero.statement}</p>
      <ul className={styles.keywords} aria-label="サービスの特徴">{hero.keywords.map(keyword=><li key={keyword}>{keyword}</li>)}</ul>
    </div>
    <HeroShowcase examples={examples}/>
    <aside className={styles.offer} aria-label="制作と運用の費用の目安" data-hero-copy>
      <div className={styles.offerLabel}><span>相談・お見積り無料</span><p>何を載せる？から、<br/>一緒に考えます。</p></div>
      <div className={styles.priceGroup}>
        <div className={styles.prices}>
          <div className={styles.initialPrice}><p>制作初期費用</p><div><strong>{pricing.initialCost}</strong><span>円〜</span></div></div>
          <div className={styles.monthlyPrice}><p>月額運用費</p><div><strong>{pricing.monthlyFrom}</strong><span>円〜</span></div></div>
        </div>
        <p className={styles.priceNote}>初期0円は基本構成の場合。追加ページ・演出・機能は別途お見積り。<span>（{pricing.priceTaxNote}）</span></p>
      </div>
      <div className={styles.offerActions}>
        <a className={styles.lineAction} href={line.addFriendUrl} data-line-placement="hero" target="_blank" rel="noopener noreferrer"><LineIcon/><span>LINEで内容・費用を相談</span></a>
      </div>
    </aside>
  </div></HeroExperience>;
}
