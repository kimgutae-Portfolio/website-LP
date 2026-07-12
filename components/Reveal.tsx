"use client";

import { createElement, useEffect, useRef, useState } from "react";

/**
 * 스크롤 리빌 래퍼: 뷰포트에 들어오면 페이드업으로 나타남 (1회만)
 * - delay(ms)로 카드들의 순차 등장(스태거) 연출
 * - prefers-reduced-motion 사용자는 globals.css에서 즉시 표시로 처리
 * - JS 미작동 환경은 layout.tsx의 <noscript> 폴백으로 항상 표시
 */
export function Reveal({
  as = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: "div" | "li";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      className: `reveal ${visible ? "reveal-visible" : ""} ${className}`,
    },
    children,
  );
}
