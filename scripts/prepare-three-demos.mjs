import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
const assets = JSON.parse(await readFile(new URL("./demo-three-assets.json", import.meta.url), "utf8"));
for (const item of assets) {
 const target = path.resolve(`public/demo/${item.asset}.webp`);
 await mkdir(path.dirname(target), {recursive:true});
 await sharp(item.source).resize({width:1600,withoutEnlargement:true}).webp({quality:86,effort:5}).toFile(target);
}
const order = ["hero","room","bath","meal"];
const filters = order.map((_,i)=>`[${i}:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${i%2?"1.07-on*0.0005":"1.015+on*0.0005"}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${i}]`);
filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]","[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]","[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.3,fade=t=out:st=11.5:d=0.5[out]");
await new Promise((resolve,reject)=>{
 const child=spawn("ffmpeg",["-hide_banner","-loglevel","error","-y",...order.flatMap(name=>["-i",path.resolve(`public/demo/nagi/${name}.webp`)]),"-filter_complex",filters.join(";"),"-map","[out]","-t","12","-an","-c:v","libx264","-preset","medium","-crf","24","-pix_fmt","yuv420p","-movflags","+faststart",path.resolve("public/demo/nagi/photo-film.mp4")],{stdio:["ignore","ignore","pipe"]});
 let errors=""; child.stderr.on("data",chunk=>errors+=chunk.toString()); child.on("error",reject); child.on("close",code=>code===0?resolve():reject(new Error(errors)));
});
console.log("Prepared 12 original WebP photographs and one silent, 12-second photo film.");
