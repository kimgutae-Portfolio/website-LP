import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../components/demo/sumitoki/content.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { restaurant, posts, dishes, heroSlides } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("exactly three distinct SNS posts have images, captions and dates", () => {
  assert.equal(posts.length, 3);
  assert.equal(new Set(posts.map(post => post.image)).size, 3);
  for (const post of posts) {
    assert.ok(post.title && post.caption && post.alt);
    assert.match(post.dateTime, /^\d{4}-\d{2}-\d{2}$/);
  }
});
test("booking is configured as an external HTTPS destination", () => {
  const url = new URL(restaurant.reservationUrl);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "tabelog.com");
  assert.ok(restaurant.reservationNote.includes("デモ"));
});
test("all referenced photographs are local, optimized WebP assets", async () => {
  const names = new Set([...posts, ...dishes, ...heroSlides].map(item => item.image));
  assert.equal(names.size, 5);
  for (const name of names) {
    const info = await stat(new URL(`../public/demo/sumitoki/${name}.webp`, import.meta.url));
    assert.ok(info.size > 10000 && info.size < 500000, `${name} should be optimized`);
  }
});
test("the on-demand photo film is present and lightweight", async () => {
  const info = await stat(new URL("../public/demo/sumitoki/photo-film-no-people.mp4", import.meta.url));
  assert.ok(info.size > 100000 && info.size < 3000000);
});
test("production page has three post controls, no booking form, and noindex metadata", async () => {
  const html = await readFile(new URL("../.next/server/app/demo/sumitoki.html", import.meta.url), "utf8");
  assert.equal((html.match(/aria-label="SNS投稿を見る：/g) ?? []).length, 3);
  assert.match(html, /id="sumitoki-instagram-feed"[^>]*role="region"[^>]*tabindex="0"/);
  assert.match(html, /aria-label="前の写真へ"/);
  assert.match(html, /aria-label="次の写真へ"/);
  assert.ok(!/<form(?:\s|>)/i.test(html));
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /href="https:\/\/tabelog\.com\/" target="_blank"/);
});
