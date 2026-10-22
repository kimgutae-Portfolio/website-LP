# KOMOREBI children's clinic demo

Route: `/demo/komorebi`. A fictional pediatric clinic, not a real healthcare provider.
It is noindex and excluded from the main sitemap. No doctor credentials,
testimonials, medical outcomes, actual clinic address, or telephone number are
invented. There is no Instagram feed, patient-data form, or in-site booking system.

## Content and interactions

Edit `content.ts` for service descriptions, news, FAQs, first-visit belongings,
mascot greetings, and external destinations. All treatment and facility information
is illustrative and must be reviewed by the real clinic before adaptation.

- A storybook-style hero entrance brings the forest illustration into view; it
  never locks the page or blocks access to the header and mobile action bar.
- The greeting button animates the characters briefly and cycles three friendly
  messages, announced through a polite live region. No continuous animation.
- Scrolling reveals sections. Reduced-motion preferences disable all animation.
- Services and news open native dialogs with Escape and close controls.
- News category filters, native FAQ accordions, and a three-item belongings
  checklist work locally. No input is stored or transmitted.
- First-visit guidance is presented as a welcome letter beside a paper-style
  belongings memo, rather than numbered steps or a timeline. On mobile the
  letter and memo are stacked; hours and booking links remain directly below.
- Mobile navigation has keyboard focus management. Essential hours/access and
  booking actions remain available at the bottom of the screen.
- Reservation buttons explain the demo before linking to MEDICALPASS's official
  product website. Replace `clinic.reservationUrl` with the customer's actual
  authorized booking destination when adapting this demo.
- MapEmbed is rendered on the server and passed into the client component. The
  map shows Sakai city, not an actual clinic location.

The footer and relevant sections clearly label the clinic, hours, facilities,
images and services as fictional. The public consultation link points to the
[Ministry of Health, Labour and Welfare's #8000 information](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/newpage_55223.html),
checked when implementing this sample. Local consultation availability differs;
the site does not make diagnoses or provide symptom-specific advice.

## Original media / built-in ImageGen

Final assets are in `public/demo/komorebi/forest-friends.webp` and
`public/demo/komorebi/interior.webp`. The illustration retains alpha transparency.
No existing image or clinic's branding was used as a reference. The following
prompt set was used with the built-in image-generation tool, not the CLI fallback.

### Forest friends — final prompt

Use case: illustration-story. Asset type: original hero illustration for a fictional Japanese children's clinic website, not a UI mockup. A welcoming little forest clearing with three original friendly animal friends: a round caramel-brown bear wearing a moss-green scarf, an ivory rabbit wearing mustard overalls, and a tiny terracotta-orange bird. The bear gently waves one paw, the rabbit holds a small leaf, the bird sits on a low branch. A single softly curved leafy tree shelters them. Full bodies visible, generous breathing room around the silhouette. Style: premium Japanese picture-book illustration, matte gouache and softly textured colored paper, simple thoughtful shapes, charming imperfect edges, expressive tiny dark eyes and soft blush cheeks. Warm, calm, reassuring, not babyish. Palette is warm cream, sage and forest green, ochre yellow, caramel, restrained dusty coral. Wide composition, animals grouped along lower center, tree rising at the right, clean genuinely transparent background including around leaves. No typography, no labels, no logos, no watermark, no medical tools, no syringes, no red crosses. Art should feel commissioned for an elegant child-friendly clinic brand, not shiny 3D, not stock clipart.

### Clinic interior — final prompt

Use case: photorealistic-natural. Asset type: interior photograph for a fictional Japanese pediatric clinic website. A sunlit, exceptionally welcoming small contemporary pediatric clinic waiting room in Japan, with rounded oak reception counter, cream plaster walls, a sage-green upholstered bench, low wooden picture-book shelves, pale cork floor, a tiny child-sized oak chair and a leafy tree visible outside a large window. Quiet morning daylight, subtle natural texture, photographic realism, editorial architectural photography. Unoccupied, no people, no readable text, no logos, no medical devices, no watermark. Calm composition at child eye level, wide landscape, no ultra-wide distortion, no heavy bloom, no artificial glossy surfaces. Warm restrained cream, pale wood and forest green, polished and believable, not a luxury hotel.

Re-encode source PNGs without changing their content:
`node scripts/prepare-komorebi-media.mjs <forest-friends.png> <interior.png>`.

## Validation

Run `npm run build`, then `node --test scripts/test-komorebi.mjs`.
Browser QA covers the hero, mascot greeting, navigation, service/news dialogs,
filters, checklist, FAQ, booking example and small-screen table layout.
Typography is Noto Sans JP throughout. Styles are scoped in `komorebi.module.css`.
