// Google measurement IDs are public identifiers, not API keys. The verified
// production ID is set here so a Vercel deployment needs no new secret.
export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-JVS5FTTQLJ",
  // Only opt-in local QA may send debug events; Vercel previews stay excluded.
  debugLocal: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
};
