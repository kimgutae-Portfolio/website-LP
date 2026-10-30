import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {loadSiteConfig} from "./load-site-config.mjs";
const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const { siteConfig } = await loadSiteConfig();

test("first screen leads with service benefits and real, server-rendered consultation links", async () => {
  const html = await read(".next/server/app/index.html");
  const hero = html.slice(html.indexOf('id="top"'), html.indexOf('id="demo"'));
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  for (const text of ["お店の魅力を、", "新しいお客様へ。", "見つけてもらう。選んでもらう。", "制作初期費用", "月額運用費", "初期0円は基本構成の場合。", "追加ページ", "LINEで無料相談"]) assert.ok(hero.includes(text), text);
  assert.doesNotMatch(html, /WordPress/);
  assert.match(hero, /data-line-placement="hero"/);
  assert.match(hero, /href="https:\/\/lin\.ee\/Ny9tbUX"/);
  assert.match(hero, /data-opening-mark/);
  assert.doesNotMatch(hero, /<video\b|<img\b|DESIGN REEL|KASANE|SUMITOKI|NAGI|data-hero-media/);
  assert.match(hero, /<strong[^>]*>0<\/strong>/);
  assert.match(hero, /5,500/);
  for (const match of html.matchAll(/href="#([^\"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), match[1]);
});

test("continuous sunrise / doorway opening has a finite fallback and respects user intent", async () => {
  const component = await read("components/home/HeroExperience.tsx"), scene = await read("components/home/TownScene.tsx"), opening = await read("components/home/HeroOpening.tsx"), css = await read("components/home/hero.module.css");
  assert.match(component, /3600/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "Tab"/);
  assert.match(component, /onFocusCapture=\{finish\}/);
  assert.match(component, /onPointerDownCapture=\{finish\}/);
  assert.match(component, /passive: true/);
  assert.match(component, /preference\.addEventListener\("change", update\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  for (const name of ["mainApproach", "sunRise", "doorOpening"]) assert.ok(css.includes(`@keyframes ${name}`), name);
  for (const hook of ["data-entry-camera", "data-entry-sun", "data-entry-doorway"]) assert.equal((scene.match(new RegExp(hook,"g")) ?? []).length, 1);
  assert.match(opening, /event\.target === event\.currentTarget/);
  assert.match(component, /addEventListener\("hashchange", onHash\)/);
  assert.match(css, /\.brandScene\s*\{[^}]*pointer-events: none/);
  assert.match(css, /mainApproach 3\.2s/);
  assert.match(component, /<HeroOpening active=\{entry === "preparing" \|\| entry === "playing"\} scene=\{scene\} onReady=\{play\} onComplete=\{finish\}/);
  assert.doesNotMatch(css, /animation[^;}]*infinite/);
  assert.doesNotMatch(component, /preventDefault|style\.overflow|"wheel"|"touchmove"|<video/);
});

test("an unseen hero opening waits for the headline and does not end on a tiny scroll", async () => {
  const component = await read("components/home/HeroExperience.tsx");
  assert.match(component, /"waiting" \| "preparing" \| "playing" \| "complete"/);
  assert.match(component, /observer\.current\.observe\(heading\)/);
  assert.match(component, /if \(item\.isIntersecting\) begin\(\)/);
  assert.match(component, /getBoundingClientRect\(\)\.bottom <= 0/);
  assert.doesNotMatch(component, /const onScroll = [^\n]*scrollY > 32/);
  assert.match(component, /if \(hasPlayed\.current \|\| preference\.matches\) return/);
  assert.match(component, /window\.setTimeout\(finish, 3600\)/);
  assert.match(component, /event\?\.type === "pointerdown"/);
  assert.match(component, /target\.closest\("a, button, input, textarea, select, summary"\)/);
});

test("full-viewport doors reveal the live page and hand off the sun without a screen fade", async () => {
  const source = await read("components/home/HeroOpening.tsx"), css = await read("components/home/hero.module.css");
  assert.match(source, /data-entry-stage aria-hidden="true"/);
  assert.match(source, /data-entry-leaf="left"/);
  assert.match(source, /data-entry-leaf="right"/);
  assert.match(source, /data-opening-sun/);
  assert.match(source, /while \(parent\)/);
  assert.match(source, /element\.clientWidth \/ 2/);
  assert.match(source, /element\.clientHeight \/ 2/);
  for (const property of ["--opening-sun-x", "--opening-sun-y", "--opening-sun-scale"]) assert.ok(source.includes(property));
  assert.match(css, /\.opening\s*\{[^}]*position: fixed;[^}]*inset: 0;[^}]*z-index: 100;[^}]*pointer-events: none/);
  assert.match(css, /openingFinish 3\.2s step-end both/);
  assert.match(css, /@keyframes openingFinish[^\n]*visibility: hidden/);
  assert.match(css, /translateX\(-104%\) rotateY/);
  assert.match(css, /translateX\(104%\) rotateY/);
  const openingFrames = css.slice(css.indexOf("@keyframes openingLeft"), css.indexOf("@keyframes mainApproach"));
  assert.doesNotMatch(openingFrames, /opacity:/);
  assert.match(css, /prefers-reduced-motion:reduce[^\n]*\.opening \{ display: none!important/);
  assert.doesNotMatch(source, /preventDefault|style\.overflow|<video|<img|fetch\(/);
});

test("opening prepares its geometry before playback and batches only event-driven updates", async () => {
  const source = await read("components/home/HeroOpening.tsx"), component = await read("components/home/HeroExperience.tsx"), css = await read("components/home/hero.module.css");
  assert.match(component, /\("preparing"\)/);
  assert.match(component, /current === "preparing" \? "playing" : current/);
  assert.match(source, /if \(!geometry\)/);
  assert.match(source, /if \(!frame\) frame = window\.requestAnimationFrame\(placeSun\)/);
  assert.match(source, /geometry = null; schedule\(\)/);
  assert.match(source, /if \(!geometry\) placeSun\(\)/);
  assert.match(source, /if \(geometry\) onReady\(\)/);
  assert.match(source, /else onComplete\(\)/);
  assert.match(source, /cancelAnimationFrame\(frame\)/);
  assert.match(source, /cancelAnimationFrame\(warmup\)/);
  const writes = source.slice(source.indexOf('element.style.setProperty'), source.indexOf('const schedule'));
  assert.doesNotMatch(writes, /offsetWidth|clientWidth|clientHeight|offsetTop|offsetLeft/);
  assert.match(css, /openingSafety 3\.6s/);
  assert.match(css, /will-change: transform/);
  assert.doesNotMatch(css, /cameraEntry|wordsArrival|offerArrival/);
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
  for (const keyword of siteConfig.hero.keywords) assert.ok(opening.includes(keyword));
  assert.match(css, /grid-template-columns:\s*\.8fr 1\.2fr/);
  assert.match(css, /100svh - 64px/);
  assert.match(opening, /viewBox="0 0 900 620"/);
  assert.match(opening, /aria-hidden="true"/);
});

test("consultation is optional in-person and security / SEO claims are qualified", () => {
  assert.match(siteConfig.flow[0].highlight, /ご希望の方/);
  assert.match(siteConfig.flow[0].text, /まずはLINEやメール/);
  assert.match(siteConfig.meta.description, /ご希望の方/);
  assert.match(siteConfig.faq.find(item => item.q.includes("セキュリティ")).a, /安全性を完全に保証するものではありません/);
  assert.match(siteConfig.faq.find(item => item.q.includes("検索に")).a, /順位を保証するものではありません/);
  assert.match(siteConfig.faq.find(item => item.q.includes("見本にない")).a, /作業前に費用/);
  assert.equal(siteConfig.pricing.initialCost, "0");
  assert.equal(siteConfig.pricing.monthlyFrom, "5,500");
});

test("examples are the second main section, followed by details, maintenance and consultation", async () => {
  const html = await read(".next/server/app/index.html");
  const positions = ["data-home-hero", 'id="demo"', 'id="home-strengths"', 'id="home-problem-heading"', 'id="home-support-heading"', 'id="price"', 'id="flow"', 'id="column"'].map(mark => html.indexOf(mark));
  for (let i = 0; i < positions.length; i++) { assert.ok(positions[i] >= 0); if (i) assert.ok(positions[i] > positions[i - 1]); }
  assert.match(await read("app/page.tsx"), /<FloatingLine afterHero/);
  assert.match(await read("components/home/MobileNavigation.tsx"), /onClick=\{closeMenu\}/);
  const main = html.match(/<main>([\s\S]*?)<\/main>/)[1];
  assert.deepEqual([...main.matchAll(/<section\b[^>]*id="([^"]+)"/g)].slice(0, 2).map(match => match[1]), ["top", "demo"]);
  assert.ok(html.includes(siteConfig.hero.sub));
  assert.ok(html.includes("ご希望の方には、訪問でのご相談も。"));
});

test("business LINE actions use the same LINE brand color and preserve tracking", async () => {
  for (const path of ["components/home/hero.module.css", "components/home/home.module.css", "components/pricing/pricing.module.css", "components/column/column.module.css"]) {
    const css = await read(path);
    assert.match(css, /var\(--color-line,\s*#06c755\)/, path);
    assert.match(css, /var\(--color-line-dark,\s*#05b04b\)/, path);
  }
  for (const path of ["components/LineCta.tsx", "components/FloatingLine.tsx"]) assert.match(await read(path), /bg-line/);
});
