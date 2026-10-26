export const CONSENT_STORAGE_KEY = "machinowebs:measurement-consent:v1";
export const CONSENT_MAX_AGE = 90 * 24 * 60 * 60 * 1000;
export const PREFERENCES_EVENT = "machinowebs:measurement-preferences";
export type MeasurementConsent = "granted" | "denied";

export function readConsent(value: string | null, now = Date.now()): MeasurementConsent | null {
  try {
    const saved = JSON.parse(value ?? "null");
    return saved && (saved.choice === "granted" || saved.choice === "denied") &&
      Number.isFinite(saved.savedAt) && saved.savedAt <= now && now - saved.savedAt < CONSENT_MAX_AGE
      ? saved.choice : null;
  } catch {
    return null;
  }
}

export function measurementId(value: string | undefined): string | null {
  return value && /^G-[A-Z0-9]+$/.test(value) ? value : null;
}

export function measurementHost(host: string, canonicalHost: string, debug = false): boolean {
  return host === canonicalHost || host === `www.${canonicalHost}` ||
    (debug && (host === "localhost" || host === "127.0.0.1"));
}

// Query strings may contain form values or other private information. Only
// bounded campaign parameters / Google click IDs belong in measurement URLs.
export function measurementUrl(href: string): string {
  const url = new URL(href);
  const clean = new URL(url.pathname, url.origin);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"]) {
    const value = url.searchParams.get(key);
    if (value && value.length <= 100 && /^[\p{L}\p{N} _.\-/|]+$/u.test(value)) clean.searchParams.set(key, value);
  }
  for (const key of ["gclid", "gbraid", "wbraid"]) {
    const value = url.searchParams.get(key);
    if (value && /^[A-Za-z0-9_-]{1,200}$/.test(value)) clean.searchParams.set(key, value);
  }
  return clean.href;
}

export function measurementReferrer(href: string): string {
  try {
    const url = new URL(href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

export function isBusinessLineLink(href: string, businessUrl: string): boolean {
  try {
    const link = new URL(href);
    const business = new URL(businessUrl);
    return link.protocol === "https:" && link.origin === business.origin &&
      link.pathname.replace(/\/$/, "") === business.pathname.replace(/\/$/, "");
  } catch {
    return false;
  }
}

const locations = ["header", "cta", "contact", "floating", "pricing_intro", "pricing", "column", "not_found"];
export function lineClickParameters(location: string | undefined, pathname: string, businessUrl: string) {
  return {
    contact_method: "line",
    cta_location: location && locations.includes(location) ? location : "cta",
    page_path: pathname,
    link_url: businessUrl,
  };
}
