/**
 * Analytics facade. Events always go to window.dataLayer (GTM reads them);
 * GA4 / Meta Pixel are loaded only after consent (see ConsentManager).
 * Event names and params are documented in docs/ANALYTICS.md.
 */

export type AnalyticsEvent =
  | "phone_click"
  | "messenger_click"
  | "booking_open"
  | "booking_step"
  | "booking_submit"
  | "lead_success"
  | "lead_error"
  | "quick_form_submit"
  | "callback_submit"
  | "quiz_start"
  | "quiz_step"
  | "quiz_complete"
  | "calculator_use"
  | "price_view"
  | "price_search"
  | "route_click"
  | "scroll_depth"
  | "search_open"
  | "search_query"
  | "exit_intent_shown"
  | "exit_intent_convert"
  | "video_play"
  | "before_after_drag"
  | "cta_click";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", event, params);
  }
  // Meta standard events for the conversions that matter
  if (window.fbq && (event === "lead_success" || event === "quick_form_submit" || event === "callback_submit")) {
    window.fbq("track", "Lead", { content_name: params.service ?? params.form });
  }
  if (window.fbq && (event === "phone_click" || event === "messenger_click")) {
    window.fbq("track", "Contact", { method: params.channel });
  }
}
