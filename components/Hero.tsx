import { siteConfig } from "@/site.config";
import { HeroExperience } from "./home/HeroExperience";
import styles from "./home/home.module.css";

export function Hero() {
  const {hero,pricing,demos}=siteConfig;
  const scenes=[
    {name:"KASANE",category:"企業・会社",url:demos.corporateShowcase.url},
    {name:"SUMITOKI",category:"飲食店",url:demos.restaurantShowcase.url},
    {name:"NAGI",category:"旅館・宿泊施設",url:demos.additionalShowcases[1].url},
  ];
  return <>
    <HeroExperience scenes={scenes} poster={{src:demos.corporateShowcase.image,alt:"木と自然光の空間を使った、架空の企業KASANEのホームページ制作見本"}}>
      <div className={styles.heroCopy} data-hero-copy>
        <p className={styles.heroEyebrow}>WEB DESIGN & SUPPORT <span aria-hidden="true">—</span> SAKAI, OSAKA</p>
        <h1 id="home-hero-heading"><span>{hero.catchTop}</span><span>{hero.catchMain}</span></h1>
        <p className={styles.heroStatement}>つくる、その先も。まちのWeb。</p>
        <p className={styles.heroLead}>{hero.sub}</p>
        <div className={styles.heroActions}><a href="#demo" className={styles.workAction}>制作見本を見てみる</a><a href="#contact" className={styles.talkAction}>まずは、話してみる</a></div>
        <p className={styles.freeConsultation}>ご相談・お見積りは無料です。</p>
      </div>
    </HeroExperience>
    <div className={styles.priceBand} aria-label="制作と運用の費用の目安"><div>
      <div className={styles.bandStatement}><p>小さく始めて、<br/>長く頼れるパートナーに。</p><span>デザイン・制作・公開後の更新まで。</span></div>
      <a href="#price" aria-label={`制作初期費用 ${pricing.initialCost}円から。費用の目安を見る`}><span>制作初期費用</span><p><strong>{pricing.initialCost}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></p><span className={styles.bandDetail}>費用の目安を見る</span></a>
      <a href="#price" aria-label={`月額運用費 ${pricing.monthlyFrom}円から。費用の目安を見る`}><span>月額運用費</span><p><strong>{pricing.monthlyFrom}</strong><span>円〜<small>（{pricing.priceTaxNote}）</small></span></p><span className={styles.bandDetail}>費用の目安を見る</span></a>
    </div></div>
  </>;
}
