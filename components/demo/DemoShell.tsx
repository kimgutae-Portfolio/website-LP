import Link from "next/link";
import { FloatingLine } from "@/components/FloatingLine";

/**
 * 데모 사이트 공통 셸
 * - 상단 고정 배너: 가상 점포 데모임을 명시 + LP로 돌아가는 링크
 * - 플로팅 LINE 버튼: 데모를 보다가 그대로 상담으로 이어지는 영업 동선
 */
export function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-slate-900 px-4 py-2.5 text-white">
        <p className="text-xs sm:text-sm">
          ※架空の店舗のデモサイトです（デザイン見本）
        </p>
        <Link
          href="/"
          className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold transition hover:bg-white/25 sm:text-sm"
        >
          制作サービスを見る →
        </Link>
      </div>
      {children}
      <FloatingLine />
    </>
  );
}

/** 사진 자리 placeholder — 고객이 "내 사진이 여기 들어간다"를 이해하는 용도 */
export function PhotoPlaceholder({
  label = "写真が入ります",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
