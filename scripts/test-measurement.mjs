import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const compiled = ts.transpileModule(await read("lib/analytics.ts"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
}).outputText;
const analytics = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const line = "https://lin.ee/Ny9tbUX";

test("only valid GA4 IDs and verified production / opt-in local hosts are allowed", () => {
  assert.equal(analytics.measurementId("G-JVS5FTTQLJ"), "G-JVS5FTTQLJ");
  for (const id of [undefined, "", "GTM-123", "AW-123", "G-<script>"]) assert.equal(analytics.measurementId(id), null);
  for (const host of ["machinowebs.com", "www.machinowebs.com"]) assert.equal(analytics.measurementHost(host, "machinowebs.com"), true);
  for (const host of ["localhost", "127.0.0.1", "site.vercel.app", "machinowebs.com.example.com"]) assert.equal(analytics.measurementHost(host, "machinowebs.com"), false);
  assert.equal(analytics.measurementHost("localhost", "machinowebs.com", true), true);
  assert.equal(analytics.measurementHost("site.vercel.app", "machinowebs.com", true), false);
});

test("consent is explicit, bounded to 90 days, and fails closed", () => {
  const now = 1_800_000_000_000;
  for (const choice of ["granted", "denied"]) assert.equal(analytics.readConsent(JSON.stringify({ choice, savedAt: now - 100 }), now), choice);
  for (const value of [null, "broken", "{}", '"granted"', JSON.stringify({ choice: "yes", savedAt: now }), JSON.stringify({ choice: "granted", savedAt: now + 1 }), JSON.stringify({ choice: "granted", savedAt: now - analytics.CONSENT_MAX_AGE })]) assert.equal(analytics.readConsent(value, now), null);
});

test("measurement URLs drop names, emails, form values, and fragments", () => {
  const clean = new URL(analytics.measurementUrl("https://machinowebs.com/?email=person@example.com&name=private&message=hello&utm_source=google&utm_medium=cpc&utm_campaign=sakai_search&gclid=Test-click_123#contact"));
  assert.equal(clean.hash, "");
  assert.deepEqual([...clean.searchParams.keys()], ["utm_source", "utm_medium", "utm_campaign", "gclid"]);
  assert.equal(clean.searchParams.get("utm_source"), "google");
  assert.equal(analytics.measurementUrl("https://machinowebs.com/?utm_term=person@example.com&gclid=bad%2Fvalue"), "https://machinowebs.com/");
  assert.equal(analytics.measurementReferrer("https://example.com/search?email=private#name"), "https://example.com/search");
  assert.equal(analytics.measurementReferrer(""), "");
});

test("only the actual business LINE destination is counted, not demo / hostile links", () => {
  for (const href of [line, `${line}/`, `${line}?openExternalBrowser=1`]) assert.equal(analytics.isBusinessLineLink(href, line), true);
  for (const href of ["https://line.me/", "https://lin.ee/another-account", "https://lin.ee/Ny9tbUX-fake", "https://lin.ee.example.com/Ny9tbUX", "https://lin.ee:444/Ny9tbUX", "http://lin.ee/Ny9tbUX", "javascript:alert(1)", "broken"]) assert.equal(analytics.isBusinessLineLink(href, line), false);
});

test("LINE event payload is limited to public location / destination data", () => {
  assert.deepEqual(analytics.lineClickParameters("pricing", "/", line), { contact_method: "line", cta_location: "pricing", page_path: "/", link_url: line });
  assert.equal(analytics.lineClickParameters("private or arbitrary text", "/", line).cta_location, "cta");
});

test("the tag is consent-gated, route changes deduplicate, and navigation is never blocked", async () => {
  const source = await read("components/analytics/GoogleMeasurement.tsx");
  assert.match(source, /consent === "granted" && id && <Script/);
  assert.match(source, /send_page_view: false/);
  assert.match(source, /lastPage\.current === pathname/);
  assert.match(source, /allow_google_signals: false/);
  assert.match(source, /allow_ad_personalization_signals: false/);
  assert.match(source, /ga-disable-/);
  assert.match(source, /clearMeasurementCookies\(\)/);
  assert.match(source, /measurementUrl\(window\.location\.href\)/);
  assert.match(source, /"event", "line_click"/);
  for (const type of ["click", "auxclick"]) {
    assert.equal((source.match(new RegExp(`addEventListener\\("${type}"`, "g")) ?? []).length, 1);
    assert.equal((source.match(new RegExp(`removeEventListener\\("${type}"`, "g")) ?? []).length, 1);
  }
  assert.doesNotMatch(source, /\.preventDefault\(|window\.open\(|\.location\s*=/);
  assert.doesNotMatch(source, /"event", "(?:generate_lead|purchase|conversion)"/);
});

test("all business LINE controls expose their placement and privacy settings are available", async () => {
  for (const [path, placement] of [["components/Header.tsx", "header"], ["components/FloatingLine.tsx", "floating"], ["components/Pricing.tsx", "pricing"], ["app/column/[slug]/page.tsx", "column"]]) assert.ok((await read(path)).includes(`data-line-placement="${placement}"`), path);
  assert.match(await read("components/LineCta.tsx"), /data-line-placement=\{placement\}/);
  assert.match(await read("app/layout.tsx"), /<GoogleMeasurement\s*\/>/);
  assert.match(await read("components/Footer.tsx"), /<MeasurementPreferencesButton\s*\/>/);
  const privacy = await read("app/privacy/page.tsx");
  assert.match(privacy, /id="measurement"/);
  assert.match(privacy, /LINEでの会話内容/);
  assert.match(privacy, /90日間/);
});
