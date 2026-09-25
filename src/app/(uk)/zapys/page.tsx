import type { Metadata } from "next";
import { BookView } from "@/views/BookView";
import { pageMetadata, staticPaths } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "uk",
  paths: staticPaths("book"),
  title: "Онлайн-запис",
  description: "Запишіться до стоматолога у Львові онлайн за 1 хвилину: оберіть послугу, лікаря і зручний час. Відповімо за 15 хвилин.",
});

export default function Page() {
  return <BookView locale="uk" />;
}
