"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./hero.module.css";

// One continuous scene: sunrise, approach, open doorway, then the live hero.
// The opening never intercepts navigation, locks scrolling or waits on media.
export function HeroExperience({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<"playing" | "complete">("playing");
  const finish = () => setEntry("complete");
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { if (preference.matches) setEntry("complete"); };
    update();
    if ((window.location.hash && window.location.hash !== "#top") || window.scrollY > 32) setEntry("complete");
    const fallback = window.setTimeout(() => setEntry("complete"), 2900);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") setEntry("complete"); };
    const onScroll = () => { if (window.scrollY > 32) setEntry("complete"); };
    const onHash = () => { if (window.location.hash && window.location.hash !== "#top") setEntry("complete"); };
    preference.addEventListener("change", update);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(fallback);
      preference.removeEventListener("change", update);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return <section id="top" className={styles.hero} data-home-hero data-entry={entry} aria-labelledby="home-hero-heading" onFocusCapture={finish} onPointerDownCapture={finish}>
    <div className={styles.brandScene} data-opening-mark aria-hidden="true">
      <svg className={styles.desktopScene} viewBox="0 0 1400 900" preserveAspectRatio="xMidYMin slice" focusable="false">
        <g className={styles.sceneCamera} data-entry-camera onAnimationEnd={event => { if (event.target === event.currentTarget) finish(); }}>
        <circle cx="1330" cy="40" r="370" fill="#205b4b"/>
        <g className={styles.sunrise} data-entry-sun>
          <circle cx="1260" cy="80" r="53" fill="#e6b86b"/>
          <path d="M1260 133L928 900H1400V246Z" fill="#e6b86b" opacity=".06"/>
        </g>
        <path d="M700 950V350L1050 55L1400 350V950Z" fill="#1c5143"/>
        <path d="M590 950V370L1048-17L1505 370V950M659 950V396L1048 67L1438 396V950" fill="none" stroke="#477b61" strokeWidth="1.5"/>
        <path d="M1010 247H1197V481H1010ZM1103 247V481M1010 364H1197" fill="none" stroke="#789373" strokeWidth="1.3"/>
        <g className={styles.doorway} data-entry-doorway>
          <path d="M835 940V420H1200V940M851 940V437H1184V940" fill="#103a31" stroke="#739071" strokeWidth="1.4"/>
          <rect className={styles.doorLeft} x="852" y="438" width="166" height="502" fill="#234f40" stroke="#8da17d" strokeWidth="1"/>
          <rect className={styles.doorRight} x="1018" y="438" width="166" height="502" fill="#1b4538" stroke="#8da17d" strokeWidth="1"/>
          <path d="M0 900L835 825M1400 900L1200 825" fill="none" stroke="#608063" strokeWidth="1"/>
        </g>
        <path d="M111 900V725L277 585L443 725V900" fill="none" stroke="#42745b" strokeWidth="1.3"/>
        <path d="M0 851H1400M0 876H1400" stroke="#49775c" strokeWidth="1"/>
        </g>
      </svg>
      <svg className={styles.mobileScene} viewBox="0 0 390 780" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className={styles.sceneCamera} data-entry-camera onAnimationEnd={event => { if (event.target === event.currentTarget) finish(); }}>
        <circle cx="435" cy="90" r="180" fill="#205b4b"/>
        <g className={styles.sunrise} data-entry-sun>
          <circle cx="270" cy="65" r="25" fill="#e6b86b"/>
          <path d="M270 90L118 780H390V182Z" fill="#e6b86b" opacity=".06"/>
        </g>
        <path d="M154 810V238L337 80L520 238V810Z" fill="#1c5143"/>
        <path d="M111 810V234L335 41L559 234V810M132 810V243L335 68L538 243V810" fill="none" stroke="#477b61" strokeWidth="1"/>
        <path d="M311 256H389V357H311ZM350 256V357M311 306H389" fill="none" stroke="#789373" strokeWidth="1"/>
        <g className={styles.doorway} data-entry-doorway>
          <path d="M210 810V290H401V810M220 810V301H391V810" fill="#103a31" stroke="#739071" strokeWidth="1"/>
          <rect className={styles.doorLeft} x="221" y="302" width="85" height="508" fill="#234f40" stroke="#8da17d" strokeWidth="1"/>
          <rect className={styles.doorRight} x="306" y="302" width="85" height="508" fill="#1b4538" stroke="#8da17d" strokeWidth="1"/>
          <path d="M0 780L210 650M390 780L401 650" fill="none" stroke="#608063" strokeWidth="1"/>
        </g>
        <path d="M0 755H390M0 768H390" stroke="#49775c"/>
        </g>
      </svg>
    </div>
    <div className={styles.entryThreshold} aria-hidden="true"><span/><span/></div>
    <div className={styles.inner}>
      <div className={styles.entryLine} aria-hidden="true"/>
      {children}
    </div>
  </section>;
}
