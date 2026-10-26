// Google measurement IDs are public identifiers, not API keys. The verified
// production ID is set here so a Vercel deployment needs no new secret.
export const analyticsConfig = {
  // No consent popup: cookie-based Google / Clarity measurement stays OFF.
  // Existing saved consent must not bypass this site-wide switch.
  cookieMeasurementEnabled: false,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-JVS5FTTQLJ",
  clarityProjectId: "z3m9xda0mq",
  // Only opt-in local QA may send debug events; Vercel previews stay excluded.
  debugLocal: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
};
