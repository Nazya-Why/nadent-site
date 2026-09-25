import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { detailRoute, route, type StaticRoute } from "@/i18n/routes";
import { getServices } from "@/content/services";
import { getDoctors } from "@/content/doctors";
import { getSearchExtras } from "@/content/search-extras";

export type SearchGroup = "service" | "doctor" | "faq" | "article" | "page";

export interface SearchItem {
  g: SearchGroup;
  t: string; // title
  d?: string; // description
  h: string; // href
  k?: string; // extra keywords
}

/** Built at export time into /search/<locale>.json and fetched on first search. */
export function buildSearchIndex(locale: Locale): SearchItem[] {
  const dict = getDictionary(locale);
  const items: SearchItem[] = [];

  for (const s of getServices(locale)) {
    items.push({ g: "service", t: s.text.name, d: s.text.short, h: detailRoute(locale, "service", s.slug) });
  }
  for (const d of getDoctors(locale)) {
    items.push({ g: "doctor", t: d.text.name, d: d.text.role, h: detailRoute(locale, "doctor", d.slug), k: d.text.short });
  }

  const pages: [StaticRoute, string][] = [
    ["prices", dict.nav.prices],
    ["doctors", dict.nav.doctors],
    ["cases", dict.nav.cases],
    ["reviews", dict.nav.reviews],
    ["about", dict.nav.about],
    ["technology", dict.nav.technology],
    ["firstVisit", dict.nav.firstVisit],
    ["payment", dict.nav.payment],
    ["offers", dict.nav.offers],
    ["blog", dict.nav.blog],
    ["faq", dict.nav.faq],
    ["contacts", dict.nav.contacts],
    ["book", dict.cta.book],
  ];
  for (const [key, label] of pages) items.push({ g: "page", t: label, h: route(locale, key) });

  items.push(...getSearchExtras(locale));
  return items;
}
