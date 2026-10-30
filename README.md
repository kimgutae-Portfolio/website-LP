# 지역 사업자용 홈페이지 서비스 LP

[lp-spec.md](./lp-spec.md) 사양대로 구현한 1페이지 LP.
Next.js (App Router, 정적 생성) + Tailwind CSS v4.

## 개발 / 빌드

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 프로덕션 빌드 (Vercel 배포 전 확인용)
```

## 메인 디자인 (2026-10-30)

기존 Next.js 프로젝트와 배포처를 유지하면서, 동네 상점과 해돋이를 중심으로 메인 브랜드를 정리했습니다.
Noto Sans JP, 짙은 초록·크림·황토색을 사용하며, 첫 화면의 0엔·5,500엔 가격과 LINE 상담은 서버 렌더링됩니다.
오프닝은 짧은 SVG 애니메이션이고, 스크롤·키보드·모션 감소 설정을 방해하지 않습니다.

- `components/home/TownScene.tsx`: 상점 일러스트와 문이 열리는 연출
- `components/pricing/gallery.module.css`: 두 번째 섹션의 큰 제작 견본 갤러리
- `public/demo/previews/`: 실제 데모 첫 화면을 캡처한 WebP 8종 (데모 디자인 수정 시 갱신)
- 제작 범위·운용 안내는 네이티브 펼침 메뉴에 유지되며, 가격·계약 조건 자체는 변경하지 않았습니다. 결제방법은 메인에서 제외하고 기존 법적 고지·개인정보처리방침에만 남깁니다.
- 검증: `npm run build` 후 `node --test scripts/test-*.mjs`

## 방문·LINE 버튼 클릭 측정

무료 GA4 전용 속성과 `line_click` 이벤트를 사용합니다. LINE 이동은 그대로 유지하며
측정 허용 여부는 방문자가 선택할 수 있습니다. 이름·이메일·대화 내용은 이벤트에 보내지 않습니다.
측정 ID, 확인 방법, 광고 연결 전 남은 작업은 [측정 안내](./components/analytics/README.md)를 참조하세요.

## 커스터마이즈 — `site.config.ts` 하나만 수정

상호 / 가격 / 카피 / 테마 색 / 데모 링크를
[site.config.ts](./site.config.ts) 에서 관리한다.
고객용 템플릿으로 재사용할 때도 이 파일 + `public/` 이미지만 교체하면 된다.

공개 전에 반드시 교체할 항목 (`【要変更】` 주석 검색):

| 항목 | 위치 |
|---|---|
| 屋号 (siteName) | `meta.siteName`, `footer.operator` |
| 도메인 | `meta.url` |
| LINE 친구추가 URL | `line.addFriendUrl` |
| LINE QR 이미지 | `line.qrImage` (`public/`에 이미지 추가 후 경로 지정) |
| 운영자 이름·사진 | `owner.name`, `owner.photo` |
| 시작 요금 | `pricing.initialCost` / `pricing.monthlyFrom` (모두 세금 포함, 상담 후 견적) |
| 제작 견본 8종 | `websiteExamples` / `demos` (기존 3개 템플릿은 메인에서 제외, URL은 유지) |
| 特商法 표기 | [app/tokushoho/page.tsx](./app/tokushoho/page.tsx) 의 準備中 항목 |

## 구조

```
site.config.ts          ← 사이트 고유 정보 전부 (색 포함)
app/
  layout.tsx            ← 폰트(Noto Sans JP)·메타·테마 색 주입
  page.tsx              ← 섹션 조립
  tokushoho/page.tsx    ← 特定商取引法に基づく表記 (placeholder)
  api/contact/route.ts  ← 문의 폼 메일 전송 (Resend)
components/
  Hero, Pain, Demo, Pricing, Flow, Owner, Faq, Cta   ← 섹션 컴포넌트
  FloatingLine          ← 플로팅 LINE 버튼 (고객 템플릿에도 기본 탑재)
  Header, Footer, LineCta, ContactForm, SectionHeading, icons
```

## 문의 폼 메일 전송

`app/api/contact/route.ts` 는 Resend를 사용합니다. `RESEND_API_KEY`와 `CONTACT_TO_EMAIL` 설정이 필요하며,
인증된 발신 도메인은 `CONTACT_FROM_EMAIL`에 지정합니다. 이번 디자인 검증에서는 실제 문의를 발송하지 않습니다.
