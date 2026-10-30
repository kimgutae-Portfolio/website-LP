"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { TownScene } from "./TownScene";
import { HeroOpening } from "./HeroOpening";
import styles from "./hero.module.css";

// One finite sunrise / storefront opening; never a blocking loading screen.
export function HeroExperience({ children }: { children: ReactNode }) {
  const hero = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const fallback = useRef<number | null>(null);
  const [entry, setEntry] = useState<"waiting" | "preparing" | "playing" | "complete">("preparing");
  const play = useCallback(() => {
    setEntry(current => current === "preparing" ? "playing" : current);
  }, []);
  const finish = useCallback((event?: SyntheticEvent) => {
    if (event?.type === "pointerdown") {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("a, button, input, textarea, select, summary")) return;
    }
    hasPlayed.current = true;
    setEntry("complete");
    observer.current?.disconnect();
    if (fallback.current !== null) window.clearTimeout(fallback.current);
  }, []);
  useEffect(() => {
    const element = hero.current;
    const heading = element?.querySelector("h1");
    if (!element || !heading) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let awaitingAnchorExit = Boolean(window.location.hash && window.location.hash !== "#top");
    const begin = () => {
      if (hasPlayed.current || preference.matches) return;
      hasPlayed.current = true;
      setEntry("preparing");
      observer.current?.disconnect();
    };
    const update = () => { if (preference.matches) finish(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") finish(); };
    // A small wheel/touch movement is not a request to skip the opening.
    const onScroll = () => { if (hasPlayed.current && element.getBoundingClientRect().bottom <= 0) finish(); };
    const onHash = () => {
      if (window.location.hash && window.location.hash !== "#top") {
        if (hasPlayed.current) finish();
        else { awaitingAnchorExit = true; setEntry("waiting"); }
      } else {
        awaitingAnchorExit = false;
        const bounds = heading.getBoundingClientRect();
        if (bounds.bottom > 64 && bounds.top < window.innerHeight) begin();
      }
    };
    if (preference.matches) finish();
    else if (typeof IntersectionObserver === "undefined") {
      if (awaitingAnchorExit || window.scrollY > 32) finish();
      else begin();
    } else {
      // Observe the actual headline, not the lower offer block. Deep links keep
      // their position; an unseen opening waits until the visitor reaches it.
      observer.current = new IntersectionObserver(([item]) => {
        if (awaitingAnchorExit) {
          if (!item.isIntersecting) awaitingAnchorExit = false;
          return;
        }
        if (item.isIntersecting) begin();
      }, { threshold: 0.15, rootMargin: "-64px 0px 0px 0px" });
      observer.current.observe(heading);
      if (awaitingAnchorExit || window.scrollY > 32) setEntry("waiting");
      else begin();
    }
    preference.addEventListener("change", update);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      if (fallback.current !== null) window.clearTimeout(fallback.current);
      observer.current?.disconnect();
      preference.removeEventListener("change", update);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [finish]);
  useEffect(() => {
    if (entry !== "playing") return;
    fallback.current = window.setTimeout(finish, 3600);
    return () => { if (fallback.current !== null) window.clearTimeout(fallback.current); };
  }, [entry, finish]);
  return <section ref={hero} id="top" className={styles.hero} data-home-hero data-entry={entry} aria-labelledby="home-hero-heading" onFocusCapture={finish} onPointerDownCapture={finish}>
    <HeroOpening active={entry === "preparing" || entry === "playing"} scene={scene} onReady={play} onComplete={finish}/>
    <div className={styles.inner}><div ref={scene} className={styles.brandScene} data-opening-mark><TownScene/></div>{children}</div>
    <div className={styles.heroFoot} aria-hidden="true"><span>お店らしさを、まっすぐ届ける。</span><span>YOUR LOCAL WEB PARTNER</span><span>つくる前も、つくったあとも。</span></div>
  </section>;
}
