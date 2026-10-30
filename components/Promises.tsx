import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import styles from "./home/home.module.css";

export function Promises() {
  const {promises}=siteConfig;
  const labels=["日々の更新","見直すきっかけ","いつもの窓口"];
  return <section className={styles.supportSection} aria-labelledby="home-support-heading"><div className={styles.contentContainer}>
    <div className={styles.supportLayout}><Reveal className={styles.supportHeading}><div><p className={styles.sectionEyebrow}>つくったあとに、差がつくこと。</p><h2 id="home-support-heading">{promises.title}</h2></div><p>公開した日から、日々の更新も。<br/>お店の「IT担当」としてお手伝いします。</p><div className={styles.messageIllustration} aria-label="更新のやりとりイメージ"><span>たとえば、こんなふうに。</span><p>来週の臨時休業を<br/>お知らせに載せたいです。</p><p>日付と内容を確認して、<br/>ホームページに反映します。</p><small>更新のやりとりイメージ</small></div></Reveal>
    <div className={styles.supportGrid}>{promises.items.map((item,index)=><Reveal key={item.title} delay={index*75} className={styles.supportItem}><span>{labels[index]}</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></div>
  </div></section>;
}
