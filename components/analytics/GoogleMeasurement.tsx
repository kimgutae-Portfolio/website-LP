"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ClarityMeasurement } from "./ClarityMeasurement";
import { stopClarity } from "@/lib/clarity";
import { analyticsConfig } from "@/analytics.config";
import { siteConfig } from "@/site.config";
import {
  CONSENT_STORAGE_KEY, PREFERENCES_EVENT, readConsent, measurementHost,
  measurementId, measurementUrl, measurementReferrer, isBusinessLineLink,
  lineClickParameters, type MeasurementConsent,
} from "@/lib/analytics";
import styles from "./measurement.module.css";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const id = measurementId(analyticsConfig.googleAnalyticsId);
const denied = {
  analytics_storage: "denied", ad_storage: "denied",
  ad_user_data: "denied", ad_personalization: "denied",
};

function clearMeasurementCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gcl(?:_|$)|_clck$|_clsk$)/.test(name)) continue;
    const hostname = window.location.hostname;
    const parent = new URL(siteConfig.meta.url).hostname;
    for (const domain of ["", `; domain=${hostname}`, `; domain=.${hostname}`, `; domain=.${parent}`]) {
      document.cookie = `${name}=; max-age=0; path=/${domain}; SameSite=Lax`;
    }
  }
}

export function GoogleMeasurement() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [consent, setConsent] = useState<MeasurementConsent | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const initialized = useRef(false);
  const lastPage = useRef<string | null>(null);
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!analyticsConfig.cookieMeasurementEnabled) {
      // Never touch cookies belonging to another localhost / preview project.
      if (!measurementHost(window.location.hostname, new URL(siteConfig.meta.url).hostname, analyticsConfig.debugLocal)) return;
      if (id) window[`ga-disable-${id}`] = true;
      window.gtag?.("consent", "update", denied);
      stopClarity();
      clearMeasurementCookies();
      try {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        localStorage.removeItem("machinowebs:measurement-consent:v1");
      } catch { /* Tracking stays disabled even when browser storage is blocked. */ }
      return;
    }
    if (!id || !measurementHost(window.location.hostname, new URL(siteConfig.meta.url).hostname, analyticsConfig.debugLocal)) return;
    setEnabled(true);
    try {
      const choice = readConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
      setConsent(choice);
      setShowPreferences(choice === null);
    } catch {
      setShowPreferences(true);
    }
    const open = () => setShowPreferences(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;
      const choice = readConsent(event.newValue);
      setConsent(choice);
      setShowPreferences(choice === null);
    };
    window.addEventListener(PREFERENCES_EVENT, open);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, open);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !id) return;
    window[`ga-disable-${id}`] = consent !== "granted";
    if (consent !== "granted") {
      if (initialized.current) window.gtag?.("consent", "update", denied);
      lastPage.current = null;
      clearMeasurementCookies();
      return;
    }
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function () { window.dataLayer?.push(arguments); };
    if (!initialized.current) {
      window.gtag("consent", "default", denied);
      window.gtag("js", new Date());
    }
    window.gtag("consent", "update", {
      ...denied, analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted",
    });
    if (!initialized.current) {
      window.gtag("config", id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: measurementUrl(window.location.href),
        page_referrer: measurementReferrer(document.referrer),
        cookie_expires: 90 * 24 * 60 * 60,
        cookie_update: false,
        ...(analyticsConfig.debugLocal ? { debug_mode: true } : {}),
      });
      initialized.current = true;
    }
  }, [enabled, consent]);

  useEffect(() => {
    if (!enabled || consent !== "granted" || !id || !initialized.current || lastPage.current === pathname) return;
    lastPage.current = pathname;
    const page = {
      page_location: measurementUrl(window.location.href),
      page_referrer: previousUrl.current ?? measurementReferrer(document.referrer),
      page_title: document.title,
    };
    window.gtag?.("set", page);
    window.gtag?.("event", "page_view", { send_to: id, ...page });
    previousUrl.current = page.page_location;
  }, [enabled, consent, pathname]);

  useEffect(() => {
    if (!enabled || consent !== "granted" || !id) return;
    const record = (event: MouseEvent) => {
      if (event.defaultPrevented || (event.type === "click" ? event.button !== 0 : event.button !== 1)) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || !isBusinessLineLink(anchor.href, siteConfig.line.addFriendUrl)) return;
      window.gtag?.("event", "line_click", {
        send_to: id,
        ...lineClickParameters(anchor.dataset.linePlacement, window.location.pathname, siteConfig.line.addFriendUrl),
      });
      // Never prevent navigation or wait for measurement: opening LINE works
      // even if Google is blocked, slow, or unavailable.
    };
    document.addEventListener("click", record);
    document.addEventListener("auxclick", record);
    return () => {
      document.removeEventListener("click", record);
      document.removeEventListener("auxclick", record);
    };
  }, [enabled, consent]);

  function choose(choice: MeasurementConsent) {
    try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ choice, savedAt: Date.now() })); } catch { /* Session-only choice if storage is unavailable. */ }
    setConsent(choice);
    setShowPreferences(false);
  }

  if (!analyticsConfig.cookieMeasurementEnabled || !enabled) return null;
  return <>
    <ClarityMeasurement active={consent === "granted"} />
    {consent === "granted" && id && <Script id="google-measurement" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />}
    {showPreferences && <section className={styles.notice} role="region" aria-label="アクセス解析の設定">
      <div><h2>サイトの改善に、ご協力ください。</h2><p>Google アナリティクスとMicrosoft Clarityで閲覧・クリック・スクロールを計測し、ヒートマップや画面再生でサイト改善・広告効果の確認に利用します。入力内容はマスキングします。許可しなくても、すべての機能をご利用いただけます。<Link href="/privacy#measurement">詳しく見る</Link></p></div>
      <div className={styles.actions}><button type="button" onClick={() => choose("denied")}>許可しない</button><button type="button" onClick={() => choose("granted")}>許可する</button></div>
    </section>}
  </>;
}

export function MeasurementPreferencesButton() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(analyticsConfig.cookieMeasurementEnabled && Boolean(id) && measurementHost(window.location.hostname, new URL(siteConfig.meta.url).hostname, analyticsConfig.debugLocal));
  }, []);
  if (!analyticsConfig.cookieMeasurementEnabled || !enabled) return null;
  return <button type="button" className="underline underline-offset-4 transition hover:text-white" onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}>アクセス解析の設定</button>;
}
