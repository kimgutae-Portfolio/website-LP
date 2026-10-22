"use client";

import { useEffect, type RefObject } from "react";
import { sceneMotion, type SuiScene } from "./motion";

export function useSuiMotion(root: RefObject<HTMLDivElement | null>, paused: boolean, revision: string) {
  useEffect(() => {
    const site = root.current;
    if (!site || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(site.querySelectorAll<HTMLElement>("[data-sui-scene]"));
    const reveals = Array.from(site.querySelectorAll<HTMLElement>("[data-sui-reveal]"));
    const active = new Set<HTMLElement>();
    let frame = 0;
    let running = false;

    const paint = () => {
      frame = 0;
      if (paused || document.hidden || preference.matches) return;
      for (const element of active) {
        const bounds = element.getBoundingClientRect();
        const motion = sceneMotion(element.dataset.suiScene as SuiScene, bounds.top, bounds.height, window.innerWidth, window.innerHeight);
        element.style.setProperty("--scene-travel", `${motion.travel}px`);
        element.style.setProperty("--scene-scale", String(motion.scale));
        element.style.setProperty("--scene-inset", `${motion.inset}px`);
      }
    };
    const schedule = () => {
      if (!frame && !paused && !document.hidden && !preference.matches) frame = requestAnimationFrame(paint);
    };
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.suiVisible = "true";
        revealObserver.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    const sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target as HTMLElement);
        else active.delete(entry.target as HTMLElement);
      }
      schedule();
    }, { rootMargin: "100px" });

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      revealObserver.disconnect();
      sceneObserver.disconnect();
      active.clear();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      running = false;
    };
    const configure = () => {
      stop();
      site.dataset.motion = String(!preference.matches);
      if (preference.matches) return;
      for (const element of reveals) if (element.dataset.suiVisible !== "true") revealObserver.observe(element);
      for (const element of scenes) sceneObserver.observe(element);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      document.addEventListener("visibilitychange", schedule);
      running = true;
      schedule();
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      if (running) stop();
      preference.removeEventListener("change", configure);
      delete site.dataset.motion;
    };
  }, [root, paused, revision]);
}
