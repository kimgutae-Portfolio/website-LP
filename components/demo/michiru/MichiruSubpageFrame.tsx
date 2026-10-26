"use client";
import Link from "next/link";
import {useState,type ReactNode} from "react";
import {Arrow,DemoDialog,DemoNotice,DemoShell} from "../shared/PremiumDemo";
import {DemoPriceGuide} from "@/components/pricing/DemoPriceGuide";
import {exampleOffers,formatInitialPrice} from "@/lib/example-offers";
import {MichiruBrand} from "./MichiruBrand";
import {michiruNavigation} from "./navigation";
import styles from "./michiru.module.css";
import pages from "./michiru-pages.module.css";

export function MichiruSubpageFrame({children,current,revision=""}:{children:ReactNode;current:"courses"|"contact";revision?:string}) {
  const [menuOpen,setMenuOpen]=useState(false);
  const title=current==="courses"?"コース・月謝":"体験・お問い合わせ";
  return <DemoShell className={styles.site} paused={menuOpen} revision={`${current}-${revision}`}>
    <div className={styles.demoBar}><a href="#production-scope">3ページ＋フォーム / 初期{formatInitialPrice(exampleOffers.michiru)}（税込）</a><Link href="/#demo">まちのWebへ戻る</Link></div>
    <header className={styles.header}><Link href="/demo/michiru" aria-label="みちる英語教室 トップへ"><MichiruBrand/></Link><nav aria-label="メインメニュー">{michiruNavigation.map(([href,label])=><Link href={href} key={href} aria-current={href===`/demo/michiru/${current}`?"page":undefined}>{label}</Link>)}</nav><Link className={styles.headerTrial} href="/demo/michiru/contact" aria-current={current==="contact"?"page":undefined}>体験・お問い合わせ<Arrow/></Link><button type="button" className={styles.menuTrigger} onClick={()=>setMenuOpen(true)} aria-label="メニューを開く"><span/><span/></button></header>
    <main><nav className={`${pages.breadcrumbs} ${styles.container}`} aria-label="パンくずリスト"><Link href="/demo/michiru">みちるのトップ</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>{children}</main>
    <footer className={`${styles.footer} ${styles.container}`}><div><Link href="/demo/michiru"><MichiruBrand/></Link><a href="#michiru-page-top">ページの先頭へ</a></div><nav aria-label="フッターメニュー">{michiruNavigation.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}<Link href="/demo/michiru/contact">体験・お問い合わせ</Link></nav><DemoPriceGuide slug="michiru"/><DemoNotice/><small>© MICHIRU ENGLISH CLASS / DESIGN SAMPLE</small></footer>
    <div className={styles.mobileTrial}><Link href="/demo/michiru/courses">コース・月謝</Link><Link href="/demo/michiru/contact">体験・お問い合わせ<Arrow/></Link></div>
    <DemoDialog open={menuOpen} onClose={()=>setMenuOpen(false)} label="みちる MENU" className={styles.menuDialog}><nav>{michiruNavigation.map(([href,label])=><Link href={href} key={href} onClick={()=>setMenuOpen(false)}>{label}<Arrow/></Link>)}<Link href="/demo/michiru/contact" onClick={()=>setMenuOpen(false)}>体験・お問い合わせ<Arrow/></Link></nav></DemoDialog>
  </DemoShell>;
}
