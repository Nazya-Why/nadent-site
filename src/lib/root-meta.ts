import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export function rootMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(`${site.url}/`),
    title: { default: d.meta.defaultTitle, template: d.meta.titleTemplate },
    description: d.meta.defaultDescription,
    applicationName: "NaDent",
    formatDetection: { telephone: false, address: false, email: false },
    icons: {
      icon: [{ url: `${site.basePath}/icon.svg`, type: "image/svg+xml" }],
      apple: `${site.basePath}/apple-icon.png`,
    },
    manifest: `${site.basePath}/manifest.webmanifest`,
  };
}

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0e" },
  ],
};
