type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: Clarity;
  }
}

export function clarityProjectId(value: string | undefined): string | null {
  return value && /^[a-z0-9]{6,20}$/.test(value) ? value : null;
}

// Inserted only after the server verifies Japanese traffic, and never after an
// opt-out. This analytics-only regional default is not an explicit-consent log.
// A single script survives App Router navigation and preference changes.
export function startClarity(projectId: string) {
  if (!clarityProjectId(projectId)) return;
  window.clarity ??= function (...args: unknown[]) {
    (window.clarity!.q ??= []).push(args);
  };
  const existing = document.getElementById("microsoft-clarity");
  if (existing) window.clarity("start");
  window.clarity("consentv2", {
    analytics_Storage: "granted",
    ad_Storage: "denied",
  });
  if (existing) return;
  const script = document.createElement("script");
  script.id = "microsoft-clarity";
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}

export function stopClarity() {
  if (!window.clarity) return;
  window.clarity("consentv2", {
    analytics_Storage: "denied",
    ad_Storage: "denied",
  });
  // Denying cookies alone still permits cookieless collection. Stop the
  // recorder as well when the visitor withdraws analytics consent.
  window.clarity("stop");
}
