import type { Metadata } from "next";
import { absoluteUrl } from "@/config/site";
import { getDictionary } from "@/i18n";
import { ogLocale, type Locale, type Localized } from "@/i18n/config";
import { staticRoutes, type StaticRoute } from "@/i18n/routes";

interface MetaInput {
  locale: Locale;
  /** Path of this page in every locale */
  paths: Localized<string>;
  title: string;
  description: string;
  /** OG image path (absolute path on this site) */
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  /** Use the title as-is (home page) instead of the template */
  absoluteTitle?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function pageMetadata({ locale, paths, title, description, image, noindex, type = "website", absoluteTitle, publishedTime, modifiedTime }: MetaInput): Metadata {
  const d = getDictionary(locale);
  const url = absoluteUrl(paths[locale]);
  const og = image ?? `/og/${locale}-default.png`;
  const fullTitle = absoluteTitle ? title : d.meta.titleTemplate.replace("%s", title);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: {
        uk: absoluteUrl(paths.uk),
        en: absoluteUrl(paths.en),
        "x-default": absoluteUrl(paths.uk),
      },
    },
    openGraph: {
      type,
      url,
      siteName: "NaDent",
      title: fullTitle,
      description,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[locale === "uk" ? "en" : "uk"]],
      images: [{ url: absoluteUrl(og), width: 1200, height: 630, alt: title }],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(og)],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
  };
}

export function staticPaths(key: StaticRoute): Localized<string> {
  return staticRoutes[key];
}
