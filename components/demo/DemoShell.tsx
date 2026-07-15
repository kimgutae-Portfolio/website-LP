import Link from "next/link";
import { FloatingLine } from "@/components/FloatingLine";
import { FacebookIcon, InstagramIcon } from "@/components/icons";
import { siteConfig } from "@/site.config";

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

/**
 * 데모 푸터용 SNS 아이콘 (고객 사이트 기본 탑재 사양의 견본)
 * 색은 부모 요소의 text 색을 따라가므로 데모별 팔레트에 자동으로 맞음.
 */
export function DemoSocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`}>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="transition hover:opacity-70"
      >
        <InstagramIcon />
      </a>
      <a
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="transition hover:opacity-70"
      >
        <FacebookIcon />
      </a>
    </div>
  );
}

/**
 * 제작 크레딧 링크 (고객 사이트 템플릿 기본 탑재)
 * 고객 사이트가 늘어날수록 まちのWeb으로의 지역 백링크가 쌓이는 구조.
 * 실제 고객 사이트에서는 href를 절대 URL(https://machinowebs.com)로.
 */
export function DemoCredit() {
  return (
    <p className="mt-3 text-xs opacity-60">
      制作:{" "}
      <Link href="/" className="underline underline-offset-2 transition hover:opacity-80">
        {siteConfig.meta.siteName}
      </Link>
    </p>
  );
}

/**
 * Instagram 피드 그리드 (데모용)
 * LP의 InstagramFeed와 같은 "정사각 그리드, 프로필 헤더 없음" 사양의 견본.
 * 가상 점포라 실제 게시물이 없으므로, 사진 자리를 데모 팔레트 색으로 표시.
 * 실제 고객 사이트에서는 점포의 게시물 사진이 이 자리에 그대로 들어간다.
 */
export function DemoInstagramGrid({
  heading,
  tileClassName,
  noteClassName = "opacity-60",
}: {
  /** 각 데모의 타이포 체계에 맞춘 見出し 요소를 그대로 전달 (예: <BarHeading>Instagram</BarHeading>) */
  heading: React.ReactNode;
  /** 타일 배경(그라데이션 등) — 데모 팔레트에 맞춰 지정 */
  tileClassName: string;
  noteClassName?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      {heading}
      <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-2xl">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center ${tileClassName}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 opacity-70"
              aria-hidden="true"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-center text-xs ${noteClassName}`}>
        ※デモのため写真の代わりに表示しています。実際のサイトには、投稿写真がそのまま並びます
      </p>
    </div>
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
