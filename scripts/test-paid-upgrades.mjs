import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import ts from "typescript";
import {loadSiteConfig} from "./load-site-config.mjs";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const {websiteExamples}=await loadSiteConfig();
async function leaf(path){const code=ts.transpileModule(await read(path),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);}
const {stayEstimate}=await leaf("components/demo/nagi/stay-data.ts");
const {recommendCourse}=await leaf("components/demo/michiru/course-guide.ts");
const paths=["kasane/projects/workplace","kasane/projects/atelier","nagi/stay","niwato/member"];

test("only the four paid examples receive upgrades, without changing their prices",()=>{
 const free=websiteExamples.filter(item=>item.offer.kind==="zero"),paid=websiteExamples.filter(item=>item.offer.kind!=="zero");
 assert.equal(free.length,4);assert.equal(paid.length,4);
 for(const item of free){assert.equal(item.offer.initialFrom,0);assert.equal(item.offer.upgrade,undefined);}
 for(const item of paid){assert.ok(item.offer.upgrade?.title&&item.offer.upgrade?.cta);assert.equal(item.offer.upgrade.features.length,3);assert.match(item.offer.upgrade.href,/^\/demo\//);}
 assert.equal(paid.find(item=>item.url==="/demo/michiru").offer.initialFrom,55000);
 for(const item of paid.filter(item=>item.url!=="/demo/michiru"))assert.equal(item.offer.initialFrom,null);
});
test("new paid pages are complete noindex documents, with no live personal-data forms",async()=>{
 for(const path of paths){const html=await read(`.next/server/app/demo/${path}.html`);assert.match(html,/name="robots" content="noindex/);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);assert.match(html,new RegExp(`rel="canonical" href="https://machinowebs.com/demo/${path}"`));assert.doesNotMatch(html,/data-demo-price-guide|production-scope|この見本でできること、/);assert.match(html,/架空/);assert.doesNotMatch(html,/<form(?:\s|>)/);assert.doesNotMatch(html,/<input[^>]+type="(?:text|email|password|tel)"/);}
 const sitemap=await read(".next/server/app/sitemap.xml.body");assert.doesNotMatch(sitemap,/\/demo\//);
});
test("main gallery exposes a direct interaction link for every paid example only",async()=>{
 const html=await read(".next/server/app/index.html");
 const cards=[...html.matchAll(/<article[^>]*data-offer-kind="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];assert.equal(cards.length,8);
 for(const [,kind,body] of cards)assert.equal(body.includes("追加制作で、ここまで。"),kind!=="zero");
 for(const item of websiteExamples.filter(item=>item.offer.upgrade)){assert.ok(html.includes(`href="${item.offer.upgrade.href}"`));assert.ok(html.includes(item.offer.upgrade.cta));}
});
test("stay planner calculates each fixed two-adult sample and rejects invalid input",()=>{
 for(const style of [0,1])for(const nights of [1,2]){const quote=stayEstimate(style,nights);assert.equal(quote.guests,2);assert.equal(quote.total,(style===0?18700:26400)*2*nights);}
 for(const input of [[-1,1],[2,1],[0,0],[0,3],[NaN,1]])assert.throws(()=>stayEstimate(...input),RangeError);
});
test("course guide respects each age group and qualifies its example recommendations",()=>{
 for(const age of ["first","explore","next"])for(const experience of [0,1])for(const goal of [0,1,2]){const result=recommendCourse(age,experience,goal);assert.equal(result.id,age);assert.ok(result.reason.length>20);}
 for(const input of [["unknown",0,0],["first",3,0],["first",0,-1]])assert.throws(()=>recommendCourse(...input),RangeError);
});
test("planners and member portal never send, persist, authenticate or charge",async()=>{
 for(const path of ["nagi/NagiStayPage.tsx","michiru/MichiruCourseFinder.tsx","niwato/NiwatoMemberPage.tsx"]){const source=await read(`components/demo/${path}`);assert.doesNotMatch(source,/fetch\(|axios|localStorage|sessionStorage|sendBeacon|\/api\/|type="(?:password|email|tel)"/);assert.match(source,/送信|手続き/);assert.match(source,/保存/);}
 const portal=await read("components/demo/niwato/NiwatoMemberPage.tsx");for(const text of ["訪問日の表示を変更","変更内容を確認する","明細","休止","再開","実際の会員機能・安全な認証・決済接続"])assert.ok(portal.includes(text),text);
 assert.match(await read("components/demo/michiru/MichiruContactPage.tsx"),/courses.some\(item=>item.id===requested\)/);
});
test("corporate stories are linked from the showcase and connect to each other",async()=>{
 const home=await read(".next/server/app/demo/kasane.html");
 for(const slug of ["workplace","atelier"]){assert.ok(home.includes(`href="/demo/kasane/projects/${slug}"`));const html=await read(`.next/server/app/demo/kasane/projects/${slug}.html`);for(const text of ["THE IDEA BEHIND THE SPACE","MATERIAL NOTES","NEXT PROJECT","架空の提案"])assert.ok(html.includes(text));assert.match(html,/href="\/demo\/kasane#kasane-contact"/);}
});
