import {readFile} from "node:fs/promises";
import ts from "typescript";

const compile = async path => ts.transpileModule(
  await readFile(new URL(`../${path}`,import.meta.url),"utf8"),
  {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}},
).outputText;
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;

// The config's only runtime dependency is the public, local offer catalog.
export async function loadSiteConfig() {
  const offersUrl=url(await compile("lib/example-offers.ts"));
  const source=(await compile("site.config.ts")).replaceAll("@/lib/example-offers",offersUrl);
  return import(url(source));
}
