import type { Locale } from "./config";

/**
 * Every static page and its localized path. UA lives at the root, EN under /en.
 * Transliteration follows the official Ukrainian system (КМУ 2010).
 */
export const staticRoutes = {
  home: { uk: "/", en: "/en/" },
  services: { uk: "/posluhy/", en: "/en/services/" },
  doctors: { uk: "/likari/", en: "/en/doctors/" },
  prices: { uk: "/tsiny/", en: "/en/prices/" },
  cases: { uk: "/roboty/", en: "/en/cases/" },
  reviews: { uk: "/vidhuky/", en: "/en/reviews/" },
  about: { uk: "/pro-kliniku/", en: "/en/about/" },
  technology: { uk: "/tekhnolohii/", en: "/en/technology/" },
  offers: { uk: "/aktsii/", en: "/en/offers/" },
  payment: { uk: "/rozstrochka/", en: "/en/payment/" },
  firstVisit: { uk: "/pershyi-vizyt/", en: "/en/first-visit/" },
  blog: { uk: "/blog/", en: "/en/blog/" },
  faq: { uk: "/faq/", en: "/en/faq/" },
  contacts: { uk: "/kontakty/", en: "/en/contacts/" },
  book: { uk: "/zapys/", en: "/en/book/" },
  thanks: { uk: "/diakuiemo/", en: "/en/thank-you/" },
  privacy: { uk: "/polityka-konfidentsiinosti/", en: "/en/privacy-policy/" },
  terms: { uk: "/umovy-vykorystannia/", en: "/en/terms/" },
  styleguide: { uk: "/styleguide/", en: "/styleguide/" },
} as const satisfies Record<string, Record<Locale, string>>;

export type StaticRoute = keyof typeof staticRoutes;

/** Collections with a detail page: the parent route supplies the prefix. */
const collectionParent = {
  service: "services",
  doctor: "doctors",
  case: "cases",
  article: "blog",
} as const satisfies Record<string, StaticRoute>;

export type CollectionRoute = keyof typeof collectionParent;

export function route(locale: Locale, key: StaticRoute, hash?: string): string {
  const path = staticRoutes[key][locale];
  return hash ? `${path}#${hash}` : path;
}

export function detailRoute(locale: Locale, key: CollectionRoute, slug: string): string {
  return `${staticRoutes[collectionParent[key]][locale]}${slug}/`;
}

export function homeFor(locale: Locale): string {
  return staticRoutes.home[locale];
}
