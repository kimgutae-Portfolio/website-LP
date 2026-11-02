"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { orbitFrontIndex } from "@/lib/hero-orbit";
import styles from "./hero.module.css";

type HeroExample = { name: string; category: string; href: string; image: string };

/** A small CSS-only 3D ring. No timers or frame-by-frame React updates. */
export function HeroShowcase({ examples }: { examples: readonly HeroExample[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const rotor = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [entryReady, setEntryReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [startAngle, setStartAngle] = useState(0);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => { setMotionAllowed(!preference.matches); if (preference.matches) setPlaying(false); };
    const visibility = () => setPageVisible(document.visibilityState === "visible");
    const hero = element.closest("[data-home-hero]");
    const entry = () => setEntryReady(!hero || hero.getAttribute("data-entry") === "complete");
    motion(); visibility(); entry();
    const observer = new IntersectionObserver(([item]) => setInView(item.isIntersecting), { threshold: .15 });
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
  const autoRunning = playing && motionAllowed && inView && entryReady && firstImageReady && pageVisible && !hovered;
  const showCard = (index: number) => { setPlaying(false); setManualIndex(index); setStartAngle(-index * 360 / examples.length); };
  const frontIndex = () => {
    if (manualIndex !== null) return manualIndex;
    try {
      const matrix = new DOMMatrixReadOnly(window.getComputedStyle(rotor.current!).transform);
      return orbitFrontIndex(Math.atan2(matrix.m31, matrix.m11) * 180 / Math.PI, examples.length);
    } catch { return 0; }
  };
  const resume = () => {
    if (!playing && manualIndex !== null) setManualIndex(null);
    setPlaying(current => !current);
  };
  return <div className={styles.showcase} aria-labelledby="hero-examples-heading" data-hero-showcase data-auto-running={autoRunning} data-manual={manualIndex !== null} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}>
    <div className={styles.showcaseHeading}><h2 id="hero-examples-heading">制作サイトの見本</h2><button type="button" className={styles.playback} data-preview-playback aria-label={playing ? "自動回転を停止" : "自動回転を再開"} aria-controls="hero-orbit-stage" disabled={!motionAllowed} onClick={resume}><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true" focusable="false"><path d={playing ? "M4 3h3v10H4zM9 3h3v10H9z" : "M4 2v12l9-6z"}/></svg><span>{playing ? "自動回転" : "停止中"}</span></button></div>
    <div ref={stage} id="hero-orbit-stage" className={styles.orbitStage} role="region" aria-label="制作見本が左から右へ一周します。矢印キーでも選べます" tabIndex={0} onFocus={event => { if (event.target === event.currentTarget) setPlaying(false); }} onKeyDown={event => {
      if (!motionAllowed || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === "Home" ? 0 : event.key === "End" ? examples.length - 1 : (frontIndex() + (event.key === "ArrowRight" ? 1 : -1) + examples.length) % examples.length;
      showCard(index);
      rotor.current?.querySelectorAll<HTMLAnchorElement>("a")[index]?.focus({ preventScroll: true });
    }}>
      <div ref={rotor} className={styles.orbitRotor} role="list" style={{ "--orbit-angle": `${startAngle}deg` } as CSSProperties}>
        {examples.map((example, index) => <div key={example.href} className={styles.orbitCard} role="listitem" data-hero-preview style={{ "--card-angle": `${index * 360 / examples.length}deg` } as CSSProperties}>
          <a href={example.href} target="_blank" rel="noopener noreferrer" aria-label={`${example.category}：${example.name}の制作見本を開く（新しいタブ）`} onPointerDown={() => setPlaying(false)} onFocus={event => {
            setPlaying(false);
            if (motionAllowed && event.currentTarget.matches(":focus-visible")) showCard(index);
          }}>
            <span className={styles.orbitImage}><Image src={example.image} alt={`${example.name}のホームページ制作見本`} fill sizes="(max-width:760px) 200px, 280px" priority={index === 0} onLoad={index === 0 ? () => setFirstImageReady(true) : undefined} style={{ objectFit: "contain" }}/></span>
            <span className={styles.orbitCaption}><span>{example.category}</span><strong>{example.name}</strong></span>
          </a>
        </div>)}
      </div>
    </div>
    <div className={styles.orbitFooter}><a href="#demo">すべての制作見本を見る</a><p>架空の店舗・企業の制作見本です。</p></div>
    <noscript><style>{`.${styles.orbitStage}{height:auto!important;overflow-x:auto!important;perspective:none!important;padding:10px 0}.${styles.orbitRotor}{position:static!important;display:flex!important;width:max-content!important;height:auto!important;gap:12px;transform:none!important;animation:none!important}.${styles.orbitCard}{position:relative!important;inset:auto!important;flex:0 0 160px;width:160px!important;transform:none!important}`}</style></noscript>
  </div>;
}
