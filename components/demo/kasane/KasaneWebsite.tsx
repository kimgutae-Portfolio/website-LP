"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionNavigation } from "./SectionNavigation";
import {
  kasaneNews,
  kasaneProjects,
  type KasaneNews,
  type KasaneProject,
} from "./content";
import styles from "./kasane.module.css";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h17M15 7l5 5-5 5" />
    </svg>
  );
}

function CloseLabel() {
  return <><span>閉じる</span><span aria-hidden="true">×</span></>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`${styles.brand} ${footer ? styles.brandFooter : ""}`}>
      <svg width="32" height="34" viewBox="0 0 32 34" fill="currentColor" aria-hidden="true">
        <path d="M0 0h7v34H0zM11 0h9L9 15h-7zM12 19h8l12 15h-9zM23 0h9L20 15h-9z" />
      </svg>
      <span>KASANE<span className={styles.brandCaption}>株式会社かさね</span></span>
    </span>
  );
}

type ModalContent = { kind: "contact" | "film" | "recruit" } | { kind: "project"; project: KasaneProject } | { kind: "news"; news: KasaneNews };
type OpeningState = "pending" | "playing" | "complete" | "skipped";

const navigation = [
  ["#kasane-about", "私たちについて"],
  ["#kasane-business", "事業内容"],
  ["#kasane-projects", "プロジェクト"],
  ["#kasane-company", "会社情報"],
] as const;

