import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const names = ["hero", "bob", "short", "wave", "interior", "craft"];
const inputs = process.argv.slice(2);
if (inputs.length !== names.length) throw new Error("Expected six image paths: hero, bob, short, wave, interior, craft.");
const destination = path.resolve("public/demo/sui");
await mkdir(destination, { recursive: true });
await Promise.all(names.map(async (name, index) => {
  await sharp(inputs[index]).resize({ width: [0,4,5].includes(index) ? 1600 : 1100, withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toFile(path.join(destination, `${name}.webp`));
}));

// An intentionally silent editorial photo film, not live-action salon footage.
const order = ["hero", "craft", "interior", "bob"];
const filters = order.map((_, index) => `[${index}:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${index % 2 ? "1.07-on*0.0005" : "1.015+on*0.0005"}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${index}]`);
filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]", "[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]", "[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.3,fade=t=out:st=11.5:d=0.5[out]");
const args = ["-hide_banner", "-loglevel", "error", "-y", ...order.flatMap(name => ["-i", path.join(destination, `${name}.webp`)]), "-filter_complex", filters.join(";"), "-map", "[out]", "-t", "12", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(destination, "photo-film.mp4")];
await new Promise((resolve, reject) => {
  const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let errors = "";
  child.stderr.on("data", chunk => { errors += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve() : reject(new Error(errors)));
});
console.log(`Prepared six original photographs and a 12-second photo film in ${destination}`);
