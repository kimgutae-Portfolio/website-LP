import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import ts from "typescript";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const output=ts.transpileModule(await read("content/columns.ts"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2021}}).outputText;
const {columnArticles,getColumn}=await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
const expected=["business-system-outsourcing","website-outsourcing-partner","why-a-website","website-preparation","website-costs","google-and-local-search","website-maintenance"];
function structuredData(html){return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));}

test("seven original, substantial Japanese articles have distinct themes and valid section/related links",()=>{
 assert.equal(columnArticles.length,7);assert.equal(new Set(columnArticles.map(x=>x.slug)).size,7);assert.equal(new Set(columnArticles.map(x=>x.theme)).size,7);
 for(const slug of expected){const a=getColumn(slug);assert.ok(a);assert.ok(a.description.length>45);assert.ok(a.lead.length>75);assert.equal(a.sections.length,4);assert.equal(new Set(a.sections.map(x=>x.id)).size,4);const readingText=[a.lead,a.takeaway,...a.sections.flatMap(s=>[s.title,...s.paragraphs,...(s.bullets??[]),s.note??"",...(s.comparison??[]).flatMap(row=>Object.values(row))])].join("");assert.ok(readingText.length>1000,slug);for(const related of a.relatedSlugs)assert.ok(getColumn(related)&&related!==slug);assert.match(a.publishedAt,/^\d{4}-\d{2}-\d{2}$/);}
 assert.equal(getColumn("not-an-article"),undefined);
});
test("search guidance uses primary official references and makes no ranking promise",()=>{
 const article=getColumn("google-and-local-search");
 for(const section of article.sections){assert.ok(section.sources?.length);for(const source of section.sources)assert.ok(["developers.google.com","support.google.com"].includes(new URL(source.url).hostname));}
 const text=article.sections.flatMap(s=>s.paragraphs).join("");assert.match(text,/保証されるものではありません/);assert.match(text,/関連性/);assert.match(text,/距離/);assert.match(text,/知名度/);
});
test("main section and index expose all seven real article links in static HTML",async()=>{
 const home=await read(".next/server/app/index.html"),index=await read(".next/server/app/column.html");
 const section=home.slice(home.indexOf('id="column"'),home.indexOf('id="faq"'));
 assert.match(section,/お役立ちコラム/);assert.match(section,/href="\/column"/);assert.equal((section.match(/記事を読む/g)||[]).length,7);
 for(const slug of expected){assert.ok(section.includes(`href="/column/${slug}"`));assert.ok(index.includes(`href="/column/${slug}"`));}
 assert.equal((index.match(/<h1(?:\s|>)/g)||[]).length,1);assert.match(index,/<link rel="canonical" href="https:\/\/machinowebs.com\/column"/);
 const schema=structuredData(index).find(x=>x["@type"]==="CollectionPage");assert.equal(schema.mainEntity.itemListElement.length,7);
});
test("articles render complete content, self-canonical metadata, honest bylines and valid Article/Breadcrumb data",async()=>{
 for(const article of columnArticles){const html=await read(`.next/server/app/column/${article.slug}.html`);
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.ok(html.includes(article.title));assert.ok(html.includes(article.lead));assert.ok(html.includes(article.takeaway));
  assert.ok(html.includes(`rel="canonical" href="https://machinowebs.com/column/${article.slug}"`));assert.match(html,/property="og:type" content="article"/);assert.match(html,/name="robots" content="index, follow"/);
  assert.match(html,/執筆：/);assert.match(html,/まちのWeb/);assert.ok(!html.includes("nextjs-portal"));
  for(const section of article.sections){assert.ok(html.includes(`href="#${section.id}"`));assert.ok(html.includes(`id="${section.id}"`));for(const p of section.paragraphs)assert.ok(html.includes(p));}
  const graph=structuredData(html).find(x=>x["@graph"])["@graph"],post=graph.find(x=>x["@type"]==="BlogPosting"),crumb=graph.find(x=>x["@type"]==="BreadcrumbList");
  assert.equal(post.headline,article.title);assert.equal(post.datePublished,article.publishedAt);assert.equal(post.author.name,"まちのWeb");assert.equal(post.mainEntityOfPage["@id"],`https://machinowebs.com/column/${article.slug}`);assert.equal(crumb.itemListElement.length,3);
 }
});
test("articles link to related reading, consultation and the main sections rather than broken in-page targets",async()=>{
 for(const article of columnArticles){const html=await read(`.next/server/app/column/${article.slug}.html`);
  for(const slug of article.relatedSlugs)assert.ok(html.includes(`href="/column/${slug}"`));
  for(const target of ["/#top","/#demo","/#price","/#column","/#contact"])assert.ok(html.includes(`href="${target}"`));
  assert.match(html,/href="https:\/\/lin\.ee\/Ny9tbUX"/);assert.ok(!/<form(?:\s|>)/.test(html));
  for(const match of html.matchAll(/href="#([^\"]+)"/g))assert.ok(html.includes(`id="${match[1]}"`),`${article.slug}: ${match[1]}`);
 }
});
test("sitemap discovers the index and seven articles without exposing illustrative demos",async()=>{
 const xml=await read(".next/server/app/sitemap.xml.body");assert.match(xml,/<loc>https:\/\/machinowebs.com\/column<\/loc>/);
 for(const slug of expected)assert.ok(xml.includes(`<loc>https://machinowebs.com/column/${slug}</loc>`));assert.ok(!xml.includes("/demo/"));
});
test("outsourcing guide gives production partners useful scope, safe handoff and an appropriate consultation path",async()=>{
 const article=getColumn("website-outsourcing-partner");
 assert.ok(columnArticles.some(item=>item.slug===article.slug));
 assert.equal(article.audience,"partners");
 assert.equal(article.publishedAt,"2026-11-06");
 const text=[article.lead,article.takeaway,...article.sections.flatMap(section=>[...section.paragraphs,...(section.bullets??[]),section.note??""])].join("\n");
 for(const phrase of ["制作会社", "デザイン事務所", "コーディング", "React・Next.js", "スマートフォン", "検収", "ソースコード", "秘密保持", "掲載可否", "個別にお見積り", "対応できない場合", "パスワード", "個人情報"])assert.ok(text.includes(phrase),phrase);
 assert.match(text,/お客様の情報や制作途中の画面を、確認なく公開/);
 assert.match(text,/店舗・事業者さま向けの初期費用・月額運用費の案内とは分けて/);
 assert.doesNotMatch(text,/最短即日納品|必ず上位表示|満足度\d|受託実績\d|外注.*0円/);
 const html=await read(`.next/server/app/column/${article.slug}.html`);
 assert.match(html,/LINEで外注の相談をする/);
 assert.match(html,/フォームで外注の相談をする/);
 assert.match(html,/外注したい作業を、/);
 assert.match(html,/href="\/#demo"/);
 assert.match(html,/data-theme="partner"/);
 assert.doesNotMatch(html,/あなたのお店なら、/);
 assert.ok(getColumn("website-maintenance").relatedSlugs.includes(article.slug));
 assert.ok((await read(".next/server/app/column/website-maintenance.html")).includes(`href="/column/${article.slug}"`));
 const sitemap=await read(".next/server/app/sitemap.xml.body");
 assert.match(sitemap,/<loc>https:\/\/machinowebs.com\/column\/website-outsourcing-partner<\/loc>\s*<lastmod>2026-11-06/);
 const general=await read(".next/server/app/column/why-a-website.html");
 assert.match(general,/あなたのお店なら、/);
 assert.doesNotMatch(general,/LINEで外注の相談をする/);
});
test("system outsourcing guide offers realistic business scopes, safe discovery and its own development consultation",async()=>{
 const article=getColumn("business-system-outsourcing");
 assert.equal(columnArticles[0].slug,article.slug);
 assert.equal(article.audience,"systems");
 assert.equal(article.publishedAt,"2026-11-06");
 const text=[article.lead,article.takeaway,...article.sections.flatMap(section=>[...section.paragraphs,...(section.bullets??[]),section.note??""])].join("\n");
 for(const phrase of ["顧客・予約管理","在庫・備品管理","請求書作成","シフト","API連携","既存システムの改修","制作会社","開発部分だけの外注","要件定義","アクセス権限","バックアップ","個人情報","パスワード","APIキー","テスト用","ソースコード","秘密保持","個別にお見積り","gutae.dev"])assert.ok(text.includes(phrase),phrase);
 assert.match(text,/完成済みの商品や導入実績を示すものではありません/);
 assert.match(text,/初期0円・月額運用費の案内とは別/);
 assert.match(text,/実際の送信・課金が起きない方法/);
 assert.match(text,/個人情報、本番のデータ、パスワード、APIキーをお問い合わせフォームやLINEに貼り付けないでください/);
 const requirements=article.sections.find(section=>section.id==="prepare-system-brief");
 assert.ok(requirements.sources.some(source=>source.url==="https://dx.ipa.go.jp/youken-teigi"));
 assert.doesNotMatch(text,/必ず業務効率|最短即日|満足度\d|開発実績\d|無料で開発/);
 const html=await read(`.next/server/app/column/${article.slug}.html`);
 assert.match(html,/data-theme="system"/);
 assert.match(html,/業務システム開発の外注を検討される企業・制作会社の方/);
 assert.match(html,/LINEでシステム開発を相談/);
 assert.match(html,/フォームでシステム開発を相談/);
 const consultation=html.slice(html.lastIndexOf('aria-labelledby="article-consult-heading"'),html.indexOf('</main>'));
 assert.match(consultation,/href="\/#contact"/);
 assert.match(consultation,/href="https:\/\/gutae.dev" target="_blank" rel="noopener noreferrer"/);
 assert.match(consultation,/システム開発の実績を見る（gutae.dev）/);
 assert.doesNotMatch(consultation,/制作・運用の費用を見る|ホームページの制作見本を見る|コーディング・更新だけ/);
 assert.ok(article.relatedSlugs.includes("website-outsourcing-partner"));
 assert.ok(getColumn("website-outsourcing-partner").relatedSlugs.includes(article.slug));
 const partner=await read(".next/server/app/column/website-outsourcing-partner.html");
 assert.ok(partner.includes(`href="/column/${article.slug}"`));
 assert.match(partner,/LINEで外注の相談をする/);
 assert.doesNotMatch(partner,/LINEでシステム開発を相談/);
 assert.match(await read(".next/server/app/sitemap.xml.body"),/<loc>https:\/\/machinowebs.com\/column\/business-system-outsourcing<\/loc>\s*<lastmod>2026-11-06/);
});
test("unique share images are real PNGs and the reading layout is progressively enhanced",async()=>{
 for(const path of ["column",...expected.map(slug=>`column/${slug}`)]){const file=new URL(`../.next/server/app/${path}/opengraph-image.body`,import.meta.url);const bytes=await readFile(file);assert.equal(bytes.subarray(1,4).toString(),"PNG");assert.ok((await stat(file)).size>10000);}
 const page=await read("app/column/[slug]/page.tsx"),css=await read("components/column/column.module.css");
 assert.ok(!page.includes('"use client"'));assert.match(page,/generateStaticParams/);assert.match(css,/overflow-x: auto/);assert.match(css,/prefers-reduced-motion: reduce/);
});
