import assert from "node:assert/strict";
import test from "node:test";
import {readFile,stat} from "node:fs/promises";
import {createHash} from "node:crypto";
import sharp from "sharp";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const manifest=JSON.parse(await read("scripts/demo-people-free-assets.json"));
test("eight replacement photographs retain their image dimensions and are optimized",async()=>{
 assert.equal(manifest.assets.length,8);
 for(const asset of manifest.assets){
  const replacement=new URL(`../${asset.output}`,import.meta.url);const a=await sharp(await readFile(replacement)).metadata(),b=await sharp(asset.reference).metadata();
  assert.equal(a.width,b.width,asset.asset);assert.equal(a.height,b.height,asset.asset);assert.equal(a.format,"webp");
  const size=(await stat(replacement)).size;assert.ok(size>10000&&size<750000,asset.asset);
  assert.match(asset.prompt,/precise-object-edit/);assert.ok(asset.source&&asset.reference&&asset.prompt);
 }
});
test("salon photographs and video are byte-for-byte unchanged",async()=>{
 assert.equal(manifest.protectedSalonAssets.length,7);
 for(const file of manifest.protectedSalonAssets){const bytes=await readFile(new URL(`../${file.path}`,import.meta.url));assert.equal(createHash("sha256").update(bytes).digest("hex"),file.sha256,file.path);}
});
test("both affected photo films are rebuilt from people-free sources",async()=>{
 assert.equal(manifest.films.length,2);
 for(const film of manifest.films){const size=(await stat(new URL(`../${film.output}`,import.meta.url))).size;assert.ok(size>100000&&size<4000000);assert.equal(film.images.length,4);for(const image of film.images){assert.ok(!manifest.assets.some(a=>image===a.reference.replace(/^.*\/public\//,"public/")));await stat(new URL(`../${image}`,import.meta.url));}}
 const kasane=await read("components/demo/kasane/KasaneWebsite.tsx"),sumitoki=await read("components/demo/sumitoki/SumitokiWebsite.tsx");
 assert.match(kasane,/brand-film-no-people\.mp4/);assert.match(sumitoki,/photo-film-no-people\.mp4/);
});
test("no affected production page references an original people photograph",async()=>{
 const routes=[...new Set(manifest.assets.map(a=>a.asset.split("/")[0]))];
 for(const route of routes){const html=await read(`.next/server/app/demo/${route}.html`);for(const asset of manifest.assets){const old=`/demo/${asset.asset}.webp`;assert.ok(!html.includes(encodeURIComponent(old)),`${route}: stale image ${old}`);assert.ok(!html.includes(`src="${old}"`));}}
});
test("main portfolio thumbnails use the edited hero images too",async()=>{
 const html=await read(".next/server/app/index.html");
 for(const route of ["kasane","sumitoki","michiru"]){assert.ok(html.includes(encodeURIComponent(`/demo/${route}/hero-no-people.webp`)));assert.ok(!html.includes(encodeURIComponent(`/demo/${route}/hero.webp`)));}
});
test("descriptions match objects and rooms rather than removed people",async()=>{
 const michiru=await read(".next/server/app/demo/michiru.html"),niwato=await read(".next/server/app/demo/niwato.html");
 assert.ok(!michiru.includes("生徒の話を聞きながら、明るい教室で微笑む先生"));assert.ok(!michiru.includes("先生と子どもたちが学ぶ手元"));assert.ok(!niwato.includes("芝刈り機で整えるスタッフ"));
});
