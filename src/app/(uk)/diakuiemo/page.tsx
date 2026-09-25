import type { Metadata } from "next";
import { ThanksView } from "@/views/ThanksView";
import { pageMetadata, staticPaths } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "uk",
  paths: staticPaths("thanks"),
  title: "Дякуємо за заявку",
  description: "Заявку отримано. Ми звʼяжемося з вами найближчим часом.",
  noindex: true,
});

export default function Page() {
  return <ThanksView locale="uk" />;
}
