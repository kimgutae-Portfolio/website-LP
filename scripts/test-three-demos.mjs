import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import ts from "typescript";
import sharp from "sharp";
const read=relative=>readFile(new URL(`../${relative}`,import.meta.url),"utf8");
async function content(name) { const source=await read(`components/demo/${name}/content.ts`); const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText; return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`); }
const sekka=await content("sekka"),nagi=await content("nagi"),michiru=await content("michiru");
const gallerySource=await read("components/demo/nagi/gallery-scroll.ts");
const galleryModule=ts.transpileModule(gallerySource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {galleryScrollState}=await import(`data:text/javascript;base64,${Buffer.from(galleryModule).toString("base64")}`);
test("inn gallery follows mobile scroll position and clamps the last photograph correctly",()=>{
 const first=galleryScrollState(0,912,337,[24,318,612]);
 assert.deepEqual(first.targets,[0,294,575]); assert.equal(first.index,0);assert.equal(first.atStart,true);assert.equal(first.atEnd,false);
 const middle=galleryScrollState(294,912,337,[24,318,612]);assert.equal(middle.index,1);assert.ok(middle.progress>50&&middle.progress<52);
 const last=galleryScrollState(575,912,337,[24,318,612]);assert.equal(last.index,2);assert.equal(last.progress,100);assert.equal(last.atEnd,true);
});
test("gallery handles elastic overscroll, empty tracks and tracks without overflow",()=>{
 assert.equal(galleryScrollState(-80,912,337,[24,318,612]).progress,0);
 assert.equal(galleryScrollState(1000,912,337,[24,318,612]).progress,100);
 for(const offsets of [[],[24]]){const state=galleryScrollState(0,300,337,offsets);assert.equal(state.index,0);assert.equal(state.progress,0);assert.equal(state.atStart,true);assert.equal(state.atEnd,true);}
});
test("gallery index calculation also accommodates wide editorial photographs",()=>{
 const middle=galleryScrollState(836,2776,1425,[152,988,1824]);assert.equal(middle.index,1);
 const last=galleryScrollState(1351,2776,1425,[152,988,1824]);assert.equal(last.index,2);assert.equal(last.atEnd,true);
 assert.equal(nagi.gallery.length,3);for(const scene of nagi.gallery)assert.ok(scene.title&&scene.alt&&scene.note&&scene.english);
});
test("gallery exposes a real position slider, keyboard controls and large-photo actions",async()=>{
 const html=await read(".next/server/app/demo/nagi.html");
 assert.match(html,/id="nagi-gallery"/);assert.match(html,/aria-label="写真のスクロール位置"/);assert.match(html,/type="range"/);
 assert.equal((html.match(/aria-label="館内写真を大きく見る：/g)||[]).length,3);
 const source=await read("components/demo/nagi/NagiGallery.tsx");assert.match(source,/prefers-reduced-motion: reduce/);assert.match(source,/ResizeObserver/);assert.match(source,/event\.key === "End"/);assert.ok(!source.includes('"wheel"')&&!source.includes('"touchmove"'));
});
test("manufacturing demo has three distinct processes and three illustrative samples",()=>{
 assert.equal(sekka.processes.length,3); assert.equal(new Set(sekka.processes.map(x=>x.id)).size,3);
 for(const item of sekka.processes) assert.ok(item.title&&item.description&&item.materials&&item.applications&&item.image);
 assert.equal(sekka.examples.length,3); assert.equal(sekka.news.length,3);
});
test("inn has three time-of-day scenes and two clearly priced illustrative plans",()=>{
 assert.equal(nagi.moments.length,3); assert.equal(new Set(nagi.moments.map(x=>x.image)).size,3);
 for(const item of nagi.moments) assert.ok(item.time&&item.title&&item.text&&item.alt);
 assert.equal(nagi.plans.length,2); for(const plan of nagi.plans) assert.match(plan.price,/^[\d,]+$/);
 assert.equal(new URL(nagi.bookingUrl).hostname,"travel.rakuten.co.jp"); assert.equal(nagi.faqs.length,3);
});
test("English school has three complete courses, fees and interactive phrases",()=>{
 assert.equal(michiru.courses.length,3); assert.equal(new Set(michiru.courses.map(x=>x.id)).size,3);
 for(const course of michiru.courses) {assert.ok(course.age&&course.day&&course.time&&course.description);assert.match(course.fee,/^[\d,]+$/);assert.equal(course.points.length,3);}
 assert.equal(michiru.phrases.length,3); for(const item of michiru.phrases) assert.ok(item.english&&item.japanese&&item.note);
 assert.equal(michiru.faqs.length,4); assert.equal(michiru.news.length,3);
});
test("all twelve original images are optimized, local, high-resolution WebP files",async()=>{
 const assets=JSON.parse(await read("scripts/demo-three-assets.json")); assert.equal(assets.length,12);
 let total=0;
 for(const asset of assets) {assert.ok(asset.prompt.includes("Use case:"));const file=new URL(`../public/demo/${asset.asset}.webp`,import.meta.url);const info=await stat(file);total+=info.size;assert.ok(info.size>10000&&info.size<750000,asset.asset);const image=await sharp(await readFile(file)).metadata();assert.equal(image.format,"webp");assert.ok(image.width>=1200);}
 assert.ok(total<5000000);
});
test("all new demos are noindex with a single primary heading, working section anchors, and no forms",async()=>{
 for(const name of ["sekka","nagi","michiru"]) {const html=await read(`.next/server/app/demo/${name}.html`);assert.match(html,/name="robots" content="noindex/);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.ok(!/<form(?:\s|>)/i.test(html));assert.match(html,/架空/);assert.match(html,/data-demo-opening/);for(const match of html.matchAll(/href="#([^\"]+)"/g))assert.ok(html.includes(`id="${match[1]}"`),`${name}: missing ${match[1]}`);}
});
test("each demo contains its purpose-specific content and controls",async()=>{
 const a=await read(".next/server/app/demo/sekka.html"),b=await read(".next/server/app/demo/nagi.html"),c=await read(".next/server/app/demo/michiru.html");
 assert.equal((a.match(/role="tab"/g)||[]).length,3); assert.match(a,/品質への姿勢/);assert.match(a,/実際の製造・納入実績/);
 assert.equal((b.match(/role="tab"/g)||[]).length,3);assert.match(b,/温泉・泉質・効能を示すものではありません/);assert.match(b,/href="https:\/\/travel\.rakuten\.co\.jp\/" target="_blank" rel="noopener noreferrer"/);
 const course=await read(".next/server/app/demo/michiru/courses.html");
 assert.equal((course.match(/role="tab"/g)||[]).length,6);assert.equal((c.match(/<details>/g)||[]).length,4);assert.match(c,/実在の講師・資格・経歴を示すものではありません/);
 assert.match(c,/href="\/demo\/michiru\/courses"/);assert.match(c,/href="\/demo\/michiru\/contact"/);
});
test("English school has three real noindex pages and a strictly non-sending demo form",async()=>{
 const home=await read(".next/server/app/demo/michiru.html");
 for(const page of ["courses","contact"]){
  const html=await read(`.next/server/app/demo/michiru/${page}.html`);
  assert.match(html,/name="robots" content="noindex/);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
  assert.match(html,new RegExp(`rel="canonical" href="https://machinowebs.com/demo/michiru/${page}"`));
  assert.doesNotMatch(html,/data-demo-price-guide|production-scope|55,000円〜|この見本でできること、/);
  for(const route of ["/demo/michiru","/demo/michiru/courses","/demo/michiru/contact"])assert.ok(html.includes(`href="${route}"`));
 }
 const html=await read(".next/server/app/demo/michiru/contact.html"),source=await read("components/demo/michiru/MichiruContactPage.tsx");
 assert.doesNotMatch(home,/data-demo-price-guide|production-scope/);assert.match(html,/<form[^>]*data-demo-contact-form/);
 assert.match(html,/送信されない、フォームの操作見本です/);assert.match(html,/個人情報は入力しないでください/);
 assert.equal((html.match(/readOnly=""/g)||[]).length,3);assert.match(html,/data-clarity-mask="true"/);
 assert.match(source,/event.preventDefault\(\)/);assert.match(source,/setStep\("confirm"\)/);assert.match(source,/setStep\("complete"\)/);
 assert.doesNotMatch(source,/fetch\(|localStorage|sessionStorage|sendBeacon|mailto:|\/api\//);
 const sitemap=await read(".next/server/app/sitemap.xml.body");assert.ok(!sitemap.includes("/demo/"));
});
test("inn photo film is local, lightweight, and only mounted on demand",async()=>{
 const file=await stat(new URL("../public/demo/nagi/photo-film.mp4",import.meta.url));assert.ok(file.size>100000&&file.size<4000000);
 assert.ok(!/<video(?:\s|>)/i.test(await read(".next/server/app/demo/nagi.html")));
});
test("shared motion is progressive enhancement, finite and respects live reduced-motion preferences",async()=>{
 const source=await read("components/demo/shared/PremiumDemo.tsx"),css=await read("components/demo/shared/premium.module.css");
 assert.match(source,/prefers-reduced-motion: reduce/);assert.match(source,/preference\.addEventListener\("change", configure\)/);assert.match(source,/paused \|\| document\.hidden \|\| preference\.matches/);assert.match(source,/rootMargin: "100px"/);assert.ok(!source.includes('"wheel"')&&!source.includes('"touchmove"'));assert.match(css,/prefers-reduced-motion:reduce/);assert.match(source,/\[data-demo-opening\]\{display:none!important\}/);
 for(const name of ["sekka","nagi","michiru"])assert.ok(!(await read(`components/demo/${name}/${name}.module.css`)).includes("infinite"));
});
test("main showcase links all three demos and previews their actual first screens",async()=>{
 const html=await read(".next/server/app/index.html");
 for(const name of ["sekka","nagi","michiru"]) {assert.match(html,new RegExp(`href="/demo/${name}"`));assert.ok(html.includes(encodeURIComponent(`/demo/previews/${name}.webp`)));assert.match(await read(`app/demo/${name}/icon.svg`),/<svg/);}
});
