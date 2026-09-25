/**
 * Captures UTM / click ids on landing and keeps them for the whole session
 * (and 30 days as first-touch after consent), so every lead carries its source.
 */

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing_page" | "referrer" | "first_touch", string>>;

const SESSION_KEY = "nd-attr";
const FIRST_TOUCH_KEY = "nd-first-touch";

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  const existing = safe(() => JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null") as Attribution | null, null);
  if (Object.keys(found).length || !existing) {
    const record: Attribution = {
      ...found,
      landing_page: window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : "",
    };
    safe(() => sessionStorage.setItem(SESSION_KEY, JSON.stringify(record)), undefined);
  }
}

/** Persist first touch for 30 days: only called when analytics consent is given. */
export function persistFirstTouch(): void {
  const current = getAttribution();
  if (!current.utm_source && !current.gclid && !current.fbclid) return;
  const existing = safe(() => localStorage.getItem(FIRST_TOUCH_KEY), null);
  if (existing) {
    const parsed = safe(() => JSON.parse(existing) as { at: number }, { at: 0 });
    if (Date.now() - parsed.at < 30 * 864e5) return;
  }
  safe(() => localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({ at: Date.now(), ...current })), undefined);
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const session = safe(() => JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "{}") as Attribution, {});
  const first = safe(() => JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY) ?? "null") as (Attribution & { at?: number }) | null, null);
  if (first && first.utm_source && first.utm_source !== session.utm_source) {
    return { ...session, first_touch: `${first.utm_source}/${first.utm_medium ?? ""}/${first.utm_campaign ?? ""}` };
  }
  return session;
}