export function KasaneWebsite({ className }: { className?: string }) {
  const [opening, setOpening] = useState<OpeningState>("pending");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [sent, setSent] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenuButton = useRef<HTMLButtonElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const heroImage = useRef<HTMLImageElement>(null);
  const openingScreen = useRef<HTMLDivElement>(null);
  const heroHeading = useRef<HTMLHeadingElement>(null);
  const site = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const openingVisible = opening === "pending" || opening === "playing";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Deep links should take visitors straight to the requested content.
    if (motion.matches || (window.location.hash && window.location.hash !== "#kasane-top")) {
      setOpening("skipped");
      return;
    }
    let cancelled = false;
    let started = false;
    const start = () => {
      if (cancelled || started) return;
      started = true;
      window.clearTimeout(fallback);
      setOpening(state => state === "pending" ? "playing" : state);
    };
    // Wait briefly for the photo and font, without turning the opening into a loader.
    const fallback = window.setTimeout(start, 700);
    Promise.all([
      document.fonts.ready,
      heroImage.current?.decode().catch(() => undefined),
    ]).then(start);
    const onMotionChange = () => { if (motion.matches) setOpening("skipped"); };
    motion.addEventListener("change", onMotionChange);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (opening !== "playing") return;
    openingScreen.current?.focus({ preventScroll: true });
    const finish = () => setOpening(state => state === "playing" ? "complete" : state);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpening("skipped");
      // Keyboard visitors can continue immediately without a visible skip control.
      if (event.key === "Tab") { event.preventDefault(); setOpening("skipped"); }
    };
    const fallback = window.setTimeout(finish, 3200);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(fallback);
      document.removeEventListener("keydown", onKeyDown);
      if (document.activeElement === openingScreen.current || document.activeElement === document.body) {
        heroHeading.current?.focus({ preventScroll: true });
      }
    };
  }, [opening]);

  useEffect(() => {
    if (!modal) return;
    const el = dialog.current;
    el?.showModal();
    return () => {
      film.current?.pause();
      el?.close();
    };
  }, [modal]);

  useEffect(() => {
    if (!menuOpen && !modal && !openingVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen, modal, openingVisible]);

  useEffect(() => {
    if (!menuOpen) return;
    closeMenuButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const elements = Array.from(document.querySelectorAll<HTMLElement>("#kasane-mobile-menu a, #kasane-mobile-menu button"));
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function openContact() { setSent(false); setMenuOpen(false); setModal({ kind: "contact" }); }

  return (
    <div ref={site} className={`${styles.site} ${className ?? ""}`} data-entry={opening}>
      {openingVisible && <div ref={openingScreen} tabIndex={-1} className={styles.opening} data-kasane-opening role="dialog" aria-modal="true" aria-label="KASANE オープニング">
        <div className={`${styles.openingPanel} ${styles.openingLeft}`} aria-hidden="true" />
        <div className={`${styles.openingPanel} ${styles.openingRight}`} aria-hidden="true" onAnimationEnd={event => {
          if (event.target === event.currentTarget) setOpening(state => state === "playing" ? "complete" : state);
        }} />
        <div className={styles.openingSeam} aria-hidden="true" />
        <div className={styles.openingComposition} aria-hidden="true">
          <span className={styles.openingEyebrow}>A NEW PERSPECTIVE</span>
          <div className={styles.openingBrand}><Brand /></div>
          <p className={styles.openingMessage}>想いを重ね、<br />新しい景色の中へ。</p>
          <span className={styles.openingSignature}>SPACE DESIGN & CONSTRUCTION</span>
        </div>
        <span className={styles.openingLocation} aria-hidden="true">OSAKA, JAPAN <span>EST. 2026</span></span>
      </div>}
      <noscript><style>{`[data-kasane-opening]{display:none!important}`}</style></noscript>
      <div className={styles.pageContent} inert={opening === "playing"}>
      <div id="kasane-top" />
      <div className={styles.demoBar} data-kasane-banner>
        <span><i /> CORPORATE DESIGN DEMO</span>
        <Link href="/#demo">まちのWebへ戻る <span aria-hidden="true">↗</span></Link>
      </div>

      <header ref={header} className={styles.header}>
        <a href="#kasane-top" aria-label="KASANE トップページ"><Brand /></a>
        <nav className={styles.desktopNav} aria-label="メインメニュー">
          {navigation.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <a href="#kasane-recruit" className={styles.recruitNav}>採用情報</a>
        </nav>
        <button type="button" className={styles.headerContact} onClick={openContact}>お問い合わせ <Arrow /></button>
        <button ref={menuButton} type="button" className={styles.menuButton} aria-label="メニューを開く" aria-expanded={menuOpen} aria-controls="kasane-mobile-menu" onClick={() => setMenuOpen(true)}>
          <span /><span /><small>MENU</small>
        </button>
      </header>

      {menuOpen && <div id="kasane-mobile-menu" className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="メニュー">
        <div className={styles.mobileMenuTop}><Brand /><button ref={closeMenuButton} type="button" className={styles.closeButton} aria-label="メニューを閉じる" onClick={() => { setMenuOpen(false); menuButton.current?.focus(); }}><CloseLabel /></button></div>
        <nav aria-label="モバイルメニュー">
          {navigation.map(([href, label], index) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}<Arrow /></a>)}
          <a href="#kasane-recruit" onClick={() => setMenuOpen(false)}><span>05</span>採用情報<Arrow /></a>
        </nav>
        <button className={styles.solidButton} type="button" onClick={openContact}>お問い合わせ <Arrow /></button>
        <p className={styles.mobileMenuNote}>SPACE DESIGN & CONSTRUCTION<br />OSAKA / JAPAN</p>
      </div>}

      <main>
        <section id="kasane-home" className={styles.hero} aria-labelledby="kasane-hero-heading">
          <Image ref={heroImage} src="/demo/kasane/hero-no-people.webp" alt="木とコンクリート、庭の緑が調和する、かさねの空間づくりのイメージ" fill priority sizes="100vw" className={styles.heroImage} />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}><span /> SPACE DESIGN & CONSTRUCTION</p>
            <h1 ref={heroHeading} tabIndex={-1} id="kasane-hero-heading">想いを重ね、<br />街の、その先へ<span>。</span></h1>
            <p className={styles.heroDescription}>人が集い、想いが育つ。<br />その場所の「これから」を、つくる会社です。</p>
          </div>
          <div className={styles.heroBottom}>
            <a href="#kasane-about" className={styles.scrollLink}><span className={styles.scrollLine} />SCROLL TO EXPLORE</a>
            <button className={styles.filmButton} type="button" onClick={() => setModal({ kind: "film" })}><span className={styles.playIcon} aria-hidden="true">▶</span><span>ブランドムービーを見る<small>BRAND FILM / 00:12</small></span></button>
          </div>
          <div className={styles.heroIndex}>DESIGN / BUILD / PARTNERSHIP</div>
        </section>

        <div className={styles.newsTicker}>
          <span className={styles.tickerLabel}>LATEST NEWS</span>
          <button type="button" onClick={() => setModal({ kind: "news", news: kasaneNews[0] })}><time dateTime="2026-10-15">2026.10.15</time><span>{kasaneNews[0].title}</span><Arrow /></button>
        </div>

        <section id="kasane-about" className={`${styles.about} ${styles.container}`} aria-labelledby="kasane-about-heading">
          <Reveal className={styles.sectionTop}><p className={styles.eyebrow}>01 / ABOUT US</p><span>私たちについて</span></Reveal>
          <div className={styles.aboutGrid}>
            <Reveal><h2 id="kasane-about-heading" className={styles.japaneseHeading}>いい空間は、<br />いい関係から。</h2><p className={styles.aboutEnglish}>Good places.<br /><em>Better possibilities.</em></p></Reveal>
            <Reveal delay={100} className={styles.aboutText}><p>そこにいる人のこと。<br />これまでの時間のこと。<br />そして、まだ見ぬ未来のこと。</p><p>私たちは、対話を重ねるところから始めます。<br className={styles.desktopBreak} />小さな想いを一つひとつすくい上げ、<br className={styles.desktopBreak} />設計から施工、その後の暮らしまで。<br className={styles.desktopBreak} />長く愛される空間を、ともにつくっていきます。</p><a className={styles.textLink} href="#kasane-company">KASANEを知る <Arrow /></a></Reveal>
          </div>
          <Reveal className={styles.aboutImageWrap}>
            <Image src="/demo/kasane/craft-no-people.webp" alt="木材・タイル・布の素材と建築模型を並べた、静かな設計スタジオのテーブル" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 70vw" className={styles.aboutImage} />
            <div className={styles.imageCaption}><span>THE WAY WE WORK</span><span>ひとつの素材から、対話が始まる。</span></div>
            <div className={styles.aboutStamp} aria-hidden="true">想いを<br />重ねる。</div>
          </Reveal>
        </section>

        <section id="kasane-business" className={styles.business} aria-labelledby="kasane-business-heading">
          <div className={styles.container}>
            <Reveal className={styles.sectionTop}><p className={styles.eyebrow}>02 / OUR BUSINESS</p><span>事業内容</span></Reveal>
            <Reveal className={styles.businessIntro}><h2 id="kasane-business-heading" className={styles.japaneseHeading}>描く。つくる。<br className={styles.mobileBreak} />育てていく。</h2><p>企画から、その先まで。<br />ひとつのチームで、想いをかたちに。</p></Reveal>
            <div className={styles.serviceList}>
              {[
                { n: "01", en: "DESIGN", title: "建築・空間設計", text: "働き方も、街の風景も。人と場所の可能性をひらく空間を、対話から描きます。", tags: "オフィス / 店舗 / リノベーション" },
                { n: "02", en: "BUILD", title: "施工・ものづくり", text: "図面の向こうにある想いまで。素材と細部に向き合い、確かな技術でかたちにします。", tags: "内装施工 / 造作家具 / 施工管理" },
                { n: "03", en: "PARTNERSHIP", title: "空間の運用・伴走", text: "完成は、はじまりです。使う人の声に耳を傾け、その場所の未来を一緒に育てます。", tags: "メンテナンス / 空間改善 / 活用相談" },
              ].map((service, index) => <Reveal key={service.n} delay={index * 70} className={styles.service}><span className={styles.serviceNumber}>{service.n}</span><div className={styles.serviceName}><span>{service.en}</span><h3>{service.title}</h3></div><div className={styles.serviceText}><p>{service.text}</p><small>{service.tags}</small></div><span className={styles.serviceSymbol} aria-hidden="true">{index === 0 ? "↗" : index === 1 ? "+" : "↔"}</span></Reveal>)}
            </div>
          </div>
        </section>

        <section id="kasane-projects" className={`${styles.projects} ${styles.container}`} aria-labelledby="kasane-projects-heading">
          <Reveal className={styles.sectionTop}><p className={styles.eyebrow}>03 / SELECTED PROJECTS</p><span>空間の提案</span></Reveal>
          <Reveal className={styles.projectsHeading}><h2 id="kasane-projects-heading" className={styles.japaneseHeading}>想いが息づく、<br className={styles.mobileBreak} />場所を。</h2><div className={styles.filters} role="group" aria-label="プロジェクトの絞り込み">{[["all", "すべて"], ["office", "オフィス"], ["store", "店舗"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div></Reveal>
          <div className={styles.projectGrid}>
            {kasaneProjects.filter(project => filter === "all" || project.type === filter).map(project => <article className={styles.project} key={project.id}>
              <button type="button" onClick={() => setModal({ kind: "project", project })} aria-label={`${project.name}の詳細を見る`}>
                <div className={styles.projectImage}><Image src={project.image} alt={project.alt} width={project.width} height={project.height} sizes="(max-width: 700px) 90vw, 46vw" /><span className={styles.projectNumber}>{project.number}</span></div>
                <div className={styles.projectMeta}><span>{project.category}</span><span>{project.location}</span></div><h3>{project.title}</h3><p className={styles.projectName}>{project.name}</p><span className={styles.projectMore}>詳しく見る <Arrow /></span>
              </button>
            </article>)}
          </div>
          <p className={styles.projectNote}>※ デザイン見本として制作した架空のプロジェクトです。</p>
        </section>

        <section id="kasane-film" className={styles.filmSection} aria-labelledby="kasane-film-heading">
          <Image src="/demo/kasane/hero-no-people.webp" alt="中庭へと続く、光に包まれた木の空間" fill sizes="100vw" />
          <div className={styles.filmShade} />
          <Reveal className={styles.filmContent}><p className={styles.eyebrow}>KASANE IN MOTION</p><h2 id="kasane-film-heading">空間には、<br />想いのつづきがある。</h2><button type="button" onClick={() => setModal({ kind: "film" })}><span className={styles.playIcon} aria-hidden="true">▶</span><span>映像を見る<small>BRAND FILM / 00:12</small></span></button></Reveal>
        </section>

        <section id="kasane-journal" className={`${styles.news} ${styles.container}`} aria-labelledby="kasane-news-heading">
          <Reveal className={styles.newsHeading}><p className={styles.eyebrow}>04 / JOURNAL</p><h2 id="kasane-news-heading">かさねの日々。</h2><p>私たちの活動と、<br />日々の小さなお知らせ。</p></Reveal>
          <div className={styles.newsList}>{kasaneNews.map(item => <Reveal key={item.date}><button type="button" className={styles.newsItem} onClick={() => setModal({ kind: "news", news: item })}><div><time dateTime={item.dateTime}>{item.date}</time><span>{item.category}</span></div><h3>{item.title}</h3><Arrow /></button></Reveal>)}</div>
        </section>

        <section id="kasane-company" className={styles.company} aria-labelledby="kasane-company-heading">
          <div className={styles.container}>
            <Reveal className={styles.sectionTop}><p className={styles.eyebrow}>05 / COMPANY</p><span>会社情報</span></Reveal>
            <div className={styles.companyGrid}><Reveal className={styles.companyVisual}><Image src="/demo/kasane/atelier.webp" alt="街にひらかれた、テラコッタ色の外観の設計イメージ" width={1536} height={1024} sizes="(max-width: 700px) 90vw, 45vw" /><p>ROOTED IN OSAKA.<br /><em>OPEN TO POSSIBILITIES.</em></p></Reveal><Reveal delay={100} className={styles.companyDetails}><h2 id="kasane-company-heading">この街から、<br />新しい可能性を。</h2><dl>{[["会社名", "株式会社かさね"], ["拠点", "大阪府堺市（デモ設定）"], ["事業内容", "建築・空間設計 / 内装施工 / 空間の運用支援"], ["お問い合わせ", "下記のお問い合わせフォームから" ]].map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl><button type="button" className={styles.textLink} onClick={openContact}>私たちに相談する <Arrow /></button></Reveal></div>
          </div>
        </section>

        <section id="kasane-recruit" className={`${styles.recruit} ${styles.container}`} aria-labelledby="kasane-recruit-heading"><Reveal className={styles.recruitInner}><div><p className={styles.eyebrow}>RECRUIT</p><h2 id="kasane-recruit-heading">一緒につくろう。<br />まだない、あたりまえを。</h2><p>一人では届かない場所へ、チームで。</p></div><button type="button" className={styles.recruitLink} onClick={() => setModal({ kind: "recruit" })} aria-label="採用情報を見る">募集情報を見る <Arrow /></button></Reveal></section>

        <section id="kasane-contact" className={styles.contact} aria-labelledby="kasane-contact-heading"><div className={styles.container}><Reveal className={styles.contactLayout}><div><p className={styles.eyebrow}>CONTACT</p><h2 id="kasane-contact-heading" className={styles.contactHeading}>その想いを、<br className={styles.mobileBreak} />お聞かせください。</h2></div><button type="button" className={styles.contactLink} onClick={openContact}>お問い合わせフォームへ <Arrow /></button></Reveal></div></section>
      </main>

      <footer id="kasane-footer" className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><a href="#kasane-top" aria-label="KASANE トップへ"><Brand footer /></a><div><p>株式会社かさね</p><span>SPACE DESIGN & CONSTRUCTION<br />OSAKA, JAPAN</span></div><a href="#kasane-top" className={styles.backToTop}>BACK TO TOP <span>↑</span></a></div><div className={styles.footerBottom}><span>© KASANE Inc.</span><p>本サイトは架空の企業のデザインデモです。<br className={styles.mobileBreak} />掲載情報・写真・映像はすべて見本です。</p><Link href="/">DESIGN BY まちのWeb ↗</Link></div></div></footer>

      <dialog ref={dialog} className={styles.dialog} onClose={() => { if (!dialog.current?.open) setModal(null); }} onClick={event => { if (event.target === event.currentTarget) setModal(null); }} aria-labelledby="kasane-dialog-title">
        {modal && <div className={`${styles.dialogInner} ${modal.kind === "film" ? styles.filmDialog : ""}`}><button type="button" className={styles.closeButton} aria-label="閉じる" onClick={() => setModal(null)}><CloseLabel /></button>
          {modal.kind === "film" && <><h2 id="kasane-dialog-title" className={styles.dialogEyebrow}>KASANE / BRAND FILM</h2><video ref={film} controls autoPlay playsInline preload="metadata" poster="/demo/kasane/hero-no-people.webp" aria-label="かさねの空間づくりのイメージフィルム"><source src="/demo/kasane/brand-film-no-people.mp4" type="video/mp4" />お使いのブラウザは動画再生に対応していません。</video><p>想いを重ね、街の、その先へ。<small>デモ用に制作した写真によるモーションフィルムです。</small></p></>}
          {modal.kind === "project" && <><p className={styles.dialogEyebrow}>{modal.project.category} / {modal.project.year}</p><h2 id="kasane-dialog-title">{modal.project.title}</h2><p className={styles.projectName}>{modal.project.name}</p><Image src={modal.project.image} alt={modal.project.alt} width={modal.project.width} height={modal.project.height} sizes="(max-width: 700px) 90vw, 740px" className={styles.dialogPhoto} /><p className={styles.dialogBody}>{modal.project.description}</p><dl className={styles.projectFacts}><div><dt>LOCATION</dt><dd>{modal.project.location}</dd></div><div><dt>SCOPE</dt><dd>{modal.project.scope}</dd></div></dl><p className={styles.projectNote}>架空のプロジェクトの制作見本です。</p></>}
          {modal.kind === "news" && <><p className={styles.dialogEyebrow}>{modal.news.date} / {modal.news.category}</p><h2 id="kasane-dialog-title">{modal.news.title}</h2><p className={styles.dialogBody}>{modal.news.text}</p><p className={styles.projectNote}>デザインデモ用のお知らせです。</p></>}
          {modal.kind === "recruit" && <><p className={styles.dialogEyebrow}>RECRUIT / JOIN OUR TEAM</p><h2 id="kasane-dialog-title">想いを、ともに<br />かたちにする仲間へ。</h2><p className={styles.dialogBody}>対話を楽しみ、素材に触れ、チームで考える。そんな空間づくりに関心のある方のための、採用情報ページの見本です。</p><dl className={styles.projectFacts}><div><dt>募集職種</dt><dd>空間設計 / 施工ディレクション</dd></div><div><dt>働く場所</dt><dd>大阪府堺市を拠点としたプロジェクト</dd></div></dl><p className={styles.projectNote}>※ 実際の募集ではありません。採用条件の掲載・エントリーへの導線を想定しています。</p><button type="button" className={styles.solidButton} onClick={openContact}>エントリーフォームを見る <Arrow /></button></>}
          {modal.kind === "contact" && <><p className={styles.dialogEyebrow}>CONTACT / START A CONVERSATION</p><h2 id="kasane-dialog-title">その想いから、<br />はじめましょう。</h2>{sent ? <div className={styles.formSuccess} role="status"><span>✓</span><h3>入力のデモが完了しました。</h3><p>このフォームは制作見本のため、<br />内容は送信・保存されていません。</p><button type="button" className={styles.textLink} onClick={() => setModal(null)}>サイトに戻る <Arrow /></button></div> : <form className={styles.form} onSubmit={event => { event.preventDefault(); setSent(true); }}><p>こちらはデモ用フォームです。送信・保存は行われません。</p><label htmlFor="kasane-name">お名前 <small>必須</small></label><input id="kasane-name" name="name" required autoComplete="name" placeholder="山田 太郎" maxLength={100} /><label htmlFor="kasane-email">メールアドレス <small>必須</small></label><input id="kasane-email" name="email" type="email" required autoComplete="email" placeholder="example@company.jp" maxLength={254} /><label htmlFor="kasane-company-input">会社名</label><input id="kasane-company-input" name="company" autoComplete="organization" placeholder="株式会社〇〇" maxLength={100} /><label htmlFor="kasane-message">ご相談内容 <small>必須</small></label><textarea id="kasane-message" name="message" required rows={4} maxLength={3000} placeholder="新しいオフィスのこと、今の場所のこと。お気軽にお聞かせください。" /><button type="submit" className={styles.solidButton}>入力を確認する（デモ） <Arrow /></button></form>}</>}
        </div>}
      </dialog>
      </div>
      <SectionNavigation siteRef={site} headerRef={header} blocked={openingVisible || menuOpen || !!modal} />
    </div>
  );
}
