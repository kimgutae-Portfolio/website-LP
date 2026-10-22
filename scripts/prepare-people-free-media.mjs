import sharp from "sharp";
import {readFile,mkdir} from "node:fs/promises";
import {spawn} from "node:child_process";
import path from "node:path";
const manifest=JSON.parse(await readFile(new URL("./demo-people-free-assets.json",import.meta.url),"utf8"));
for(const item of manifest.assets){
 const original=await sharp(item.reference).metadata();
 const target=path.resolve(item.output);await mkdir(path.dirname(target),{recursive:true});
 await sharp(item.source).resize(original.width,original.height,{fit:"cover"}).webp({quality:85,effort:5}).toFile(target);
}
for(const film of manifest.films){
 const filters=film.images.map((_,i)=>`[${i}:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${i%2?"1.07-on*0.0005":"1.015+on*0.0005"}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${i}]`);
 filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]","[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]","[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.3,fade=t=out:st=11.5:d=0.5[out]");
 await new Promise((resolve,reject)=>{
  const child=spawn("ffmpeg",["-hide_banner","-loglevel","error","-y",...film.images.flatMap(image=>["-i",path.resolve(image)]),"-filter_complex",filters.join(";"),"-map","[out]","-t","12","-an","-c:v","libx264","-preset","medium","-crf","24","-pix_fmt","yuv420p","-movflags","+faststart",path.resolve(film.output)],{stdio:["ignore","ignore","pipe"]});
  let error="";child.stderr.on("data",chunk=>error+=chunk);child.on("error",reject);child.on("close",code=>code===0?resolve():reject(new Error(error)));
 });
}
console.log(`Prepared ${manifest.assets.length} people-free photographs and ${manifest.films.length} photo films. Original media and salon assets are untouched.`);
