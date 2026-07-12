"use client";

import { useEffect, useState } from "react";

/**
 * 초경량 히어로 캐러셀 (외부 라이브러리 없음)
 * - 크로스페이드 자동 전환 + 점 네비게이션
 * - 고객 사이트 템플릿용: slides에 사진(<img>)이나 일러스트를 넣으면 됨
 * - 컨테이너 높이는 className으로 지정 (슬라이드는 absolute로 채움)
 */
export function HeroCarousel({
  slides,
  interval = 4500,
  className = "",
}: {
  slides: React.ReactNode[];
  /** 자동 전환 간격 (ms) */
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide}
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`スライド${i + 1}を表示`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
