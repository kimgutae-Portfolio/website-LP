import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const compiled = ts.transpileModule(await read("lib/clarity.ts"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;

function harness() {
  const scripts = [];
  const window = {};
  const exports = {};
  const document = {
    getElementById: id => scripts.find(script => script.id === id) ?? null,
    createElement: tag => ({ tag }),
    head: { appendChild: script => scripts.push(script) },
  };
  vm.runInNewContext(compiled, { window, document, exports });
  const commands = () => JSON.parse(JSON.stringify(window.clarity?.q ?? []));
  return { scripts, window, commands, ...exports };
}

test("only valid public Clarity project IDs are accepted", () => {
  const clarity = harness();
  assert.equal(clarity.clarityProjectId("z3m9xda0mq"), "z3m9xda0mq");
  for (const value of [undefined, "", "<script>", "../other", "a?x=1", "a".repeat(21)]) {
    assert.equal(clarity.clarityProjectId(value), null);
    clarity.startClarity(value);
  }
  assert.equal(clarity.scripts.length, 0);
});

test("no tag or global is created before opt-in / on an initial denial", () => {
  const clarity = harness();
  clarity.stopClarity();
  assert.equal(clarity.scripts.length, 0);
  assert.equal(clarity.window.clarity, undefined);
});

test("opt-in appends one asynchronous tag to head with analytics-only consent", () => {
  const clarity = harness();
  clarity.startClarity("z3m9xda0mq");
  assert.deepEqual(clarity.scripts, [{
    tag: "script", id: "microsoft-clarity", type: "text/javascript",
    async: true, src: "https://www.clarity.ms/tag/z3m9xda0mq",
  }]);
  assert.deepEqual(clarity.commands(), [["consentv2", {
    analytics_Storage: "granted", ad_Storage: "denied",
  }]]);
});

test("withdrawal stops cookieless recording too; regrant reuses the existing tag", () => {
  const clarity = harness();
  clarity.startClarity("z3m9xda0mq");
  clarity.stopClarity();
  assert.deepEqual(clarity.commands().slice(-2), [
    ["consentv2", { analytics_Storage: "denied", ad_Storage: "denied" }],
    ["stop"],
  ]);
  clarity.startClarity("z3m9xda0mq");
  assert.equal(clarity.scripts.length, 1);
  assert.deepEqual(clarity.commands().slice(-2), [
    ["start"],
    ["consentv2", { analytics_Storage: "granted", ad_Storage: "denied" }],
  ]);
});

test("Clarity shares the production-host consent gate and prompts old GA-only visitors again", async () => {
  const component = await read("components/analytics/GoogleMeasurement.tsx");
  const clarity = await read("components/analytics/ClarityMeasurement.tsx");
  assert.match(component, /if \(!analyticsConfig\.cookieMeasurementEnabled \|\| !enabled\) return null/);
  assert.match(component, /<ClarityMeasurement active=\{consent === "granted"\}/);
  assert.match(component, /Microsoft Clarity/);
  assert.match(component, /ヒートマップや画面再生/);
  assert.match(component, /_clck\$\|_clsk\$/);
  assert.match(clarity, /if \(!active \|\| !id\) return/);
  assert.match(clarity, /return \(\) => stopClarity\(\)/);
  assert.match(await read("lib/analytics.ts"), /measurement-consent:v2/);
});

test("contact masking and session-replay disclosures are present", async () => {
  assert.match(await read("components/ContactForm.tsx"), /<form[^>]+data-clarity-mask="true"/);
  const privacy = await read("app/privacy/page.tsx");
  assert.match(privacy, /Microsoft Clarity/);
  assert.match(privacy, /ヒートマップとセッション再生/);
  assert.match(privacy, /privacy\.microsoft\.com\/ja-jp\/privacystatement/);
  assert.match(privacy, /GoogleとClarityの測定タグは許可前には読み込みません/);
});
