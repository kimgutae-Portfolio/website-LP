# まちのWeb — service-first homepage

2026-11-02: the first screen names the service before asking visitors to infer it:
「お店・会社の ホームページ制作。」 is the main heading, followed by the concrete
「デザインから、公開後の更新まで。」 and real, directly viewable examples.
Actual screenshots of all eight existing demos replace the town illustration.
Small cards circle left-to-right in a CSS 3D ring rather than one large slide.
It waits for the opening and first image, respects reduced motion, and pauses on
hover, keyboard focus, manual navigation or when the page is hidden. A visible
pause/resume control is always available. The town
SVG remains a reusable asset but is not loaded by the homepage. Warm paper pricing
and side-by-side initial/monthly prices remain. On mobile the order is the explicit
heading, pricing and consultation, then the compact orbit. Small screens must
retain readable prices without horizontal overflow. The large examples button,
first-message hint, price-details shortcut and minimum-term line have been removed
from this first screen; full terms remain in the pricing section.
The eight examples are the second main section, immediately after the opening.
Long lead, optional visits and technical strengths follow the examples in
`ServiceStrengths.tsx`. No guaranteed increase in customers, search ranking, or
complete security is claimed. WordPress comparisons are not used in sales copy.

- `Hero.tsx`: server-rendered headline, three short keywords, basic initial fee 0 yen,
  monthly fee from 5,500 yen and adjacent scope / extra-estimate conditions.
  Minimum-term conditions are retained in the full pricing section.
  A smaller link under the preview opens the complete examples section. Consultation
  remains the real business LINE link (`cta_location: hero`).
  LINE actions in hero/header/pricing/journal use the shared LINE green token.
- `HeroExperience.tsx` / `HeroOpening.tsx` / `hero.module.css`: a 3.2s spatial entrance.
  A large sun rises between full-viewport doors, the doors slide apart, and the sun
  lands on a small circular accent, not a dominant illustration. The opening itself
  now says 「ホームページ制作・リニューアル」. The page approaches behind it;
  the screen itself never fades out. Sun coordinates use untransformed layout
  geometry. Hydration measures the destination before playback; two preparation
  frames let the browser paint and promote the moving surfaces first. The scene
  and copy approach as one layer instead of several nested animations. Layout
  reads are grouped and cached: native scrolling only adjusts cached coordinates,
  resize invalidates them, and event updates are coalesced to one animation frame.
  Temporary compositor hints are removed when the entrance completes. There is no
  continuous JavaScript animation loop. A separate CSS safety hides the initial
  doors without JavaScript, leaving the underlying page in its normal static pose.
  Completion comes from the stage animation plus a 3.6s safety timeout. Deep links
  keep their scroll position and defer an unseen opening until the headline appears.
  Small scrolls and non-interactive touches do not cancel it; actionable clicks,
  focus, Escape/Tab or leaving the hero can finish immediately. Reduced motion skips
  the stage. It is decorative, pointer-transparent, and CSS alone dismisses it
  without JS. The real headline, prices and links remain server-rendered underneath.
  No scroll lock, autoplaying video, remote media or frame-by-frame JS animation is used.
- `home.module.css`: shared header, customer concerns and ongoing-support styles.
- `HeroShowcase.tsx`: eight small real screenshot links in a 42s CSS 3D orbit,
  with pause/resume and Arrow/Home/End keyboard navigation. Focused links face
  forward; reduced motion and no-JS use a static, horizontally scrollable row.
  Only the first image is prioritised; there is no timer or JS animation loop,
  and these are explicitly fictional examples, not claimed customer work.
- `MobileNavigation.tsx` / `FloatingLineAfterHero.tsx`: retain native mobile navigation
  and floating LINE after the hero.

The old people-free reels and preparation script remain as reusable assets, but
the homepage no longer loads them. Demos remain available in the next section.
Visits are optional: initial contact may be LINE / email, with nearby in-person
consultation offered when requested.

2026-10-28: `ServiceStrengths.tsx` is now a server-rendered, locally relevant
service guide (`services.module.css`). It explains the information needed by
restaurants, salons, schools and companies, links to clearly labelled fictional
examples, and distinguishes the basic one-page scope from extra pages / forms /
integrations. The guide covers Sakai-based optional visits without disclosing a
home address or implying a storefront. No actual customer results or ranking
guarantees are invented. Metadata and local FAQ share the public service scope.
`siteConfig.localService.updatedAt` records this substantive homepage update and
is used for its sitemap lastmod; update it only when homepage content changes.

Prices / metadata / structured data / share image / legal copy share `site.config.ts`.
Additional pages, bespoke design / animation and feature development are quoted
before work. Minimum term and monthly support conditions remain unchanged.

Verify with build, all `scripts/test-*.mjs`, and 320/390px plus desktop browser QA.
No real contact forms should be submitted in QA.

2026-11-02: explicit paid landings (gclid/dclid/gbraid/wbraid or a paid
utm_medium) bypass the opening. A tiny, homepage-only head bootstrap sets a fixed
presentation flag before first paint; HeroExperience completes before paint on
hydration. The static homepage, canonical, real prices and ordinary-visit opening
remain unchanged. No identifiers are persisted or sent, and this flag does not
grant measurement consent. Consultation copy now states what a customer gets:
help sorting the content and estimated cost, with a concrete first-message example.
LINE remains primary, with the existing form/email alternatives and price limits.
The floating LINE action is hidden while the contact section is visible, so it
does not cover the section's own LINE button or form on mobile.
