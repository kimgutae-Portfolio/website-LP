"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "../Logo";
import styles from "./hero.module.css";

// A brief typographic opening, never a loading screen. All sales copy and
// native consultation links are rendered on the server before enhancement.
export function HeroExperience({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<"playing" | "complete">("playing");
  const finish = () => setEntry("complete");
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { if (preference.matches) setEntry("complete"); };
    update();
    if ((window.location.hash && window.location.hash !== "#top") || window.scrollY > 32) setEntry("complete");
    const fallback = window.setTimeout(() => setEntry("complete"), 1100);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") setEntry("complete"); };
    const onScroll = () => { if (window.scrollY > 32) setEntry("complete"); };
    preference.addEventListener("change", update);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(fallback);
      preference.removeEventListener("change", update);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return <section id="top" className={styles.hero} data-home-hero data-entry={entry} aria-labelledby="home-hero-heading" onFocusCapture={finish} onPointerDownCapture={finish}>
    <div className={styles.inner}>
      <div className={styles.signature} data-opening-mark aria-hidden="true"><LogoMark/><span>つくる、その先も。</span></div>
      <div className={styles.entryLine} aria-hidden="true"/>
      {children}
    </div>
  </section>;
}
