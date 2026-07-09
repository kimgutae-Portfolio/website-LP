import { siteConfig } from "@/site.config";
import { LineIcon } from "./icons";

// 주요 CTA 버튼: 전 섹션 공통으로 LINE 상담 유도
export function LineCta({
  label = siteConfig.hero.ctaLabel,
  size = "lg",
}: {
  label?: string;
  size?: "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-lg"
      : "px-5 py-2.5 text-base";

  return (
    <a
      href={siteConfig.line.addFriendUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-line font-bold text-white shadow-md transition hover:bg-line-dark hover:shadow-lg active:scale-[0.98] ${sizeClass}`}
    >
      <LineIcon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
      {label}
    </a>
  );
}
