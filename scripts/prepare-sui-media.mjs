import sharp from "sharp";
import { spawn } from "node:child_process";
import path from "node:path";

const [detail] = process.argv.slice(2);
if (!detail || process.argv.length !== 3) throw new Error("Expected one people-free image of the styling station.");
const destination = path.resolve("public/demo/sui");
const interior = path.join(destination, "interior.webp");
const tools = path.join(destination, "station-tools.webp");
await Promise.all([
  sharp(interior).extract({left: 794, top: 4, width: 680, height: 1020}).webp({quality: 84, effort: 5}).toFile(path.join(destination, "interior-mobile.webp")),
  sharp(detail).resize({width: 1536, withoutEnlargement: true}).webp({quality: 85, effort: 5}).toFile(tools),
]);

// Four people-free stills: room, tools, window light, and chair/mirror.
const shots = [
  { image: interior, crop: "" },
  { image: tools, crop: "" },
  { image: interior, crop: "crop=896:560:0:124," },
  { image: interior, crop: "crop=800:548:720:346," },
];
const filters = shots.map(({crop}, index) => `[${index}:v]${crop}scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${index % 2 ? "1.062-on*0.0005" : "1.012+on*0.0005"}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=81:s=1280x720:fps=24,format=yuv420p,setsar=1,settb=AVTB[v${index}]`);
filters.push("[v0][v1]xfade=transition=fade:duration=0.5:offset=2.875[x1]", "[x1][v2]xfade=transition=fade:duration=0.5:offset=5.75[x2]", "[x2][v3]xfade=transition=fade:duration=0.5:offset=8.625,fade=t=in:st=0:d=0.3,fade=t=out:st=11.5:d=0.5[out]");
const args = ["-hide_banner", "-loglevel", "error", "-y", ...shots.flatMap(({image}) => ["-i", image]), "-filter_complex", filters.join(";"), "-map", "[out]", "-t", "12", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(destination, "salon-film.mp4")];
await new Promise((resolve, reject) => {
  const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let errors = "";
  child.stderr.on("data", chunk => { errors += chunk.toString(); });
  child.on("error", reject);
  child.on("close", code => code === 0 ? resolve() : reject(new Error(errors)));
});
console.log(`Prepared a portrait crop, station detail and 12-second people-free film in ${destination}`);
