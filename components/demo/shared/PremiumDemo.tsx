"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./premium.module.css";

export function DemoShell({ children, className, paused = false, revision = "" }: { children: ReactNode; className: string; paused?: boolean; revision?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const padding = html.style.scrollPaddingTop;
    const gutter = html.style.scrollbarGutter;
    html.style.scrollPaddingTop = "0px";
    html.style.scrollbarGutter = "stable";
    let cancelled = false;
    const show = () => { if (!cancelled) setReady(true); };
    const timeout = window.setTimeout(show, 650);
    const image = root.current?.querySelector<HTMLImageElement>("[data-hero-image]");
    Promise.all([document.fonts.ready, image?.decode().catch(() => undefined)]).then(show);
    return () => { cancelled = true; window.clearTimeout(timeout); html.style.scrollPaddingTop = padding; html.style.scrollbarGutter = gutter; };
  }, []);
  useEffect(() => {
    const site = root.current;
    if (!site || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveals = Array.from(site.querySelectorAll<HTMLElement>("[data-demo-reveal]"));
    const scenes = Array.from(site.querySelectorAll<HTMLElement>("[data-demo-scene]"));
    const active = new Set<HTMLElement>();
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (paused || document.hidden || preference.matches) return;
      for (const element of active) {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
        element.style.setProperty("--scene-progress", progress.toFixed(4));
        element.style.setProperty("--scene-travel", `${((.5 - progress) * Math.min(rect.height * .045, innerWidth <= 700 ? 22 : 48)).toFixed(2)}px`);
        element.style.setProperty("--scene-arrival", Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight * .8))).toFixed(4));
      }
    };
    const schedule = () => { if (!frame && !paused && !document.hidden && !preference.matches) frame = requestAnimationFrame(paint); };
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.seen = "true"; revealObserver.unobserve(entry.target); }
    }, { rootMargin: "0px 0px -7% 0px" });
    const sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) { if (entry.isIntersecting) active.add(entry.target as HTMLElement); else active.delete(entry.target as HTMLElement); }
      schedule();
    }, { rootMargin: "100px" });
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; active.clear(); revealObserver.disconnect(); sceneObserver.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", schedule);
    };
    const configure = () => {
      stop(); site.dataset.motion = String(!preference.matches);
      if (preference.matches) return;
      reveals.filter(element => element.dataset.seen !== "true").forEach(element => revealObserver.observe(element));
      scenes.forEach(element => sceneObserver.observe(element));
      window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule, { passive: true }); document.addEventListener("visibilitychange", schedule);
      schedule();
    };
    configure(); preference.addEventListener("change", configure);
    return () => { stop(); preference.removeEventListener("change", configure); delete site.dataset.motion; };
  }, [paused, revision]);
  return <div ref={root} className={`${styles.root} ${className}`} data-ready={ready}>
    <noscript><style>{"[data-demo-opening]{display:none!important}"}</style></noscript>{children}
  </div>;
}

export function DemoDialog({ open, onClose, label, className = "", children }: { open: boolean; onClose: () => void; label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const element = ref.current;
    const focus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => { element?.querySelectorAll("video").forEach(video => video.pause()); element?.close(); document.body.style.overflow = overflow; focus?.focus({ preventScroll: true }); };
  }, [open]);
  return <dialog ref={ref} aria-label={label} className={`${styles.dialog} ${className}`} onClose={() => { if (!ref.current?.open) close.current(); }} onClick={event => { if (event.target === event.currentTarget) close.current(); }}>
    {open && <><div className={styles.dialogTop}><span>{label}</span><button type="button" aria-label="閉じる" onClick={onClose}>CLOSE <span aria-hidden="true">×</span></button></div>{children}</>}
  </dialog>;
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M3 12h17m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.3"/></svg>;
}

export function DemoNotice() {
  return <p className={styles.demoNotice}>架空の店舗・企業のホームページ制作見本です。掲載する写真・人物・料金・営業情報・製品はデモ用のイメージであり、実在の施設・実績・資格を示すものではありません。</p>;
}
