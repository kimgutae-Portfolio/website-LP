import { siteConfig } from "@/site.config";
import { LineIcon } from "./icons";
import { FloatingLineAfterHero } from "./home/FloatingLineAfterHero";

/**
 * 플로팅 LINE 친구추가 버튼 (화면 우하단 고정)
 * 고객 사이트 템플릿에도 기본 탑재되는 사양이므로 컴포넌트로 분리.
 * 메인은 차분한 텍스트형, 데모는 기존 원형 버튼을 유지한다.
 */
export function FloatingLine({afterHero=false}:{afterHero?:boolean}) {
  const button=(
    <div className={afterHero?"fixed bottom-4 right-4 z-50":"fixed bottom-5 right-5 z-50 h-16 w-16"}>
      {!afterHero&&<span
        aria-hidden="true"
        className="animate-ping-soft absolute inset-0 rounded-full bg-line"
      />}
      <a
        href={siteConfig.line.addFriendUrl}
        data-line-placement="floating"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINEで友だち追加して相談する"
        className={afterHero?"relative flex h-12 items-center justify-center gap-2 rounded bg-line px-4 text-white shadow-md ring-2 ring-white/80 transition hover:bg-line-dark":"relative flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full bg-line text-white shadow-lg ring-4 ring-white/70 transition hover:scale-105 hover:bg-line-dark"}
      >
        <LineIcon className={afterHero?"h-5 w-5":"h-7 w-7"} />
        <span className={afterHero?"text-xs font-bold":"text-[10px] font-bold leading-none"}>{afterHero?"LINEで相談":"相談"}</span>
      </a>
    </div>
  );
  return afterHero?<FloatingLineAfterHero>{button}</FloatingLineAfterHero>:button;
}
