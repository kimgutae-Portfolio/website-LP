# 炭と季 / SUMITOKI restaurant showcase

Route: `/demo/sumitoki`. A fictional Japanese seasonal charcoal bistro.
The route is noindex, self-canonical, and excluded from the main sitemap.
It is a custom-plan showcase, separate from the three basic templates and KASANE.

## Edit content

- Restaurant, hours, menu, prices, two news items and exactly three SNS posts:
  `components/demo/sumitoki/content.ts`.
- External booking destination: `restaurant.reservationUrl`.
  The current demo goes to `https://tabelog.com/`, not a real store booking page.
  All booking links open a new tab with `noopener noreferrer`; there is no
  reservation form, booking API, payment, or personal-data collection in this demo.
- SNS is a manually curated three-image horizontal feed with large, square photos,
  native swipe/scroll snapping, and previous/next arrows. On mobile, the next photo
  peeks into view. Detail dialogs are unchanged. It does not scrape Instagram,
  download posts, or promise automatic sync.
  Replace the photos and captions, or add a customer's authorized widget later.
- The map shows Sakai city, not a fictional street address or an actual restaurant.
- All restaurant names, prices, dishes, capacities and business hours are examples.

## Presentation and accessibility

Noto Sans JP is used throughout. The palette is charcoal, warm ivory and muted amber.
The curtain-style opening has no visible skip control; Escape or Tab continues
immediately. Deep links and reduced-motion settings bypass it. A no-JavaScript
fallback keeps page content available.

The three hero scenes crossfade every eight seconds. The pause control, browser
visibility, menu/dialog state and reduced-motion preference are respected.
Menus use keyboard-operable tabs; food cards can be swiped natively on mobile.
The three SNS posts, news and photo film open native dialogs. Mobile navigation
has focus management. Reservation links remain visible in a mobile bottom bar.

After a production build, run `node --test scripts/test-sumitoki.mjs` to verify
the three posts, external destination, optimized assets, noindex, and absence of
any reservation form in the rendered page.

## Generated media

Created with the built-in ImageGen tool (not the fallback API/CLI).
The final project-bound assets are:

- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/hero.webp`
- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/interior.webp`
- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/fish.webp`
- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/vegetables.webp`
- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/dessert.webp`
- `/Users/gimgutae/Developer/website-LP/public/demo/sumitoki/photo-film.mp4`

The 12-second silent film is assembled from generated still photographs with
slow camera moves and dissolves. It is explicitly labelled PHOTO FILM, not live video,
and is fetched only when opened. Originals remain untouched in the ImageGen folder.
Rebuild with `node scripts/prepare-sumitoki-media.mjs <hero> <interior> <fish> <vegetables> <dessert>`.

### Final ImageGen prompt set

#### hero

Use case: photorealistic-natural. Asset: cinematic website hero for a fictional Japanese seasonal charcoal bistro. Create a horizontal landscape editorial photograph, 1536x1024 composition. Low close viewpoint across a genuine Japanese binchotan charcoal grill: glowing embers, a few small orange flames, beautifully charred seasonal mushrooms and leek, a chef's hand using realistic metal tongs near the right side only. The left third is dark, atmospheric negative space for vertically set website text. The grill and ember details occupy the central lower/right frame; distant small restaurant lights are warm soft bokeh. Rich natural near-black shadows, toasted brown wood, amber fire, subdued cream highlights. Authentic service, subtle wisps of smoke, tactile imperfection, restrained high-end food magazine photography, not a CGI render. No text, no logo, no watermark, no excessive sparks, no montage or borders.

#### interior

Use case: photorealistic-natural. Asset: restaurant atmosphere photograph for a fictional Japanese seasonal charcoal bistro. Horizontal landscape 1536x1024 composition. Intimate twelve-seat Japanese charcoal bistro at blue hour, long dark walnut counter, simple oak chairs, small amber pendant lights, textured warm plaster walls, an open charcoal kitchen at the end, one small seasonal branch in a handmade vase. Editorial architecture photography from the entrance at eye level, human warmth but no visible customers or faces. The room feels genuinely small and welcoming rather than extravagant; deep green-black shadows, toasted wood and warm ivory light, realistic wear and uneven grain. Natural depth and believable geometry, softly lit, no sterile hotel-lobby aesthetics. No readable signage, no text, no logos, no watermarks.

#### fish

Use case: photorealistic-natural. Asset: seasonal dish photograph for a fictional Japanese charcoal bistro. Horizontal landscape 1536x1024 composition; subject centered with enough margin to crop square. A single elegant but generous serving of charcoal-grilled sea bream with crisp golden skin on an irregular off-white handmade ceramic plate, served with a charred shishito pepper, a little sudachi citrus, autumn mushrooms, and a restrained natural sauce. Dark walnut counter underneath, warm directional side light, imperfect ceramic glaze, delicious realistic fish texture, shallow depth of field. Premium Japanese food editorial photography, honest cooking, not theatrical fine-dining foam, no shiny plastic appearance. No text, no logo, no people, no watermark, no collage.

#### vegetables

Use case: photorealistic-natural. Asset: seasonal vegetable dish for a fictional Japanese charcoal bistro. Horizontal landscape 1536x1024 composition, centered dish and generous margin for square cropping. A dark handmade ceramic plate holding charcoal-grilled autumn vegetables: wedge of kabocha pumpkin with blistered edges, shiitake mushroom, long leek, a little aubergine, finished with a subtle miso glaze and a few fresh leaves. A small linen napkin partly visible at one edge, dark warm wood tabletop, warm amber side lighting, low-saturation authentic textures, tactile visible ceramic grain. Realistic high-end food magazine photograph, cozy and delicious, restrained plating. No text, logo, watermark, people, or collage.

#### dessert

Use case: photorealistic-natural. Asset: dessert and evening coffee photograph for a fictional Japanese seasonal bistro. Horizontal landscape 1536x1024 composition with centered food and margin for square cropping. A small handmade cream-colored ceramic plate with a generous slice of roasted hojicha basque cheesecake, caramelized top and soft interior, a little whipped cream and a toasted walnut. An unbranded tiny ceramic espresso cup softly out of focus behind it, warm walnut counter and very dark restaurant background, soft amber lamplight falling diagonally across the cake. Tactile, natural, intimate premium food editorial photograph, slightly imperfect and appetizing rather than glossy advertising. No text, logos, watermarks, packaging, faces, or collage.


## 人物を写さない写真への更新（2026-10-22）

人物・手の写った写真は `-no-people.webp` の編集版へ切り替えました。該当する写真フィルム、メインサムネイル、画像説明も更新済みです。元の生成記録は履歴として保持しています。現在の保存先・完全な編集プロンプトは `scripts/demo-people-free-assets.json`、更新内容は `components/demo/README-people-free-media.md` を参照してください。
