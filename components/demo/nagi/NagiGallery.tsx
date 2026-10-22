"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "../shared/PremiumDemo";
import { gallery } from "./content";
import { galleryScrollState } from "./gallery-scroll";
import styles from "./nagi.module.css";

const number = (value: number) => String(value).padStart(2, "0");

export function NagiGallery({ onOpen }: { onOpen: (index: number) => void }) {
 const track = useRef<HTMLDivElement>(null);
 const position = useRef<HTMLInputElement>(null);
 const active = useRef(0);
 const [state, setState] = useState({ index: 0, atStart: true, atEnd: false });
 const measure = () => {
  const element = track.current;
  if (!element) return null;
  const offsets = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-gallery-photo]")).map(photo => photo.offsetLeft);
  return galleryScrollState(element.scrollLeft, element.scrollWidth, element.clientWidth, offsets);
 };
 const goTo = (index: number, focus = false) => {
  const element = track.current;
  const metrics = measure();
  if (!element || !metrics) return;
  const next = Math.max(0, Math.min(gallery.length - 1, index));
  element.scrollTo({ left: metrics.targets[next], behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  if (focus) element.querySelectorAll<HTMLButtonElement>("[data-gallery-photo]")[next]?.focus({ preventScroll: true });
 };
 const finishScrubbing = () => {
  track.current?.removeAttribute("data-scrubbing");
  goTo(measure()?.index ?? state.index);
 };
 useEffect(() => {
  const element = track.current;
  if (!element) return;
  let frame = 0;
  const paint = () => {
   frame = 0;
   const offsets = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-gallery-photo]")).map(photo => photo.offsetLeft);
   const metrics = galleryScrollState(element.scrollLeft, element.scrollWidth, element.clientWidth, offsets);
   active.current = metrics.index;
   if (position.current) { position.current.value = String(metrics.progress); position.current.style.setProperty("--gallery-progress", `${metrics.progress}%`); }
   setState(previous => previous.index === metrics.index && previous.atStart === metrics.atStart && previous.atEnd === metrics.atEnd ? previous : { index: metrics.index, atStart: metrics.atStart, atEnd: metrics.atEnd });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
  const resize = () => {
   const offsets = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-gallery-photo]")).map(photo => photo.offsetLeft);
   const metrics = galleryScrollState(element.scrollLeft, element.scrollWidth, element.clientWidth, offsets);
   element.scrollTo({ left: metrics.targets[active.current] ?? 0, behavior: "auto" });
   schedule();
  };
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(element);
  element.querySelectorAll("[data-gallery-photo]").forEach(photo => observer?.observe(photo));
  element.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  paint();
  return () => { cancelAnimationFrame(frame); observer?.disconnect(); element.removeEventListener("scroll", schedule); window.removeEventListener("resize", resize); };
 }, []);

 return <section id="nagi-gallery" className={styles.gallerySection} aria-labelledby="nagi-gallery-heading">
  <div className={`${styles.galleryHeading} ${styles.container}`} data-demo-reveal><div><p className={styles.eyebrow}>SCENES OF NAGI</p><h2 id="nagi-gallery-heading">館内を、ひとめぐり。</h2></div><p>部屋から、湯へ。縁側から、庭へ。<br/>気になる風景を、ゆっくり送って。</p></div>
  <div className={styles.galleryHint} aria-hidden="true"><span>横にめくる、凪の風景</span><span>SCROLL TO EXPLORE<Arrow/></span></div>
  <div ref={track} id="nagi-gallery-track" className={styles.gallery} role="region" aria-label="館内の写真ギャラリー" tabIndex={0} onKeyDown={event => {
   const next = event.key === "ArrowRight" ? state.index + 1 : event.key === "ArrowLeft" ? state.index - 1 : event.key === "Home" ? 0 : event.key === "End" ? gallery.length - 1 : null;
   if (next === null) return;
   event.preventDefault(); goTo(next, true);
  }}>
   {gallery.map((item, index) => <button type="button" key={item.image} data-gallery-photo className={styles.galleryCard} aria-label={`館内写真を大きく見る：${item.title}`} onClick={() => onOpen(index)}>
    <span className={styles.galleryPhoto}><Image src={`/demo/nagi/${item.image}.webp`} alt={item.alt} fill sizes="(max-width:700px) 110vw,100vw"/><span className={styles.galleryPhotoLabel}>{item.english}<Arrow diagonal/></span></span>
    <span className={styles.galleryCaption}><span className={styles.galleryNumber}>{number(index + 1)}</span><span><span className={styles.galleryTitle}>{item.title}</span><small>{item.note}</small></span><span className={styles.galleryExpand} aria-hidden="true">＋</span></span>
   </button>)}
  </div>
  <div className={`${styles.galleryTools} ${styles.container}`} data-nagi-gallery-tools>
   <p className={styles.galleryCounter} aria-live="polite" aria-atomic="true"><span aria-hidden="true">{number(state.index + 1)}</span><span aria-hidden="true">/</span><span aria-hidden="true">{number(gallery.length)}</span><span className={styles.srOnly}>{gallery.length}枚中{state.index + 1}枚目、{gallery[state.index].title}</span></p>
   <input ref={position} className={styles.galleryPosition} type="range" min="0" max="100" step="0.1" defaultValue="0" aria-label="写真のスクロール位置" aria-valuetext={`${state.index + 1} / ${gallery.length} ${gallery[state.index].title}`} aria-controls="nagi-gallery-track" onPointerDown={event => { track.current?.setAttribute("data-scrubbing", "true"); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={finishScrubbing} onPointerCancel={finishScrubbing} onBlur={finishScrubbing} onKeyDown={event => {
    const next = event.key === "ArrowRight" || event.key === "ArrowUp" ? state.index + 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? state.index - 1 : event.key === "Home" ? 0 : event.key === "End" ? gallery.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); goTo(next);
   }} onInput={event => {
    const metrics = measure();
    if (metrics) track.current?.scrollTo({ left: metrics.maximum * event.currentTarget.valueAsNumber / 100, behavior: "auto" });
   }}/>
   <div className={styles.galleryArrows}><button type="button" aria-label="前の風景へ" aria-controls="nagi-gallery-track" disabled={state.atStart} onClick={() => goTo(state.index - 1)}><Arrow/></button><button type="button" aria-label="次の風景へ" aria-controls="nagi-gallery-track" disabled={state.atEnd} onClick={() => goTo(state.index + 1)}><Arrow/></button></div>
  </div>
  <p className={`${styles.galleryFootnote} ${styles.container}`}>写真を選ぶと、大きな画面でご覧いただけます。写真は架空の宿のイメージです。</p>
  <noscript><style>{"[data-nagi-gallery-tools]{display:none!important}"}</style></noscript>
 </section>;
}
