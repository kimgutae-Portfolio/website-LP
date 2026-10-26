import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const source = ts.transpileModule(await read("site.config.ts"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { siteConfig } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("first screen leads with service benefits and real, server-rendered consultation links", async () => {
  const html = await read(".next/server/app/index.html");
  const hero = html.slice(html.indexOf('id="top"'), html.indexOf('id="demo"'));
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  for (const text of ["「こうしたい」を、", "自由につくる。", "WordPressを使わない", "制作初期費用", "月額運用費", "初期0円は基本構成の場合。", "追加ページ", "ご希望の方には", "LINEで無料相談", "安全性"]) assert.ok(hero.includes(text), text);
  assert.match(hero, /data-line-placement="hero"/);
  assert.match(hero, /href="https:\/\/lin\.ee\/Ny9tbUX"/);
  assert.match(hero, /data-opening-mark/);
  assert.doesNotMatch(hero, /<video\b|<img\b|DESIGN REEL|KASANE|SUMITOKI|NAGI|data-hero-media/);
  assert.match(hero, /<strong[^>]*>0<\/strong>/);
  assert.match(hero, /5,500/);
  for (const match of html.matchAll(/href="#([^\"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), match[1]);
});

test("short text opening has finite fallback and respects motion preferences and user intent", async () => {
  const component = await read("components/home/HeroExperience.tsx"), css = await read("components/home/hero.module.css");
  assert.match(component, /1100/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "Tab"/);
  assert.match(component, /onFocusCapture=\{finish\}/);
  assert.match(component, /onPointerDownCapture=\{finish\}/);
  assert.match(component, /passive: true/);
  assert.match(component, /preference\.addEventListener\("change", update\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@keyframes ruleArrival/);
  assert.doesNotMatch(css, /animation[^;}]*infinite/);
  assert.doesNotMatch(component, /preventDefault|style\.overflow|"wheel"|"touchmove"|<video/);
});

test("responsive offer keeps real links, clear conditions and generous tap areas", async () => {
  const hero = await read("components/Hero.tsx"), css = await read("components/home/hero.module.css");
  assert.match(css, /max-width:540px/);
  assert.match(css, /max-width:360px/);
  assert.match(css, /min-height:52px/);
  assert.match(hero, /初期0円は基本構成の場合/);
  assert.match(hero, /最低契約期間3ヶ月/);
  assert.match(hero, /target="_blank" rel="noopener noreferrer"/);
});

test("mobile first screen is concise, prices stay side-by-side, and long explanations follow the opening", async () => {
  const html = await read(".next/server/app/index.html"), css = await read("components/home/hero.module.css");
  const opening = html.slice(html.indexOf('id="top"'), html.indexOf('</section>', html.indexOf('id="top"')));
  assert.ok(!opening.includes(siteConfig.hero.sub));
  assert.ok(!opening.includes("ご希望の方には、訪問"));
  assert.match(opening, /自由なデザイン/);
  assert.match(opening, /検索の基本設定/);
  assert.match(opening, /更新サポート/);
  assert.match(css, /grid-template-columns:\s*\.8fr 1\.2fr/);
  assert.match(css, /100svh - 64px/);
  assert.match(opening, /viewBox="0 0 1400 900"/);
  assert.match(opening, /aria-hidden="true"/);
});

test("consultation is optional in-person and security / SEO claims are qualified", () => {
  assert.match(siteConfig.flow[0].highlight, /ご希望の方/);
  assert.match(siteConfig.flow[0].text, /まずはLINEやメール/);
  assert.match(siteConfig.meta.description, /ご希望の方/);
  assert.match(siteConfig.faq.find(item => item.q.includes("WordPress")).a, /安全性は開発方式だけで決まるものではありません/);
  assert.match(siteConfig.faq.find(item => item.q.includes("検索に")).a, /順位を保証するものではありません/);
  assert.match(siteConfig.faq.find(item => item.q.includes("見本にない")).a, /作業前に費用/);
  assert.equal(siteConfig.pricing.initialCost, "0");
  assert.equal(siteConfig.pricing.monthlyFrom, "5,500");
});

test("demos still follow the hero while maintenance, pricing, journal and navigation remain available", async () => {
  const html = await read(".next/server/app/index.html");
  const positions = ["data-home-hero", 'id="demo"', 'id="home-problem-heading"', 'id="home-support-heading"', 'id="price"', 'id="flow"', 'id="column"'].map(mark => html.indexOf(mark));
  for (let i = 0; i < positions.length; i++) { assert.ok(positions[i] >= 0); if (i) assert.ok(positions[i] > positions[i - 1]); }
  assert.match(await read("app/page.tsx"), /<FloatingLine afterHero/);
  assert.match(await read("components/home/MobileNavigation.tsx"), /onClick=\{closeMenu\}/);
});
