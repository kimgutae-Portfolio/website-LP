"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { chapterAt, chapterStep, chapterStops, type ChapterStop } from "./chapter-scroll";
import styles from "./kasane.module.css";

const chapters = [
  { id: "kasane-home", hash: "kasane-top", label: "トップ", short: "TOP" },
  { id: "kasane-about", hash: "kasane-about", label: "私たちについて", short: "ABOUT" },
  { id: "kasane-business", hash: "kasane-business", label: "事業内容", short: "BUSINESS" },
  { id: "kasane-projects", hash: "kasane-projects", label: "プロジェクト", short: "PROJECTS" },
  { id: "kasane-film", hash: "kasane-film", label: "ブランドムービー", short: "FILM" },
  { id: "kasane-journal", hash: "kasane-journal", label: "お知らせ", short: "JOURNAL" },
  { id: "kasane-company", hash: "kasane-company", label: "会社情報", short: "COMPANY" },
  { id: "kasane-recruit", hash: "kasane-recruit", label: "採用情報", short: "RECRUIT" },
  { id: "kasane-contact", hash: "kasane-contact", label: "お問い合わせ", short: "CONTACT" },
  { id: "kasane-footer", hash: "kasane-footer", label: "サイト情報", short: "INFORMATION" },
] as const;

type Props = { siteRef: RefObject<HTMLDivElement | null>; headerRef: RefObject<HTMLElement | null>; blocked: boolean };

