/**
 * 브랜드 로고: 하우스 마크(마을) + 「まちのWeb」 워드마크
 * 마크 색은 테마 CSS 변수를 따르므로 config의 primary만 바꾸면 로고 색도 바뀜.
 */

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--sc-primary, #0f6d6a)" />
      {/* 집(마을) 실루엣 */}
      <path d="M16 6.5 L26.5 15.2 V25.5 H5.5 V15.2 Z" fill="#ffffff" />
      {/* 문 */}
      <rect x="13.4" y="18.2" width="5.2" height="7.3" rx="1.4" fill="var(--sc-primary, #0f6d6a)" />
      {/* 지붕 위 전파(웹) 포인트 */}
      <circle cx="16" cy="3.5" r="1.6" fill="var(--sc-accent, #e8842c)" />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  className = "",
}: {
  /** dark: 밝은 배경용 / light: 어두운 배경(푸터)용 */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span
        className={`text-xl font-bold tracking-wide ${
          variant === "light" ? "text-white" : "text-slate-900"
        }`}
      >
        まちの
        <span className={variant === "light" ? "text-accent" : "text-primary"}>
          Web
        </span>
      </span>
    </span>
  );
}
