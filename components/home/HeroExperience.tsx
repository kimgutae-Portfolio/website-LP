"use client";
import { useEffect, useState, type ReactNode } from "react";
import { TownScene } from "./TownScene";
import styles from "./hero.module.css";

// One finite sunrise / storefront opening; never a blocking loading screen.
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
    <div className={styles.inner}><div className={styles.brandScene} data-opening-mark><TownScene onEntryEnd={finish}/></div>{children}</div>
    <div className={styles.heroFoot} aria-hidden="true"><span>お店らしさを、まっすぐ届ける。</span><span>YOUR LOCAL WEB PARTNER</span><span>つくる前も、つくったあとも。</span></div>
  </section>;
}
