import { siteConfig } from "@/site.config";
import { HeroExperience } from "./home/HeroExperience";
import { LineIcon } from "./icons";
import styles from "./home/hero.module.css";

export function Hero() {
  const { hero, pricing, line } = siteConfig;
  return <><HeroExperience>
    <div className={styles.main}>
      <div className={styles.copy} data-hero-copy>
        <p className={styles.eyebrow}>お店に合わせた、ホームページ制作</p>
        <h1 id="home-hero-heading"><span>{hero.catchTop}</span><span>{hero.catchMain}</span></h1>
        <p className={styles.statement}>{hero.statement}</p>
        <ul className={styles.keywords} aria-label="サービスの特徴"><li>自由なデザイン</li><li>検索の基本設定</li><li>更新サポート</li></ul>
      </div>
      <aside className={styles.offer} aria-label="制作と運用の費用の目安" data-hero-copy>
        <p className={styles.offerIntro}>はじめの一歩を、もっと軽く。</p>
        <div className={styles.prices}>
          <div className={styles.initialPrice}><p>制作初期費用</p><div><strong>{pricing.initialCost}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></div></div>
          <div className={styles.monthlyPrice}><p>月額運用費</p><div><strong>{pricing.monthlyFrom}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></div></div>
        </div>
        <p className={styles.priceNote}>初期0円は基本構成の場合。<br/>追加ページ・演出・機能は別途お見積り。</p>
        <a className={styles.lineAction} href={line.addFriendUrl} data-line-placement="hero" target="_blank" rel="noopener noreferrer"><LineIcon/><span>LINEで無料相談</span></a>
        <div className={styles.secondaryActions}><a href="#demo">制作見本を見る</a><a href="#price">費用・対応内容を見る</a></div>
        <p className={styles.conditions}>税込表示・最低契約期間3ヶ月 ／ ご相談・お見積り無料</p>
      </aside>
    </div>
  </HeroExperience>
  <section className={styles.details} aria-label="まちのWebのホームページ制作の特徴">
    <div className={styles.detailsInner}>
      <div className={styles.supportIntro}><p>{hero.sub}</p><p>堺市を拠点に。ご希望の方には、訪問でのご相談も。</p></div>
      <div className={styles.strengths}>
        {hero.strengths.map(item => <div className={styles.strength} key={item.label}><p>{item.label}</p><h2>{item.title}</h2><p>{item.text}</p></div>)}
      </div>
    </div>
  </section></>;
}
