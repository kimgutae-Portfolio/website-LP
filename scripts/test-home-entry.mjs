import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const source = await read("lib/home-entry.ts");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { isPaidLanding, homeEntryBootstrap } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const examples = [
  ["", false], ["?gclid=", false], ["?gclid=%20", false],
  ["?gclid=test-only", true], ["?dclid=test-only", true],
  ["?gbraid=test-only", true], ["?wbraid=test-only", true],
  ["?utm_medium=cpc", true], ["?utm_medium=PPC", true],
  ["?utm_medium=paidsearch", true], ["?utm_medium=paid_search", true],
  ["?utm_medium=paid-social", true], ["?utm_medium=paid_social", true],
  ["?utm_medium=display", true], ["?utm_medium=%20CPC%20", true],
  ["?utm_source=google&utm_medium=organic", false],
  ["?utm_source=google", false], ["?utm_medium=email", false],
  ["?utm_medium=social", false], ["?utm_medium=cpc-fake", false],
  ["?not_gclid=test", false], ["?message=gclid%3Dtest", false],
];

test("only explicit paid click parameters or paid UTM media bypass the entrance", () => {
  for (const [search, expected] of examples) assert.equal(isPaidLanding(search), expected, search);
});

test("pre-paint bootstrap and hydration agree; no query value is copied to the DOM", () => {
  for (const [search, expected] of examples) {
    const attributes = {};
    runInNewContext(homeEntryBootstrap, {
      URLSearchParams,
      location: { pathname: "/", search },
      document: { documentElement: { setAttribute: (key, value) => { attributes[key] = value; } } },
    });
    assert.deepEqual(attributes, expected ? { "data-home-entry": "direct" } : {}, search);
  }
  assert.doesNotMatch(source, /localStorage|sessionStorage|document\.cookie|fetch\(|gtag|clarity|sendBeacon/);
});

test("advertising presentation is homepage-only and cannot break when early DOM access fails", () => {
  let changes = 0;
  for (const pathname of ["/demo/sumitoki", "/column", "/privacy"]) {
    runInNewContext(homeEntryBootstrap, {
      URLSearchParams, location: { pathname, search: "?gclid=test-only" },
      document: { documentElement: { setAttribute: () => { changes++; } } },
    });
  }
  assert.equal(changes, 0);
  assert.doesNotThrow(() => runInNewContext(homeEntryBootstrap, {}));
});

test("paid visitors see the offer before hydration while normal visitors retain the opening", async () => {
  const layout = await read("app/layout.tsx"), hero = await read("components/home/HeroExperience.tsx"), css = await read("components/home/hero.module.css"), html = await read(".next/server/app/index.html");
  assert.ok(layout.indexOf('id="home-entry-mode"') < layout.indexOf("<body"));
  assert.ok(html.indexOf('id="home-entry-mode"') < html.indexOf('id="top"'));
  assert.match(hero, /isPaidLanding\(window\.location\.search\)/);
  assert.match(hero, /removeAttribute\("data-home-entry"\)/);
  assert.match(css, /html\[data-home-entry="direct"\]\) \.opening \{ display: none!important/);
  assert.match(css, /html\[data-home-entry="direct"\]\) \.hero[^\n]+animation: none!important/);
  assert.match(css, /openingFinish 3\.2s/);
});

test("consultation explains the outcome and a first message without changing price boundaries", async () => {
  const html = await read(".next/server/app/index.html");
  for (const text of ["LINEで内容・費用を相談", "店名と「作りたい」の一言から。", "必要な掲載内容と費用の目安", "無料で一緒に整理", "友だち追加後", "〇〇店です。ホームページの内容と費用を相談したいです。", "ご相談後に契約する必要はありません。", "最低契約期間3ヶ月", "追加ページ・演出・機能は別途お見積り。"]) assert.ok(html.includes(text), text);
  assert.match(html, /data-line-placement="hero"/);
  assert.match(html, /data-line-placement="contact"/);
});

test("the floating consultation action never covers the contact section's own controls", async () => {
  const source = await read("components/home/FloatingLineAfterHero.tsx");
  assert.match(source, /document\.querySelector\("#contact"\)/);
  assert.match(source, /observer\.observe\(contact\)/);
  assert.match(source, /setVisible\(!heroVisible&&!contactVisible\)/);
  assert.match(source, /observer\.disconnect\(\)/);
});
