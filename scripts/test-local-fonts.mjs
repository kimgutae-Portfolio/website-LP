import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("page and share-card fonts do not depend on Google Fonts at build time", async () => {
  for (const path of ["app/layout.tsx", "app/demo/luce/page.tsx", "app/opengraph-image.tsx", "components/column/ColumnOgImage.tsx", "lib/og-font.ts"]) {
    assert.doesNotMatch(await read(path), /next\/font\/google|fonts\.(?:googleapis|gstatic)\.com/, path);
  }
  assert.match(await read("app/layout.tsx"), /@fontsource-variable\/noto-sans-jp/);
  assert.match(await read("app/demo/luce/page.tsx"), /@fontsource-variable\/noto-serif-jp/);
  for (const weight of ["bold", "black"]) {
    const file = await readFile(new URL(`../assets/fonts/noto-sans-jp-${weight}.woff`, import.meta.url));
    assert.equal(file.toString("ascii", 0, 4), "wOFF");
  }
});

test("the home and column share images are rendered locally as PNGs", async () => {
  for (const route of ["opengraph-image", "column/business-system-outsourcing/opengraph-image"]) {
    const png = await readFile(new URL(`../.next/server/app/${route}.body`, import.meta.url));
    assert.equal(png.toString("ascii", 1, 4), "PNG");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
});
