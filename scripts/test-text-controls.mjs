import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const arrows = /[↗→↓↑←↔]/;

test("marketing and journal controls no longer use decorative arrow glyphs", async () => {
  for (const path of [
    "components/Hero.tsx", "components/home/HeroExperience.tsx",
    "components/home/MobileNavigation.tsx", "components/Demo.tsx",
    "components/Pricing.tsx", "components/Columns.tsx",
    "components/pricing/WebsiteExamples.tsx", "components/column/ColumnCard.tsx",
    "app/column/page.tsx", "app/column/[slug]/page.tsx",
    "app/privacy/page.tsx", "app/tokushoho/page.tsx", "components/home/hero.module.css",
  ]) assert.doesNotMatch(await read(path), arrows, path);
  for (const path of ["components/home/home.module.css", "components/home/details.module.css", "components/pricing/pricing.module.css", "components/pricing/gallery.module.css", "components/column/column.module.css"])
    assert.doesNotMatch(await read(path), arrows, path);
});

test("gallery uses custom bold arrows while preserving labels and keyboard support", async () => {
  const source = await read("components/pricing/WebsiteExamples.tsx");
  assert.match(source, /onClick=\{\(\)=>move\(-1\)\}[^>]+aria-label="前の制作見本"[^>]*><GalleryArrow previous\/><\/button>/);
  assert.match(source, /onClick=\{\(\)=>move\(1\)\}[^>]+aria-label="次の制作見本"[^>]*><GalleryArrow\/><\/button>/);
  assert.match(source, /fill="currentColor" aria-hidden="true" focusable="false"/);
  assert.match(source, /M3 9H13V4L21 12L13 20V15H3V9Z/);
  for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) assert.ok(source.includes(`"${key}"`));
  assert.match(source, /disabled=\{edges.start\}/);
  assert.match(source, /disabled=\{edges.end\}/);
  assert.doesNotMatch(source, /ExternalIcon/);
  assert.match(source, /制作見本を見る/);
  assert.match(source, /見本は新しいタブで開きます/);
  assert.match(await read("components/pricing/gallery.module.css"), /\.railButtons>button\{[^}]*min-width:54px;[^}]*height:48px/);
});

test("text-first links remain explicit and retain meaningful functional icons", async () => {
  const hero = await read("components/Hero.tsx"), experience = await read("components/home/HeroExperience.tsx");
  assert.match(hero, /href="#demo"[^>]*>制作見本を見る<\/a>/);
  assert.match(hero, /data-line-placement="hero"/);
  assert.match(hero, /LINEで無料相談/);
  assert.match(hero, /費用・対応内容を見る/);
  assert.match(experience, /data-home-hero/);
  assert.doesNotMatch(experience, /<video/);
  assert.match(await read("components/Pricing.tsx"), /<LineIcon\/>/);
  assert.doesNotMatch(await read("components/pricing/pricing.module.css"), /\.consultButton>span:last-child/);
});

test("built homepage and journal render arrow-free navigation and action text", async () => {
  for (const path of [".next/server/app/index.html", ".next/server/app/column.html", ".next/server/app/column/why-a-website.html"]) {
    const html = await read(path);
    const controls = [...html.matchAll(/<(?:a|button)\b[^>]*>([\s\S]*?)<\/(?:a|button)>/g)];
    assert.ok(controls.length > 10, path);
    for (const [, content] of controls) assert.doesNotMatch(content, arrows, path);
  }
});
