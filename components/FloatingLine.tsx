import { siteConfig } from "@/site.config";
import { LineIcon } from "./icons";

/**
 * 플로팅 LINE 친구추가 버튼 (화면 우하단 고정)
 * 고객 사이트 템플릿에도 기본 탑재되는 사양이므로 컴포넌트로 분리.
 * 은은한 펄스 링으로 시선을 유도 (prefers-reduced-motion 시 자동 정지).
 */
export function FloatingLine() {
  return (
    <div className="fixed bottom-5 right-5 z-50 h-16 w-16">
      <span
        aria-hidden="true"
        className="animate-ping-soft absolute inset-0 rounded-full bg-line"
      />
      <a
        href={siteConfig.line.addFriendUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINEで友だち追加して相談する"
        className="relative flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full bg-line text-white shadow-lg ring-4 ring-white/70 transition hover:scale-105 hover:bg-line-dark"
      >
        <LineIcon className="h-7 w-7" />
        <span className="text-[10px] font-bold leading-none">相談</span>
      </a>
    </div>
  );
}
