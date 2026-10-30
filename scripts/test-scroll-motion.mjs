import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const variants = ["fade", "wipe", "slide-left", "slide-right", "settle", "gallery"];

test("scroll choreography is opt-in and still reveals once with an observer", async () => {
  const source = await read("components/Reveal.tsx");
  for (const variant of variants) assert.ok(source.includes(`"${variant}"`));
  assert.match(source, /variant\?: RevealVariant/);
  assert.match(source, /"data-reveal": variant/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /querySelector\("\[data-gallery-stage\]"\)/);
  assert.doesNotMatch(source, /requestAnimationFrame|scrollTo\(|addEventListener\("(?:scroll|wheel|touchmove)"/);
});

test("main sections have distinct motion, while demo pages retain the default", async () => {
  const html = await read(".next/server/app/index.html");
  for (const variant of variants) assert.ok(html.includes(`data-reveal="${variant}"`), variant);
  assert.equal((html.match(/data-gallery-card="(?:true)?"/g) || []).length, 8);
  assert.match(html, /data-gallery-stage="(?:true)?"/);
  for (const slug of ["sumitoki", "sui", "komorebi", "kasane", "sekka", "nagi", "michiru", "niwato"]) {
    assert.doesNotMatch(await read(`.next/server/app/demo/${slug}.html`), / data-reveal="(?:fade|wipe|slide-left|slide-right|settle|gallery)"/);
  }
  const flow = await read("components/home/details.module.css");
  assert.match(flow, /\.flowStep::after.*scaleX\(var\(--reveal-progress, 1\)\)/);
});

test("motion has mobile limits and immediate reduced-motion, keyboard and no-script fallbacks", async () => {
  const css = await read("app/globals.css");
  for (const variant of variants) assert.ok(css.includes(`[data-reveal="${variant}"]`));
  assert.match(css, /\.reveal\[data-reveal="wipe"\] > \*\s*\{[^}]*clip-path: inset/);
  assert.doesNotMatch(css, /\.reveal\[data-reveal="wipe"\]\s*\{[^}]*clip-path:/);
  assert.match(css, /\[data-gallery-card\] > \*\s*\{[^}]*transform: translateX/);
  assert.doesNotMatch(css, /\[data-gallery-card\]\s*\{[^}]*transform:/);
  assert.match(css, /--reveal-distance: 14px/);
  assert.match(css, /nth-child\(n \+ 4\).*--gallery-step: 3/);
  assert.match(css, /\.reveal:focus-within/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-gallery-card\][\s\S]*clip-path: none !important/);
  const source = await read("components/Reveal.tsx");
  assert.match(source, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
  assert.match(source, /addEventListener\("focusin", showOnFocus\)/);
  const layout = await read("app/layout.tsx");
  assert.match(layout, /<noscript>[\s\S]*\[data-gallery-card\][\s\S]*--reveal-progress:1!important[\s\S]*clip-path:none!important/);
});
