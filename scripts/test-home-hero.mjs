import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {loadSiteConfig} from "./load-site-config.mjs";
const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const { siteConfig, websiteExamples } = await loadSiteConfig();

test("first screen explicitly names homepage production and shows real, linked examples", async () => {
  const html = await read(".next/server/app/index.html");
  const hero = html.slice(html.indexOf('id="top"'), html.indexOf('id="demo"'));
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  for (const text of ["お店・会社の", "ホームページ制作。", "デザインから、公開後の更新まで。", "制作サイトの見本", "制作初期費用", "月額運用費", "初期0円は基本構成の場合。", "追加ページ", "LINEで内容・費用を相談"]) assert.ok(hero.includes(text), text);
  assert.doesNotMatch(hero, /店名と「作りたい」の一言から。|費用・対応内容を見る|最低契約期間3ヶ月/);
  assert.ok(html.includes("最低契約期間3ヶ月"));
  assert.doesNotMatch(html, /WordPress/);
  assert.match(hero, /data-line-placement="hero"/);
  assert.match(hero, /href="https:\/\/lin\.ee\/Ny9tbUX"/);
  assert.match(hero, /data-opening-mark/);
  assert.doesNotMatch(hero, /<video\b|DESIGN REEL|data-hero-media|まちの商店/);
  assert.equal((hero.match(/data-hero-preview/g) ?? []).length, websiteExamples.length);
  for (const example of websiteExamples) {
    assert.ok(hero.includes(`href="${example.url}"`));
    assert.ok(hero.includes(encodeURIComponent(example.previewImage ?? example.image)));
  }
  assert.match(hero, /<strong[^>]*>0<\/strong>/);
  assert.match(hero, /5,500/);
  for (const match of html.matchAll(/href="#([^\"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), match[1]);
});

test("the secondary brand entrance has a finite fallback and respects user intent", async () => {
  const component = await read("components/home/HeroExperience.tsx"), scene = await read("components/home/TownScene.tsx"), opening = await read("components/home/HeroOpening.tsx"), css = await read("components/home/hero.module.css");
  assert.match(component, /3600/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "Tab"/);
  assert.match(component, /onFocusCapture=\{finish\}/);
  assert.match(component, /onPointerDownCapture=\{finish\}/);
  assert.match(component, /passive: true/);
  assert.match(component, /preference\.addEventListener\("change", update\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  for (const name of ["mainApproach", "sunRise"]) assert.ok(css.includes(`@keyframes ${name}`), name);
  for (const hook of ["data-entry-camera", "data-entry-sun", "data-entry-doorway"]) assert.equal((scene.match(new RegExp(hook,"g")) ?? []).length, 1);
  assert.match(opening, /event\.target === event\.currentTarget/);
  assert.match(component, /addEventListener\("hashchange", onHash\)/);
  assert.match(css, /\.brandScene\s*\{[^}]*pointer-events: none/);
  assert.match(css, /mainApproach 3\.2s/);
  assert.match(component, /<HeroOpening active=\{entry === "preparing" \|\| entry === "playing"\} scene=\{scene\} onReady=\{play\} onComplete=\{finish\}/);
  assert.doesNotMatch(css.match(/\.hero\[data-entry="playing"\] \.opening\s*\{[^}]*\}/)?.[0] ?? "", /infinite/);
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

test("full-viewport doors hand off to a small accent rather than a competing illustration", async () => {
  const source = await read("components/home/HeroOpening.tsx"), css = await read("components/home/hero.module.css");
  assert.match(source, /data-entry-stage aria-hidden="true"/);
  assert.match(source, /data-entry-leaf="left"/);
  assert.match(source, /data-entry-leaf="right"/);
  assert.match(source, /data-opening-sun/);
  assert.match(source, /while \(parent\)/);
  assert.match(source, /element\.clientWidth \/ 2/);
  assert.match(source, /element\.clientHeight \/ 2/);
  assert.match(source, /target\.clientHeight \/ 2/);
  assert.match(source, /scale: width \/ diameter/);
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
  assert.doesNotMatch(hero, /最低契約期間3ヶ月/);
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
  assert.doesNotMatch(opening, /viewBox="0 0 900 620"/);
  assert.match(opening, /data-hero-showcase/);
  assert.match(opening, /aria-hidden="true"/);
});

test("compact example orbit runs only when visible, with pause, keyboard and reduced-motion fallbacks", async () => {
  const source = await read("components/home/HeroShowcase.tsx"), css = await read("components/home/hero.module.css"), hero = await read("components/home/HeroExperience.tsx");
  assert.doesNotMatch(hero, /import.*TownScene|<TownScene/);
  assert.match(source, /priority=\{index === 0\}/);
  for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) assert.ok(source.includes(`"${key}"`));
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /aria-controls="hero-orbit-stage"/);
  assert.match(source, /role="list"/);
  assert.match(source, /target="_blank" rel="noopener noreferrer"/);
  assert.match(source, /架空の店舗・企業の制作見本です/);
  assert.doesNotMatch(source, /setInterval|setTimeout|requestAnimationFrame|fetch\(/);
  assert.match(source, /playing && motionAllowed && inView && entryReady && firstImageReady && pageVisible && !hovered/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /attributeFilter: \["data-entry"\]/);
  assert.match(source, /自動回転を停止/);
  assert.match(source, /自動回転を再開/);
  assert.match(source, /showCard/);
  assert.match(source, /<noscript>/);
  assert.match(css, /animation: websiteOrbit 42s linear infinite; animation-play-state: paused/);
  assert.match(css, /\.showcase\[data-auto-running="true"\] \.orbitRotor \{ animation-play-state: running/);
  assert.match(css, /preserve-3d/);
  assert.match(css, /grid-template-areas: "copy" "offer" "showcase"/);
  assert.match(css, /\.orbitCard[^\n]+transform: none!important/);
  const html = await read(".next/server/app/index.html");
  assert.ok(html.indexOf('aria-label="制作と運用の費用の目安"') < html.indexOf('data-hero-showcase'));
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
