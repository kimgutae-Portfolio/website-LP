"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { LineIcon } from "@/components/icons";
import { faqs, menuGroups, menuGuide, news, salon } from "./content";
import { useSuiMotion } from "./useSuiMotion";
import styles from "./sui.module.css";

function Arrow({ external = false }: { external?: boolean }) {
  return <svg className={styles.arrow} viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d={external ? "M6 18 18 6M6 6h12v12" : "M3 12h17m-5-5 5 5-5 5"} stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function Brand({ large = false }: { large?: boolean }) {
  return <span className={`${styles.brand} ${large ? styles.brandLarge : ""}`}><span>sui<span>.</span></span><small>HAIR ATELIER</small></span>;
}

function TextLines({ lines }: { lines: string[] }) {
  return <span className={styles.typeLines}>{lines.map(line => <span key={line}><span>{line}</span></span>)}</span>;
}

function Reserve({ className = "", children = "予約サイトはこちら" }: { className?: string; children?: ReactNode }) {
  return <a href={salon.reservationUrl} target="_blank" rel="noopener noreferrer" className={className} aria-label="外部予約サイトを開く（新しいタブ）">{children}<Arrow external/></a>;
}

function LineLink({ className = "" }: { className?: string }) {
  return <a href={salon.lineUrl} target="_blank" rel="noopener noreferrer" className={className} aria-label="LINEの連携例を開く（新しいタブ）"><LineIcon className={styles.lineIcon}/><span>LINEで相談する</span><Arrow external/></a>;
}

const navigation = [["#sui-guide", "髪のお悩み"], ["#sui-design", "OUR DESIGN"], ["#sui-menu", "MENU"], ["#sui-salon", "SALON"], ["#sui-access", "ACCESS"]] as const;
const heroAlt = "光が差し込むサロンの店内。鏡の前に並ぶ黒い椅子";
const { props: desktopPhoto } = getImageProps({
  src: "/demo/sui/interior.webp", alt: heroAlt, width: 1536, height: 1024, sizes: "100vw", loading: "eager", fetchPriority: "high",
});
const { props: mobilePhoto } = getImageProps({
  src: "/demo/sui/interior-mobile.webp", alt: heroAlt, width: 680, height: 1020, sizes: "100vw",
});
type Modal = { kind: "film" } | { kind: "news"; index: number } | null;

export function SuiWebsite({ map }: { map: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<(typeof menuGroups)[number]["id"]>("cut-color");
  const [guideChoice, setGuideChoice] = useState<string>();
  const [modal, setModal] = useState<Modal>(null);
  const site = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuClose = useRef<HTMLButtonElement>(null);
  const restoreMenuFocus = useRef(false);
  const modalOpen = modal !== null;
  const currentMenu = menuGroups.find(group => group.id === menuTab) ?? menuGroups[0];
  useSuiMotion(site, menuOpen || modalOpen);

  useEffect(() => {
    const html = document.documentElement;
    const previousPadding = html.style.scrollPaddingTop;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollPaddingTop = "0px";
    html.style.scrollbarGutter = "stable";
    let cancelled = false;
    const show = () => { if (!cancelled) setReady(true); };
    const fallback = window.setTimeout(show, 350);
    photo.current?.decode().then(show, show);
    return () => { cancelled = true; window.clearTimeout(fallback); html.style.scrollPaddingTop = previousPadding; html.style.scrollbarGutter = previousGutter; };
  }, []);

  useEffect(() => {
    if (!menuOpen && !modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen, modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const element = dialog.current;
    element?.showModal();
    return () => { video.current?.pause(); element?.close(); };
  }, [modalOpen]);

  useEffect(() => {
    if (!menuOpen) {
      if (restoreMenuFocus.current) { menuTrigger.current?.focus({ preventScroll: true }); restoreMenuFocus.current = false; }
      return;
    }
    menuClose.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { restoreMenuFocus.current = true; setMenuOpen(false); }
      if (event.key !== "Tab") return;
      const items = Array.from(mobileMenu.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return <div ref={site} className={styles.site} data-ready={ready}>
    <noscript><style>{"[data-sui-curtain]{display:none!important}"}</style></noscript>
    <div className={styles.opening} data-sui-curtain aria-hidden="true"><div className={styles.openingPanel}/><div className={styles.openingPanel}/><div className={styles.openingIdentity}><Brand large/><span className={styles.openingRule}/><p>A LITTLE CHANGE. A NEW YOU.</p></div><span className={styles.openingFoot}>SUI HAIR ATELIER / SAKAI, OSAKA</span></div>
    <div inert={menuOpen || undefined}>
      <div className={styles.demoBar}><span>SUI HAIR ATELIER</span><Link href="/#demo">まちのWebへ戻る <Arrow external/></Link></div>
      <header className={styles.header}>
        <a href="#sui-top" aria-label="sui hair atelier トップへ"><Brand/></a>
        <nav aria-label="メインメニュー">{navigation.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</nav>
        <Reserve className={styles.headerReservation}><span className={styles.desktopReservation}>WEB RESERVATION</span><span className={styles.mobileReservationLabel}>ご予約</span></Reserve>
        <button ref={menuTrigger} type="button" className={styles.menuTrigger} aria-label="メニューを開く" aria-controls="sui-mobile-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span/><span/><small>MENU</small></button>
      </header>

      <main>
        <section id="sui-top" className={styles.hero} aria-labelledby="sui-hero-heading">
          <div className={styles.heroPhoto} data-sui-scene="hero">
            <picture><source media="(max-width: 700px)" srcSet={mobilePhoto.srcSet} sizes={mobilePhoto.sizes}/><img {...desktopPhoto} ref={photo}/></picture>
            <div className={styles.heroShade}/>
          </div>
          <div className={styles.heroCopy}><p>堺の美容室 <span>/ SUI HAIR ATELIER</span></p><h1 id="sui-hero-heading"><TextLines lines={["切った日よりも、", "その先の毎日を。"]}/></h1><p className={styles.heroDescription}>帰ってからの髪まで、考えて。<br/>髪質と暮らしに合わせたカット・カラーを。</p><a href="#sui-guide" className={styles.heroLink}>髪のお悩みからメニューを探す</a></div>
          <div className={styles.heroBottom}><span>SAKAI, OSAKA / DESIGN SAMPLE</span><a href="#sui-intro">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a></div>
          <span className={styles.heroCredit}>SUI / SALON IMAGE</span>
        </section>

        <div className={`${styles.latest} ${styles.container}`}><span>JOURNAL</span><button type="button" onClick={() => setModal({ kind: "news", index: 0 })}><time dateTime={news[0].dateTime}>{news[0].date}</time><span>{news[0].title}</span><Arrow/></button><a href="#sui-journal" aria-label="すべてのお知らせを見る">ALL NEWS <Arrow/></a></div>

        <section id="sui-intro" className={`${styles.intro} ${styles.container}`} aria-label="suiのコンセプト"><div data-sui-reveal><p className={styles.eyebrow}>SOMETHING THAT FEELS LIKE YOU.</p><h2><TextLines lines={["似合う、の先に。", "あなたらしい髪を。"]}/></h2></div><Reveal delay={100} className={styles.introCopy}><p>鏡の前で、少し気分が上がること。<br/>いつもの服が、なんだかしっくりくること。</p><p>大きく変える日も、少し整える日も。<br/>あなたの輪郭、髪質、暮らしに目を向けて。<br/>「似合う」を、あなたらしい形にしていきます。</p><span>YOUR HAIR. YOUR PACE. YOUR EVERYDAY.</span></Reveal></section>

        <section id="sui-guide" className={styles.guide} aria-labelledby="sui-guide-heading">
          <span id="sui-lookbook" className={styles.guideAlias} aria-hidden="true"/>
          <div className={`${styles.guideLayout} ${styles.container}`}>
            <div className={styles.guideHeading} data-sui-reveal>
              <p className={styles.eyebrow}>COUNSELING &amp; MENU</p>
              <h2 id="sui-guide-heading"><TextLines lines={["髪のお悩みから、", "メニューを選ぶ。"]}/></h2>
              <p>したい髪型が、まだ決まっていなくても。<br/>気になることから、ご覧ください。</p>
              <a href="#sui-first" className={styles.guideFirst}>初めての方へのご案内</a>
            </div>
            <div className={styles.guideList}>
              {menuGuide.map((entry, index) => {
                const menu = menuGroups.find(group => group.id === entry.group)?.items.find(item => item.id === entry.item);
                if (!menu) return null;
                return <details key={entry.id} name="sui-menu-concern" open={index === 0}>
                  <summary><span className={styles.guideLabel}>{entry.label}</span><span className={styles.guideConcern}>{entry.concern}</span><span className={styles.guideIndicator} aria-hidden="true"/></summary>
                  <div className={styles.guideDetail}>
                    <p>{entry.description}</p>
                    <a href="#sui-menu" className={styles.guidePrice} onClick={() => { setMenuTab(entry.group); setGuideChoice(menu.id); }}>
                      <span><small>ご相談の目安</small>{menu.name}</span><strong>¥{menu.price}</strong><span className={styles.guidePriceLink}>料金表を見る</span>
                    </a>
                  </div>
                </details>;
              })}
              <p className={styles.guideNote}>掲載のメニュー・料金は税込の制作見本です。施術は髪の状態を見てご相談する想定です。</p>
            </div>
          </div>
        </section>

        <section id="sui-design" className={`${styles.design} ${styles.container}`} aria-labelledby="sui-design-heading"><div className={styles.craftPhoto} data-sui-reveal><div className={styles.craftFrame} data-sui-scene="craft"><Image src="/demo/sui/station-tools.webp" alt="鏡の前に置かれたハサミ、コーム、白いタオル" width={1536} height={1024} sizes="(max-width: 700px) 150vw, 90vw"/></div><span>A LITTLE DETAIL MAKES THE DIFFERENCE.</span></div><div className={styles.designCopy} data-sui-reveal><p className={styles.eyebrow}>OUR DESIGN</p><h2 id="sui-design-heading"><TextLines lines={["似合わせを、", "感覚だけで", "終わらせない。"]}/></h2><p>長さや色を決める前に、<br/>髪質と、普段の過ごし方を。</p><dl>{[["輪郭と、バランス。","正面だけでなく、横顔や後ろ姿まで。顔まわりと全体のシルエットを考えます。"],["髪質と、動き。","髪のやわらかさや生えぐせ、動きの出方。素材の表情を見ながら、ご提案します。"],["いつもの、お手入れ。","朝のスタイリングにかけられる時間も。サロンの外の毎日まで、いっしょに考えます。"]].map(([title,text]) => <div key={title} className={styles.designNote} data-sui-reveal><dt>{title}</dt><dd>{text}</dd></div>)}</dl><small>架空のサロンのカウンセリング方針を紹介する制作例です。</small></div></section>

        <section id="sui-menu" className={styles.menuSection} aria-labelledby="sui-menu-heading"><div className={`${styles.menuLayout} ${styles.container}`}><Reveal className={styles.menuIntro}><p className={styles.eyebrow}>MENU & PRICE</p><h2 id="sui-menu-heading">髪に、<br/>必要なことを。</h2><p>選びやすく、わかりやすく。<br/>なりたい印象と、今の髪から。</p><a href="#sui-first" className={styles.textLink}>メニューに迷ったら<Arrow/></a></Reveal><Reveal delay={100} className={styles.menuContent}><div className={styles.menuTabs} role="tablist" aria-label="メニューの種類" onKeyDown={event => { const next = event.key === "ArrowLeft" || event.key === "ArrowRight" ? menuGroups.find(group => group.id !== menuTab) : event.key === "Home" ? menuGroups[0] : event.key === "End" ? menuGroups[menuGroups.length - 1] : undefined; if (!next) return; event.preventDefault(); setMenuTab(next.id); document.getElementById(`sui-tab-${next.id}`)?.focus(); }}>{menuGroups.map(group => <button type="button" role="tab" key={group.id} id={`sui-tab-${group.id}`} aria-selected={menuTab === group.id} aria-controls="sui-menu-panel" tabIndex={menuTab === group.id ? 0 : -1} onClick={() => setMenuTab(group.id)}>{group.label}<small>{group.english}</small></button>)}</div><div id="sui-menu-panel" role="tabpanel" aria-labelledby={`sui-tab-${menuTab}`} className={styles.priceList}>{currentMenu.items.map(item => <div key={item.id} data-menu-picked={guideChoice === item.id || undefined}><div><h3>{item.name}</h3><p>{item.detail}</p></div><span>¥{item.price}</span></div>)}</div><p className={styles.priceNote}>すべて税込・制作見本の料金です。<br/>施術内容・髪の長さや状態により、料金・所要時間が変わる想定です。実際の店舗では事前にご確認ください。</p></Reveal></div></section>

        <section id="sui-salon" className={styles.salonSection} aria-labelledby="sui-salon-heading"><div className={styles.salonPhoto} data-sui-scene="salon"><Image src="/demo/sui/interior.webp" alt="窓から光が入り、鏡と椅子が並ぶサロンの店内" fill sizes="(max-width: 700px) 210vw, 100vw"/><div/><div className={styles.salonOverlay} data-sui-reveal><p className={styles.eyebrow}>THE SALON</p><h2 id="sui-salon-heading"><TextLines lines={["ひと息つける、", "髪のアトリエ。"]}/></h2><button type="button" className={styles.filmButton} onClick={() => setModal({ kind: "film" })}><span aria-hidden="true">▶</span><span>写真で見る、サロンの空気<small>PHOTO FILM / 00:12</small></span></button></div><small className={styles.salonImageNote}>SALON IMAGE / DESIGN SAMPLE</small></div><div className={`${styles.salonCaption} ${styles.container}`}><p>会話も、静けさも。<br/>心地よいほうで。</p><p>少しだけ、日常から離れて。<br/>髪と、自分に向き合う時間を。<br/>店内の写真・設備は、架空のサロンのイメージです。</p></div></section>

        <section id="sui-first" className={`${styles.firstVisit} ${styles.container}`} aria-label="初めての方へのご案内"><Reveal className={styles.firstCopy}><p className={styles.eyebrow}>FOR YOUR FIRST VISIT</p><h2>「なんとなく」も、<br/>持ってきてください。</h2><p>はっきり決まっていなくても。<br/>変えたい気持ちから、<br/>いっしょに見つけていきましょう。</p><LineLink className={styles.textLink}/><small>LINE公式アカウントへの連携例です。</small></Reveal><div className={styles.faqList}>{faqs.map(item => <Reveal key={item.question}><details><summary>{item.question}<span aria-hidden="true">＋</span></summary><p>{item.answer}</p></details></Reveal>)}</div></section>

        <section id="sui-journal" className={`${styles.journal} ${styles.container}`} aria-labelledby="sui-journal-heading"><Reveal className={styles.journalHeading}><p className={styles.eyebrow}>FROM THE ATELIER</p><h2 id="sui-journal-heading">Journal<span>サロンからのお知らせ</span></h2></Reveal><div className={styles.newsList}>{news.map((item,index) => <button type="button" key={item.date} onClick={() => setModal({ kind: "news", index })}><time dateTime={item.dateTime}>{item.date}</time><small>{item.category}</small><span>{item.title}</span><Arrow/></button>)}</div></section>

        <section id="sui-access" className={styles.access} aria-labelledby="sui-access-heading"><div className={`${styles.accessGrid} ${styles.container}`}><Reveal><p className={styles.eyebrow}>COME AS YOU ARE.</p><h2 id="sui-access-heading">Access</h2><dl>{[["SALON",salon.name],["AREA",salon.area],["OPEN",salon.hours],["CLOSED",salon.closed]].map(([term,text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl><p className={styles.accessNote}>地図は堺市周辺の表示例です。<br/>実在するサロンの所在地・営業情報ではありません。</p></Reveal><Reveal delay={100} className={styles.mapBlock}><div className={styles.mapFrame}>{map}</div><a href="https://www.google.com/maps/search/?api=1&query=%E5%A0%BA%E5%B8%82" target="_blank" rel="noopener noreferrer" className={styles.textLink}>堺市周辺をGoogleマップでみる<Arrow external/></a></Reveal></div></section>

        <section id="sui-reservation" className={styles.reservation} aria-labelledby="sui-reservation-heading"><div className={styles.container} data-sui-reveal><p className={styles.eyebrow}>MAKE ROOM FOR A NEW YOU.</p><h2 id="sui-reservation-heading"><TextLines lines={["次の髪を、", "話すところから。"]}/></h2><div className={styles.bookingLinks}><Reserve className={styles.reservationLink}><span>予約サイトはこちら<small>WEB RESERVATION</small></span></Reserve><LineLink className={styles.lineLink}/></div><p className={styles.linkNote}>{salon.linkNote}</p></div></section>
      </main>

      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><a href="#sui-top" aria-label="sui hair atelier トップへ"><Brand large/></a><nav aria-label="フッターメニュー">{navigation.map(([href,label]) => <a href={href} key={href}>{label}</a>)}<a href="#sui-first">FIRST VISIT</a><a href="#sui-journal">JOURNAL</a></nav><a className={styles.topLink} href="#sui-top">BACK TO TOP ↑</a></div><div className={styles.footerBottom}><p>架空のヘアサロンのホームページ制作見本です。<br/>店名・料金・営業情報・写真はデモ用です。モデル画像は実際のお客様・施術実績ではありません。</p><Link href="/#demo">DESIGN BY まちのWeb<Arrow external/></Link><small>© SUI HAIR ATELIER / DESIGN SAMPLE</small></div></div></footer>
      <div className={styles.mobileBooking}><Reserve>WEB予約</Reserve><LineLink/></div>
    </div>

    {menuOpen && <div ref={mobileMenu} id="sui-mobile-menu" className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="メニュー"><div className={styles.mobileMenuTop}><Brand/><button ref={menuClose} type="button" className={styles.closeButton} aria-label="メニューを閉じる" onClick={() => { restoreMenuFocus.current = true; setMenuOpen(false); }}>CLOSE<span aria-hidden="true">×</span></button></div><nav>{navigation.map(([href,label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<Arrow/></a>)}<a href="#sui-first" onClick={() => setMenuOpen(false)}>FIRST VISIT<Arrow/></a></nav><div className={styles.mobileMenuLinks}><Reserve className={styles.textLink}/><LineLink className={styles.textLink}/></div><p>SUI HAIR ATELIER / DESIGN SAMPLE</p></div>}

    <dialog ref={dialog} className={`${styles.dialog} ${modal?.kind === "film" ? styles.filmDialog : ""}`} aria-labelledby="sui-dialog-heading" onClose={() => { if (!dialog.current?.open) setModal(null); }} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      {modal && <div className={styles.dialogInner}><button type="button" className={styles.closeButton} aria-label="閉じる" onClick={() => setModal(null)}>CLOSE<span aria-hidden="true">×</span></button>
        {modal.kind === "news" && <div className={styles.newsDetail}><p className={styles.eyebrow}>{news[modal.index].date} / {news[modal.index].category}</p><h2 id="sui-dialog-heading">{news[modal.index].title}</h2><p>{news[modal.index].body}</p><small>架空のサロンのお知らせ掲載例です。</small></div>}
        {modal.kind === "film" && <div className={styles.filmDetail}><h2 id="sui-dialog-heading">SUI / PHOTO FILM</h2><video ref={video} controls autoPlay playsInline preload="metadata" poster="/demo/sui/interior.webp" aria-label="suiの写真による12秒のイメージフィルム"><source src="/demo/sui/salon-film.mp4" type="video/mp4"/>動画再生に対応していないブラウザです。</video><p>A LITTLE ROOM FOR YOURSELF.<small>デモ用写真から制作した、12秒の無音フォトフィルムです。実写動画ではありません。</small></p></div>}
      </div>}
    </dialog>
  </div>;
}
