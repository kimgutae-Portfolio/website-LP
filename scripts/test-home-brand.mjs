import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";
import { loadSiteConfig } from "./load-site-config.mjs";
const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const { websiteExamples, siteConfig } = await loadSiteConfig();

test("town brand is a lightweight decorative SVG, not an external video dependency", async () => {
  const scene = await read("components/home/TownScene.tsx");
  assert.match(scene, /viewBox="0 0 900 620"/);
  assert.match(scene, /aria-hidden="true" focusable="false"/);
  for (const text of ["まちの商店", "まちに、Webの入口を。", "data-entry-sun", "data-entry-doorway"]) assert.ok(scene.includes(text));
  assert.doesNotMatch(scene, /https?:|<video|<image|fetch\(/);
  const layout = await read("app/layout.tsx");
  assert.match(layout, /Noto_Sans_JP/);
  assert.match(layout, /900/);
});

test("all eight gallery previews are optimized captures of their actual demo pages", async () => {
  assert.equal(new Set(websiteExamples.map(x=>x.previewImage)).size, 8);
  for (const example of websiteExamples) {
    assert.equal(example.previewImage, `/demo/previews/${example.url.split("/").at(-1)}.webp`);
    const asset = await stat(new URL(`../public${example.previewImage}`, import.meta.url));
    assert.ok(asset.size > 10000 && asset.size < 180000, example.previewImage);
  }
  const source = await read("components/pricing/WebsiteExamples.tsx");
  assert.match(source, /example\.previewImage\?\?example\.image/);
  const css = await read("components/pricing/gallery.module.css");
  assert.match(css, /align-items: stretch/);
  assert.match(css, /aspect-ratio: 1250 \/ 712/);
});

test("gallery shares six concise content tracks and keeps controls above the cards", async () => {
  const css = await read("components/pricing/gallery.module.css");
  assert.match(css, /grid-template-rows: repeat\(6, auto\)/);
  assert.match(css, /grid-template-rows: subgrid/);
  assert.match(css, /grid-row: span 6/);
  assert.match(css, /grid-row: 2 \/ span 3/);
  assert.match(css, /@supports not \(grid-template-rows: subgrid\)/);
  assert.match(css, /\.exampleOffer\s*\{\s*grid-row: 5/);
  assert.match(css, /\.scopeDetails\s*\{\s*grid-row: 6/);
  const source = await read("components/pricing/WebsiteExamples.tsx");
  assert.ok(source.indexOf("className={styles.railButtons}") < source.indexOf('id="website-examples-rail" ref='));
  assert.doesNotMatch(css, /\.exampleCard\s*\{[^}]*height:\s*\d+px/);
});

test("gallery shows a short introduction and price, with all scope lists behind a disclosure", async () => {
  const source = await read("components/pricing/WebsiteExamples.tsx");
  assert.doesNotMatch(source, /basicPreview|scopeExcerpt|exampleOpen|included\.slice/);
  assert.match(source, /<summary>制作内容・費用の詳細<\/summary>/);
  assert.match(source, /example\.displayName\?\?example\.name/);
  for (const example of websiteExamples) assert.ok(example.displayName && example.displayName.length <= 18);
  const html = await read(".next/server/app/index.html");
  const cards = [...html.matchAll(/<article[^>]*data-offer-kind="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, websiteExamples.length);
  for (const [index, [, , body]] of cards.entries()) {
    const example = websiteExamples[index];
    const disclosure = body.match(/<details\b[^>]*>([\s\S]*?)<\/details>/)?.[1];
    assert.ok(disclosure);
    const collapsed = body.replace(/<details\b[^>]*>[\s\S]*?<\/details>/, "");
    assert.doesNotMatch(collapsed, /<ul|初期0円でできること|追加制作で、ここまで。/);
    assert.ok(collapsed.includes(example.detail));
    assert.ok(collapsed.includes("初期費用"));
    for (const text of [...example.offer.included, ...example.offer.additional, example.offer.note]) assert.ok(disclosure.includes(text), text);
    if (example.offer.kind === "zero") assert.ok(collapsed.includes("基本1ページの場合"));
    if (example.offer.upgrade) {
      assert.ok(disclosure.includes(`href="${example.offer.upgrade.href}"`));
      assert.ok(!collapsed.includes(example.offer.upgrade.cta));
    }
  }
});

test("pricing and service disclosures retain their full server-rendered terms", async () => {
  const html = await read(".next/server/app/index.html");
  for (const text of [siteConfig.pricing.estimateNote, ...siteConfig.pricing.notes]) assert.ok(html.includes(text), text);
  for (const text of ["基本の制作範囲・運用内容について", "掲載する内容と、制作の範囲", "初期0円の基本構成と、追加制作のこと"]) assert.ok(html.includes(text));
  for (const item of siteConfig.faq) { assert.ok(html.includes(item.q)); assert.ok(html.includes(item.a)); }
  for (const id of ["flow-heading", "faq-heading", "contact-heading"]) assert.ok(html.includes(`aria-labelledby="${id}"`));
});

test("support illustration is labelled as an example, not a fabricated testimonial", async () => {
  const source = await read("components/Promises.tsx");
  assert.match(source, /更新のやりとりイメージ/);
  assert.doesNotMatch(source, /お客様の声|導入実績|満足度|売上.*倍/);
  assert.match(await read("components/home/details.module.css"), /prefers-reduced-motion/);
});
