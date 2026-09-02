/**
 * Advisor code (`?a=`) and UTM capture.
 *
 * Sales commission is attributed by the advisor code, so it is captured on first load,
 * kept in sessionStorage for the rest of the visit, injected into every WhatsApp message
 * and sent with the lead form payload.
 */

const ADVISOR_KEY = "jm_advisor";
const UTM_KEY = "jm_utm";
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
] as const;

export type Attribution = {
  advisor: string | null;
  utm: Record<string, string>;
};

const EMPTY: Attribution = { advisor: null, utm: {} };

function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    // Private browsing or blocked storage — attribution degrades, the page does not.
    return null;
  }
}

function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/** Advisor codes are short alphanumeric slugs; anything else is ignored. */
function sanitizeAdvisor(raw: string | null): string | null {
  if (!raw) return null;
  const code = raw.trim().slice(0, 24);
  return /^[A-Za-z0-9._-]+$/.test(code) ? code : null;
}

function sanitizeValue(raw: string): string {
  return raw.trim().slice(0, 120);
}

/**
 * Reads `?a=` and `utm_*` from the current URL, merges them over what is already stored,
 * and persists the result. Safe to call on every mount.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  const params = new URLSearchParams(window.location.search);

  const advisorFromUrl = sanitizeAdvisor(params.get("a"));
  if (advisorFromUrl) writeSession(ADVISOR_KEY, advisorFromUrl);

  const utmFromUrl: Record<string, string> = {};
  for (const param of UTM_PARAMS) {
    const value = params.get(param);
    if (value) utmFromUrl[param] = sanitizeValue(value);
  }
  if (Object.keys(utmFromUrl).length > 0) {
    writeSession(UTM_KEY, JSON.stringify(utmFromUrl));
  }

  return getAttribution();
}

/** Reads what was captured earlier in the session. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  let utm: Record<string, string> = {};
  const stored = readSession(UTM_KEY);
  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        utm = parsed as Record<string, string>;
      }
    } catch {
      /* ignore malformed storage */
    }
  }

  return { advisor: sanitizeAdvisor(readSession(ADVISOR_KEY)), utm };
}
