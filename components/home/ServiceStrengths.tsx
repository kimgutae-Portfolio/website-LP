import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Reveal } from "@/components/Reveal";
import { ServiceVisual } from "./ServiceVisual";
import styles from "./services.module.css";

export function ServiceStrengths() {
  const { hero, localService: service, pricing } = siteConfig;

  return (
    <section id="home-strengths" className={styles.section} aria-labelledby="local-service-heading">
      <div className={styles.container}>
        <Reveal variant="fade" className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>{service.eyebrow}</p>
            <h2 id="local-service-heading">{service.title}</h2>
          </div>
          <div className={styles.introCopy}>
            <p>{service.introduction}</p>
            <p>{hero.sub}</p>
          </div>
        </Reveal>

        <div className={styles.strengths}>
          {hero.strengths.map((item, index) => (
            <Reveal key={item.label} variant="settle" delay={index * 110} className={styles.strength}>
              <div className={styles.strengthArt}><ServiceVisual kind={index===0?1:index===1?0:2}/></div>
              <div className={styles.strengthCopy}><p className={styles.eyebrow}>{item.label}</p><h3>{item.title}</h3><p>{item.text}</p></div>
            </Reveal>
          ))}
        </div>

        <div className={styles.industrySection}>
          <Reveal variant="wipe" className={styles.industryHeading}>
            <h3>{service.industriesTitle}</h3>
            <p>{service.industriesLead}</p>
          </Reveal>
          <div className={styles.industryGrid}>
            {service.industries.map((industry, index) => (
              <Reveal key={industry.category} variant={index % 2 === 0 ? "slide-right" : "slide-left"} delay={(index % 2) * 80} className={styles.industry}>
                <article>
                  <p className={styles.category}>{industry.category}</p>
                  <h4>{industry.title}</h4>
                  <p className={styles.description}>{industry.description}</p>
                  <details className={styles.industryDetails}><summary>掲載する内容と、制作の範囲</summary><ul className={styles.information}>
                    {industry.details.map(detail => <li key={detail}>{detail}</li>)}
                  </ul>
                  <p className={styles.scope}>{industry.scope}</p>
                  </details>
                  <Link href={industry.exampleHref} className={styles.textLink}>
                    {industry.exampleLabel}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
          <p className={styles.examplesNote}>{service.examplesNote}</p>
        </div>

        <Reveal variant="fade"><details className={styles.scopeBand}><summary>初期0円の基本構成と、追加制作のこと</summary><div className={styles.scopeContent}>
          <div>
            <p className={styles.eyebrow}>基本構成で始める</p>
            <h3>{service.basicTitle}</h3>
            <p>{service.basicText}</p>
            <p className={styles.price}>
              <span>制作初期費用 <strong>{pricing.initialCost}</strong>円〜</span>
              <span>月額運用費 <strong>{pricing.monthlyFrom}</strong>円〜</span>
              <small>（{pricing.priceTaxNote}）</small>
            </p>
          </div>
          <div>
            <p className={styles.eyebrow}>追加制作は、事前にお見積り</p>
            <h3>{service.additionalTitle}</h3>
            <p>{service.additionalText}</p>
            <a href="#price" className={styles.textLink}>基本範囲・追加費用・運用条件を見る</a>
          </div>
        </div></details></Reveal>

        <Reveal variant="settle" className={styles.localConsultation}>
          <div className={styles.areaHeading}>
            <p className={styles.eyebrow}>堺市中区を拠点に</p>
            <h3>{service.areaTitle}</h3>
            <span className={styles.localMark} aria-hidden="true">
              <svg viewBox="0 0 180 100" fill="none">
                <path d="M4 89h172M17 89V37l32-19 32 19v52M29 89V57h22v32M61 53h9v12h-9M89 89V48h43v41M84 48l11-17h31l11 17M100 89V65h20v24M144 89V28h25v61M149 39h5m6 0h5m-16 13h5m6 0h5m-16 13h5m6 0h5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="107" cy="14" r="10" fill="currentColor" stroke="none"/>
              </svg>
            </span>
          </div>
          <div className={styles.areaCopy}>
            <p className={styles.visitLabel}>ご希望の方には、訪問でのご相談も。</p>
            <p>{service.areaText}</p>
            <p>{service.consultationText}</p>
            <a href="#contact" className={styles.consultLink}>お店・会社のことを相談する</a>
            <span className={styles.consultNote}>相談・お見積り無料 ／ LINE・メールからで大丈夫です</span>
          </div>
        </Reveal>

        <div className={styles.reading}>
          <p>もう少し詳しく知りたい方へ</p>
          <Link href="/column/google-and-local-search">Googleマップとホームページの役割</Link>
          <Link href="/column/website-preparation">制作を頼む前に、用意しておくこと</Link>
        </div>
      </div>
    </section>
  );
}
