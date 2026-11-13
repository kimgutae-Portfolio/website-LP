import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Satori accepts static WOFF (not the variable WOFF2 used by the browser).
export function loadOgFont(weight: 700 | 900) {
  const filename = weight === 700 ? "noto-sans-jp-bold.woff" : "noto-sans-jp-black.woff";
  return readFile(join(process.cwd(), "assets", "fonts", filename));
}
