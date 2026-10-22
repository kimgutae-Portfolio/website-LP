import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import ts from "typescript";
const exec=promisify(execFile);
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const output=ts.transpileModule(await read("components/home/reel.ts"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {reelSceneAt,REEL_DURATION}=await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);

test("reel captions follow the three crossfades and return to the first scene at the loop seam",()=>{
 assert.equal(REEL_DURATION,16.4);
 for(const [time,expected] of [[-1,0],[0,0],[5.59,0],[5.6,1],[10.79,1],[10.8,2],[15.99,2],[16,0],[16.4,0],[NaN,0],[Infinity,0]])assert.equal(reelSceneAt(time),expected);
});
test("both local reels are lightweight, silent H.264 with deliberate mobile and desktop dimensions",async()=>{
 for(const [name,width,height] of [["design-reel",960,1280],["design-reel-mobile",640,1136]]){
  const file=new URL(`../public/home/${name}.mp4`,import.meta.url);const size=(await stat(file)).size;assert.ok(size>100000&&size<4000000);
  const {stdout}=await exec("ffprobe",["-v","error","-show_entries","stream=codec_type,codec_name,width,height,r_frame_rate:format=duration","-of","json",file.pathname]);const info=JSON.parse(stdout);
  assert.equal(info.streams.length,1);assert.equal(info.streams[0].codec_type,"video");assert.equal(info.streams[0].codec_name,"h264");assert.equal(info.streams[0].width,width);assert.equal(info.streams[0].height,height);assert.equal(info.streams[0].r_frame_rate,"24/1");assert.ok(Math.abs(Number(info.format.duration)-REEL_DURATION)<.1);
 }
});
test("the first screen is a real, server-rendered homepage rather than a loading gate",async()=>{
 const html=await read(".next/server/app/index.html");assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.match(html,/そのお店らしさが、/);assert.match(html,/ちゃんと伝わる。/);assert.match(html,/data-home-hero/);assert.match(html,/data-hero-media/);assert.match(html,/data-opening-mark/);
 assert.ok(html.includes(encodeURIComponent("/demo/kasane/hero-no-people.webp")));assert.ok(!/<video(?:\s|>)/.test(html));assert.ok(!html.includes("PhoneMockup")&&!html.includes("スマホ最適化"));
 assert.match(html,/制作初期費用/);assert.match(html,/30,000/);assert.match(html,/5,500/);assert.match(html,/制作見本を見てみる/);assert.match(html,/架空の店舗・企業の制作見本をもとにしたイメージ映像/);
 for(const match of html.matchAll(/href="#([^\"]+)"/g))assert.ok(html.includes(`id="${match[1]}"`),match[1]);
});
test("the same media frame expands into the hero, with finite and reduced-motion-safe CSS",async()=>{
 const source=await read("components/home/HeroExperience.tsx"),css=await read("components/home/home.module.css");
 assert.equal((source.match(/data-hero-media/g)||[]).length,1);assert.match(css,/@keyframes windowArrival/);assert.match(css,/prefers-reduced-motion: reduce/);assert.match(css,/\.entryBrand[^}]*opacity: 0/);assert.ok(!/animation[^;}]*infinite/.test(css));assert.ok(!source.includes("preventDefault")&&!source.includes('style.overflow'));
 assert.match(source,/event.key==="Escape"/);assert.match(source,/event.key==="Tab"/);assert.match(source,/window.location.hash/);assert.match(source,/passive:true/);assert.ok(!source.includes('"wheel"')&&!source.includes('"touchmove"'));
});
test("video respects visibility, preferences, data saving and explicit pause/play intent",async()=>{
 const source=await read("components/home/HeroExperience.tsx");
 for(const pattern of [/saveData/,/effectiveType/,/preferences.ready/,/!preferences.reduced/,/document.hidden/,/IntersectionObserver/,/onPause/,/映像を一時停止/,/映像を再生/,/muted playsInline loop/,/media="\(max-width:700px\)"/,/setMode\("paused"\)/])assert.match(source,pattern);
 assert.match(source,/preference.addEventListener\("change",update\)/);assert.match(source,/requested&&<video/);assert.match(source,/if\(shouldPlay\)setRequested\(true\)/);
});
test("recent demos now lead the story, before concerns and support, without changing the price/column sections",async()=>{
 const html=await read(".next/server/app/index.html");const positions=['data-home-hero','id="demo"','id="home-problem-heading"','id="home-support-heading"','id="price"','id="flow"','id="column"'].map(mark=>html.indexOf(mark));
 for(let i=0;i<positions.length;i++){assert.ok(positions[i]>=0);if(i)assert.ok(positions[i]>positions[i-1]);}
 const header=await read("components/Header.tsx"),mobile=await read("components/home/MobileNavigation.tsx"),floating=await read("components/home/FloatingLineAfterHero.tsx");assert.ok(!header.startsWith('"use client";'));assert.ok(mobile.startsWith('"use client";'));assert.match(mobile,/aria-label="モバイルメニュー"/);assert.match(mobile,/onClick=\{closeMenu\}/);assert.match(floating,/IntersectionObserver/);assert.match(await read("app/page.tsx"),/<FloatingLine afterHero/);
});
