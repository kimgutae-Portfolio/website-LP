import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const inputs = process.argv.slice(2);
if (inputs.length !== 2) throw new Error("Expected forest-friends and interior source images.");
const destination = path.resolve("public/demo/komorebi");
await mkdir(destination, { recursive: true });
await Promise.all(["forest-friends", "interior"].map(async (name, index) => {
  await sharp(inputs[index]).resize({ width: index === 0 ? 1536 : 1440, withoutEnlargement: true }).webp({ quality: 86, alphaQuality: 95, effort: 5 }).toFile(path.join(destination, `${name}.webp`));
}));
console.log(`Prepared original clinic illustration and interior image in ${destination}`);
