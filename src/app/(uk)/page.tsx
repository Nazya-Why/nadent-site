import type { Metadata } from "next";
import { HomeView } from "@/views/HomeView";
import { getDictionary } from "@/i18n";
import { pageMetadata, staticPaths } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const d = getDictionary("uk");
  return pageMetadata({ locale: "uk", paths: staticPaths("home"), title: d.meta.defaultTitle, description: d.meta.defaultDescription, absoluteTitle: true });
}

export default function Page() {
  return <HomeView locale="uk" />;
}
