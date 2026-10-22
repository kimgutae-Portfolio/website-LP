import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../components/demo/kasane/chapter-scroll.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { chapterStops, chapterAt, chapterStep } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const stops = chapterStops([
  { id: "home", top: 112, bottom: 800 },
  { id: "about", top: 880, bottom: 1600 },
  { id: "business", top: 1600, bottom: 3120 },
  { id: "projects", top: 3120, bottom: 3840 },
  { id: "footer", top: 3840, bottom: 4180 },
], 800, 80, 3380);

test("first screen includes the banner; section starts account for the sticky header", () => {
  assert.deepEqual(stops.map(s => s.start), [0, 800, 1520, 3040, 3380]);
});
test("one step lands at the next section rather than skipping sections", () => {
  assert.deepEqual(chapterStep(stops, 0, 800, 80, 1), { top: 800, index: 1 });
  assert.deepEqual(chapterStep(stops, 800, 800, 80, 1), { top: 1520, index: 2 });
});
test("long sections are read in overlapping screens before advancing", () => {
  const first = chapterStep(stops, 1520, 800, 80, 1);
  assert.equal(first.index, 2);
  assert.ok(first.top > 1520 && first.top < 2320);
  const second = chapterStep(stops, first.top, 800, 80, 1);
  assert.deepEqual(second, { top: 2320, index: 2 });
  assert.deepEqual(chapterStep(stops, second.top, 800, 80, 1), { top: 3040, index: 3 });
});
test("reverse navigation enters the end of the preceding long section", () => {
  assert.deepEqual(chapterStep(stops, 3040, 800, 80, -1), { top: 2320, index: 2 });
  const previous = chapterStep(stops, 2320, 800, 80, -1);
  assert.equal(previous.index, 2);
  assert.ok(previous.top > 1520 && previous.top < 2320);
});
test("the footer is reachable and stops at the document bottom", () => {
  assert.deepEqual(chapterStep(stops, 3040, 800, 80, 1), { top: 3380, index: 4 });
  assert.deepEqual(chapterStep(stops, 3380, 800, 80, 1), { top: 3380, index: 4 });
  assert.equal(chapterAt(stops, 3380), 4);
});
test("oversized first and last sections do not wrap in the wrong direction", () => {
  const long = [{ id: "only", start: 0, end: 1000 }];
  assert.deepEqual(chapterStep(long, 0, 800, 80, -1), { top: 0, index: 0 });
  assert.deepEqual(chapterStep(long, 1000, 800, 80, 1), { top: 1000, index: 0 });
});
test("an empty document remains stationary", () => {
  assert.deepEqual(chapterStep([], 42, 800, 80, 1), { top: 42, index: 0 });
});
