import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import ts from "typescript";
import {loadSiteConfig} from "./load-site-config.mjs";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
async function moduleAt(p){const source=ts.transpileModule(await read(p),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);}
const {siteConfig,websiteExamples}=await loadSiteConfig();
const {exampleScrollTarget}=await moduleAt("components/pricing/example-scroll.ts");
test("one consultation-based offer uses both starting prices and retains the contract",()=>{
 const p=siteConfig.pricing;
 assert.equal(p.initialCost,"0");assert.equal(p.monthlyFrom,"5,500");assert.equal(p.priceTaxNote,"税込");assert.match(p.conditions,/3ヶ月/);
 assert.ok(!("mainPlan" in p)&&!("secondPlan" in p));assert.match(p.estimateNote,/基本構成の場合の開始価格/);assert.match(p.estimateNote,/ご納得いただいてから/);assert.match(p.optionalFeatures,/お問い合わせフォーム/);assert.match(p.basicScope,/初期費用0円/);
});
test("customer-specific Stripe payments preserve bank transfer and quote-first terms",async()=>{
 const {payments}=siteConfig;
 assert.match(payments.methods,/クレジットカード（Stripe）/);assert.match(payments.methods,/銀行振込/);
 assert.match(payments.guidance,/ご契約後/);assert.match(payments.guidance,/確定した金額/);assert.match(payments.timing,/ご契約前/);
 assert.match(payments.cardNote,/当サイトで入力・保存することはありません/);
 const faq=siteConfig.faq.find(item=>item.q==="支払い方法は何がありますか？");assert.ok(faq);assert.ok(faq.a.includes(payments.methods));
 const html=await read(".next/server/app/index.html"),legal=await read(".next/server/app/tokushoho.html"),privacy=await read(".next/server/app/privacy.html");
 for(const output of [html,legal]){assert.ok(output.includes(payments.methods));assert.ok(output.includes(payments.guidance));assert.doesNotMatch(output,/href="https:\/\/(?:buy|invoice)\.stripe\.com/);}
 assert.match(privacy,/https:\/\/stripe\.com\/jp\/privacy/);assert.match(privacy,/カード番号・セキュリティコードを当サイトで入力・保存することはありません/);
});
test("eight recent demos use unique valid links and current local cover assets",async()=>{
 const expected=["kasane","sumitoki","sui","komorebi","sekka","nagi","michiru","niwato"];
 assert.equal(websiteExamples.length,8);assert.equal(new Set(websiteExamples.map(x=>x.url)).size,8);
 for(const name of expected){const example=websiteExamples.find(x=>x.url===`/demo/${name}`);assert.ok(example?.category&&example.detail&&example.name);await stat(new URL(`../public${example.image}`,import.meta.url));}
 assert.equal(websiteExamples.find(x=>x.url==="/demo/komorebi").imageMode,"contain");assert.match(websiteExamples.find(x=>x.url==="/demo/niwato").detail,/決済はデモ/);
});
test("gallery stepping reaches the end on small screens and handles overscroll",()=>{
 const offsets=[0,282,564,846,1128,1410,1692,1974];
 assert.equal(exampleScrollTarget(0,2242,295,offsets,1),282);assert.equal(exampleScrollTarget(282,2242,295,offsets,-1),0);
 assert.equal(exampleScrollTarget(1692,2242,295,offsets,1),1947);assert.equal(exampleScrollTarget(1947,2242,295,offsets,1),1947);assert.equal(exampleScrollTarget(9999,2242,295,offsets,-1),1692);
 assert.equal(exampleScrollTarget(-200,2242,295,offsets,-1),0);assert.equal(exampleScrollTarget(0,100,300,[0],1),0);
});
test("desktop stepping clamps duplicate last targets and exposes the last three demos",()=>{
 const offsets=[0,300,600,900,1200,1500,1800,2100];
 assert.equal(exampleScrollTarget(1500,2382,882,offsets,1),1500);assert.equal(exampleScrollTarget(1500,2382,882,offsets,-1),1200);assert.equal(exampleScrollTarget(1200,2382,882,offsets,1),1500);
});
test("main gallery promotes the eight recent sites, not the old templates",async()=>{
 const html=await read(".next/server/app/index.html"),demo=html.slice(html.indexOf('id="demo"'),html.indexOf('id="price"'));
 assert.match(demo,/id="website-examples"/);
 for(const example of websiteExamples){assert.ok(demo.includes(`href="${example.url}"`));assert.ok(demo.includes(encodeURIComponent(example.image)));}
 assert.equal((demo.match(/class="[^"]*exampleCard[^\"]*"/g)||[]).length,8);assert.match(demo,/target="_blank" rel="noopener noreferrer"/);assert.match(demo,/href="#price"/);
 for(const name of ["nozomi","luce","maruta"])assert.ok(!html.includes(`href="/demo/${name}"`));
});
test("zero-start pricing is consistent and qualified across public prices, metadata, schema and legal text",async()=>{
 const html=await read(".next/server/app/index.html"),legal=await read(".next/server/app/tokushoho.html");
 for(const source of [html,legal]){assert.doesNotMatch(source,/30,000/);assert.match(source,/5,500/);assert.match(source,/初期費用0円/);assert.match(source,/基本構成/);assert.match(source,/別途お見積り/);assert.ok(!/基本プラン|カスタムプラン|最短3日/.test(source));}
 assert.match(html,/制作初期費用0円〜・月額運用費5,500円〜/);assert.match(html,/制作内容と費用を<br\/>LINEで相談する/);
 const price=html.slice(html.indexOf('id="price"'),html.indexOf('id="flow"'));
 assert.match(price,/初期費用0円は基本構成の場合の開始価格/);assert.match(price,/追加機能は別途お見積り/);assert.match(price,/href="https:\/\/lin\.ee\/Ny9tbUX"/);assert.match(price,/href="#contact"/);
 const og=await read("app/opengraph-image.tsx");assert.match(og,/siteConfig.pricing.initialCost/);assert.match(og,/siteConfig.pricing.monthlyFrom/);
});
test("gallery is native scrolling, keyboard accessible and reduced-motion aware",async()=>{
 const source=await read("components/pricing/WebsiteExamples.tsx"),css=await read("components/pricing/pricing.module.css");
 assert.match(source,/tabIndex=\{0\}/);assert.match(source,/ResizeObserver/);assert.match(source,/prefers-reduced-motion: reduce/);assert.match(source,/event.key==="Home"/);assert.match(css,/scroll-snap-type:x mandatory/);assert.match(css,/prefers-reduced-motion:reduce/);assert.ok(!source.includes('"wheel"')&&!source.includes('"touchmove"'));
});
test("every demo explicitly distinguishes setup scope from paid additions",async()=>{
 assert.equal(websiteExamples.filter(item=>item.offer.kind==="zero").length,4);
 assert.equal(websiteExamples.filter(item=>item.offer.kind!=="zero").length,4);
 for(const example of websiteExamples){
  const slug=example.url.split("/").at(-1),html=await read(`.next/server/app/demo/${slug}.html`);
  assert.match(html,new RegExp(`data-demo-price-guide="${slug}"`));
  assert.match(html,/id="production-scope"/);assert.match(html,/追加制作費が必要なこと/);
  assert.match(html,/月額運用費/);assert.match(html,/最低契約期間3ヶ月/);
  for(const text of example.offer.included)assert.ok(html.includes(text),`${slug}: ${text}`);
  for(const text of example.offer.additional)assert.ok(html.includes(text),`${slug}: ${text}`);
  if(example.offer.kind==="zero")assert.equal(example.offer.initialFrom,0);
 }
 const english=websiteExamples.find(item=>item.url==="/demo/michiru");
 assert.equal(english.offer.kind,"custom");assert.equal(english.offer.initialFrom,55000);
 assert.equal(english.offer.breakdown.reduce((sum,item)=>sum+item.amount,0),55000);
 assert.match(english.offer.note,/初期0円の対象外/);
 const html=await read(".next/server/app/index.html");
 assert.match(html,/制作初期費用で見本を絞り込む/);assert.match(html,/初期0円の制作例/);assert.match(html,/追加制作費のある例/);
 assert.equal((html.match(/data-offer-kind="zero"/g)||[]).length,4);
 assert.equal((html.match(/data-offer-kind="(?:custom|system)"/g)||[]).length,4);
 assert.match(await read("components/pricing/WebsiteExamples.tsx"),/<details className=\{styles.scopeDetails\}>/);
});
