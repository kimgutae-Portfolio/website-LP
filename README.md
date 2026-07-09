# 지역 사업자용 홈페이지 서비스 LP

[lp-spec.md](./lp-spec.md) 사양대로 구현한 1페이지 LP.
Next.js (App Router, 정적 생성) + Tailwind CSS v4.

## 개발 / 빌드

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 프로덕션 빌드 (Vercel 배포 전 확인용)
```

## 커스터마이즈 — `site.config.ts` 하나만 수정

상호 / 가격 / 카피 / 테마 색 / 데모 링크 / 캠페인 배지까지 전부
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
| 캠페인 배지 ON/OFF | `pricing.campaign.enabled` |
| 데모 사이트 링크 | `demos.items[].url` (빈 문자열이면 「準備中」 표시) |
| 特商法 표기 | [app/tokushoho/page.tsx](./app/tokushoho/page.tsx) 의 準備中 항목 |

## 구조

```
site.config.ts          ← 사이트 고유 정보 전부 (색 포함)
app/
  layout.tsx            ← 폰트(Noto Sans JP)·메타·테마 색 주입
  page.tsx              ← 섹션 조립
  tokushoho/page.tsx    ← 特定商取引法に基づく表記 (placeholder)
  api/contact/route.ts  ← 문의 폼 stub (TODO: Resend / Supabase / LINE 알림)
components/
  Hero, Pain, Demo, Pricing, Flow, Owner, Faq, Cta   ← 섹션 컴포넌트
  FloatingLine          ← 플로팅 LINE 버튼 (고객 템플릿에도 기본 탑재)
  Header, Footer, LineCta, ContactForm, SectionHeading, icons
```

## 폼 전송 확장 (추후)

`app/api/contact/route.ts` 는 현재 서버 로그로만 기록하는 stub.
Resend 메일 전송 → Supabase 저장 → LINE 알림 순으로 확장 예정 (spec §6 참고).
