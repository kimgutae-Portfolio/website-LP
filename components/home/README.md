# まちのWeb — service-first homepage

2026-10-26: the first screen now presents the service, not fictional demo footage.
The compact opening uses a deep-green architectural house/window illustration
(inline decorative SVG, no image request), warm paper pricing panel, and large
side-by-side initial/monthly prices. Mobile uses the small viewport height with
content-driven overflow; essential pricing must fit 320×568 and 390×844 screens.
「お店の魅力を、新しいお客様へ。」 leads with customer acquisition, not technology.
Short supporting copy: 「見つけてもらう。選んでもらう。」
The eight examples are the second main section, immediately after the opening.
Long lead, optional visits and technical strengths follow the examples in
`ServiceStrengths.tsx`. No guaranteed increase in customers, search ranking, or
complete security is claimed. WordPress comparisons are not used in sales copy.

- `Hero.tsx`: server-rendered headline, three short keywords, basic initial fee 0 yen,
  monthly fee from 5,500 yen, adjacent scope / extra-estimate / minimum-term conditions.
  Primary CTA is the real business LINE link (`cta_location: hero`).
  LINE actions in hero/header/pricing/journal use the shared LINE green token.
- `HeroExperience.tsx` / `hero.module.css`: continuous 2.6s sunrise → camera approach
  → sliding doorway → live hero. The actual SVG background is the opening scene,
  not a separate film or loading screen. Mobile has its own camera geometry.
  Completion comes from the camera animation plus a 2.9s safety timeout. Scrolling,
  pointer/focus, Escape/Tab or a deep hash finish immediately; reduced motion skips
  the sequence. Content is server-rendered, and CSS alone finishes without JS.
  No scroll lock, autoplaying video, remote media or continuous motion is used.
- `home.module.css`: shared header, customer concerns and ongoing-support styles.
- `MobileNavigation.tsx` / `FloatingLineAfterHero.tsx`: retain native mobile navigation
  and floating LINE after the hero.

The old people-free reels and preparation script remain as reusable assets, but
the homepage no longer loads them. Demos remain available in the next section.
Visits are optional: initial contact may be LINE / email, with nearby in-person
consultation offered when requested.

Prices / metadata / structured data / share image / legal copy share `site.config.ts`.
Additional pages, bespoke design / animation and feature development are quoted
before work. Minimum term and monthly support conditions remain unchanged.

Verify with build, all `scripts/test-*.mjs`, and 320/390px plus desktop browser QA.
No real contact forms should be submitted in QA.
