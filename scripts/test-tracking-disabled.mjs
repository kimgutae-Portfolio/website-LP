import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const compile = async path => ts.transpileModule(await read(path), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const configCode = await compile("analytics.config.ts");
const componentCode = await compile("components/analytics/GoogleMeasurement.tsx");
const clarityCode = await compile("lib/clarity.ts");
const analyticsCode = await compile("lib/analytics.ts");

function harness({ previous = false, blockedStorage = false } = {}) {
  const configExports = {};
  vm.runInNewContext(configCode, { exports: configExports, process: { env: {} } });
  const config = configExports.analyticsConfig;
  const effects = [], google = [], clarity = [], removed = [], expired = [];
  const cookies = new Map(previous ? [["_ga", "old"], ["_ga_TEST", "old"], ["_gcl_aw", "old"], ["_clck", "old"], ["_clsk", "old"], ["necessary", "keep"]] : []);
  const unexpected = () => { throw new Error("Disabled measurement must not load tags or attach listeners"); };
  const window = { location: { hostname: "machinowebs.com" }, addEventListener: unexpected, removeEventListener: unexpected };
  if (previous) {
    window.gtag = (...args) => google.push(args);
    window.clarity = (...args) => clarity.push(args);
  }
  const document = {
    get cookie() { return [...cookies].map(([key, value]) => `${key}=${value}`).join("; "); },
    set cookie(value) { expired.push(value); cookies.delete(value.split("=")[0]); },
    createElement: unexpected, getElementById: unexpected,
    addEventListener: unexpected, removeEventListener: unexpected,
    head: { appendChild: unexpected },
  };
  const localStorage = {
    getItem: () => { throw new Error("Saved grants must not be read while measurement is disabled"); },
    setItem: () => { throw new Error("No implicit consent may be saved"); },
    removeItem: key => { if (blockedStorage) throw new Error("Storage blocked"); removed.push(key); },
  };
  const clarityExports = {}, analyticsExports = {};
  vm.runInNewContext(clarityCode, { exports: clarityExports, window, document });
  vm.runInNewContext(analyticsCode, { exports: analyticsExports, URL, Date });
  const modules = {
    react: { useEffect: effect => effects.push(effect), useState: initial => [initial, () => {}], useRef: initial => ({ current: initial }) },
    "react/jsx-runtime": { jsx: unexpected, jsxs: unexpected },
    "next/navigation": { usePathname: () => "/" },
    "next/script": {}, "next/link": {}, "./ClarityMeasurement": {},
    "@/analytics.config": configExports,
    "@/site.config": { siteConfig: { meta: { url: "https://machinowebs.com" }, line: { addFriendUrl: "https://lin.ee/Ny9tbUX" } } },
    "@/lib/analytics": analyticsExports, "@/lib/clarity": clarityExports,
    "./measurement.module.css": {},
  };
  const exports = {};
  vm.runInNewContext(componentCode, { exports, window, document, localStorage, URL,
    require: name => { assert.ok(name in modules, name); return modules[name]; },
  });
  assert.equal(config.cookieMeasurementEnabled, false);
  assert.equal(exports.GoogleMeasurement(), null);
  assert.equal(exports.MeasurementPreferencesButton(), null);
  effects.forEach(effect => effect());
  return { config, window, cookies, expired, removed, google, clarity };
}

test("fresh visitors see no consent UI and load no Google or Clarity tags", () => {
  const result = harness();
  assert.equal(result.window[`ga-disable-${result.config.googleAnalyticsId}`], true);
  assert.equal(result.window.gtag, undefined);
  assert.equal(result.window.clarity, undefined);
  assert.equal(result.google.length, 0);
  assert.equal(result.clarity.length, 0);
});

test("previous permission cannot restart measurement; old tracking cookies are cleared", () => {
  const result = harness({ previous: true });
  assert.deepEqual(result.removed, ["machinowebs:measurement-consent:v2", "machinowebs:measurement-consent:v1"]);
  assert.deepEqual([...result.cookies], [["necessary", "keep"]]);
  assert.ok(result.expired.every(cookie => cookie.includes("max-age=0; path=/")));
  const google = JSON.parse(JSON.stringify(result.google)), clarity = JSON.parse(JSON.stringify(result.clarity));
  assert.equal(google.length, 1);
  assert.equal(google[0][0], "consent");
  assert.ok(Object.values(google[0][2]).every(value => value === "denied"));
  assert.deepEqual(clarity, [["consentv2", { analytics_Storage: "denied", ad_Storage: "denied" }], ["stop"]]);
});

test("blocked browser storage cannot turn tracking on or show a popup", () => {
  const result = harness({ previous: true, blockedStorage: true });
  assert.equal(result.window[`ga-disable-${result.config.googleAnalyticsId}`], true);
  assert.deepEqual([...result.cookies], [["necessary", "keep"]]);
});

test("public privacy copy reflects disabled tracking and cookie-free basic statistics remain", async () => {
  const privacy = await read(".next/server/app/privacy.html");
  assert.match(privacy, /Google アナリティクスとMicrosoft Clarityの測定を停止しています/);
  assert.match(privacy, /Cookieの許可を求める画面は表示しません/);
  assert.doesNotMatch(privacy, /このブラウザに90日間保存/);
  assert.match(privacy, /Cookieを使用しないVercel Web Analytics/);
  assert.match(await read("app/layout.tsx"), /<Analytics\s*\/>/);
});
