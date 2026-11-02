// Presentation only: no click IDs are saved, sent, or treated as consent.
const paidClickKeys = ["gclid", "dclid", "gbraid", "wbraid"];
const paidMedia = ["cpc", "ppc", "paidsearch", "paid_search", "paid-social", "paid_social", "display"];

export function isPaidLanding(search: string): boolean {
  const params = new URLSearchParams(search);
  return paidClickKeys.some(key => Boolean(params.get(key)?.trim())) ||
    paidMedia.includes((params.get("utm_medium") ?? "").trim().toLowerCase());
}

// Runs in the head, before the opening can paint. Keep the homepage static and
// cacheable; query values never enter HTML, text, storage or an analytics event.
export const homeEntryBootstrap = `(()=>{try{if(location.pathname!=="/")return;var p=new URLSearchParams(location.search);if(${JSON.stringify(paidClickKeys)}.some(k=>(p.get(k)||"").trim())||${JSON.stringify(paidMedia)}.includes((p.get("utm_medium")||"").trim().toLowerCase()))document.documentElement.setAttribute("data-home-entry","direct");}catch{}})();`;
