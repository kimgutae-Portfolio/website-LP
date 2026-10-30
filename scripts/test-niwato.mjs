import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import ts from "typescript";
import sharp from "sharp";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const compiled=ts.transpileModule(await read("components/demo/niwato/content.ts"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {areas,plans,getQuote,yen,seasons,faqs}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
test("all six monthly quotes match their published inclusive prices",()=>{
 assert.deepEqual(areas,[30,60,100]);assert.equal(plans.length,2);
 const expected={monthly:[6600,9900,14300],twice:[11000,16500,24200]};
 for(const plan of plans)areas.forEach((area,i)=>{const q=getQuote(area,plan.id);assert.equal(q.total,expected[plan.id][i]);assert.equal(q.visits,plan.visits);assert.equal(q.taxIncluded,true);assert.equal(q.area,area);});
 assert.equal(yen(6600),"6,600");assert.equal(yen(24200),"24,200");
});
test("invalid areas and plans are rejected instead of producing an invalid charge",()=>{
 for(const area of [0,29,31,NaN,Infinity,"30",undefined])assert.throws(()=>getQuote(area,"monthly"),RangeError);
 for(const plan of ["yearly","",null])assert.throws(()=>getQuote(30,plan),RangeError);
});
test("seasonal care and billing expectations are explained including winter",()=>{
 assert.equal(seasons.length,4);for(const season of seasons)assert.ok(season.label&&season.months&&season.text&&season.task);
 assert.match(seasons[3].text,/無理に刈りません/);assert.equal(faqs.length,6);
 assert.match(faqs[4][1],/7日前/);assert.match(faqs[5][1],/カード情報の入力・送信、課金、訪問依頼は発生しません/);
});
test("checkout is a local simulation with no card fields, storage or payment network calls",async()=>{
 const checkout=await read("components/demo/niwato/Checkout.tsx");
 assert.equal((checkout.match(/<input\s/g)||[]).length,1);assert.match(checkout,/<input type="checkbox"/);
 assert.match(checkout,/disabled=\{!agreed\}/);assert.match(checkout,/setComplete\(true\)/);assert.match(checkout,/カード情報の取得・保存・送信は一切行いません/);assert.match(checkout,/決済・契約は発生していません/);
 for(const token of ["fetch(","localStorage","sessionStorage","stripe","cardNumber","cvc","type=\"email\""])assert.ok(!checkout.includes(token),token);
 assert.match(checkout,/setAgreed\(false\);setComplete\(false\)/);assert.match(checkout,/heading.current\?\.focus/);
});
test("comparison keeps aligned original and edited photographs with a real accessible slider",async()=>{
 const manifest=JSON.parse(await read("scripts/demo-niwato-assets.json"));
 const before=manifest.assets.find(x=>x.name==="before"),after=manifest.assets.find(x=>x.name==="after");
 assert.equal(after.reference,before.source);assert.match(after.prompt,/EXACT camera/);
 const source=await read("components/demo/niwato/BeforeAfter.tsx");assert.match(source,/type="range"/);assert.match(source,/aria-valuetext/);assert.match(source,/実際の施工実績ではありません/);
});
test("four original photographs are local, optimized and high resolution",async()=>{
 const manifest=JSON.parse(await read("scripts/demo-niwato-assets.json"));assert.equal(manifest.assets.length,4);let total=0;
 for(const asset of manifest.assets){const file=new URL(`../${asset.output}`,import.meta.url);const info=await stat(file);total+=info.size;assert.ok(info.size>10000&&info.size<750000);const m=await sharp(await readFile(file)).metadata();assert.equal(m.format,"webp");assert.ok(m.width>=1200);assert.ok(asset.prompt&&asset.source);}
 assert.ok(total<2000000);
});
test("rendered page is noindex, has one H1, clear demo pricing and working anchors",async()=>{
 const html=await read(".next/server/app/demo/niwato.html");assert.match(html,/name="robots" content="noindex/);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.match(html,/実際の請求・契約は発生しません/);assert.match(html.replace(/<!--.*?-->/g,""),/月額 ¥6,600/);assert.equal((html.match(/role="tab"/g)||[]).length,4);
 for(const match of html.matchAll(/href="#([^\"]+)"/g))assert.ok(html.includes(`id="${match[1]}"`),match[1]);
 assert.ok(!/<input[^>]+type="(?:text|email|number|password)"/.test(html));
});
test("demo is linked from the main portfolio and respects reduced motion",async()=>{
 const main=await read(".next/server/app/index.html");assert.match(main,/href="\/demo\/niwato"/);assert.ok(main.includes(encodeURIComponent("/demo/previews/niwato.webp")));
 const css=await read("components/demo/niwato/niwato.module.css");assert.match(css,/prefers-reduced-motion:reduce/);assert.ok(!css.includes("infinite"));assert.match(await read("app/demo/niwato/icon.svg"),/<svg/);
});
