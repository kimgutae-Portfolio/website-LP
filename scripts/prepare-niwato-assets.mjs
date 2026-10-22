import sharp from "sharp";
import {readFile,mkdir} from "node:fs/promises";
import path from "node:path";
const manifest=JSON.parse(await readFile(new URL("./demo-niwato-assets.json",import.meta.url),"utf8"));
for(const asset of manifest.assets){
  const target=path.resolve(asset.output);
  await mkdir(path.dirname(target),{recursive:true});
  await sharp(asset.source).resize({width:1536,withoutEnlargement:true}).webp({quality:86,effort:5}).toFile(target);
}
console.log(`Prepared ${manifest.assets.length} local NIWATO WebP photographs.`);
