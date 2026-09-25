import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getAttribution } from "./utm";

/* ---------- Phone ---------- */

/** Keeps the 9 national digits after +380. Accepts "067…", "+38067…", "38067…", "67…". */
export function phoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("380")) d = d.slice(3).replace(/^0/, "");
  else if (d.startsWith("80") && d.length > 9) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 9);
}

/** "671234567" -> "+380 67 123 45 67" (progressive, for the input mask) */
export function formatPhoneInput(digits: string): string {
  const d = digits.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return `+380${parts.length ? " " : ""}${parts.join(" ")}`;
}

export function toE164(digits: string): string {
  return `+380${digits}`;
}

/* ---------- Schemas ---------- */

export const channels = ["call", "telegram", "viber", "whatsapp"] as const;
export type Channel = (typeof channels)[number];
export const dayParts = ["asap", "morning", "day", "evening"] as const;
export type DayPart = (typeof dayParts)[number];

/* ---------- Submit ---------- */

export type LeadKind = "booking" | "quick" | "callback" | "quiz" | "exit" | "doctor";

export interface LeadPayload {
  kind: LeadKind;
  locale: Locale;
  name: string;
  phone: string; // E.164
  channel?: Channel;
  service?: string;
  doctor?: string;
  date?: string;
  dayPart?: string;
  time?: string;
  comment?: string;
  quiz?: Record<string, string | string[]>;
  estimate?: string;
  website?: string;
  turnstileToken?: string;
}

export interface LeadResult {
  ok: boolean;
  demo?: boolean;
  error?: "network" | "spam" | "rate_limit" | "server";
}

/**
 * Sends a lead to the Worker (Telegram + email + CRM). Without an endpoint the site
 * runs in demo mode: the lead is kept in this browser only, so the flow can be tested.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const body = {
    ...payload,
    page: typeof window !== "undefined" ? window.location.pathname : "",
    submittedAt: new Date().toISOString(),
    attribution: getAttribution(),
  };

  if (payload.website) return { ok: true }; // honeypot: pretend success, send nothing

  if (!site.leadEndpoint) {
    await new Promise((r) => setTimeout(r, 700));
    try {
      const prev = JSON.parse(localStorage.getItem("nd-demo-leads") ?? "[]") as unknown[];
      localStorage.setItem("nd-demo-leads", JSON.stringify([...prev.slice(-19), body]));
    } catch {
      /* ignore */
    }
    console.info("[NaDent demo] lead captured locally:", body);
    return { ok: true, demo: true };
  }

  try {
    const res = await fetch(site.leadEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, error: "rate_limit" };
    if (res.status === 403) return { ok: false, error: "spam" };
    return { ok: false, error: "server" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** Remember the first name for a personal thank-you page. */
export function rememberLead(name: string, kind: LeadKind) {
  try {
    sessionStorage.setItem("nd-last-lead", JSON.stringify({ name: name.split(" ")[0], kind, at: Date.now() }));
  } catch {
    /* ignore */
  }
}
