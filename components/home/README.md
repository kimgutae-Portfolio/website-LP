# まちのWeb — connected opening and homepage

The opening and hero use the **same media frame**: the existing house mark sits over a small window, the window expands into the main design reel, and the headline arrives alongside it. It is not a separate loading screen. Desktop uses an editorial paper/film split; mobile uses a darkened film with readable foreground copy.

- `Hero.tsx`: server-rendered copy, demo references and prices from `site.config.ts`.
- `HeroExperience.tsx`: finite opening, native video, playback controls and visibility/preferences handling.
- `reel.ts`: caption timing for the three fictional demo scenes.
- `MobileNavigation.tsx` / `FloatingLineAfterHero.tsx`: small, isolated interactions. The shared header, brand, prices and service configuration stay server-rendered so column and legacy demo pages do not inherit the homepage film or a large configuration payload.
- `home.module.css`: shared paper/green visual direction, header, hero, service introduction. No CSS animation is infinite.
- `scripts/prepare-home-reel.mjs`: builds two silent H.264 reels from existing people-free demo photographs. Original source photographs and demo films are not overwritten.

## Media provenance

1. KASANE: `public/demo/kasane/hero-no-people.webp`
2. SUMITOKI: `public/demo/sumitoki/hero-no-people.webp`
3. NAGI: `public/demo/nagi/hero.webp`

These are **illustrative fictional demo sites**, not completed client work or footage of まちのWeb’s office. The visible film caption makes this distinction clear.

## Progressive enhancement

The poster, headline, links and prices are present in server HTML. The opening completes through finite CSS even without JavaScript; its default styles are the final visible state. It never locks scrolling or traps focus. Tab, Escape, pointer interaction, scrolling and deep links finish it immediately. `prefers-reduced-motion` removes the opening before hydration.

No video source is mounted until the opening has finished and the hero is visible. Reduced motion, data saver and very slow connections keep the still poster until the visitor explicitly requests playback. A rejected autoplay request leaves a usable play button. The film pauses offscreen and when the document is hidden; a visitor’s pause choice is preserved. Mobile and desktop load separate encodes. The floating LINE control appears after leaving the hero so it does not cover the film caption or primary actions.

Homepage sequence: hero → recent design collection → customer concerns → ongoing support → starting prices → flow → columns → FAQ/contact. Existing prices and service conditions remain unchanged.

Verification: production build, `scripts/test-home-hero.mjs`, existing regression tests, and real browser checks at 320/390px plus desktop. Check menu close behavior, links, pause/resume, chapter captions and layout overflow. Do not submit real contact messages while testing.
