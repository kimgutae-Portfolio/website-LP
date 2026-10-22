# KASANE corporate design demo

Route: `/demo/kasane`. This is a fictional Japanese design-and-construction company.
All company, project and news information is illustrative. There are no real client claims.
The demo is `noindex` and excluded from the sitemap.

## Media

Built-in ImageGen was used to create these four original images, stored in
`public/demo/kasane/` as optimized WebP files:

- `hero.webp`: Japanese creative workplace in cedar, oak, concrete and glass, courtyard tree, warm afternoon light; architectural editorial photography, landscape, no logos or text.
- `workplace.webp`: renovated workplace, oak meeting table, olive chairs, terracotta lights and reeded glass; landscape architectural photography, no people or text.
- `atelier.webp`: Japanese neighborhood commercial building with terracotta facade, glazing and maple planting; landscape architectural photography, no logos or text.
- `craft.webp`: designers' hands choosing ash wood, tile, concrete and linen beside an architectural model; documentary editorial photography, no faces or logos.

`brand-film.mp4` is a 12-second silent motion film made from these photographs
with slow camera moves and dissolves. It is not live-action footage.
It is requested only after the visitor opens the film; reduced-motion preferences
are respected throughout the page's decorative animations.

The media can be reproduced from the original PNGs using
`node scripts/prepare-kasane-media.mjs <hero> <workplace> <atelier> <craft>`.

## Interactions

- Keyboard-accessible mobile navigation with focus management.
- Project filters and project detail dialogs.
- News detail dialogs and a recruitment sample.
- Native video controls in the brand film dialog.
- A validated demo contact form. It does not send or persist entered data.

CSS is scoped in `kasane.module.css`; existing demo styles remain independent.

Typography uses the root layout's Noto Sans JP for all Japanese and Latin text.
Actions use text labels, straight underlines and restrained rectangular form buttons;
project details are opened from the image or the explicit 「詳しく見る」 label.

## Opening sequence

The top-level entry opens with a brief KASANE identity, then two paper-colored
panels slide apart like an architectural threshold. The hero photograph makes a
slow forward reveal and its copy appears in sequence. No extra media is downloaded.
The panels finish in 2.3 seconds after a readiness wait capped at 700ms.
There is no visible skip button. Escape or Tab lets keyboard visitors continue
immediately; direct section links and reduced-motion preferences bypass the opening.
The content remains available
without JavaScript, and completion has a timeout fallback.

## Section navigation

- Mouse/trackpad visitors move one chapter per gesture with a 680–980ms eased
  transition. Trackpad inertia is consumed until the gesture stops, so one flick
  does not skip several sections.
- Chapters fill at least the visible area below the measured sticky header.
  Oversized chapters advance by overlapping screens before moving on, so no
  text, image, or footer content becomes unreachable.
- Touch devices retain native scrolling with proximity snapping, rather than
  intercepting touch gestures. Reduced-motion visitors retain native scrolling.
- Page Up/Down, arrow keys, Space, Home/End, header links, and the desktop section
  rail are supported. Links focus the destination heading without a second jump.
- The opening, mobile menu, and dialogs pause chapter controls; form fields,
  nested scrollers, pinch zoom, and horizontal gestures are not intercepted.
- Route-specific document scroll settings are restored on unmount. A stable
  scrollbar gutter prevents overlay dialogs from moving the aligned content.

Run `node --test scripts/test-kasane-scroll.mjs` for scroll-boundary tests.


## 人物を写さない写真への更新（2026-10-22）

人物・手の写った写真は `-no-people.webp` の編集版へ切り替えました。該当する写真フィルム、メインサムネイル、画像説明も更新済みです。元の生成記録は履歴として保持しています。現在の保存先・完全な編集プロンプトは `scripts/demo-people-free-assets.json`、更新内容は `components/demo/README-people-free-media.md` を参照してください。
