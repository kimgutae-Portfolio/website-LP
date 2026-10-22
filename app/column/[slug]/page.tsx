import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/site.config";
import { columnArticles, formatColumnDate, getColumn } from "@/content/columns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ColumnArt } from "@/components/column/ColumnArt";
import { ColumnCard } from "@/components/column/ColumnCard";
import styles from "@/components/column/column.module.css";

type Props = { params: Promise<{slug:string}> };
export const dynamicParams = false;
export function generateStaticParams() { return columnArticles.map(({slug})=>({slug})); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const article=getColumn((await params).slug); if(!article)notFound();
  const path=`/column/${article.slug}`;
  return {
    title:`${article.title}｜${siteConfig.meta.siteName}`,description:article.description,alternates:{canonical:path},
    openGraph:{title:article.title,description:article.description,url:path,type:"article",publishedTime:article.publishedAt,modifiedTime:article.publishedAt,authors:[siteConfig.meta.siteName],images:[{url:`${path}/opengraph-image`,width:1200,height:630,alt:article.title}]},
    twitter:{card:"summary_large_image",title:article.title,description:article.description,images:[`${path}/opengraph-image`]},
  };
}

export default async function ColumnArticlePage({params}:Props) {
  const article=getColumn((await params).slug); if(!article)notFound();
  const url=`${siteConfig.meta.url}/column/${article.slug}`;
  const schema={"@context":"https://schema.org","@graph":[
    {"@type":"BlogPosting","@id":`${url}#article`,headline:article.title,description:article.description,datePublished:article.publishedAt,dateModified:article.publishedAt,inLanguage:"ja-JP",mainEntityOfPage:{"@type":"WebPage","@id":url},image:`${url}/opengraph-image`,author:{"@type":"Organization",name:siteConfig.meta.siteName,url:siteConfig.meta.url},publisher:{"@type":"Organization","@id":`${siteConfig.meta.url}/#organization`,name:siteConfig.meta.siteName,url:siteConfig.meta.url,logo:{"@type":"ImageObject",url:`${siteConfig.meta.url}/brand/machinowebs-icon-1024.png`}}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"ホーム",item:siteConfig.meta.url},{"@type":"ListItem",position:2,name:"お役立ちコラム",item:`${siteConfig.meta.url}/column`},{"@type":"ListItem",position:3,name:article.title,item:url}]},
  ]};
  return <><Header homeHref="/"/><main className={styles.articlePage}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><Link href="/column">お役立ちコラム</Link><span aria-hidden="true">/</span><span aria-current="page">{article.category}</span></nav>
      <article>
        <header className={styles.articleHeader}><div><p className={styles.eyebrow}>{article.category}</p><h1>{article.title}</h1><div className={styles.byline}><time dateTime={article.publishedAt}>{formatColumnDate(article.publishedAt)}</time><span>執筆：{siteConfig.meta.siteName}</span></div></div><ColumnArt article={article}/></header>
        <div className={styles.readingLayout}>
          <aside className={styles.contents}><nav aria-label="この記事の目次"><p>この記事の内容</p><ol>{article.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav></aside>
          <div className={styles.articleBody}>
            <p className={styles.lead}>{article.lead}</p>
            <div className={styles.takeaway}><span>先に、お伝えしたいこと</span><p>{article.takeaway}</p></div>
            {article.sections.map(section=><section key={section.id} id={section.id} className={styles.bodySection} aria-labelledby={`heading-${section.id}`}>
              <h2 id={`heading-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
              {section.comparison && <div className={styles.comparison} role="region" aria-label="SNSとホームページの比較表。横にスクロールできます" tabIndex={0}><table><caption>SNSとホームページの役割の一例<span className={styles.tableHint}>横にスクロールしてご覧ください</span></caption><thead><tr><th scope="col">伝えること</th><th scope="col">SNS</th><th scope="col">ホームページ</th></tr></thead><tbody>{section.comparison.map(row=><tr key={row.topic}><th scope="row">{row.topic}</th><td>{row.sns}</td><td>{row.website}</td></tr>)}</tbody></table></div>}
              {section.bullets && <ul className={styles.bodyList}>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
              {section.note && <p className={styles.note}>{section.note}</p>}
              {section.sources && <div className={styles.sources}><span>参考・公式情報</span>{section.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only">（新しいタブで開きます）</span></a>)}</div>}
            </section>)}
            <footer className={styles.articleEnd}><p>この記事は、{siteConfig.meta.siteName}がホームページ制作を検討されるお店・事業者の方向けにまとめたものです。外部サービスの仕様は変更される場合があります。最新の内容は各公式サイトでもご確認ください。</p><Link href="/column">コラム一覧へ戻る</Link></footer>
          </div>
        </div>
      </article>
      <section className={styles.related} aria-labelledby="related-heading"><div className={styles.relatedHeading}><p className={styles.eyebrow}>READ NEXT</p><h2 id="related-heading">あわせて読みたいこと。</h2></div><div>{article.relatedSlugs.map(slug=>{const related=getColumn(slug);return related?<ColumnCard key={slug} article={related} compact/>:null;})}</div></section>
      <section className={styles.articleConsult} aria-labelledby="article-consult-heading"><div><p className={styles.eyebrow}>LET’S TALK</p><h2 id="article-consult-heading">あなたのお店なら、<br/>どんなかたちがいいだろう。</h2><p>まだ作るか決まっていなくても大丈夫。<br/>気になることから、お聞かせください。</p></div><div><a href={siteConfig.line.addFriendUrl} target="_blank" rel="noopener noreferrer">LINEで無料相談</a><Link href="/#contact">フォームから相談する</Link><Link href="/#price">制作・運用の費用を見る</Link></div></section>
    </div>
  </main><Footer/></>;
}
