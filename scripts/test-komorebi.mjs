import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";

const source = await readFile(new URL("../components/demo/komorebi/content.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { clinic, services, notices, faqs, belongings, greetings } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("clinic content has complete service, news, FAQ, and first-visit sections", () => {
  assert.equal(services.length, 3);
  assert.equal(new Set(services.map(service => service.id)).size, 3);
  assert.equal(notices.length, 3);
  assert.equal(faqs.length, 4);
  assert.equal(belongings.length, 3);
  assert.equal(greetings.length, 3);
  for (const service of services) assert.ok(service.title && service.detail && service.note);
  assert.ok(clinic.area.includes("デモ"));
});
test("reservation is an external service example, not a real clinic booking URL", () => {
  assert.equal(new URL(clinic.reservationUrl).protocol, "https:");
  assert.equal(new URL(clinic.reservationUrl).hostname, "products.medicalpass.jp");
  assert.ok(clinic.reservationNote.includes("実際の予約はできません"));
  assert.equal(new URL(clinic.consultationUrl).hostname, "www.mhlw.go.jp");
});
test("original illustration and interior image are present and optimized", async () => {
  for (const name of ["forest-friends", "interior"]) {
    const file = new URL(`../public/demo/komorebi/${name}.webp`, import.meta.url);
    const info = await stat(file);
    assert.ok(info.size > 20000 && info.size < 650000, `${name} must be lightweight`);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(metadata.format, "webp");
    if (name === "forest-friends") assert.equal(metadata.hasAlpha, true);
  }
});
test("production clinic demo is noindex, has no Instagram feed or medical-data form", async () => {
  const html = await readFile(new URL("../.next/server/app/demo/komorebi.html", import.meta.url), "utf8");
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /架空の小児科サイト/);
  assert.match(html, /診断・診療・予約受付は行っていません/);
  assert.ok(!/<form(?:\s|>)/i.test(html));
  assert.ok(!/instagram/i.test(html));
  assert.equal((html.match(/type="checkbox"/g) ?? []).length, 3);
  for (const id of ["top", "news", "about", "care", "first", "faq", "access"]) assert.match(html, new RegExp(`id="komorebi-${id}"`));
  assert.equal((html.match(/<details>/g) ?? []).length, 4);
});
test("first-visit guidance is an unnumbered welcome letter with a working checklist entry", async () => {
  const html = await readFile(new URL("../.next/server/app/demo/komorebi.html", import.meta.url), "utf8");
  const firstVisit = html.match(/<section id="komorebi-first"[\s\S]*?<\/section>/)?.[0];
  assert.ok(firstVisit);
  assert.ok(!/STEP|CHECK &amp; BOOK|HELLO, LITTLE ONE|TALK TOGETHER/.test(firstVisit));
  assert.match(firstVisit, /ご家族のみなさまへ/);
  assert.match(firstVisit, /いつもの親子のままで/);
  assert.equal((firstVisit.match(/type="checkbox"/g) ?? []).length, 3);
  assert.match(firstVisit, /予約についてみる/);
  assert.match(firstVisit, /href="#komorebi-access"/);
});
