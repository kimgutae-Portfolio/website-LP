import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import * as net from "node:net";
import vm from "node:vm";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const compiled = new Map();
for (const path of ["analytics.config.ts", "lib/analytics.ts", "lib/measurement-region.ts", "lib/measurement-settings.ts", "app/api/measurement-region/route.ts", "components/analytics/GoogleMeasurement.tsx"]) {
  compiled.set(path, ts.transpileModule(await read(path), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText);
}
function load(path, modules = {}, globals = {}) {
  const exports = {};
  vm.runInNewContext(compiled.get(path), { exports, URL, Date, Headers, Request, Response,
    require: name => { assert.ok(name in modules, `Unexpected import: ${name}`); return modules[name]; }, ...globals });
  return exports;
}
const config = load("analytics.config.ts", {}, { process: { env: {} } });
const analytics = load("lib/analytics.ts");
const settings = load("lib/measurement-settings.ts");
const geo = load("lib/measurement-region.ts", { "node:net": net });
const site = { siteConfig: { meta: { url: "https://machinowebs.com" }, line: { addFriendUrl: "https://lin.ee/Ny9tbUX" } } };
const plain = value => JSON.parse(JSON.stringify(value));

test("only Japanese Vercel traffic is eligible; foreign, missing and malformed countries fail closed", () => {
  for (const country of ["JP", "US", "GB", "DE", "CH", "KR", "XX", "T1", "", "jp", "JP,US", "<script>"]) {
    assert.equal(geo.japanMeasurementEligibility(new Headers({ "x-vercel-ip-country": country })).eligible, country === "JP", country);
  }
  assert.equal(geo.japanMeasurementEligibility(new Headers()).eligible, false);
});

test("verified Cloudflare uses visitor country, never the proxy server country", () => {
  for (const remote of ["104.16.1.1", "172.64.0.1", "2606:4700::1234"]) {
    assert.equal(geo.japanMeasurementEligibility(new Headers({ "x-vercel-forwarded-for": remote, "x-vercel-ip-country": "US", "cf-ipcountry": "JP" })).eligible, true);
    for (const country of ["GB", "DE", "US", "XX", "T1", ""]) {
      assert.equal(geo.japanMeasurementEligibility(new Headers({ "x-vercel-forwarded-for": remote, "x-vercel-ip-country": "JP", "cf-ipcountry": country })).eligible, false);
    }
    assert.equal(geo.japanMeasurementEligibility(new Headers({ "x-vercel-forwarded-for": remote, "x-vercel-ip-country": "JP" })).eligible, false);
  }
});

test("spoofed or unverifiable Cloudflare headers cannot enable tracking", () => {
  for (const remote of ["", "8.8.8.8", "127.0.0.1", "104.15.255.255", "2606:4800::1", "104.16.1.1, 8.8.8.8", "bad"]) {
    assert.equal(geo.japanMeasurementEligibility(new Headers({ "x-vercel-forwarded-for": remote, "x-vercel-ip-country": "JP", "cf-ipcountry": "JP", "cf-ray": "fake" })).eligible, false, remote);
  }
});

test("API is production-domain-only, uncached, and returns no IP or precise location", async () => {
  for (const [environment, url, expected] of [
    ["production", "https://machinowebs.com/api/measurement-region", true],
    ["production", "https://www.machinowebs.com/api/measurement-region", true],
    ["preview", "https://machinowebs.com/api/measurement-region", false],
    ["production", "https://site.vercel.app/api/measurement-region", false],
    ["production", "http://localhost:3110/api/measurement-region", false],
  ]) {
    const route = load("app/api/measurement-region/route.ts", { "@/analytics.config": config, "@/site.config": site, "@/lib/measurement-region": geo }, { process: { env: { VERCEL: "1", VERCEL_ENV: environment } } });
    const response = route.GET(new Request(url, { headers: { "x-vercel-ip-country": "JP" } }));
    const body = await response.json();
    assert.equal(body.eligible, expected);
    assert.deepEqual(Object.keys(body).sort(), ["eligible", "reason"]);
    for (const header of ["cache-control", "cdn-cache-control", "vercel-cdn-cache-control"]) assert.match(response.headers.get(header), /no-store/);
    assert.equal(response.headers.get("set-cookie"), null);
  }
  const route = load("app/api/measurement-region/route.ts", { "@/analytics.config": config, "@/site.config": site, "@/lib/measurement-region": geo }, { process: { env: {} } });
  assert.equal((await route.GET(new Request("https://machinowebs.com/api/measurement-region", { headers: { "x-vercel-ip-country": "JP" } })).json()).eligible, false);
});

test("opt-out does not expire and previous refusals / malformed storage are respected", () => {
  assert.equal(settings.measurementOptedOut(null), false);
  assert.equal(settings.measurementOptedOut('{"disabled":true,"savedAt":1}'), true);
  assert.equal(settings.measurementOptedOut('{"disabled":false}'), false);
  assert.equal(settings.measurementOptedOut(null, '{"choice":"denied","savedAt":1}'), true);
  assert.equal(settings.measurementOptedOut(null, '{"choice":"granted","savedAt":1}'), false);
  for (const saved of ["broken", "null", "{}", "[]", "false"]) assert.equal(settings.measurementOptedOut(saved), true);
  for (const eligible of [true, false]) for (const optOut of [true, false, null]) for (const gpc of [true, false]) {
    assert.equal(settings.measurementAllowed(eligible, optOut, gpc), eligible && optOut === false && !gpc);
  }
});

// Small hook runner: real component effects / closures, with no network or SDK.
function browserHarness({ stored = null, legacy = null, blockedStorage = false, gpc = false } = {}) {
  const slots = [], pending = [], requests = [], cleanups = [], timers = new Map();
  const windowListeners = new Map(), documentListeners = new Map(), storage = new Map();
  if (stored !== null) storage.set(settings.MEASUREMENT_OPTOUT_KEY, stored);
  if (legacy !== null) storage.set(analytics.CONSENT_STORAGE_KEY, legacy);
  let cursor = 0, dirty = true, path = "/", tree, timerId = 0, stopCount = 0;
  const add = map => (name, callback) => map.set(name, callback);
  const remove = map => (name, callback) => { if (map.get(name) === callback) map.delete(name); };
  const window = { location: { hostname: "machinowebs.com", pathname: "/", href: "https://machinowebs.com/?email=private@example.com&utm_source=google" }, addEventListener: add(windowListeners), removeEventListener: remove(windowListeners) };
  const cookies = new Map([["_ga", "old"], ["_clck", "old"], ["_clsk", "old"], ["_gcl_aw", "old"], ["necessary", "keep"]]);
  const document = { get cookie() { return [...cookies].map(([key, value]) => `${key}=${value}`).join("; "); }, set cookie(value) { assert.match(value, /max-age=0; path=\//); cookies.delete(value.split("=")[0]); }, title: "まちのWeb", referrer: "https://example.com/?private=value", visibilityState: "visible", addEventListener: add(documentListeners), removeEventListener: remove(documentListeners) };
  const navigator = { globalPrivacyControl: gpc };
  const localStorage = {
    getItem: key => { if (blockedStorage) throw new Error("blocked"); return storage.get(key) ?? null; },
    setItem: (key, value) => { if (blockedStorage) throw new Error("blocked"); storage.set(key, value); },
    removeItem: key => { if (blockedStorage) throw new Error("blocked"); storage.delete(key); },
  };
  const react = {
    useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { const next = typeof value === "function" ? value(slots[index]) : value; if (!Object.is(next, slots[index])) { slots[index] = next; dirty = true; } }]; },
    useRef(initial) { const index = cursor++; if (!(index in slots)) slots[index] = { current: initial }; return slots[index]; },
    useEffect(effect, deps) { const index = cursor++, old = slots[index]; if (!old || deps.some((value, i) => !Object.is(value, old[i]))) { slots[index] = deps; pending.push(() => { cleanups[index]?.(); cleanups[index] = effect(); }); } },
  };
  const jsx = (type, props) => ({ type, props });
  class Element { constructor(anchor) { this.anchor = anchor; } closest() { return this.anchor; } }
  const modules = { react, "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" }, "next/navigation": { usePathname: () => path }, "next/script": { default: "script" }, "next/link": { default: "link" }, "./ClarityMeasurement": { ClarityMeasurement: "clarity" }, "@/analytics.config": config, "@/site.config": site, "@/lib/analytics": analytics, "@/lib/measurement-settings": settings, "@/lib/clarity": { stopClarity: () => stopCount++ }, "./measurement.module.css": { default: {} } };
  const component = load("components/analytics/GoogleMeasurement.tsx", modules, { window, document, navigator, localStorage, AbortController, Element,
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; }, clearTimeout: id => timers.delete(id), setInterval: () => ++timerId, clearInterval: () => {},
    fetch: (url, options) => new Promise((resolve, reject) => { assert.equal(url, "/api/measurement-region"); assert.equal(options.cache, "no-store"); requests.push({ resolve: (body, ok = true) => resolve({ ok, json: async () => body }), reject }); options.signal.addEventListener("abort", () => reject(new Error("aborted"))); }),
  });
  const render = () => { cursor = 0; dirty = false; tree = component.GoogleMeasurement(); while (pending.length) pending.shift()(); };
  const flush = async () => { for (let i = 0; i < 20; i++) { if (dirty) render(); await Promise.resolve(); } };
  function find(type, label, node = tree) { if (!node || typeof node !== "object") return null; if (node.type === type && (!label || node.props.children === label)) return node; for (const child of [node.props?.children].flat(Infinity)) { if (!child || typeof child !== "object") continue; const found = find(type, label, child); if (found) return found; } return null; }
  const commands = () => plain((window.dataLayer ?? []).map(args => Array.from(args)));
  return { window, document, navigator, storage, requests, timers, cookies, flush, find, commands,
    open: async () => { windowListeners.get(analytics.PREFERENCES_EVENT)(); await flush(); },
    choose: async disabled => { const button = find("button", disabled ? "計測を停止する" : "計測を再開する"); assert.ok(button); button.props.onClick(); await flush(); },
    navigate: async next => { path = next; window.location.pathname = next; window.location.href = `https://machinowebs.com${next}`; dirty = true; render(); const beforeEffects = find("script"); await flush(); return beforeEffects; },
    visibility: async () => { documentListeners.get("visibilitychange")(); await flush(); },
    storageChange: async disabled => { storage.set(settings.MEASUREMENT_OPTOUT_KEY, JSON.stringify({ disabled })); windowListeners.get("storage")({ key: settings.MEASUREMENT_OPTOUT_KEY }); await flush(); },
    click: (href, placement = "hero") => { documentListeners.get("click")?.({ defaultPrevented: false, type: "click", button: 0, target: new Element({ href, dataset: { linePlacement: placement } }), preventDefault: () => { throw new Error("LINE navigation must not be blocked"); } }); },
    stopCount: () => stopCount,
  };
}

