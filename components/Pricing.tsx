import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { CheckIcon, LineIcon } from "./icons";
import styles from "./pricing/pricing.module.css";

export function Pricing() {
  const { pricing } = siteConfig;
  return (
    <section id="price" className={styles.priceSection} aria-labelledby="price-heading">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className={styles.priceIntro}>
          <p className={styles.eyebrow}>PRICE & CONSULTATION</p>
          <h2 id="price-heading">{pricing.headline}</h2>
          <p>{pricing.description}</p>
        </Reveal>
        <Reveal className={styles.priceCard}>
          <div className={styles.priceSummary}>
            <div className={styles.costBlock}><p>ホームページを、つくる</p><h3>制作初期費用</h3><p className={styles.priceValue}><strong>{pricing.initialCost}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></p><p>デザイン・ページ構成・必要な機能に合わせて</p></div>
            <div className={styles.costBlock}><p>公開後も、育てていく</p><h3>月額運用費</h3><p className={styles.priceValue}><strong>{pricing.monthlyFrom}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></p><p>更新・管理・日々のご相談まで</p></div>
          </div>
          <div className={styles.quoteNote}><span>お見積りについて</span><p>{pricing.estimateNote}</p></div>
          <div className={styles.quickConsult}><p>お店のことも、ご予算のことも。<br className="sm:hidden"/>まずは気軽にお話しください。</p><a href={siteConfig.line.addFriendUrl} data-line-placement="pricing_intro" target="_blank" rel="noopener noreferrer">LINEで無料相談</a></div>
          <div className={styles.serviceColumns}>
            <div><p className={styles.eyebrow}>WEBSITE CREATION</p><h3>伝わるための、土台づくり。</h3><ul>{pricing.creationFeatures.map(feature=><li key={feature}><CheckIcon/><span>{feature}</span></li>)}</ul></div>
            <div><p className={styles.eyebrow}>ONGOING SUPPORT</p><h3>作ったあとも、そばに。</h3><ul>{pricing.operationFeatures.map(feature=><li key={feature}><CheckIcon/><span>{feature}</span></li>)}</ul></div>
          </div>
          <div className={styles.optional}><h3>もう少し、こんなことも。</h3><p>{pricing.optionalFeatures}</p><span>追加機能は別途お見積り。必要なものだけをご提案します。</span></div>
          <div className={styles.consultation}>
            <div><p className={styles.eyebrow}>LET’S TALK</p><h3>まずは、お店のことを<br/>聞かせてください。</h3><p>気になる見本、ご予算、困っていること。<br/>まだイメージが固まっていなくても大丈夫です。</p><span>相談・お見積り無料 ／ ご相談だけでも歓迎です</span></div>
            <div><a href={siteConfig.line.addFriendUrl} data-line-placement="pricing" target="_blank" rel="noopener noreferrer" className={styles.consultButton}><LineIcon/><span>制作内容と費用を<br/>LINEで相談する</span></a><a href="#contact" className={styles.formLink}>フォームから相談する</a><a href="#demo" className={styles.examplesLink}>制作見本をもう一度見る</a></div>
          </div>
        </Reveal>
        <div className={styles.priceNotes}><p>{pricing.conditions}</p><ul>{pricing.notes.map(note=><li key={note}>※ {note}</li>)}</ul></div>
      </div>
    </section>
  );
}
