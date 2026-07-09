// 공통 인라인 SVG 아이콘 (외부 아이콘 라이브러리 없이 경량 유지)

export function LineIcon({ className = "h-6 w-6" }: { className?: string }) {
  // LINE풍 말풍선 아이콘
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5C6.48 2.5 2 6.24 2 10.85c0 4.13 3.6 7.59 8.47 8.24.33.07.78.22.9.5.1.26.07.66.03.92l-.14.87c-.04.26-.2 1.02.9.56 1.1-.47 5.92-3.49 8.08-5.97 1.49-1.63 2.2-3.29 2.2-5.12C22.44 6.24 17.52 2.5 12 2.5z" />
    </svg>
  );
}

export function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ExternalIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

export function PersonIcon({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.69-8 6v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-3.31-3.58-6-8-6z" />
    </svg>
  );
}
