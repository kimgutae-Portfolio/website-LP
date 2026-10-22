import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

// Source photographs were generated for this fictional company with the built-in image tool.
// Run with four PNG paths: hero, workplace, atelier, craft. Originals remain untouched.
const names = ["hero", "workplace", "atelier", "craft"];
const inputs = process.argv.slice(2);
if (inputs.length !== names.length) throw new Error("Expected four source PNG paths.");
const destination = path.resolve("public/demo/kasane");
await mkdir(destination, { recursive: true });
await Promise.all(names.map(async (name, index) => {
  const height = index < 2 ? 900 : 1066;
  await sharp(inputs[index])
    .resize({ width: 1600, height, fit: "cover", withoutEnlargement: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(path.join(destination, `${name}.webp`));
}));

// Four slow camera moves, gently dissolved into a 12-second, silent 720p brand film.
// Video is loaded only when the visitor explicitly opens the film.
const order = ["hero", "craft", "workplace", "atelier"];
const filters = order.map((_, index) => {
  const zoom = index % 2 === 0 ? "1.02+on*0.00065" : "1.075-on*0.00065";
  return `[${index}:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${index}]`;
});
filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]");
filters.push("[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]");
filters.push("[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.35,fade=t=out:st=11.5:d=0.5[out]");

const args = ["-y", ...order.flatMap(name => ["-i", path.join(destination, `${name}.webp`)]), "-filter_complex", filters.join(";"), "-map", "[out]", "-t", "12", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(destination, "brand-film.mp4")];
await new Promise((resolve, reject) => {
  const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let errors = "";
  child.stderr.on("data", chunk => { errors += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve() : reject(new Error(errors)));
});
console.log(`Created four optimized WebP photographs and brand-film.mp4 in ${destination}`);
