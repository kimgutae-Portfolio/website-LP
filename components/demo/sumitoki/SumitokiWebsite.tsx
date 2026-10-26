"use client";

import Image from "next/image";
import { DemoPriceGuide } from "@/components/pricing/DemoPriceGuide";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon } from "@/components/icons";
import { courses, dishes, drinks, heroSlides, news, posts, restaurant } from "./content";
import styles from "./sumitoki.module.css";

function Arrow({ external = false }: { external?: boolean }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d={external ? "M5 19 19 5M7 5h12v12" : "M3 12h17M15 7l5 5-5 5"} /></svg>;
}

function CoalMark() {
  return <svg viewBox="0 0 40 40" width="32" height="32" fill="none" aria-hidden="true"><path d="m10 28 18-18M8 20 20 8M20 32l12-12M9 35h25" /></svg>;
}

function Brand({ large = false }: { large?: boolean }) {
  return <span className={`${styles.brand} ${large ? styles.brandLarge : ""}`}><span>炭と季</span><small>SUMITOKI</small></span>;
}

function ReservationLink({ className = "", children }: { className?: string; children: ReactNode }) {
  return <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer" className={className} aria-label="外部予約サイトを開く（新しいタブ）">{children}<Arrow external /></a>;
}

const nav = [["#sumitoki-about", "炭と季について"], ["#sumitoki-menu", "お品書き"], ["#sumitoki-space", "店内のこと"], ["#sumitoki-journal", "日々のこと"], ["#sumitoki-access", "店舗情報"]] as const;
type Modal = { kind: "film" } | { kind: "post"; index: number } | { kind: "news"; index: number } | null;