test("no popup or provider before server eligibility; Japan starts analytics-only measurement", async () => {
  const browser = browserHarness(); await browser.flush();
  assert.equal(browser.find("dialog"), null); assert.equal(browser.find("script"), null);
  assert.equal(browser.commands().length, 0); assert.equal(browser.requests.length, 1);
  browser.requests[0].resolve({ eligible: true }); await browser.flush();
  assert.ok(browser.find("script")); assert.equal(browser.find("clarity").props.active, true);
  const commands = browser.commands();
  assert.deepEqual(commands.find(args => args[0] === "consent")[2], { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  assert.equal(commands.filter(args => args[1] === "page_view").length, 1);
  assert.ok(!JSON.stringify(commands).includes("private@example.com"));
  assert.equal(browser.find("dialog"), null);
});

test("foreign, unknown, failed and timed-out checks never start Google or Clarity", async () => {
  for (const decision of [{ eligible: false }, {}, null, { eligible: "true" }, "error", "timeout"]) {
    const browser = browserHarness(); await browser.flush();
    if (decision === "error") browser.requests[0].reject(new Error("offline"));
    else if (decision === "timeout") [...browser.timers.values()][0]();
    else browser.requests[0].resolve(decision);
    await browser.flush();
    assert.equal(browser.find("script"), null); assert.equal(browser.find("clarity").props.active, false);
    assert.equal(browser.commands().length, 0); assert.equal(browser.find("dialog"), null);
    assert.deepEqual([...browser.cookies], [["necessary", "keep"]]);
  }
});

test("stored opt-out, previous refusal, GPC and blocked storage override Japan eligibility", async () => {
  for (const options of [{ stored: '{"disabled":true}' }, { legacy: '{"choice":"denied"}' }, { gpc: true }, { blockedStorage: true }]) {
    const browser = browserHarness(options); await browser.flush(); browser.requests[0].resolve({ eligible: true }); await browser.flush();
    assert.equal(browser.find("script"), null); assert.equal(browser.find("clarity").props.active, false); assert.equal(browser.commands().length, 0);
  }
});

test("footer-only preferences stop immediately, persist across visits, and resume manually", async () => {
  const browser = browserHarness(); await browser.flush(); browser.requests[0].resolve({ eligible: true }); await browser.flush();
  await browser.open(); assert.ok(browser.find("dialog"));
  await browser.choose(true); assert.equal(browser.window[`ga-disable-${config.analyticsConfig.googleAnalyticsId}`], true);
  assert.equal(browser.find("script"), null); assert.equal(browser.find("clarity").props.active, false);
  assert.equal(JSON.parse(browser.storage.get(settings.MEASUREMENT_OPTOUT_KEY)).disabled, true);
  assert.ok(browser.stopCount() > 0);
  assert.deepEqual([...browser.cookies], [["necessary", "keep"]]);
  const next = browserHarness({ stored: browser.storage.get(settings.MEASUREMENT_OPTOUT_KEY) }); await next.flush(); next.requests[0].resolve({ eligible: true }); await next.flush(); assert.equal(next.find("script"), null);
  await browser.choose(false); assert.ok(browser.find("script")); assert.equal(JSON.parse(browser.storage.get(settings.MEASUREMENT_OPTOUT_KEY)).disabled, false);
});

test("cross-tab opt-out stops measurement, route changes recheck, and refresh does not duplicate pageviews", async () => {
  const browser = browserHarness(); await browser.flush(); browser.requests[0].resolve({ eligible: true }); await browser.flush();
  await browser.visibility(); assert.equal(browser.find("script"), null); browser.requests[1].resolve({ eligible: true }); await browser.flush();
  assert.equal(browser.commands().filter(args => args[1] === "page_view").length, 1);
  assert.equal(await browser.navigate("/column"), null); assert.equal(browser.find("script"), null);
  browser.requests[2].resolve({ eligible: true }); await browser.flush(); assert.equal(browser.commands().filter(args => args[1] === "page_view").length, 2);
  await browser.storageChange(true); assert.equal(browser.find("script"), null); assert.equal(browser.find("clarity").props.active, false);
});

test("LINE events count only the real button while active, without form data or blocked navigation", async () => {
  const browser = browserHarness(); await browser.flush();
  browser.click("https://lin.ee/Ny9tbUX"); assert.equal(browser.commands().length, 0);
  browser.requests[0].resolve({ eligible: true }); await browser.flush();
  browser.click("https://line.me/"); browser.click("https://lin.ee/another-account");
  browser.click("https://lin.ee/Ny9tbUX", "pricing");
  let clicks = browser.commands().filter(args => args[1] === "line_click"); assert.equal(clicks.length, 1);
  assert.deepEqual(Object.keys(clicks[0][2]).sort(), ["contact_method", "cta_location", "link_url", "page_path", "send_to"]);
  assert.equal(clicks[0][2].cta_location, "pricing");
  await browser.storageChange(true); browser.click("https://lin.ee/Ny9tbUX");
  clicks = browser.commands().filter(args => args[1] === "line_click"); assert.equal(clicks.length, 1);
});

test("a delayed answer for a previous page cannot authorize a new page", async () => {
  const browser = browserHarness(); await browser.flush();
  await browser.navigate("/column"); assert.equal(browser.requests.length, 2);
  browser.requests[0].resolve({ eligible: true }); await browser.flush(); assert.equal(browser.find("script"), null);
  browser.requests[1].resolve({ eligible: false }); await browser.flush(); assert.equal(browser.find("script"), null);
  assert.equal(browser.commands().length, 0);
});

test("public disclosures describe the actual Japanese-only policy and opt-out, not assumed consent", async () => {
  const privacy = await read(".next/server/app/privacy.html");
  for (const text of ["接続元の国が日本", "初回にCookieの同意画面は表示しません", "Google アナリティクス", "Microsoft Clarity", "LINEボタン", "自動では期限切れにしません", "Global Privacy Control", "Cookieを使用しないVercel Web Analytics"]) assert.ok(privacy.includes(text), text);
  assert.doesNotMatch(privacy, /同意いただいた場合に限り|GoogleとClarityの測定タグは許可前/);
});
