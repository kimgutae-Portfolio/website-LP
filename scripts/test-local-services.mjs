import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { loadSiteConfig } from "./load-site-config.mjs";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const { siteConfig } = await loadSiteConfig();

test("local service information is server rendered with descriptive headings and real links", async () => {
  const html = await read(".next/server/app/index.html");
  const service = html.slice(html.indexOf('id="home-strengths"'), html.indexOf('id="home-problem-heading"'));
  assert.match(service, /aria-labelledby="local-service-heading"/);
  assert.ok(service.includes(siteConfig.localService.title));
  assert.equal(siteConfig.localService.industries.length, 4);
  for (const industry of siteConfig.localService.industries) {
    assert.ok(service.includes(industry.category));
    assert.ok(service.includes(industry.title));
    assert.ok(service.includes(industry.scope));
    for (const detail of industry.details) assert.ok(service.includes(detail));
    assert.ok(service.includes(`href="${industry.exampleHref}"`));
    assert.ok(service.includes(industry.exampleLabel));
    await read(`.next/server/app${industry.exampleHref}.html`);
  }
  for (const href of ["#price", "#contact", "/column/google-and-local-search", "/column/website-preparation"]) {
    assert.ok(service.includes(`href="${href}"`));
  }
  assert.match(service, /実際のお客様の制作実績ではありません/);
  assert.doesNotMatch(service, /深井中町|必ず上位|順位保証|集客保証/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
});

test("local service preserves basic prices, extra-fee boundaries and optional visits", async () => {
  const { localService, hero, pricing, faq } = siteConfig;
  assert.equal(pricing.initialCost, "0");
  assert.equal(pricing.monthlyFrom, "5,500");
  assert.match(localService.basicText, /対象の制作見本|1ページ|基本構成/);
  assert.match(localService.additionalText, /お問い合わせフォーム/);
  assert.match(localService.additionalText, /制作前/);
  assert.match(localService.industries.find(item => item.category === "教室・習い事").scope, /フォームは追加制作/);
  assert.match(localService.areaText, /堺市外/);
  assert.match(localService.areaText, /直接お話ししたい方/);
  assert.match(localService.areaText, /事前にご相談/);
  assert.ok(hero.strengths.some(item => item.text.includes("掲載・順位は保証しません")));
  assert.match(faq.find(item => item.q.includes("今あるホームページ")).a, /契約・管理状況/);
  assert.match(faq.find(item => item.q.includes("検索に")).a, /順位を保証するものではありません/);
  const css = await read("components/home/services.module.css");
  assert.match(css, /max-width: 700px/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /white-space: nowrap;[^}]*width: [3-9]\d\dpx/);
});

test("metadata and sitemap reflect the substantive homepage update without indexing fictional demos", async () => {
  const html = await read(".next/server/app/index.html");
  const sitemap = await read(".next/server/app/sitemap.xml.body");
  assert.match(siteConfig.meta.description, /堺市中区/);
  assert.match(siteConfig.meta.description, /飲食店・美容室・教室・会社/);
  assert.ok(html.includes(siteConfig.meta.description));
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.ok(sitemap.includes(`<lastmod>${siteConfig.localService.updatedAt}T00:00:00.000Z</lastmod>`) || sitemap.includes(`<lastmod>${siteConfig.localService.updatedAt}</lastmod>`));
  assert.doesNotMatch(sitemap, /\/demo\//);
  assert.match(await read("components/Header.tsx"), /href: "#home-strengths", label: "サービス内容"/);
});
