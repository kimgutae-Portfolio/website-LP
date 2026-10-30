import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import styles from "./home/details.module.css";

export function Flow() {
  return (
    <section id="flow" className={styles.flow} aria-labelledby="flow-heading">
      <div className={styles.container}>
        <Reveal className={styles.flowIntro}>
          <p className={styles.eyebrow}>まずは、お話を聞かせてください。</p>
          <h2 id="flow-heading">まだ、まとまって<br />いなくても大丈夫。</h2>
          <p>「こんなお店です」「ここに困っています」。<br />そのお話から、ホームページの形を考えます。</p>
        </Reveal>
        <ol className={styles.flowList}>
          {siteConfig.flow.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 120}
              className={styles.flowStep}
            >
              <span className={styles.flowIndex} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>
                {step.title}
              </h3>
              {step.highlight && (
                // 지역 밀착 차별화 포인트 강조
                <p className={styles.highlight}>
                  {step.highlight}
                </p>
              )}
              <p className={styles.stepText}>
                {step.text}
              </p></div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
