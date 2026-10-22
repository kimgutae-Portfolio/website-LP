import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import styles from "./home/home.module.css";

export function Promises() {
  const {promises}=siteConfig;
  const labels=["KEEP IT UP TO DATE","KNOW YOUR WEBSITE","GROW WITH YOUR BUSINESS"];
  return <section className={styles.supportSection} aria-labelledby="home-support-heading"><div className={styles.contentContainer}>
    <Reveal className={styles.supportHeading}><div><p className={styles.sectionEyebrow}>DESIGN IS JUST THE BEGINNING</p><h2 id="home-support-heading">{promises.title}</h2></div><p>公開した日から、日々の更新も。<br/>お店の「IT担当」としてお手伝いします。</p></Reveal>
    <div className={styles.supportGrid}>{promises.items.map((item,index)=><Reveal key={item.title} delay={index*75} className={styles.supportItem}><span>{labels[index]}</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div>
  </div></section>;
}
