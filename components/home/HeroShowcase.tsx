"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

type HeroExample = { name: string; category: string; href: string; image: string };

function PreviewArrow({ previous = false }: { previous?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d={previous ? "M21 9H11V4L3 12L11 20V15H21V9Z" : "M3 9H13V4L21 12L13 20V15H3V9Z"}/></svg>;
}

/** Real demo screenshots, with polite, pausable auto-advance and native swipe. */
export function HeroShowcase({ examples }: { examples: readonly HeroExample[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [entryReady, setEntryReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [firstImageReady, setFirstImageReady] = useState(false);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => { setMotionAllowed(!preference.matches); if (preference.matches) setPlaying(false); };
    const visibility = () => setPageVisible(document.visibilityState === "visible");
    const hero = element.closest("[data-home-hero]");
    const entry = () => setEntryReady(!hero || hero.getAttribute("data-entry") === "complete");
    motion(); visibility(); entry();
    const observer = new IntersectionObserver(([item]) => setInView(item.isIntersecting), { threshold: .25 });
    observer.observe(element);
    const opening = new MutationObserver(entry);
    if (hero) opening.observe(hero, { attributes: true, attributeFilter: ["data-entry"] });
    preference.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect(); opening.disconnect();
      preference.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      const index = Math.max(0, Math.min(examples.length - 1, Math.round(element.scrollLeft / Math.max(1, element.clientWidth))));
      setActive(current => current === index ? current : index);
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [examples.length]);
  const move = useCallback((index: number, immediate = false) => {
    const element = rail.current;
    if (!element) return;
    const target = Math.max(0, Math.min(examples.length - 1, index));
    element.scrollTo({ left: target * element.clientWidth, behavior: immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [examples.length]);
  const manualMove = (index: number) => { setPlaying(false); move(index); };
  const autoRunning = playing && motionAllowed && inView && entryReady && firstImageReady && pageVisible && !hovered;
  useEffect(() => {
    if (!autoRunning || examples.length < 2) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % examples.length;
      // Wrap without sweeping back through three unrelated websites.
      move(next, next === 0);
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [autoRunning, active, examples.length, move]);
  const pauseOnFocus = (target: EventTarget) => {
    if (!(target instanceof Element) || !target.closest("[data-preview-playback]")) setPlaying(false);
  };
  return <div className={styles.showcase} aria-labelledby="hero-examples-heading" data-hero-showcase data-auto-running={autoRunning} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={event => pauseOnFocus(event.target)}>
    <div className={styles.showcaseHeading}><h2 id="hero-examples-heading">制作サイトの見本</h2><button type="button" className={styles.playback} data-preview-playback aria-label={playing ? "自動切替を停止" : "自動切替を再開"} aria-controls="hero-preview-rail" disabled={!motionAllowed} onClick={() => setPlaying(current => !current)}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true" focusable="false"><path d={playing ? "M4 3h3v10H4zM9 3h3v10H9z" : "M4 2v12l9-6z"}/></svg><span>{playing ? "自動切替" : "自動切替オフ"}</span></button></div>
    <div className={styles.previewTabs} role="group" aria-label="見たい業種を選ぶ">{examples.map((example, index) => <button key={example.href} type="button" aria-pressed={active === index} aria-controls="hero-preview-rail" onClick={() => manualMove(index)}>{example.category}</button>)}</div>
    <div className={styles.previewFrame}>
      <div className={styles.previewBar} aria-hidden="true"><span><i/><i/><i/></span><p>DESIGN PREVIEW</p><b>{String(active + 1).padStart(2, "0")}</b></div>
      <div className={styles.previewProgress} aria-hidden="true"><i key={active}/></div>
      <div ref={rail} id="hero-preview-rail" className={styles.previewRail} role="region" aria-label="制作サイトの見本。左右にスワイプできます" tabIndex={0} onPointerDown={() => setPlaying(false)} onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        manualMove(event.key === "Home" ? 0 : event.key === "End" ? examples.length - 1 : active + (event.key === "ArrowLeft" ? -1 : 1));
      }}>
        {examples.map((example, index) => <figure key={example.href} className={styles.previewSlide} data-hero-preview>
          <a href={example.href} target="_blank" rel="noopener noreferrer" className={styles.previewImage} aria-label={`${example.category}：${example.name}の制作見本を開く（新しいタブ）`}>
            <Image src={example.image} alt={`${example.name}のホームページ制作見本・実際のファーストビュー`} fill sizes="(max-width:760px) calc(100vw - 40px), (max-width:1100px) 47vw, 600px" priority={index === 0} onLoad={index === 0 ? () => setFirstImageReady(true) : undefined} style={{ objectFit: "contain" }}/>
          </a>
          <figcaption><div><span>{example.category}</span><strong>{example.name}</strong></div><a href={example.href} target="_blank" rel="noopener noreferrer">このサイトを見る</a></figcaption>
        </figure>)}
      </div>
    </div>
    <div className={styles.previewFooter}><div className={styles.previewNotes}><a href="#demo">すべての制作見本を見る</a><p>架空の店舗・企業の制作見本です。</p></div><div><span>{String(active + 1).padStart(2, "0")}<i/> {String(examples.length).padStart(2, "0")}</span><button type="button" onClick={() => manualMove(active - 1)} disabled={active === 0} aria-label="前のサイト見本" aria-controls="hero-preview-rail"><PreviewArrow previous/></button><button type="button" onClick={() => manualMove(active + 1)} disabled={active === examples.length - 1} aria-label="次のサイト見本" aria-controls="hero-preview-rail"><PreviewArrow/></button></div></div>
  </div>;
}
