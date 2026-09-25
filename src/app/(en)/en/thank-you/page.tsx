import type { Metadata } from "next";
import { ThanksView } from "@/views/ThanksView";
import { pageMetadata, staticPaths } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  paths: staticPaths("thanks"),
  title: "Thank you",
  description: "We have received your request and will be in touch shortly.",
  noindex: true,
});

export default function Page() {
  return <ThanksView locale="en" />;
}
