import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import styles from "./home/details.module.css";

export function Faq() {
  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-heading">
      <div className={styles.container}>
        <Reveal className={styles.faqIntro}><p className={styles.eyebrow}>気になること、先にお答えします。</p><h2 id="faq-heading">よくあるご質問。</h2></Reveal>
        <Reveal className={styles.questions}>
          {siteConfig.faq.map((item) => (
            <details
              key={item.q}
              className={styles.question}
            >
              <summary>
                <span>
                  <span className={styles.questionMark} aria-hidden="true">Q</span>
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={styles.questionToggle}
                >
                  ＋
                </span>
              </summary>
              <div className={styles.answer}>
                <span aria-hidden="true">A</span>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
