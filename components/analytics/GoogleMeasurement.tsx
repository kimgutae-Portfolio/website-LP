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
  CONSENT_STORAGE_KEY, PREFERENCES_EVENT, measurementHost, measurementId,
  measurementUrl, measurementReferrer, isBusinessLineLink, lineClickParameters,
} from "@/lib/analytics";
import { MEASUREMENT_OPTOUT_KEY, measurementAllowed, measurementOptedOut } from "@/lib/measurement-settings";
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
const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
const analyticsOnly = { ...denied, analytics_storage: "granted" };
type Region = { path: string | null; status: "checking" | "allowed" | "blocked" };

function supportedHost() {
  return measurementHost(window.location.hostname, new URL(siteConfig.meta.url).hostname, analyticsConfig.debugLocal);
}

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
  const [region, setRegion] = useState<Region>({ path: null, status: "checking" });
  const [optedOut, setOptedOut] = useState<boolean | null>(null);
  const [privacySignal, setPrivacySignal] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const initialized = useRef(false);
  const lastPage = useRef<string | null>(null);
  const previousUrl = useRef<string | null>(null);
  const active = enabled && analyticsConfig.cookieMeasurementEnabled &&
    region.path === pathname && measurementAllowed(region.status === "allowed", optedOut, privacySignal);

  useEffect(() => {
    if (!id || !supportedHost()) return;
    setEnabled(true);
    const sync = () => {
      setPrivacySignal((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
      try {
        setOptedOut(measurementOptedOut(localStorage.getItem(MEASUREMENT_OPTOUT_KEY), localStorage.getItem(CONSENT_STORAGE_KEY)));
        setStorageUnavailable(false);
      } catch {
        setOptedOut(true);
        setStorageUnavailable(true);
      }
    };
    sync();
    // Only a deliberate footer action opens this dialog. Never auto-prompt.
    const open = () => setShowPreferences(true);
    const storage = (event: StorageEvent) => {
      if (event.key === MEASUREMENT_OPTOUT_KEY || event.key === CONSENT_STORAGE_KEY || event.key === null) sync();
    };
    window.addEventListener(PREFERENCES_EVENT, open);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, open);
      window.removeEventListener("storage", storage);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !analyticsConfig.cookieMeasurementEnabled) return;
    let disposed = false;
    let controller: AbortController | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const refresh = async () => {
      controller?.abort();
      clearTimeout(timeout);
      controller = new AbortController();
      const current = controller;
      setRegion({ path: pathname, status: "checking" });
      timeout = setTimeout(() => current.abort(), 8000);
      try {
        const response = await fetch("/api/measurement-region", { cache: "no-store", credentials: "omit", redirect: "error", signal: current.signal });
        const decision: unknown = response.ok ? await response.json() : null;
        const eligible = decision !== null && typeof decision === "object" && "eligible" in decision && decision.eligible === true;
        if (!disposed && controller === current) setRegion({ path: pathname, status: eligible ? "allowed" : "blocked" });
      } catch {
        if (!disposed && controller === current) setRegion({ path: pathname, status: "blocked" });
      } finally {
        if (controller === current) clearTimeout(timeout);
      }
    };
    const visible = () => {
      setPrivacySignal((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
      if (document.visibilityState === "visible") void refresh();
    };
    const offline = () => { controller?.abort(); setRegion({ path: pathname, status: "blocked" }); };
    void refresh();
    const interval = setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("online", visible);
    window.addEventListener("offline", offline);
    return () => {
      disposed = true;
      controller?.abort();
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("online", visible);
      window.removeEventListener("offline", offline);
    };
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled || !id) return;
    window[`ga-disable-${id}`] = !active;
    if (!active) {
      if (initialized.current) window.gtag?.("consent", "update", denied);
      stopClarity();
      if (!analyticsConfig.cookieMeasurementEnabled || optedOut || privacySignal || region.status === "blocked") {
        clearMeasurementCookies();
        lastPage.current = null;
        previousUrl.current = null;
      }
      return;
    }
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function () { window.dataLayer?.push(arguments); };
    if (!initialized.current) {
      // A regional analytics default, not a record of explicit visitor consent.
      // Advertising storage, ad user data, personalization and signals stay OFF.
      window.gtag("consent", "default", analyticsOnly);
      window.gtag("js", new Date());
      window.gtag("set", "ads_data_redaction", true);
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
    } else {
      window.gtag("consent", "update", analyticsOnly);
    }
  }, [enabled, active, optedOut, privacySignal, region.status]);

  useEffect(() => {
    if (!active || !id || !initialized.current || lastPage.current === pathname) return;
    lastPage.current = pathname;
    const page = {
      page_location: measurementUrl(window.location.href),
      page_referrer: previousUrl.current ?? measurementReferrer(document.referrer),
      page_title: document.title,
    };
    window.gtag?.("set", page);
    window.gtag?.("event", "page_view", { send_to: id, ...page });
    previousUrl.current = page.page_location;
  }, [active, pathname]);

  useEffect(() => {
    if (!active || !id) return;
    const record = (event: MouseEvent) => {
      if (event.defaultPrevented || (event.type === "click" ? event.button !== 0 : event.button !== 1)) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || !isBusinessLineLink(anchor.href, siteConfig.line.addFriendUrl)) return;
      window.gtag?.("event", "line_click", { send_to: id, ...lineClickParameters(anchor.dataset.linePlacement, window.location.pathname, siteConfig.line.addFriendUrl) });
      // Never prevent navigation or wait for Google. LINE works independently.
    };
    document.addEventListener("click", record);
    document.addEventListener("auxclick", record);
    return () => {
      document.removeEventListener("click", record);
      document.removeEventListener("auxclick", record);
    };
  }, [active]);

  useEffect(() => {
    if (showPreferences && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [showPreferences]);

  function choose(disabled: boolean) {
    if (disabled) {
      if (id) window[`ga-disable-${id}`] = true;
      stopClarity();
      clearMeasurementCookies();
    }
    try {
      localStorage.setItem(MEASUREMENT_OPTOUT_KEY, JSON.stringify({ disabled }));
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      localStorage.removeItem("machinowebs:measurement-consent:v1");
      setStorageUnavailable(false);
    } catch { setStorageUnavailable(true); }
    setOptedOut(disabled);
  }

  if (!enabled || !analyticsConfig.cookieMeasurementEnabled) return null;
  return <>
    <ClarityMeasurement active={active} />
    {active && id && <Script id="google-measurement" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />}
    {showPreferences && <dialog ref={dialog} className={styles.notice} aria-labelledby="measurement-heading" onCancel={() => setShowPreferences(false)} onClose={() => setShowPreferences(false)}>
      <div><h2 id="measurement-heading">アクセス解析の設定</h2><p>日本国内と判定されたアクセスに限り、Google アナリティクスとMicrosoft Clarityで閲覧・LINEボタンのクリック・画面操作を計測します。広告のパーソナライズは行いません。入力内容はマスキングします。<Link href="/privacy#measurement" onClick={() => setShowPreferences(false)}>詳しく見る</Link></p></div>
      <p className={styles.status} role="status">{privacySignal ? "ブラウザのプライバシー設定により、計測を停止しています。" : region.status === "checking" ? "接続地域を確認中です。現在は計測していません。" : region.status === "blocked" ? "日本国内のアクセスと確認できないため、計測していません。" : optedOut ? "このブラウザでの計測は停止しています。" : "サイト改善のための計測が有効です。"}</p>
      {storageUnavailable && <p className={styles.storageNote}>設定を保存できないため、変更はこのページを開いている間のみ有効です。再訪問時は保存を確認できなければ計測しません。</p>}
      <div className={styles.actions}>
        <button type="button" onClick={() => choose(true)} disabled={optedOut === true}>計測を停止する</button>
        <button type="button" onClick={() => choose(false)} disabled={region.status !== "allowed" || privacySignal || optedOut === false}>計測を再開する</button>
        <button type="button" onClick={() => setShowPreferences(false)}>閉じる</button>
      </div>
    </dialog>}
  </>;
}

export function MeasurementPreferencesButton() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(analyticsConfig.cookieMeasurementEnabled && Boolean(id) && supportedHost()); }, []);
  if (!enabled) return null;
  return <button type="button" className="underline underline-offset-4 transition hover:text-white" onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}>アクセス解析の設定</button>;
}
