/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/site.config";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { InstagramIcon } from "./icons";

/**
 * Instagram 피드 섹션 — 공식 embed(프로필 헤더·버튼이 강제로 붙음) 대신,
 * 게시물 사진을 public/insta/ 에 두고 인스타 프로필처럼 정사각 그리드로 표시.
 * 타일 클릭 시 해당 게시물로 이동. API·토큰 불요, 사진 교체만으로 갱신.
 * config의 items가 비어 있으면 섹션 자체를 렌더링하지 않음.
 */
export function InstagramFeed() {
  const { instagram } = siteConfig;
  const items = instagram.items.filter((item) => item.image !== "");

  if (items.length === 0) return null;

  return (
    <section id="instagram" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading label={instagram.label} title={instagram.title} />

        <Reveal className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-2xl">
            {items.map((item, i) => (
              <a
                key={`${item.url}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagramの投稿を見る"
                className="group relative aspect-square"
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* 호버 시 인스타 아이콘 오버레이 */}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <InstagramIcon className="h-8 w-8" />
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        {instagram.profileUrl && (
          <Reveal className="mt-10 text-center">
            <a
              href={instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-lg font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              <InstagramIcon className="h-5 w-5" />
              {instagram.followLabel}
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
