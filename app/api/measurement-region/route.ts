import { analyticsConfig } from "@/analytics.config";
import { siteConfig } from "@/site.config";
import { japanMeasurementEligibility } from "@/lib/measurement-region";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: Request) {
  const host = new URL(request.url).hostname;
  const canonical = new URL(siteConfig.meta.url).hostname;
  const production = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
  const decision = analyticsConfig.cookieMeasurementEnabled && production && (host === canonical || host === `www.${canonical}`)
    ? japanMeasurementEligibility(request.headers)
    : { eligible: false, reason: "unsupported-deployment" };
  // No IP, precise location, cookies, or consent records are returned or stored.
  // Never cache a Japanese visitor's answer for another visitor.
  return Response.json(decision, { headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
    "Vary": "X-Vercel-IP-Country, CF-IPCountry",
  } });
}
