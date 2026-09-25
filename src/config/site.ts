/**
 * Deployment-level settings. Everything comes from env so the same build
 * can target GitHub Pages, a custom domain or a preview.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nazya-why.github.io/nadent-site";

export const site = {
  /** Absolute origin + base path, no trailing slash. */
  url: rawUrl.replace(/\/$/, ""),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  /** Where lead forms POST to (Cloudflare Worker in /worker). Empty = demo mode. */
  leadEndpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  },
  /** Call tracking: replaces the displayed phone site-wide when set. */
  trackingPhone: {
    display: process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY ?? "",
    tel: process.env.NEXT_PUBLIC_TRACKING_PHONE_TEL ?? "",
  },
  /** Only true when slots come from a real CRM. Never fake scarcity. */
  liveSlots: process.env.NEXT_PUBLIC_LIVE_SLOTS === "true",
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Prefix a public asset path with the base path (next/link does this for links). */
export function asset(path: string): string {
  return `${site.basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
