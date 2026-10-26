"use client";

import Image from "next/image";
import { DemoPriceGuide } from "@/components/pricing/DemoPriceGuide";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { belongings, clinic, faqs, greetings, notices, services } from "./content";
import styles from "./komorebi.module.css";

function Arrow({ external = false }: { external?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden="true"><path d={external ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-5-5 5 5-5 5"} /></svg>;
}

function Leaf({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true"><path d="M43 9C17 7 7 22 14 36c14 7 31-2 29-27Z" fill="currentColor" stroke="none" /><path d="M9 47 34 22" stroke="#fff9ee" strokeWidth="2" /><path d="m20 36-1-12m9 4 10 1" stroke="#fff9ee" strokeWidth="1.5" /></svg>;
}

function BearMark() {
  return <svg viewBox="0 0 64 64" fill="none" width="44" height="44" aria-hidden="true"><circle cx="18" cy="17" r="9" fill="#b88856"/><circle cx="46" cy="17" r="9" fill="#b88856"/><ellipse cx="32" cy="34" rx="24" ry="22" fill="#d6a76d"/><ellipse cx="32" cy="41" rx="12" ry="9" fill="#f7e5c3"/><circle cx="23" cy="31" r="2" fill="#354c3e"/><circle cx="41" cy="31" r="2" fill="#354c3e"/><path d="m28 38 4 4 4-4Z" fill="#354c3e"/><path d="M25 46q7 6 14 0" stroke="#354c3e" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 52q22 13 44 0v8H10Z" fill="#577b59"/></svg>;
}

function Brand() {
  return <span className={styles.brand}><BearMark /><span>こもれび<small>こどもクリニック</small></span></span>;
}

function CareIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={styles.careIcon}>
    {kind === "care" && <><path d="M16 24a10 10 0 0 1 17-7 10 10 0 0 1 17 7c0 11-17 23-17 23S16 35 16 24Z" fill="#e9b6a0" stroke="none"/><path d="M11 39v8c0 5 11 9 21 9s21-4 21-9v-8M23 30h6l3-6 4 12 4-6h5"/></>}
    {kind === "leaf" && <><path d="M47 12C23 9 12 21 19 36c15 7 29-3 28-24Z" fill="#bed0a6" stroke="none"/><path d="M15 47 38 24M28 48v9M20 57h16M13 14v8m-4-4h8M50 40v8m-4-4h8"/></>}
    {kind === "growth" && <><path d="M18 14h29v43H18z" fill="#f3da9a" stroke="none"/><path d="M22 11v44h26M22 20h8m-8 9h5m-5 9h8m-8 9h5M41 12v24m-7-17 7-7 7 7"/></>}
    {kind === "clock" && <><circle cx="32" cy="32" r="23"/><path d="M32 18v16l10 6"/></>}
    {kind === "book" && <><path d="M32 18c-8-6-17-6-24-4v37c9-2 17-1 24 4 7-5 15-6 24-4V14c-7-2-16-2-24 4Zm0 0v37M15 25h9m-9 8h9m16-8h9m-9 8h9"/></>}
    {kind === "pin" && <><path d="M50 26c0 14-18 30-18 30S14 40 14 26a18 18 0 1 1 36 0Z"/><circle cx="32" cy="26" r="6"/></>}
  </svg>;
}

function Heading({ eyebrow, children, center = false }: { eyebrow: string; children: ReactNode; center?: boolean }) {
  return <div className={`${styles.sectionHeading} ${center ? styles.centerHeading : ""}`}><p><Leaf />{eyebrow}</p><h2>{children}</h2></div>;
}

const nav = [["#komorebi-about", "こもれびについて"], ["#komorebi-care", "診療のご案内"], ["#komorebi-first", "はじめての方へ"], ["#komorebi-access", "診療時間・アクセス"]] as const;
type Modal = { kind: "service"; index: number } | { kind: "news"; index: number } | { kind: "booking" } | null;

export function KomorebiWebsite({ map }: { map: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [category, setCategory] = useState("すべて");
  const [greeting, setGreeting] = useState(-1);
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const menu = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuClose = useRef<HTMLButtonElement>(null);
  const restoreMenuFocus = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const modalOpen = modal !== null;

  useEffect(() => {
    let cancelled = false;
    const html = document.documentElement;
    const previousPadding = html.style.scrollPaddingTop;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollPaddingTop = "0px";
    html.style.scrollbarGutter = "stable";
    const show = () => { if (!cancelled) setReady(true); };
    const fallback = window.setTimeout(show, 500);
    Promise.all([document.fonts.ready, photo.current?.decode().catch(() => undefined)]).then(show);
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
    return () => element?.close();
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
      const items = Array.from(menu.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const book = () => setModal({ kind: "booking" });
  const goTo = () => setMenuOpen(false);

  return <div className={styles.site} data-ready={ready}>
    <div inert={menuOpen || undefined}>
    <div className={styles.demoBar}><a href="#production-scope">架空の小児科サイト・制作費の範囲</a><Link href="/#demo">まちのWebへ戻る <Arrow external /></Link></div>
    <header className={styles.header}>
      <a href="#komorebi-top" aria-label="こもれび こどもクリニック トップへ"><Brand /></a>
      <nav aria-label="メインメニュー">{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
      <button type="button" className={styles.headerBooking} onClick={book}><span className={styles.calendarGlyph} aria-hidden="true">▦</span>WEB予約<Arrow external /></button>
      <button ref={menuTrigger} type="button" className={styles.menuTrigger} aria-expanded={menuOpen} aria-controls="komorebi-mobile-menu" aria-label="メニューを開く" onClick={() => setMenuOpen(true)}><span/><span/><small>MENU</small></button>
    </header>

    <main>
      <section id="komorebi-top" className={styles.hero} aria-labelledby="komorebi-hero-heading">
        <div className={`${styles.heroInner} ${styles.container}`}>
          <div className={styles.heroCopy}><p className={styles.heroEyebrow}>こどもと、家族と、一歩ずつ。</p><h1 id="komorebi-hero-heading">ちいさなきみに、<br/>おおきな<span>安心</span>を。</h1><p className={styles.heroDescription}>泣いたって、ゆっくりだって、だいじょうぶ。<br/>こどもたちの「いつも」と、<br className={styles.mobileOnly}/>ご家族の毎日に寄り添う場所へ。</p><a href="#komorebi-first" className={styles.textLink}>はじめての方へ <Arrow /></a><p className={styles.heroEnglish}>GROW TOGETHER, LITTLE BY LITTLE.</p></div>
          <div className={styles.heroStage}><div className={styles.stageBackdrop}/><div className={styles.sun} aria-hidden="true"><span/><i/><i/></div><span className={`${styles.cloud} ${styles.cloudOne}`} aria-hidden="true"/><span className={`${styles.cloud} ${styles.cloudTwo}`} aria-hidden="true"/><span className={styles.welcomeTag}>ようこそ、こもれびへ。</span><div className={styles.forestArt} data-hello={greeting >= 0} key={greeting}><Image ref={photo} src="/demo/komorebi/forest-friends.webp" alt="緑のマフラーのくま、黄色い服のうさぎ、小鳥が木の下で迎える、こもれびの森のともだち" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 60vw" priority /></div><p className={styles.greeting} aria-live="polite">{greeting >= 0 ? greetings[greeting % greetings.length] : ""}</p><button type="button" className={styles.helloButton} onClick={() => setGreeting(value => value + 1)}><span aria-hidden="true">✳</span>もりのともだちに、ごあいさつ <span aria-hidden="true">＋</span></button><Leaf className={styles.heroLeaf}/></div>
        </div>
        <div className={`${styles.quickLinks} ${styles.container}`}><a href="#komorebi-access"><CareIcon kind="clock"/><span><small>CLINIC HOURS</small>診療時間をみる</span><Arrow /></a><a href="#komorebi-first"><CareIcon kind="book"/><span><small>FIRST VISIT</small>受診の流れ・お持ち物</span><Arrow /></a><button type="button" onClick={book}><span className={styles.quickBookingIcon} aria-hidden="true">▦</span><span><small>WEB RESERVATION</small>WEB予約のご案内</span><Arrow external /></button></div>
        <div className={`${styles.heroNotice} ${styles.container}`}><span>ご来院の前に</span><p>発熱などの症状がある方は、受診先の最新のご案内をご確認ください。</p><a href="#komorebi-faq" aria-label="受診についてのよくあるご質問へ"><Arrow /></a></div>
      </section>

      <section id="komorebi-news" className={`${styles.news} ${styles.container}`} aria-labelledby="komorebi-news-heading"><Reveal className={styles.newsHeading}><div><p className={styles.eyebrow}>NEWS & LETTERS</p><h2 id="komorebi-news-heading">こもれびだより<span>お知らせ</span></h2></div><div className={styles.filters} role="group" aria-label="お知らせの絞り込み">{["すべて", "診療のこと", "クリニック"].map(value => <button type="button" aria-pressed={category === value} key={value} onClick={() => setCategory(value)}>{value}</button>)}</div></Reveal><div className={styles.newsList} aria-live="polite">{notices.map((item, index) => category === "すべて" || category === item.category ? <button type="button" key={item.date} onClick={() => setModal({ kind: "news", index })}><time dateTime={item.dateTime}>{item.date}</time><span className={styles.newsCategory}>{item.category}</span><span className={styles.newsTitle}>{item.title}</span><Arrow /></button> : null)}</div><p className={styles.sampleNote}>お知らせは、すべて制作見本の内容です。</p></section>

      <section id="komorebi-about" className={styles.about} aria-labelledby="komorebi-about-heading">
        <div className={styles.aboutWave} aria-hidden="true"/>
        <div className={`${styles.aboutInner} ${styles.container}`}>
          <Reveal className={styles.aboutPhoto}><Image src="/demo/komorebi/interior.webp" alt="木の受付、絵本の棚、やわらかな緑のベンチがある、明るい小児科待合室のイメージ" width={1440} height={960} sizes="(max-width: 700px) 88vw, 47vw"/><span>ひと息つける、木のぬくもり。<small>CLINIC IMAGE</small></span><Leaf className={styles.photoLeaf}/></Reveal>
          <Reveal delay={100} className={styles.aboutCopy}>
            <p className={styles.eyebrow}>OUR LITTLE PROMISE</p>
            <h2 id="komorebi-about-heading">「こわいな」が、<br/>すこしずつ、<br/><span>「ここなら、いいな」へ。</span></h2>
            <p>こどもが安心できること。<br/>おうちの方が、気持ちを話せること。<br/>こもれびが大切にしたいのは、<br/>そんな、ひとつひとつです。</p>
            <ol className={styles.promises}><li><span>01</span>こどものペースを、大切に。</li><li><span>02</span>小さな心配にも、耳をかたむけて。</li><li><span>03</span>わかりやすい言葉で、一緒に考える。</li></ol>
            <p className={styles.sampleNote}>架空のクリニックの理念・院内イメージです。</p>
          </Reveal>
        </div>
      </section>

      <section id="komorebi-care" className={`${styles.care} ${styles.container}`} aria-label="診療のご案内"><Reveal><Heading eyebrow="CARE FOR LITTLE ONES" center>こんなとき、<br className={styles.mobileOnly}/>こもれびへ。</Heading><p className={styles.sectionIntro}>体調のことも、成長のことも。<br/>ご家族の「気になる」をお聞かせください。</p></Reveal><div className={styles.serviceGrid}>{services.map((service, index) => <Reveal key={service.id} delay={index * 80}><button type="button" className={styles.serviceCard} onClick={() => setModal({ kind: "service", index })} aria-label={`${service.title}のご案内を見る`}><span className={styles.serviceTop}><span>{service.number}</span><small>{service.english}</small></span><div className={styles.serviceIcon}><CareIcon kind={service.icon}/></div><h3>{service.title}</h3><p>{service.text}</p><span className={styles.serviceMore}>詳しくみる<Arrow /></span></button></Reveal>)}</div><p className={styles.careNote}>掲載内容は診療科目の紹介例です。医療上の助言・診断を行うものではありません。</p></section>

      <section id="komorebi-first" className={styles.firstVisit} aria-label="はじめて受診される方へ">
        <div className={styles.container}>
          <Reveal className={styles.firstHeading}><Heading eyebrow="はじめてお越しになるご家族へ">はじめての場所も、<br/>ひとつずつ、安心に。</Heading><p>おうちで、さっと目を通して。<br/>初診のご案内を、一枚にまとめました。</p></Reveal>
          <div className={styles.visitLayout}>
            <Reveal className={styles.welcomeLetter}>
              <p className={styles.letterTo}>ご家族のみなさまへ</p>
              <h3>どうぞ、<br/>いつもの親子のままで。</h3>
              <p>はじめての病院は、こどもも大人も、<br/>少し緊張するもの。うまく話せない日も、<br className={styles.desktopLetterBreak}/>泣いてしまう日も、あわてなくて大丈夫です。</p>
              <p>受付では、ご予約のお名前とお持ちの書類を。<br/>気になることや、配慮してほしいことも、<br/>ひとこと添えて、お聞かせください。</p>
              <p>診察室でも、お子さまのペースを大切に。<br/>普段の様子をお聞きしながら、<br/>いっしょにお話ししていきましょう。</p>
              <div className={styles.letterSignature}><BearMark/><span>こもれび こどもクリニック<small>きみのペースで、だいじょうぶ。</small></span></div>
              <Leaf className={styles.letterLeaf}/>
            </Reveal>
            <Reveal className={styles.visitChecklist} delay={100}>
              <div className={styles.belongings}>
                <div><p>お出かけ前の、小さなメモ</p><h3>いつものバッグに、<br/>忘れずに。</h3><p>お持ち物をタップして、確認できます。</p></div>
                <fieldset><legend className={styles.srOnly}>受診のお持ち物チェックリスト</legend>{belongings.map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => setChecked(previous => previous.includes(item) ? previous.filter(value => value !== item) : [...previous, item])}/><span>{item}</span></label>)}<p role="status">{checked.length === belongings.length ? "準備の確認ができました。どうぞ、お気をつけて。" : `${checked.length} / ${belongings.length} 確認済み`}</p></fieldset>
                <small>お持ち物の掲載例です。実際に必要な書類は、受診先のご案内をご確認ください。チェック内容は送信・保存されません。</small>
              </div>
            </Reveal>
          </div>
          <Reveal className={styles.visitFooter}>
            <p><span>ご予約の前に</span>診療時間と、ご来院の方法をご確認ください。</p>
            <div className={styles.visitFooterLinks}><a href="#komorebi-access" className={styles.textLink}>診療時間をみる<Arrow/></a><button type="button" className={styles.textLink} onClick={book}>予約についてみる<Arrow external/></button></div>
          </Reveal>
        </div>
      </section>

      <section id="komorebi-faq" className={`${styles.faq} ${styles.container}`} aria-label="よくあるご質問"><Reveal className={styles.faqIntro}><Heading eyebrow="A LITTLE HELP">おうちの方の、<br/>気になること。</Heading><p>はじめての「どうしよう」に、<br/>迷わないご案内を。</p><Leaf className={styles.faqLeaf}/></Reveal><div className={styles.faqList}>{faqs.map((item, index) => <Reveal key={item.question} delay={index * 40}><details><summary><span>Q.</span>{item.question}<i aria-hidden="true"/></summary><p>{item.answer}</p></details></Reveal>)}</div></section>

      <section id="komorebi-access" className={styles.access} aria-label="診療時間・アクセス"><div className={styles.container}><Reveal><Heading eyebrow="WHEN & WHERE" center>いつもの毎日の、<br className={styles.mobileOnly}/>すぐそばに。</Heading></Reveal><div className={styles.accessGrid}><Reveal className={styles.hours}><h3><CareIcon kind="clock"/>診療時間</h3><p className={styles.tableNote}>診療スケジュールの表示例</p><table><caption className={styles.srOnly}>架空のクリニックの診療時間</caption><thead><tr><th scope="col">診療時間</th>{["月", "火", "水", "木", "金", "土", "日"].map(day => <th scope="col" key={day}>{day}</th>)}</tr></thead><tbody>{[["9:00–12:00", ["●", "●", "●", "—", "●", "▲", "—"]], ["14:00–15:00", ["◎", "◎", "◎", "—", "◎", "—", "—"]], ["15:00–18:00", ["●", "●", "●", "—", "●", "—", "—"]]].map(([time, days]) => <tr key={time as string}><th scope="row">{time as string}</th>{(days as string[]).map((day, index) => <td key={index} data-open={day !== "—"}>{day}<span className={styles.srOnly}>{day === "—" ? "休診" : day === "◎" ? "予防接種・健診" : day === "▲" ? "土曜は13時まで" : "診療"}</span></td>)}</tr>)}</tbody></table><div className={styles.hoursNotes}><p>● 一般診療　◎ 予防接種・健診（予約制）<br/>▲ 土曜日は13:00まで</p><p>休診日：木曜・日曜・祝日</p></div><button type="button" className={styles.primaryButton} onClick={book}>WEB予約のご案内<Arrow external /></button><p className={styles.sampleNote}>実際の診療・予約は行っていません。</p></Reveal><Reveal className={styles.accessMap} delay={100}><div className={styles.mapFrame}>{map}</div><div className={styles.mapCaption}><CareIcon kind="pin"/><div><h3>こもれび こどもクリニック</h3><p>{clinic.area}</p><small>地図は堺市周辺です。実在する医院の所在地ではありません。</small></div></div><a className={styles.textLink} href="https://www.google.com/maps/search/?api=1&query=%E5%A0%BA%E5%B8%82" target="_blank" rel="noopener noreferrer">堺市周辺をGoogleマップでみる <Arrow external /></a></Reveal></div><Reveal className={styles.consultation}><span>夜間・休日に迷ったら</span><div><h3>子ども医療電話相談 <strong>＃8000</strong></h3><p>相談できる時間・連絡先は地域により異なります。厚生労働省の案内でご確認ください。</p></div><a href={clinic.consultationUrl} target="_blank" rel="noopener noreferrer" aria-label="厚生労働省の子ども医療電話相談の案内を開く（新しいタブ）">公的な相談窓口をみる<Arrow external /></a></Reveal></div></section>

      <section className={styles.goodbye} aria-label="こもれびからのメッセージ"><Reveal><Leaf/><p>こどもと、家族と、一歩ずつ。</p><h2>きょうの小さな安心が、<br/>あしたの笑顔に、つながる。</h2><a href="#komorebi-top" className={styles.textLink}>森のともだちのところへ <span aria-hidden="true">↑</span></a></Reveal></section>
    </main>

    <footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><a href="#komorebi-top" aria-label="こもれび こどもクリニック トップへ"><Brand /></a><nav aria-label="フッターメニュー">{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}<a href="#komorebi-news">お知らせ</a><a href="#komorebi-faq">よくあるご質問</a></nav></div><div className={styles.footerBottom}><p>架空のクリニックのホームページ制作見本です。<br/>名称・診療内容・診療時間・設備・画像はデモ用です。診断・診療・予約受付は行っていません。</p><Link href="/#demo">DESIGN BY まちのWeb <Arrow external /></Link><small>© KOMOREBI KIDS CLINIC / DESIGN SAMPLE</small></div><DemoPriceGuide slug="komorebi"/></div></footer>
    <div className={styles.mobileBar}><a href="#komorebi-access"><CareIcon kind="clock"/><span>診療時間・アクセス</span></a><button type="button" onClick={book}><span aria-hidden="true">▦</span>WEB予約<Arrow external /></button></div>

    </div>
    {menuOpen && <div ref={menu} id="komorebi-mobile-menu" className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="メニュー">
      <div className={styles.mobileMenuTop}><Brand/><button ref={menuClose} type="button" className={styles.closeButton} aria-label="メニューを閉じる" onClick={() => { restoreMenuFocus.current = true; setMenuOpen(false); }}>閉じる <span aria-hidden="true">×</span></button></div>
      <nav>{nav.map(([href, label], index) => <a key={href} href={href} onClick={goTo}><small>0{index + 1}</small>{label}<Arrow /></a>)}<a href="#komorebi-news" onClick={goTo}><small>05</small>お知らせ<Arrow /></a><a href="#komorebi-faq" onClick={goTo}><small>06</small>よくあるご質問<Arrow /></a></nav>
      <button type="button" className={styles.primaryButton} onClick={() => { setMenuOpen(false); book(); }}>WEB予約のご案内<Arrow external /></button><p>GROW TOGETHER, LITTLE BY LITTLE.</p>
    </div>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="komorebi-dialog-heading" onClose={() => { if (!dialog.current?.open) setModal(null); }} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}><div className={styles.dialogInner}><button type="button" className={styles.closeButton} aria-label="閉じる" onClick={() => setModal(null)}>閉じる <span aria-hidden="true">×</span></button>{modal?.kind === "service" && <div className={styles.dialogContent}><CareIcon kind={services[modal.index].icon}/><p className={styles.eyebrow}>{services[modal.index].english}</p><h2 id="komorebi-dialog-heading">{services[modal.index].title}</h2><p>{services[modal.index].detail}</p><aside>{services[modal.index].note}</aside><small>架空のクリニックの診療案内の制作例です。医療上の助言ではありません。</small><a href="#komorebi-first" className={styles.textLink} onClick={() => setModal(null)}>はじめて受診される方へ<Arrow /></a></div>}{modal?.kind === "news" && <div className={styles.dialogContent}><p className={styles.eyebrow}>{notices[modal.index].date} / {notices[modal.index].category}</p><h2 id="komorebi-dialog-heading">{notices[modal.index].title}</h2><p>{notices[modal.index].text}</p><small>お知らせの掲載イメージです。</small></div>}{modal?.kind === "booking" && <div className={styles.dialogContent}><BearMark/><p className={styles.eyebrow}>WEB RESERVATION / DEMO</p><h2 id="komorebi-dialog-heading">ご予約は、<br/>いつもの予約サイトへ。</h2><p>ご利用中の外部予約サービスにつなぐ構成です。ホームページ内で、新たに予約情報や個人情報を入力する必要はありません。</p><aside>{clinic.reservationNote}</aside><a className={styles.primaryButton} href={clinic.reservationUrl} target="_blank" rel="noopener noreferrer" aria-label="予約システムの紹介サイトを開く（新しいタブ）">予約サービスの連携例をみる<Arrow external /></a><small>お客様の導入済みサービスに合わせて、リンク先を設定します。</small></div>}</div></dialog>
  </div>;
}
