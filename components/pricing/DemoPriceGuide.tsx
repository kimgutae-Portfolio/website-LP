import Link from "next/link";
import { exampleOffers, formatInitialPrice, type ExampleSlug, type ExampleOffer } from "@/lib/example-offers";
import { siteConfig } from "@/site.config";
import styles from "./demo-price-guide.module.css";

export function DemoPriceGuide({slug}:{slug:ExampleSlug}) {
  const offer:ExampleOffer=exampleOffers[slug];
  return <aside id="production-scope" className={styles.scope} aria-labelledby={`${slug}-scope-heading`} data-demo-price-guide={slug}>
    <header><div><p>まちのWeb / ホームページ制作費のご案内</p><h2 id={`${slug}-scope-heading`}>この見本でできること、<br/>費用のこと。</h2></div><div className={styles.price}><span>{offer.label}</span><p><small>制作初期費用</small><strong>{formatInitialPrice(offer)}</strong></p><small>{offer.initialFrom===null?"制作内容に応じて事前お見積り":"税込表示"} ／ 月額運用費 {siteConfig.pricing.monthlyFrom}円〜（税込）は別途</small></div></header>
    <div className={styles.columns}><div><h3>{offer.includedHeading}</h3><ul>{offer.included.map(item=><li key={item}>{item}</li>)}</ul></div><div><h3>追加制作費が必要なこと</h3><ul>{offer.additional.map(item=><li key={item}>{item}</li>)}</ul></div></div>
    {offer.upgrade&&<div className={styles.upgrade}><div><span>この見本で体験できる、追加制作</span><h3>{offer.upgrade.title}</h3><p>{offer.upgrade.features.join(" ／ ")}</p></div><Link href={offer.upgrade.href}>{offer.upgrade.cta}</Link></div>}
    {offer.breakdown&&<dl className={styles.breakdown}>{offer.breakdown.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.amount.toLocaleString("ja-JP")}円</dd></div>)}<div><dt>制作初期費用の目安（税込）</dt><dd>{formatInitialPrice(offer)}</dd></div></dl>}
    <p className={styles.note}>{offer.note}</p><p className={styles.note}>こちらは店舗・教室の利用料金ではなく、まちのWebによるホームページ制作費のご案内です。掲載する原稿・写真・機能を確認し、ご契約前にお見積りします。最低契約期間3ヶ月。外部サービス利用料が必要な場合は別途ご案内します。</p>
    <div className={styles.actions}><a href={siteConfig.line.addFriendUrl} data-line-placement="demo_scope" target="_blank" rel="noopener noreferrer">この構成についてLINEで相談</a><Link href="/#price">料金とサポート内容を見る</Link></div>
  </aside>;
}
