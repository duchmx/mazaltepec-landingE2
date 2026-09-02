/**
 * Meta Pixel and GA4 wrappers. Both are no-ops when the tag never loaded — either
 * because the env var is absent or because a blocker removed it.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | undefined>;

function fbqTrack(name: string, params: EventParams): void {
  try {
    window.fbq?.("trackCustom", name, params);
  } catch {
    /* analytics must never break the page */
  }
}

function gtagEvent(name: string, params: EventParams): void {
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* analytics must never break the page */
  }
}

function track(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const clean: EventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") clean[key] = value;
  }
  fbqTrack(name, clean);
  gtagEvent(name, clean);
}

/** Fired on every WhatsApp click, wherever it is on the page. */
export function trackWhatsAppClick(source: string, params: EventParams = {}): void {
  track("whatsapp_click", { source, ...params });
}

/** Fired when the lead form is accepted by the route handler. */
export function trackLeadSubmit(params: EventParams = {}): void {
  track("lead_submit", params);
}
