# まちのWeb — service-first homepage

2026-10-26: the first screen now presents the service, not fictional demo footage.
「こうしたい」を、自由につくる。 + WordPress-free custom development,
search-friendly structure, and security-conscious scope / maintenance.
No blanket security advantage over WordPress or guaranteed search ranking is claimed.

- `Hero.tsx`: server-rendered headline, three strengths, basic initial fee 0 yen,
  monthly fee from 5,500 yen, adjacent scope / extra-estimate / minimum-term conditions.
  Primary CTA is the real business LINE link (`cta_location: hero`).
- `HeroExperience.tsx` / `hero.module.css`: brief rule-and-text reveal, no loading gate,
  scroll lock, autoplaying video, stock images, or fake project presentation.
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
