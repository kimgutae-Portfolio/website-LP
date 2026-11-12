# sui hair atelier — premium salon demo

Route: `/demo/sui`. A fictional Japanese hair atelier, noindex and excluded from the
main sitemap. The photographs show a fictional space and tools, not real customer
results, reviews, or a business location.

## Content and interactions

- `content.ts` defines four hair concerns, two menu groups, prices, news, FAQ, and the
  external reservation/LINE destinations. Each concern points to a menu item by ID,
  so the price is shared with the price table instead of being maintained twice.
- The guide uses native disclosures; opening an item shows the consultation and an
  indicative menu. Its price link selects the appropriate category and highlights
  that menu in the price table. The old `#sui-lookbook` hash still reaches the guide.
- The opening parts charcoal curtains to reveal the salon. Mobile has a dedicated
  portrait crop of the mirror and chair, a shorter opening, smaller camera moves,
  and a compact hero for short screens. No video is required on the first screen.
- Scene motion uses IntersectionObserver and scroll/resize frames only. It does not
  lock or hijack scrolling, pauses behind overlays, and respects reduced motion.
- The film and news open in native dialogs. The menu and FAQs remain accessible from
  the keyboard. Mobile navigation traps focus and restores it when closed.
- The booking bar keeps the external reservation site on the left and LINE on the
  right. These links are demonstration destinations; there is no real booking,
  payment or form. The map shows Sakai city, not an actual address.

## Media

- `public/demo/sui/interior.webp`: existing people-free interior, unchanged.
- `public/demo/sui/interior-mobile.webp`: optimized portrait crop of that interior.
- `public/demo/sui/station-tools.webp`: new still life generated with built-in ImageGen,
  not the CLI fallback, then optimized to WebP.
- `public/demo/sui/salon-film.mp4`: 12-second silent sequence of the room, tools,
  window light and a tighter chair/mirror view. Mounted on request only.
- `public/demo/previews/sui-salon.webp`: updated capture of the real desktop first screen.

Rebuild the portrait crop, detail image and video with
`node scripts/prepare-sui-media.mjs <people-free-station-photo>`. The film is a
montage of still images, not live-action footage.

### Final ImageGen prompt — station tools

Use case: photorealistic-natural
Asset type: wide editorial detail photograph for the sui hair atelier demo website and its silent photo film.
Scene: an empty, small Japanese hair atelier, photographed close to a styling station. Soft side daylight and warm greige plaster, a brushed stainless steel worktop with fine wear, soft shadow from a tall window. A closed pair of professional hairdressing scissors, a matte black cutting comb and a neatly folded off-white salon towel, placed with ordinary working spacing. Cropped lower edge of the tall simple mirror in the background, reflecting only an empty plaster wall and sunlight. Quiet restrained documentary still life, tactile surfaces, natural color balance, no glossy CGI appearance. Landscape 3:2 framing, objects close to center, no lettering or logos. No people, hands, hair models, mannequins, silhouettes, or people reflected in the mirror. No text or watermark.

## Validation

Run `npm run build`, then `node --test scripts/test-*.mjs`. Check the hero and guide
at 320px and 390px, price table selection, the photo film, and the home preview.
