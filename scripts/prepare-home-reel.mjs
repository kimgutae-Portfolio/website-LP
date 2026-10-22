import {mkdir} from "node:fs/promises";
import {spawn} from "node:child_process";
import path from "node:path";

// A new editorial reel, using only the existing, people-free fictional demo photographs.
// No original photo or demo film is overwritten.
const sources=["public/demo/kasane/hero-no-people.webp","public/demo/sumitoki/hero-no-people.webp","public/demo/nagi/hero.webp"];
const output=path.resolve("public/home");
await mkdir(output,{recursive:true});
for(const [name,width,height,crf] of [["design-reel",960,1280,25],["design-reel-mobile",640,1136,26]]){
 const filters=[...sources,sources[0]].map((_,i)=>`[${i}:v]scale=${width*2}:${height*2}:force_original_aspect_ratio=increase,crop=${width*2}:${height*2},zoompan=z='${i===3?"1.02":i===1?"1.045-on*0.00017":"1.02+on*0.00017"}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${i===3?20:144}:s=${width}x${height}:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${i}]`);
 filters.push("[v0][v1]xfade=transition=fade:duration=0.8:offset=5.2[x1]","[x1][v2]xfade=transition=fade:duration=0.8:offset=10.4[x2]","[x2][v3]xfade=transition=fade:duration=0.8:offset=15.6,format=yuv420p[out]");
 await new Promise((resolve,reject)=>{
  const child=spawn("ffmpeg",["-hide_banner","-loglevel","error","-y",...sources.concat(sources[0]).flatMap(source=>["-i",path.resolve(source)]),"-filter_complex_threads","2","-filter_complex",filters.join(";"),"-map","[out]","-t","16.4","-an","-c:v","libx264","-threads","2","-preset","medium","-crf",String(crf),"-pix_fmt","yuv420p","-movflags","+faststart",path.join(output,`${name}.mp4`)],{stdio:["ignore","ignore","pipe"]});
  let errors="";child.stderr.on("data",chunk=>errors+=chunk);child.on("error",reject);child.on("close",code=>code===0?resolve():reject(new Error(errors)));
 });
 console.log(`${name}.mp4: ${width}×${height}, 16.4s, silent`);
}
