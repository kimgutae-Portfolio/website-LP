# Three distinct industry demo websites

These routes extend the existing local Next.js project; no hosted Site was registered,
no changes were committed or pushed, and no public deployment was performed.

## Routes and creative direction

- `/demo/sekka` — SEKKA / セッカ精工. Graphite, alloy-grey and safety-orange. Oversized
  precision typography, a calibration-style opening, linear image masks, technical tabs,
  illustrative product detail dialogs, quality philosophy, workshop and recruitment content.
- `/demo/nagi` — 旅宿 凪. Garden greens, ink and warm paper. Vertical Japanese verse, a slow
  opening dissolve, restrained photographic parallax, room gallery, morning/afternoon/evening
  scenes, two sample plans, FAQs and a twelve-second silent photo film loaded on demand.
  The room gallery is an oversized horizontal photo album at every breakpoint, with numbered
  captions, a draggable native position slider, previous/next buttons, keyboard navigation and
  accurate edge states. Native touch/trackpad scrolling is preserved; no wheel interception.
- `/demo/michiru` — みちる英語教室. Cobalt blue, warm white and yellow. A typographic Hello
  opening, natural classroom imagery, age-based course/fee/schedule tabs, interactive phrases,
  classroom and teacher-image storytelling, parent FAQs and a trial-information dialog.

The root LP links all three under its custom design examples. Each route has its own
favicon, metadata, self-canonical and noindex policy. Demos remain outside the sitemap.
All typography uses the existing Noto Sans JP setup.

## Editing

Each `components/demo/{sekka,nagi,michiru}/content.ts` holds editable demo content.
Its neighboring `*Website.tsx` and CSS module own the individual layout and art direction.
`shared/PremiumDemo.tsx` provides only accessible native dialogs, reduced-motion-aware
observation, small bounded scroll-linked camera moves, and common demo notices.
It never captures wheel or touch scrolling and has no continuous animation loop.
Header actions remain available during finite openings. No-JS content stays visible.

Mobile uses native page scrolling, smaller camera movement, safe-area-aware bottom actions,
horizontal sample/gallery browsing where appropriate, and image sizes that account for crops.
The English-school hero keeps the complete group composition rather than cutting off faces.
The inn's Google map is server-rendered through the existing MapEmbed component.

## Original imagery and prompt set

Mode: **built-in ImageGen**, not the fallback CLI/API.
Twelve individual image-generation calls produced original illustrative photographs.
The exact final prompt set and source paths are recorded in
[`scripts/demo-three-assets.json`](../../../scripts/demo-three-assets.json).

Final project media:

- `public/demo/sekka/{hero,parts,inspection,workshop}.webp`
- `public/demo/nagi/{hero,room,bath,meal}.webp`
- `public/demo/michiru/{hero,activity,classroom,teacher}.webp`
- `public/demo/nagi/photo-film.mp4`

Recreate the optimized WebP copies and the silent 12-second still-image film with
`node scripts/prepare-three-demos.mjs`. The original ImageGen outputs are preserved.
The film is explicitly labeled PHOTO FILM; it is not presented as live-action footage.

## Demonstration boundaries

All brands, company/lesson/room information, prices, imagery and people are fictional.
There are no invented testimonials, measured outcomes, named real teachers, industry
certifications, machining tolerances, street addresses, phone numbers or thermal-water claims.
The sample inn links to Rakuten Travel's homepage, not a fabricated live listing. School
LINE links go to the service homepage and are labeled as demonstration destinations.
Manufacturing/trial dialogs explain implementation options; no forms, uploads, payments,
actual bookings or collection of personal information are implemented.

## Verification

Run `npm run build`, then:

```text
node --test scripts/test-kasane-scroll.mjs scripts/test-sumitoki.mjs scripts/test-komorebi.mjs scripts/test-sui.mjs scripts/test-three-demos.mjs
```

Browser checks cover narrow mobile and desktop layouts, headline overflow, picture crops,
section navigation, process/course/time tabs, phrase switching, product and gallery dialogs,
FAQ expansion, menu closing, news dialogs, the photo film and external destination attributes.


## 人物を写さない写真への更新（2026-10-22）

人物・手の写った写真は `-no-people.webp` の編集版へ切り替えました。該当する写真フィルム、メインサムネイル、画像説明も更新済みです。元の生成記録は履歴として保持しています。現在の保存先・完全な編集プロンプトは `scripts/demo-people-free-assets.json`、更新内容は `components/demo/README-people-free-media.md` を参照してください。
