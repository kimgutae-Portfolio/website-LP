import Link from "next/link";
import { formatColumnDate, type ColumnArticle } from "@/content/columns";
import { ColumnArt } from "./ColumnArt";
import styles from "./column.module.css";

export function ColumnCard({ article, compact = false }: { article: ColumnArticle; compact?: boolean }) {
  return <Link href={`/column/${article.slug}`} className={`${styles.card} ${compact ? styles.compactCard : ""}`}>
    <ColumnArt article={article} compact={compact}/>
    <div className={styles.cardContent}>
      <div className={styles.cardMeta}><span>{article.category}</span><time dateTime={article.publishedAt}>{formatColumnDate(article.publishedAt)}</time></div>
      <h3>{article.title}</h3>
      {!compact && <p>{article.description}</p>}
      <span className={styles.readLink}>記事を読む</span>
    </div>
  </Link>;
}
