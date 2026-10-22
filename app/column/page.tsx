import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { columnArticles } from "@/content/columns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ColumnCard } from "@/components/column/ColumnCard";
import styles from "@/components/column/column.module.css";

const title = "お役立ちコラム｜お店のホームページ制作・運用の読みもの";
const description = "ホームページを作る理由、制作前の準備、費用、Google検索、公開後の運用。お店・会社のホームページを考える方へ、まちのWebが役立つ情報をお届けします。";
export const metadata: Metadata = {
  title: `${title}｜${siteConfig.meta.siteName}`, description,
  alternates: { canonical: "/column" },
  openGraph: {title,description,url:"/column",type:"website",images:[{url:"/column/opengraph-image",width:1200,height:630,alt:title}]},
  twitter: {card:"summary_large_image",title,description,images:["/column/opengraph-image"]},
};

export default function ColumnsPage() {
  const schema = {"@context":"https://schema.org","@type":"CollectionPage",name:title,description,url:`${siteConfig.meta.url}/column`,inLanguage:"ja-JP",mainEntity:{"@type":"ItemList",itemListElement:columnArticles.map((article,index)=>({"@type":"ListItem",position:index+1,url:`${siteConfig.meta.url}/column/${article.slug}`,name:article.title}))}};
  return <><Header homeHref="/"/><main className={styles.indexPage}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><span aria-current="page">お役立ちコラム</span></nav>
      <header className={styles.indexHeading}><p className={styles.eyebrow}>JOURNAL / まちのWebの読みもの</p><h1>お店のこれからを、<br/>Webのことから。</h1><p>{description}</p><span>{String(columnArticles.length).padStart(2,"0")} ARTICLES</span></header>
      <div className={styles.indexGrid}>{columnArticles.map(article=><ColumnCard key={article.slug} article={article}/>)}</div>
      <div className={styles.indexBottom}><p>「うちのお店なら、どうしたらいい？」<br/>そんなご相談も、お待ちしています。</p><Link href="/#contact">ホームページのことを相談する</Link></div>
    </div>
  </main><Footer/></>;
}
