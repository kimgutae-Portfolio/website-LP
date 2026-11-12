import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";

const source = await readFile(new URL("../components/demo/sui/content.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { salon, menuGuide, menuGroups, news, faqs } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const motionSource = await readFile(new URL("../components/demo/sui/motion.ts", import.meta.url), "utf8");
const motionOutput = ts.transpileModule(motionSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { sceneMotion } = await import(`data:text/javascript;base64,${Buffer.from(motionOutput).toString("base64")}`);

test("camera movement remains inside photographic overscan at mobile and desktop sizes", () => {
  for (const width of [320, 390, 700, 768, 1440]) for (const scene of ["hero", "craft", "salon"]) for (const height of [180, 380, 650]) {
    for (const top of [-2000, -650, 0, 400, 900, 3000]) {
      const result = sceneMotion(scene, top, height, width, 850);
      assert.ok(Object.values(result).every(Number.isFinite));
      assert.ok(result.inset >= 0 && result.inset <= width * .075 + .001);
      assert.ok(result.scale >= 1.04 && result.scale <= 1.13);
      assert.ok(Math.abs(result.travel) <= height * (result.scale - 1) / 2 + .001, `${scene}: camera must cover the frame`);
    }
  }
});
test("salon opens to full width on arrival, while mobile hero movement is restrained", () => {
  assert.ok(sceneMotion("salon", 850, 650, 1440, 850).inset > 0);
  assert.equal(sceneMotion("salon", 0, 650, 1440, 850).inset, 0);
  assert.equal(sceneMotion("hero", 0, 650, 390, 850).travel, 0);
  assert.ok(sceneMotion("hero", -650, 650, 390, 850).travel < sceneMotion("hero", -650, 650, 1440, 850).travel);
});
test("motion is progressive enhancement, observes only nearby scenes, and does not hijack scrolling", async () => {
  const hook = await readFile(new URL("../components/demo/sui/useSuiMotion.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../components/demo/sui/sui.module.css", import.meta.url), "utf8");
  assert.match(hook, /prefers-reduced-motion: reduce/);
  assert.match(hook, /preference\.addEventListener\("change", configure\)/);
  assert.match(hook, /if \(paused \|\| document\.hidden \|\| preference\.matches\) return/);
  assert.match(hook, /rootMargin: "100px"/);
  assert.ok(!hook.includes('"wheel"') && !hook.includes('"touchmove"') && !hook.includes("preventDefault"));
  assert.match(css, /\.opening \{ display: none; \}/);
});

test("four distinct concerns map to real menu items and shared prices", () => {
  assert.equal(menuGuide.length, 4);
  assert.equal(new Set(menuGuide.map(entry => entry.id)).size, 4);
  assert.equal(new Set(menuGuide.map(entry => entry.item)).size, 4);
  for (const entry of menuGuide) {
    assert.ok(entry.concern && entry.label && entry.description);
    assert.ok(menuGroups.find(group => group.id === entry.group)?.items.some(item => item.id === entry.item), entry.id);
  }
  assert.equal(news.length, 3);
  assert.equal(faqs.length, 4);
});
test("salon menu includes prices and item descriptions in both groups", () => {
  assert.equal(menuGroups.length, 2);
  for (const group of menuGroups) {
    assert.ok(group.id && group.label && group.english);
    for (const item of group.items) {
      assert.ok(item.name && item.detail);
      assert.match(item.price, /^[\d,]+〜?$/);
    }
  }
});
test("reservation and LINE use separate external demonstration destinations", () => {
  assert.equal(new URL(salon.reservationUrl).hostname, "beauty.hotpepper.jp");
  assert.equal(new URL(salon.lineUrl).hostname, "line.me");
  assert.ok(salon.linkNote.includes("トップページ"));
  assert.ok(salon.area.includes("デモ"));
});
test("interior, dedicated portrait and tools images are optimized local WebP files", async () => {
  for (const name of ["interior","interior-mobile","station-tools"]) {
    const file = new URL(`../public/demo/sui/${name}.webp`, import.meta.url);
    const info = await stat(file);
    assert.ok(info.size > 15000 && info.size < 650000, `${name} should be lightweight`);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(metadata.format, "webp");
    if (name === "interior-mobile") {
      assert.equal(metadata.width, 680);
      assert.equal(metadata.height, 1020);
      assert.ok(info.size < 120000);
    } else assert.ok(metadata.width >= 1000);
  }
});
test("people-free editorial photo film is present and loaded only on demand", async () => {
  const file = await stat(new URL("../public/demo/sui/salon-film.mp4", import.meta.url));
  assert.ok(file.size > 100000 && file.size < 4000000);
  const html = await readFile(new URL("../.next/server/app/demo/sui.html", import.meta.url), "utf8");
  assert.ok(!/<video(?:\s|>)/i.test(html));
  const component = await readFile(new URL("../components/demo/sui/SuiWebsite.tsx", import.meta.url), "utf8");
  assert.match(component, /modal.kind === "film".*src="\/demo\/sui\/salon-film.mp4"/);
  const pipeline = await readFile(new URL("./prepare-sui-media.mjs", import.meta.url), "utf8");
  assert.match(pipeline, /image: interior/);
  assert.match(pipeline, /image: tools/);
  assert.doesNotMatch(pipeline, /"(hero|short|bob|wave|craft)(\.webp)?"/);
});
test("production salon demo renders responsive room photography, four concern disclosures and no booking form", async () => {
  const html = await readFile(new URL("../.next/server/app/demo/sui.html", import.meta.url), "utf8");
  assert.match(html, /name="robots" content="noindex/);
  assert.equal((html.match(/<details\b[^>]*name="sui-menu-concern"/g) ?? []).length, 4);
  assert.equal((html.match(/<details\b/g) ?? []).length, 8);
  assert.match(html, /<source media="\(max-width: 700px\)"[^>]*interior-mobile.webp/);
  assert.match(html, /property="og:image" content="[^"]*\/demo\/sui\/interior.webp"/);
  assert.match(html, /堺の美容室/);
  assert.match(html, /href="#sui-guide"/);
  for (const entry of menuGuide) {
    assert.ok(html.includes(entry.concern));
    assert.ok(html.includes(entry.description));
  }
  assert.ok(!/<form(?:\s|>)/i.test(html));
  assert.match(html, /掲載のメニュー・料金は税込の制作見本です/);
  assert.doesNotMatch(html, /LOOKBOOK|モデルイメージ|(?:\/|%2F)demo(?:\/|%2F)sui(?:\/|%2F)(hero|short|wave|bob|craft)\.webp/);
  assert.match(html, /href="https:\/\/beauty\.hotpepper\.jp\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="https:\/\/line\.me\/" target="_blank" rel="noopener noreferrer"/);
  for (const id of ["top","intro","guide","lookbook","design","menu","salon","first","journal","access","reservation"]) assert.match(html, new RegExp(`id="sui-${id}"`));
});
