"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import styles from "./hero.module.css";

/** Full-viewport doors hand the same yellow sun to the live SVG background. */
export function HeroOpening({ active, scene, onReady, onComplete }: {
  active: boolean;
  scene: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onComplete: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active) return;
    let frame = 0;
    let warmup = 0;
    let geometry: { x: number; y: number; scale: number } | null = null;
    const placeSun = () => {
      frame = 0;
      const target = scene.current;
      const element = stage.current;
      const disc = sun.current;
      if (!target || !element || !disc) return;
      if (!geometry) {
        // Read layout once, before any style writes. These offsets deliberately
        // ignore the hero's animated transform; scrolling needs no fresh layout.
        const diameter = disc.offsetWidth;
        if (!diameter) return;
        let left = 0, top = 0;
        let parent: HTMLElement | null = target;
        while (parent) {
          left += parent.offsetLeft;
          top += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }
        const width = target.clientWidth;
        geometry = {
          x: left + width * 642 / 900 - element.clientWidth / 2,
          y: top + width * 164 / 900 - element.clientHeight / 2,
          scale: width * 224 / 900 / diameter,
        };
      }
      element.style.setProperty("--opening-sun-x", `${geometry.x - window.scrollX}px`);
      element.style.setProperty("--opening-sun-y", `${geometry.y - window.scrollY}px`);
      element.style.setProperty("--opening-sun-scale", String(geometry.scale));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(placeSun); };
    const resize = () => { geometry = null; schedule(); };
    placeSun();
    // Let the browser paint the initial pose and prepare the few moving layers
    // before advancing the shared CSS timeline. No frame-by-frame JS animation.
    warmup = window.requestAnimationFrame(() => {
      // A route's stylesheet may settle after hydration's first layout effect.
      // Never start against the fallback coordinates if that first read was zero.
      if (!geometry) placeSun();
      warmup = window.requestAnimationFrame(() => {
        if (geometry) onReady();
        else onComplete();
      });
    });
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(warmup);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", schedule);
    };
  }, [active, scene, onReady, onComplete]);

  return <div ref={stage} className={styles.opening} data-entry-stage aria-hidden="true"
    onAnimationEnd={event => { if (event.target === event.currentTarget) onComplete(); }}>
    <div className={styles.openingDoors}>
      <div className={styles.openingLeft} data-entry-leaf="left"/>
      <div className={styles.openingRight} data-entry-leaf="right"/>
    </div>
    <div className={styles.openingHorizon}/>
    <div ref={sun} className={styles.openingSun} data-opening-sun/>
    <div className={styles.openingIdentity}>
      <p>まちに、Webの入口を。</p>
      <strong>まちの<span>Web</span></strong>
    </div>
    <span className={styles.openingFoot}>お店と会社の、次の一歩へ。</span>
  </div>;
}
