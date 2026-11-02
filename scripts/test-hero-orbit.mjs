import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/hero-orbit.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { orbitFrontIndex } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("orbit keyboard navigation identifies the forward-facing card across complete turns", () => {
  for (const [angle, index] of [[0,0],[45,7],[90,6],[180,4],[270,2],[360,0],[-45,1],[-90,2],[-315,7],[-360,0],[720,0],[765,7]]) assert.equal(orbitFrontIndex(angle,8),index, String(angle));
  assert.equal(orbitFrontIndex(22,8),0);
  assert.equal(orbitFrontIndex(23,8),7);
  assert.equal(orbitFrontIndex(-22,8),0);
  assert.equal(orbitFrontIndex(-23,8),1);
});

test("invalid geometry remains on a safe first card rather than producing an invalid index", () => {
  for (const [angle,count] of [[NaN,8],[Infinity,8],[10,0],[10,-1],[10,2.5]]) assert.equal(orbitFrontIndex(angle,count),0);
  for (const angle of [-1000,0,1000]) assert.equal(orbitFrontIndex(angle,1),0);
});