export function SectionNavigation({ siteRef, headerRef, blocked }: Props) {
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const blockedRef = useRef(blocked);
  const refreshRef = useRef<(() => void) | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const site = siteRef.current;
    const header = headerRef.current;
    if (!site || !header) return;
    const html = document.documentElement;
    const previousMode = html.getAttribute("data-kasane-scroll");
    const previousHeader = html.style.getPropertyValue("--kasane-nav-height");
    const previousBanner = html.style.getPropertyValue("--kasane-banner-height");
    const previousScroll = { padding: html.style.scrollPaddingTop, behavior: html.style.scrollBehavior, snap: html.style.scrollSnapType, gutter: html.style.scrollbarGutter };
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = chapters.map(chapter => site.querySelector<HTMLElement>(`#${chapter.id}`)!);
    let stops: ChapterStop[] = [];
    let headerHeight = header.offsetHeight;
    let animation = 0;
    let scrollFrame = 0;
    let animating = false;
    let wheelTotal = 0;
    let wheelDirection = 0;
    let gestureConsumed = false;
    let releaseGesture = 0;
    let initialHashAligned = false;

    const measure = () => {
      headerHeight = header.offsetHeight;
      const position = window.scrollY;
      stops = chapterStops(nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return { id: node.id, top: rect.top + position, bottom: rect.bottom + position };
      }), window.innerHeight, headerHeight, Math.max(0, html.scrollHeight - window.innerHeight));
    };
    const updateActive = () => {
      scrollFrame = 0;
      setActive(chapterAt(stops, window.scrollY + Math.min(100, (window.innerHeight - headerHeight) * .12)));
    };
    const cancel = () => {
      window.cancelAnimationFrame(animation);
      animation = 0;
      animating = false;
    };
    cancelRef.current = cancel;
    const move = (top: number, index: number, focus: boolean, instant = false) => {
      cancel();
      const from = window.scrollY;
      const distance = top - from;
      const finish = () => {
        animating = false;
        animation = 0;
        setActive(index);
        if (focus) {
          const heading = nodes[index]?.querySelector<HTMLElement>("h1, h2");
          if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
        }
      };
      if (instant || motion.matches || Math.abs(distance) < 2) {
        window.scrollTo({ top, behavior: "instant" }); finish(); return;
      }
      animating = true;
      const started = performance.now();
      const duration = Math.min(980, Math.max(680, Math.abs(distance) * .34));
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({ top: from + distance * eased, behavior: "instant" });
        if (progress < 1) animation = window.requestAnimationFrame(tick); else finish();
      };
      animation = window.requestAnimationFrame(tick);
    };
    const go = (index: number, focus = true) => {
      measure();
      if (stops[index]) move(stops[index].start, index, focus);
    };
    const step = (direction: 1 | -1, focus = false) => {
      measure();
      const next = chapterStep(stops, window.scrollY, window.innerHeight, headerHeight, direction);
      move(next.top, next.index, focus && chapterAt(stops, window.scrollY) !== next.index);
    };
    const refresh = () => {
      html.style.setProperty("--kasane-nav-height", `${header.offsetHeight}px`);
      html.style.setProperty("--kasane-banner-height", `${site.querySelector<HTMLElement>("[data-kasane-banner]")?.offsetHeight ?? 0}px`);
      html.setAttribute("data-kasane-scroll", blockedRef.current ? "paused" : motion.matches ? "native" : desktop.matches ? "chapters" : "touch");
      html.style.scrollPaddingTop = `${header.offsetHeight}px`;
      html.style.scrollBehavior = "auto";
      html.style.scrollSnapType = !blockedRef.current && !motion.matches && !desktop.matches ? "y proximity" : "none";
      html.style.scrollbarGutter = "stable";
      setEnabled(!motion.matches);
      measure(); updateActive();
      if (!blockedRef.current && !initialHashAligned) {
        initialHashAligned = true;
        const index = chapters.findIndex(chapter => `#${chapter.hash}` === window.location.hash);
        if (index >= 0) move(stops[index].start, index, false, true);
      }
    };
    refreshRef.current = refresh;
    const isField = (target: EventTarget | null) => target instanceof Element && !!target.closest("input, textarea, select, video, [contenteditable='true'], dialog, [role='dialog']");
    const hasNestedScroll = (target: EventTarget | null, direction: number) => {
      let node = target instanceof Element ? target : null;
      while (node && node !== site && node !== document.body) {
        if (node instanceof HTMLElement && /(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 2) {
          if (direction < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 2) return true;
        }
        node = node.parentElement;
      }
      return false;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || !desktop.matches || motion.matches || blockedRef.current || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || isField(event.target) || hasNestedScroll(event.target, event.deltaY)) return;
      if (!event.deltaY || !event.cancelable) return;
      event.preventDefault();
      window.clearTimeout(releaseGesture);
      releaseGesture = window.setTimeout(() => { gestureConsumed = false; wheelTotal = 0; wheelDirection = 0; }, 190);
      if (animating || gestureConsumed) return;
      const direction = Math.sign(event.deltaY);
      if (direction !== wheelDirection) wheelTotal = 0;
      wheelDirection = direction;
      wheelTotal += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(wheelTotal) < 24) return;
      gestureConsumed = true;
      step(direction as 1 | -1);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { cancel(); return; }
      if (event.defaultPrevented || !desktop.matches || motion.matches || blockedRef.current || event.ctrlKey || event.metaKey || event.altKey || isField(event.target)) return;
      if (event.shiftKey && event.key !== " ") return;
      if (event.key === " " && event.target instanceof Element && event.target.closest("a, button, summary, [role='button']")) return;
      const direction = ["PageDown", "ArrowDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1) : ["PageUp", "ArrowUp"].includes(event.key) ? -1 : 0;
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); go(event.key === "Home" ? 0 : chapters.length - 1); return; }
      if (!direction) return;
      event.preventDefault();
      if (!animating) step(direction as 1 | -1, true);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      if (!anchor) return;
      const index = chapters.findIndex(chapter => `#${chapter.hash}` === anchor.getAttribute("href"));
      if (index < 0) return;
      event.preventDefault(); go(index);
      window.history.replaceState(window.history.state, "", `#${chapters[index].hash}`);
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActive); };
    const onHashChange = () => {
      const index = chapters.findIndex(chapter => `#${chapter.hash}` === window.location.hash);
      if (index >= 0 && !blockedRef.current) go(index, false);
    };
    const onResize = () => { cancel(); refresh(); };
    const observer = new ResizeObserver(() => { measure(); updateActive(); });
    observer.observe(site); observer.observe(header);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);
    site.addEventListener("click", onClick);
    desktop.addEventListener("change", onResize);
    motion.addEventListener("change", onResize);
    refresh();
    return () => {
      cancel(); window.cancelAnimationFrame(scrollFrame); window.clearTimeout(releaseGesture);
      observer.disconnect();
      window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange); site.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onResize); motion.removeEventListener("change", onResize);
      if (previousMode === null) html.removeAttribute("data-kasane-scroll"); else html.setAttribute("data-kasane-scroll", previousMode);
      if (previousHeader) html.style.setProperty("--kasane-nav-height", previousHeader); else html.style.removeProperty("--kasane-nav-height");
      if (previousBanner) html.style.setProperty("--kasane-banner-height", previousBanner); else html.style.removeProperty("--kasane-banner-height");
      html.style.scrollPaddingTop = previousScroll.padding;
      html.style.scrollBehavior = previousScroll.behavior;
      html.style.scrollSnapType = previousScroll.snap;
      html.style.scrollbarGutter = previousScroll.gutter;
      refreshRef.current = null; cancelRef.current = null;
    };
  }, [siteRef, headerRef]);

  useEffect(() => {
    blockedRef.current = blocked;
    if (blocked) cancelRef.current?.();
    refreshRef.current?.();
  }, [blocked]);

  if (!enabled) return null;
  return <nav className={styles.sectionRail} aria-label="セクションナビゲーション" data-light={[0, 4, 8, 9].includes(active)} data-hidden={blocked}>
    <p aria-hidden="true">{String(active + 1).padStart(2, "0")} <span>/ {String(chapters.length).padStart(2, "0")}</span></p>
    {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.hash}`} aria-label={`${chapter.label}へ移動`} aria-current={active === index ? "location" : undefined}>
      <span className={styles.railLabel}>{chapter.short}</span><span className={styles.railLine} aria-hidden="true" />
    </a>)}
  </nav>;
}
