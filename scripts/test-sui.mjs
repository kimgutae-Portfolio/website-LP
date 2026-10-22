import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";

const source = await readFile(new URL("../components/demo/sui/content.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { salon, looks, menuGroups, news, faqs } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const motionSource = await readFile(new URL("../components/demo/sui/motion.ts", import.meta.url), "utf8");
const motionOutput = ts.transpileModule(motionSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { sceneMotion } = await import(`data:text/javascript;base64,${Buffer.from(motionOutput).toString("base64")}`);

test("camera movement remains inside photographic overscan at mobile and desktop sizes", () => {
  for (const width of [320, 390, 700, 768, 1440]) for (const scene of ["hero", "look", "craft", "salon"]) for (const height of [180, 380, 650]) {
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

test("four unique hair styles have complete detail notes and images", () => {
  assert.equal(looks.length, 4);
  assert.equal(new Set(looks.map(look => look.image)).size, 4);
  assert.equal(new Set(looks.map(look => look.category)).size, 4);
  for (const look of looks) {
    assert.ok(look.title && look.alt && look.description && look.color);
    assert.equal(look.notes.length, 3);
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
test("six original photographs are optimized local WebP files", async () => {
  for (const name of ["hero","bob","short","wave","interior","craft"]) {
    const file = new URL(`../public/demo/sui/${name}.webp`, import.meta.url);
    const info = await stat(file);
    assert.ok(info.size > 15000 && info.size < 650000, `${name} should be lightweight`);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(metadata.format, "webp");
    assert.ok(metadata.width >= 1000);
  }
});
test("editorial photo film is present and loaded only on demand", async () => {
  const file = await stat(new URL("../public/demo/sui/photo-film.mp4", import.meta.url));
  assert.ok(file.size > 100000 && file.size < 4000000);
  const html = await readFile(new URL("../.next/server/app/demo/sui.html", import.meta.url), "utf8");
  assert.ok(!/<video(?:\s|>)/i.test(html));
});
test("production salon demo has four look controls, noindex and no booking form", async () => {
  const html = await readFile(new URL("../.next/server/app/demo/sui.html", import.meta.url), "utf8");
  assert.match(html, /name="robots" content="noindex/);
  assert.equal((html.match(/aria-label="ヘアスタイルを見る：/g) ?? []).length, 4);
  assert.equal((html.match(/<details>/g) ?? []).length, 4);
  assert.ok(!/<form(?:\s|>)/i.test(html));
  assert.match(html, /実際のお客様・施術実績ではありません/);
  assert.match(html, /href="https:\/\/beauty\.hotpepper\.jp\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="https:\/\/line\.me\/" target="_blank" rel="noopener noreferrer"/);
  for (const id of ["top","intro","lookbook","design","menu","salon","first","journal","access","reservation"]) assert.match(html, new RegExp(`id="sui-${id}"`));
});
