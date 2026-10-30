"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";

type RevealVariant = "fade" | "wipe" | "slide-left" | "slide-right" | "settle" | "gallery";

/**
 * 스크롤 리빌 래퍼: 뷰포트 진입 시 1회 재생. 기존 기본 페이드업은 유지.
 * - variant는 메인 페이지의 콘텐츠 성격에 맞춰 명시적으로 선택
 * - delay(ms)로 카드들의 순차 등장(스태거) 연출
 * - prefers-reduced-motion 사용자는 globals.css에서 즉시 표시로 처리
 * - JS 미작동 환경은 layout.tsx의 <noscript> 폴백으로 항상 표시
 */
export function Reveal({
  as = "div",
  delay = 0,
  variant,
  className = "",
  children,
}: {
  as?: "div" | "li";
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: variant ? 0.08 : 0.15, rootMargin: variant ? "0px 0px -24px 0px" : "0px 0px -40px 0px" },
    );
    const showOnFocus = () => { setVisible(true); observer.disconnect(); };
    el.addEventListener("focusin", showOnFocus);
    const target = variant === "gallery" ? el.querySelector("[data-gallery-stage]") ?? el : el;
    observer.observe(target);
    return () => { observer.disconnect(); el.removeEventListener("focusin", showOnFocus); };
  }, [variant]);

  return createElement(
    as,
    {
      ref,
      style: delay ? { transitionDelay: `${delay}ms`, "--reveal-delay": `${delay}ms` } as CSSProperties : undefined,
      "data-reveal": variant,
      className: `reveal ${visible ? "reveal-visible" : ""} ${className}`,
    },
    children,
  );
}
