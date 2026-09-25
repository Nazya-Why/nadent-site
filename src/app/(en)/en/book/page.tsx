import type { Metadata } from "next";
import { BookView } from "@/views/BookView";
import { pageMetadata, staticPaths } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  paths: staticPaths("book"),
  title: "Online booking",
  description: "Book a dentist in Lviv online in one minute: choose a treatment, doctor and convenient time. We reply within 15 minutes.",
});

export default function Page() {
  return <BookView locale="en" />;
}
