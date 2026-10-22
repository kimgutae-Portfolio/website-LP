# sui hair atelier — premium salon demo

Route: `/demo/sui`. A fictional Japanese hair atelier, separate from the basic LUCE template.
Noindex, self-canonical and excluded from the main sitemap. No real customer results,
reviews, awards, stylist credentials, telephone numbers, or street addresses are invented.
All photographs are original generated model or salon images, explicitly labeled as such.

## Content and interactions

- Edit `content.ts` for four style looks, design notes, two menu groups, prices, news,
  FAQs, opening hours, and external booking/LINE links.
- The opening presents the wordmark on charcoal, then parts two full-screen curtains.
  It lasts about two seconds after readiness, never captures pointers or locks scrolling,
  and gives way to staggered, line-masked typography and a finite camera move.
- Native scroll drives bounded photographic parallax in the hero, lookbook, craft and
  salon scenes. The salon frame expands as it enters the viewport; lookbook images reveal
  through individual shutters, including after category filtering. The desktop craft
  photograph briefly stays with the design notes. No wheel, touch or keyboard scrolling
  is intercepted. Mobile gets smaller movements and a non-sticky craft photograph.
- `useSuiMotion.ts` observes visible scenes and paints once per scroll/resize frame, with
  no continuous animation loop. It pauses scene updates behind dialogs and menus and
  while the document is hidden. Reduced-motion preferences are honored live; a noscript
  fallback removes the opening and all content remains available without motion code.
- Mobile uses a portrait from the same model-image set above its caption, rather than
  cropping the desktop landscape across the face. Image source sizes account for
  object-cover cropping so hair details remain sharp in portrait frames.
- The lookbook uses an asymmetrical editorial grid, category filters, and native detail
  dialogs with previous/next controls, Arrow keys, Escape and focus restoration.
- Menu categories are keyboard-operable tabs. FAQs use native details elements.
- Mobile navigation traps keyboard focus and makes the background inert; closing restores
  focus. Mobile booking actions remain visible, with reservation on the left and LINE on the right.
- Reservation and LINE links open official service homepages for this demonstration.
  Replace them with the customer's authorized store-specific destinations when adapting.
  No booking form, payment, sign-in, or collection of personal information is implemented.
- News detail dialogs show sample notices. The film opens on demand in a native dialog.
- MapEmbed stays server-rendered and is passed into the client. The map shows Sakai city,
  not an actual salon location.

## Original media / built-in ImageGen

Final project assets: `public/demo/sui/hero.webp`, `bob.webp`, `short.webp`, `wave.webp`,
`interior.webp`, `craft.webp`, and `photo-film.mp4` in the same directory.
The built-in image-generation tool was used, not the CLI fallback. Source prompts follow.
The 12-second silent film is assembled from these original still images with gentle
camera moves and dissolves. It is clearly labeled PHOTO FILM, not live-action footage.

Re-encode images and regenerate the film using
`node scripts/prepare-sui-media.mjs <hero> <bob> <short> <wave> <interior> <craft>`.

## Validation

Run `npm run build`, then `node --test scripts/test-sui.mjs`.
Browser QA covers the hero, model crops, category filters, style details and keyboard
controls, price tabs, FAQ, news dialogs, video, mobile menu, booking destinations and
responsive layout. Typography is Noto Sans JP throughout, with scoped CSS.

## Final prompt set

### hero

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Wide landscape hero photograph. An adult Japanese woman in her early thirties, shoulder-length dark chestnut hair with airy face-framing layers, subtly imperfect natural movement, wearing a charcoal crewneck top. Three-quarter portrait, relaxed thoughtful gaze just past the camera, head and shoulders fully visible. Position the subject in the right half against a warm light-grey plaster studio wall, with calm usable empty wall on the left for website copy. Soft directional window light from the side, muted off-white and charcoal palette, modern Japanese fashion editorial, hair is the focal point. A believable elegant everyday person, not a celebrity.

### bob

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Vertical portrait, head to upper torso fully visible. An adult Japanese woman in her late twenties with a precise chin-length dark brown blunt bob, fine soft fringe, subtle tucked ear, wearing an ivory cotton shirt. She turns her head slightly to show the clean hair silhouette and natural texture at the jaw. Warm grey studio wall, off-center editorial composition, minimal makeup, realistic skin and hair. No jewelry distracting from the cut, no smile-to-camera commercial pose.

### short

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Vertical portrait, head and shoulders fully visible. An adult Japanese woman in her mid-thirties with a sophisticated short pixie-bob, soft rounded silhouette, dark hair with a natural ash-brown tone and long side fringe. A slate-blue linen top, three-quarter profile looking away, a little air between individual hair strands. Pale grey-beige studio wall, quiet fashion editorial framing, realistic skin, softly shaped light that emphasizes the haircut outline, no exaggerated makeup.

### wave

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Vertical portrait, head and shoulders fully visible. An adult Japanese man in his late twenties with medium-length soft naturally wavy dark hair, loose fringe and gently textured sides, wearing a simple black knit top. Relaxed three-quarter view, calm expression, natural unretouched skin, modern gender-neutral hair fashion editorial. Muted warm-grey plaster background, softly directional daylight, healthy but believable hair texture. No jewelry, no intense model pose.

### interior

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Wide landscape architectural editorial photograph of a small, refined independent Japanese hair atelier, unoccupied. Three black leather salon chairs, generous gaps between stations, tall simple rectangular mirrors, a pale textured plaster wall, brushed stainless steel ledge, warm-grey microcement floor, one understated dark walnut cabinet, a large side window with soft daylight and a small sculptural branch in a vase. A lived-in working salon, restrained functional elegance, not a hotel or luxury showroom, no rounded arches, no people, no readable product labels.

### craft

Use case: photorealistic-natural. Original editorial photography for a fictional premium Japanese hair atelier website, not a UI mockup. Photorealistic, subtle film grain, authentic hair strands and natural skin texture, restrained retouching, quiet sophistication, soft neutral daylight. No text, no logos, no watermarks, no collage, no split screen, no beauty-filter skin, no exaggerated shine. Close editorial landscape photograph of a hair stylist's two natural anatomically correct hands carefully separating and combing a small section of an adult client's dark bob near the nape, seen from behind. Client wears a simple charcoal cutting cape, client's face and stylist's face outside the frame. One plain black comb, subtle hair texture and considered hand positioning, blurred warm-grey salon mirror background, soft daylight. No scissors, no extra fingers, no branded tools. The feeling is careful consultation and craftsmanship rather than a staged advertisement.
