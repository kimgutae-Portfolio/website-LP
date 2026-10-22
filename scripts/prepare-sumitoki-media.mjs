import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const names = ["hero", "interior", "fish", "vegetables", "dessert"];
const inputs = process.argv.slice(2);
if (inputs.length !== names.length) throw new Error("Expected five image paths: hero, interior, fish, vegetables, dessert.");
const destination = path.resolve("public/demo/sumitoki");
await mkdir(destination, { recursive: true });
await Promise.all(names.map(async (name, index) => {
  await sharp(inputs[index]).resize(index < 2 ? { width: 1600, height: index === 0 ? 1000 : 1066, fit: "cover" } : { width: 1200, height: 900, fit: "cover" }).webp({ quality: 85, effort: 5 }).toFile(path.join(destination, `${name}.webp`));
}));

// A silent photo film, not live-action footage; requested only when opened.
const order = ["hero", "vegetables", "interior", "dessert"];
const filters = order.map((_, index) => `[${index}:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${index % 2 ? "1.07-on*0.0006" : "1.02+on*0.0006"}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${index}]`);
filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]", "[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]", "[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.3,fade=t=out:st=11.5:d=0.5[out]");
const args = ["-hide_banner", "-loglevel", "error", "-y", ...order.flatMap(name => ["-i", path.join(destination, `${name}.webp`)]), "-filter_complex", filters.join(";"), "-map", "[out]", "-t", "12", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(destination, "photo-film.mp4")];
await new Promise((resolve, reject) => {
  const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let errors = "";
  child.stderr.on("data", chunk => { errors += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve() : reject(new Error(errors)));
});
console.log(`Created five optimized photos and a 12-second film in ${destination}`);
