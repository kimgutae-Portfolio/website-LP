import Link from "next/link";
import { columnArticles } from "@/content/columns";
import { Reveal } from "./Reveal";
import { ColumnCard } from "./column/ColumnCard";
import styles from "./column/column.module.css";

export function Columns() {
  return <section id="column" className={styles.homeSection} aria-labelledby="column-heading"><div className={styles.container}>
    <Reveal variant="wipe" className={styles.sectionHeading}><div><p className={styles.eyebrow}>JOURNAL / お役立ちコラム</p><h2 id="column-heading">つくる前も、<br/>つくったあとも。</h2></div><div><p>はじめてのホームページに、役立つ読みもの。<br/>お店のことを考える、小さなきっかけになれば。</p><Link href="/column">すべての記事を見る</Link></div></Reveal>
    <div className={styles.homeGrid}>
      <Reveal variant="settle" className={styles.featured}><ColumnCard article={columnArticles[0]}/></Reveal>
      <div className={styles.homeList}>{columnArticles.slice(1).map((article,index)=><Reveal key={article.slug} variant="slide-left" delay={index*65}><ColumnCard article={article} compact/></Reveal>)}</div>
    </div>
  </div></section>;
}