export function SumitokiWebsite({ map }: { map: ReactNode }) {
  const [opening, setOpening] = useState<"pending" | "playing" | "complete" | "skipped">("pending");
  const [reduced, setReduced] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState("recommended");
  const [modal, setModal] = useState<Modal>(null);
  const [feedEdges, setFeedEdges] = useState({ start: true, end: false });
  const entrance = useRef<HTMLDivElement>(null);
  const heroPhoto = useRef<HTMLImageElement>(null);
  const heroHeading = useRef<HTMLHeadingElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuClose = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const introVisible = opening === "pending" || opening === "playing";
  const modalOpen = modal !== null;

  useEffect(() => {
    const element = feed.current;
    if (!element) return;
    const update = () => {
      const start = element.scrollLeft <= 2;
      const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
      setFeedEdges(previous => previous.start === start && previous.end === end ? previous : { start, end });
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  function moveFeed(direction: -1 | 1) {
    const element = feed.current;
    if (!element?.firstElementChild) return;
    const step = element.firstElementChild.getBoundingClientRect().width + Number.parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: step * direction, behavior: reduced ? "auto" : "smooth" });
  }

  useEffect(() => {
    const html = document.documentElement;
    const previousPadding = html.style.scrollPaddingTop;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollPaddingTop = "0px";
    html.style.scrollbarGutter = "stable";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let started = false;
    const updateMotion = () => { setReduced(motion.matches); if (motion.matches) setOpening("skipped"); };
    updateMotion();
    if (window.location.hash && window.location.hash !== "#sumitoki-top") setOpening("skipped");
    const start = () => {
      if (cancelled || started) return;
      started = true;
      window.clearTimeout(fallback);
      setOpening(state => state === "pending" ? "playing" : state);
    };
    const fallback = window.setTimeout(start, 600);
    Promise.all([document.fonts.ready, heroPhoto.current?.decode().catch(() => undefined)]).then(start);
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onVisibility = () => setVisible(!document.hidden);
    onScroll(); onVisibility();
    motion.addEventListener("change", updateMotion);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true; window.clearTimeout(fallback);
      motion.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      html.style.scrollPaddingTop = previousPadding;
      html.style.scrollbarGutter = previousGutter;
    };
  }, []);

  useEffect(() => {
    if (opening !== "playing") return;
    entrance.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") { event.preventDefault(); setOpening("skipped"); }
    };
    const fallback = window.setTimeout(() => setOpening(state => state === "playing" ? "complete" : state), 2900);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(fallback); document.removeEventListener("keydown", onKey);
      if (document.activeElement === entrance.current || document.activeElement === document.body) heroHeading.current?.focus({ preventScroll: true });
    };
  }, [opening]);

  useEffect(() => {
    if (introVisible || reduced || paused || !visible || modalOpen || menuOpen) return;
    const timer = window.setInterval(() => setSlide(value => (value + 1) % heroSlides.length), 8000);
    return () => window.clearInterval(timer);
  }, [introVisible, reduced, paused, visible, modalOpen, menuOpen, slide]);

  useEffect(() => {
    if (!introVisible && !menuOpen && !modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [introVisible, menuOpen, modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const element = dialog.current;
    element?.showModal();
    return () => { video.current?.pause(); element?.close(); };
  }, [modalOpen]);

  useEffect(() => {
    if (modal?.kind !== "post") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      setModal(current => current?.kind === "post" ? { kind: "post", index: (current.index + (event.key === "ArrowRight" ? 1 : posts.length - 1)) % posts.length } : current);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  useEffect(() => {
    if (!menuOpen) return;
    menuClose.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuTrigger.current?.focus(); }
      if (event.key !== "Tab") return;
      const items = Array.from(menu.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return <div className={styles.site} data-opening={opening}>
    {introVisible && <div ref={entrance} className={styles.entrance} data-sumitoki-opening tabIndex={-1} role="dialog" aria-modal="true" aria-label="炭と季 オープニング" onAnimationEnd={event => { if (event.target === event.currentTarget) setOpening(state => state === "playing" ? "complete" : state); }}>
      <div className={styles.entranceIdentity}><CoalMark /><Brand large /><p>炭の香り、季節のつづき。</p><small>CHARCOAL & SEASONAL KITCHEN</small></div>
      <span className={styles.entranceBottom}>A SMALL PLACE. A GOOD EVENING.</span>
    </div>}
    <noscript><style>{`[data-sumitoki-opening]{display:none!important}`}</style></noscript>

    <div inert={opening === "playing" || menuOpen}>
      <div id="sumitoki-top" />
      <div className={styles.demoBar}><a href="#production-scope">初期0円でできる範囲を見る</a><Link href="/#demo">まちのWebへ戻る <span aria-hidden="true">↗</span></Link></div>
      <header className={`${styles.header} ${scrolled ? styles.headerSolid : ""}`}>
        <a href="#sumitoki-top" aria-label="炭と季 トップページ"><Brand /></a>
        <nav className={styles.desktopNav} aria-label="メインメニュー">{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
        <ReservationLink className={styles.headerReserve}><span>ご予約</span></ReservationLink>
        <button ref={menuTrigger} type="button" className={styles.menuTrigger} aria-label="メニューを開く" aria-expanded={menuOpen} aria-controls="sumitoki-mobile-menu" onClick={() => setMenuOpen(true)}><span /><span /><small>MENU</small></button>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="sumitoki-hero-heading">
          {heroSlides.map((item, index) => <Image key={item.image} ref={index === 0 ? heroPhoto : undefined} src={`/demo/sumitoki/${item.image}.webp`} alt={item.alt} aria-hidden={slide !== index} fill priority={index === 0} sizes="100vw" className={`${styles.heroImage} ${slide === index ? styles.heroImageActive : ""}`} data-image={item.image} />)}
          <div className={styles.heroShade} />
          <div className={styles.heroTitle}><p>炭火と、季節の小さなビストロ</p><h1 ref={heroHeading} tabIndex={-1} id="sumitoki-hero-heading"><span>炭の香り、</span><span>季節のつづき。</span></h1></div>
          <div className={styles.heroBottom}><div><p>SLOW FIRE.<br />GOOD TIME.</p><a href="#sumitoki-about" className={styles.scrollLink}>SCROLL <span aria-hidden="true">↓</span></a></div><button type="button" className={styles.filmLink} onClick={() => setModal({ kind: "film" })}><span aria-hidden="true">▶</span><span>ひとときを見る<small>PHOTO FILM / 00:12</small></span></button></div>
          <div className={styles.heroControls} role="group" aria-label="メインビジュアルの切り替え"><span aria-live="off">0{slide + 1}<i />0{heroSlides.length}</span>{heroSlides.map((item, index) => <button key={item.image} type="button" aria-label={`${index + 1}枚目：${item.label}`} aria-pressed={slide === index} onClick={() => setSlide(index)}><span /></button>)}{!reduced && <button type="button" className={styles.pause} onClick={() => setPaused(value => !value)} aria-label={paused ? "スライドショーを再生" : "スライドショーを停止"}>{paused ? "PLAY" : "PAUSE"}</button>}</div>
          <span className={styles.heroSide}>CHARCOAL & SEASONAL KITCHEN / OSAKA</span>
        </section>

        <div className={styles.latest}><span>NEWS</span><button type="button" onClick={() => setModal({ kind: "news", index: 0 })}><time dateTime={news[0].dateTime}>{news[0].date}</time><span>{news[0].title}</span><Arrow /></button></div>

        <section id="sumitoki-about" tabIndex={-1} className={`${styles.about} ${styles.container}`} aria-labelledby="sumitoki-about-heading">
          <Reveal className={styles.sectionHeading}><p className={styles.eyebrow}>01 — OUR STORY</p><h2 id="sumitoki-about-heading">きょうを、<br className={styles.mobileBreak} />おいしく。</h2></Reveal>
          <div className={styles.storyGrid}><Reveal className={styles.storyCopy}><span className={styles.smallKanji} aria-hidden="true">炭と、季節と。</span><div><p>炭をおこす。<br />旬の野菜を並べる。<br />きょうの魚に、そっと塩をふる。</p><p>特別なことは、しすぎずに。<br />素材の持ち味を、じっくり引き出す。<br />炭と季は、そんな料理と<br />気負わない時間を楽しむ小さな場所です。</p><p>香ばしいひと皿と、好きな一杯。<br />いつもの夜が、少しだけいい夜になりますように。</p><a href="#sumitoki-menu" className={styles.textLink}>お品書きを見る <Arrow /></a></div></Reveal><Reveal delay={100} className={`${styles.storyPhoto} ${styles.imageReveal}`}><Image src="/demo/sumitoki/vegetables.webp" alt="炭火の香ばしさをまとった季節野菜の一皿" width={1200} height={900} sizes="(max-width: 700px) 90vw, 48vw" /><span>FIRE BRINGS OUT THE SEASON.</span></Reveal></div>
          <Reveal className={styles.storyFoot}><span>じっくり焼いて、<br />ゆっくり過ごす。</span><p>旬のものを、旬のうちに。<br />小さなこだわりを、ひと皿ずつ。</p><CoalMark /></Reveal>
        </section>

        <section id="sumitoki-menu" tabIndex={-1} className={styles.menuSection} aria-labelledby="sumitoki-menu-heading"><div className={styles.container}>
          <Reveal className={styles.menuHeading}><div><p className={styles.eyebrow}>02 — THE MENU</p><h2 id="sumitoki-menu-heading">季節を、ひと皿に。</h2></div><p>炭火の香りに、旬の彩り。<br />今夜の気分で、お選びください。</p></Reveal>
          <div className={styles.menuTabs} role="tablist" aria-label="お品書きの種類" onKeyDown={event => {
            const tabs = ["recommended", "course", "drinks"];
            const index = tabs.indexOf(menuTab);
            const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : -1;
            if (next < 0) return;
            event.preventDefault(); setMenuTab(tabs[next]); document.getElementById(`sumitoki-tab-${tabs[next]}`)?.focus();
          }}>{[["recommended", "おすすめの一品"], ["course", "おまかせコース"], ["drinks", "お飲みもの"]].map(([id, label]) => <button key={id} type="button" id={`sumitoki-tab-${id}`} role="tab" tabIndex={menuTab === id ? 0 : -1} aria-selected={menuTab === id} aria-controls="sumitoki-menu-panel" onClick={() => setMenuTab(id)}>{label}</button>)}</div>
          {menuTab === "recommended" && <p className={styles.swipeNote}>横にスワイプして、ほかの一品も。 <span aria-hidden="true">→</span></p>}
          <div id="sumitoki-menu-panel" role="tabpanel" aria-labelledby={`sumitoki-tab-${menuTab}`} className={styles.menuPanel}>
            {menuTab === "recommended" && <div className={styles.dishGrid} role="region" aria-label="おすすめ料理の一覧（横にスクロールできます）" tabIndex={0}>{dishes.map((dish, index) => <article key={dish.image} className={styles.dish}><div className={styles.dishPhoto}><Image src={`/demo/sumitoki/${dish.image}.webp`} alt={dish.alt} width={1200} height={900} sizes="(max-width: 700px) 88vw, 32vw" /><span>0{index + 1}</span></div><p className={styles.dishEnglish}>{dish.en}</p><h3>{dish.name}</h3><p className={styles.price}>¥{dish.price}<small>税込</small></p><p className={styles.dishDescription}>{dish.text}</p></article>)}</div>}
            {menuTab === "course" && <div className={styles.courseList}>{courses.map((course, index) => <article key={course.name}><span>COURSE 0{index + 1}</span><h3>{course.name}</h3><p className={styles.price}>¥{course.price}<small>税込 / お一人様</small></p><p>{course.description}</p><small>{course.items}</small></article>)}</div>}
            {menuTab === "drinks" && <div className={styles.drinkList}>{drinks.map(([name, price, text]) => <article key={name}><div><h3>{name}</h3><p>¥{price}<small>税込</small></p></div><span>{text}</span></article>)}</div>}
          </div>
          <p className={styles.menuNote}>※ メニュー・価格は制作見本です。実際のご提供内容ではありません。</p>
          <div className={styles.menuBottom}><p>料理に合わせた一杯も、ご一緒に。</p><ReservationLink className={styles.textLink}>外部サイトから予約する</ReservationLink></div>
        </div></section>

        <section id="sumitoki-space" tabIndex={-1} className={styles.space} aria-labelledby="sumitoki-space-heading"><div className={styles.spacePhoto}><Image src="/demo/sumitoki/interior.webp" alt="木のカウンターと小さな灯りが広がる、炭と季の店内イメージ" fill sizes="100vw" /><div /><Reveal className={styles.spaceOverlay}><p className={styles.eyebrow}>03 — THE SPACE</p><h2 id="sumitoki-space-heading">火のそばで、<br />心ほどける夜を。</h2><button type="button" className={styles.filmLink} onClick={() => setModal({ kind: "film" })}><span aria-hidden="true">▶</span><span>写真でめぐる、炭と季<small>PHOTO FILM / 00:12</small></span></button></Reveal></div><div className={`${styles.spaceDetails} ${styles.container}`}><Reveal><p>12席だけの、<br />ゆっくりした夜。</p></Reveal><Reveal delay={80}><p>焼き上がる音、立ちのぼる香り。<br />料理を待つ時間まで、楽しんでいただけたら。<br />おひとりでも、おふたりでも。いつもの服で、どうぞ。</p><span>カウンター8席 / テーブル4席（デモ設定）</span></Reveal></div></section>

        <section id="sumitoki-journal" tabIndex={-1} className={`${styles.journal} ${styles.container}`} aria-labelledby="sumitoki-journal-heading"><Reveal className={styles.journalHeading}><div><p className={styles.eyebrow}>04 — PHOTO JOURNAL</p><h2 id="sumitoki-journal-heading">炭と季の日々。</h2></div><span><InstagramIcon className={styles.instagramIcon} />INSTAGRAM / DEMO FEED</span></Reveal>
          <div className={styles.feedToolbar}><p>横にめくって、お店の日常を。</p><div className={styles.feedControls}><button type="button" aria-label="前の写真へ" aria-controls="sumitoki-instagram-feed" disabled={feedEdges.start} onClick={() => moveFeed(-1)}><Arrow /></button><button type="button" aria-label="次の写真へ" aria-controls="sumitoki-instagram-feed" disabled={feedEdges.end} onClick={() => moveFeed(1)}><Arrow /></button></div></div>
          <Reveal><div ref={feed} id="sumitoki-instagram-feed" className={styles.postGrid} role="region" aria-label="Instagramの投稿（横にスクロールできます）" tabIndex={0}>{posts.map((post, index) => <div key={post.image}><button type="button" className={styles.post} onClick={() => setModal({ kind: "post", index })} aria-label={`SNS投稿を見る：${post.title}`}><div><Image src={`/demo/sumitoki/${post.image}.webp`} alt={post.alt} width={1200} height={900} sizes="(max-width: 700px) 82vw, (max-width: 1100px) 50vw, 480px" /><span>投稿を見る <Arrow /></span></div><time dateTime={post.dateTime}>{post.date}</time><h3>{post.title}</h3></button></div>)}</div></Reveal>
          <p className={styles.feedNote}>3件の投稿は手動掲載のデモです。写真をタップすると、投稿の内容をご覧いただけます。</p>
          <div className={styles.newsList}><p className={styles.eyebrow}>お店からのお知らせ</p>{news.map((item, index) => <button type="button" key={item.date} onClick={() => setModal({ kind: "news", index })}><time dateTime={item.dateTime}>{item.date}</time><span>{item.title}</span><Arrow /></button>)}</div>
        </section>

        <section id="sumitoki-access" tabIndex={-1} className={styles.access} aria-labelledby="sumitoki-access-heading"><div className={`${styles.accessGrid} ${styles.container}`}><Reveal><p className={styles.eyebrow}>05 — VISIT US</p><h2 id="sumitoki-access-heading">今夜の寄り道は、<br />こちらへ。</h2><dl>{[["店名", "炭と季 / SUMITOKI"], ["エリア", restaurant.area], ["営業時間", `${restaurant.hours}\n${restaurant.lastOrder}`], ["定休日", restaurant.closed], ["お席", "カウンター8席・テーブル4席"]].map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl><p className={styles.accessNote}>店舗情報はすべて架空の設定です。<br />地図は堺市周辺の表示例です。</p></Reveal><Reveal delay={100} className={styles.mapBlock}><div className={styles.mapFrame}>{map}</div><a className={styles.textLink} href="https://www.google.com/maps/search/?api=1&query=%E5%A0%BA%E5%B8%82" target="_blank" rel="noopener noreferrer">Googleマップで堺市を見る <Arrow external /></a></Reveal></div></section>

        <section className={styles.reservation} aria-labelledby="sumitoki-reservation-heading"><Reveal className={styles.reservationInner}><CoalMark /><p className={styles.eyebrow}>A TABLE FOR YOUR EVENING</p><h2 id="sumitoki-reservation-heading">おいしい夜を、<br />ご一緒に。</h2><p>ご予約は、ご利用中の予約サイトへ。<br />このホームページ内での予約入力はありません。</p><ReservationLink className={styles.reservationLink}><span>外部サイトで予約する<small>RESERVATION</small></span></ReservationLink><small className={styles.reservationNote}>{restaurant.reservationNote}</small></Reveal></section>
      </main>

      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><a href="#sumitoki-top" aria-label="炭と季 トップへ"><Brand large /></a><nav aria-label="フッターメニュー">{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav><a href="#sumitoki-top" className={styles.topLink}>TOP ↑</a></div><div className={styles.footerBottom}><span>© SUMITOKI — DESIGN SAMPLE</span><p>架空の飲食店の制作見本です。<br />店名・料理・価格・営業情報・写真はデモ用です。</p><Link href="/#demo">DESIGN BY まちのWeb ↗</Link></div><DemoPriceGuide slug="sumitoki"/></div></footer>
      <div className={styles.mobileReservation}><ReservationLink><span><small>RESERVATION</small>ご予約は、こちらから</span><em>外部予約サイトへ</em></ReservationLink></div>
    </div>

    {menuOpen && <div ref={menu} id="sumitoki-mobile-menu" className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="メニュー"><div className={styles.mobileMenuTop}><Brand /><button type="button" ref={menuClose} className={styles.close} onClick={() => { setMenuOpen(false); menuTrigger.current?.focus(); }} aria-label="メニューを閉じる">閉じる <span aria-hidden="true">×</span></button></div><nav>{nav.map(([href, label], index) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}<Arrow /></a>)}</nav><ReservationLink className={styles.reservationLink}><span>外部サイトで予約する<small>RESERVATION</small></span></ReservationLink><p>CHARCOAL & SEASONAL KITCHEN<br />OSAKA, JAPAN</p></div>}

    <dialog ref={dialog} className={`${styles.dialog} ${modal?.kind === "film" ? styles.filmDialog : ""}`} aria-labelledby="sumitoki-dialog-heading" onClose={() => { if (!dialog.current?.open) setModal(null); }} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      {modal && <div className={styles.dialogInner}><button type="button" className={styles.close} onClick={() => setModal(null)} aria-label="閉じる">閉じる <span aria-hidden="true">×</span></button>
        {modal.kind === "post" && <div className={styles.postDetail}><Image src={`/demo/sumitoki/${posts[modal.index].image}.webp`} alt={posts[modal.index].alt} width={1200} height={900} sizes="(max-width: 700px) 95vw, 600px" /><div className={styles.postCaption} aria-live="polite"><div className={styles.postAccount}><CoalMark /><span>炭と季<small>SUMITOKI / DEMO POST</small></span><InstagramIcon className={styles.instagramIcon} /></div><time dateTime={posts[modal.index].dateTime}>{posts[modal.index].date}</time><h2 id="sumitoki-dialog-heading">{posts[modal.index].title}</h2><p>{posts[modal.index].caption}</p><span className={styles.tags}>{posts[modal.index].tags}</span><small className={styles.postDisclaimer}>制作見本の投稿です。Instagramからの自動取得ではありません。</small><div className={styles.postControls}><button type="button" onClick={() => setModal({ kind: "post", index: (modal.index + posts.length - 1) % posts.length })} aria-label="前の投稿">← 前の投稿</button><span>{modal.index + 1} / {posts.length}</span><button type="button" onClick={() => setModal({ kind: "post", index: (modal.index + 1) % posts.length })} aria-label="次の投稿">次の投稿 →</button></div></div></div>}
        {modal.kind === "news" && <div className={styles.newsDetail}><p className={styles.eyebrow}>NEWS / {news[modal.index].date}</p><h2 id="sumitoki-dialog-heading">{news[modal.index].title}</h2><p>{news[modal.index].text}</p><small>架空の飲食店の、お知らせ掲載イメージです。</small></div>}
        {modal.kind === "film" && <div className={styles.filmDetail}><h2 id="sumitoki-dialog-heading">SUMITOKI / PHOTO FILM</h2><video ref={video} controls autoPlay playsInline preload="metadata" poster="/demo/sumitoki/hero-no-people.webp" aria-label="炭と季の写真によるイメージフィルム"><source src="/demo/sumitoki/photo-film-no-people.mp4" type="video/mp4" />動画再生に対応していないブラウザです。</video><p>炭の香り、季節のつづき。<small>デモ用に制作した写真を使った、12秒の無音フィルムです。</small></p></div>}
      </div>}
    </dialog>
  </div>;
}
