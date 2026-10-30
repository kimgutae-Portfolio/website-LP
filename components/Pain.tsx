import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import styles from "./home/home.module.css";

export function Pain() {
  return (
    <section className={styles.problemSection} aria-labelledby="home-problem-heading">
      <div className={`${styles.contentContainer} ${styles.problemLayout}`}>
        <Reveal><p className={styles.sectionEyebrow}>こんなときに、頼ってください。</p><h2 id="home-problem-heading">困ったときの、<br/>Webの相談相手に。</h2><p>{siteConfig.painsClosing}</p></Reveal>
        <ul className={styles.problemList}>
          {siteConfig.pains.map((pain, i) => (
            <Reveal
              key={pain.title}
              delay={i * 80}
              as="li"
            >
              <h3>{pain.title}</h3><p>{pain.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
