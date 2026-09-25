import type { Metadata } from "next";
import { NotFoundView } from "@/views/NotFoundView";
import { RootDocument } from "@/components/layout/RootDocument";

export const metadata: Metadata = {
  title: "404 · NaDent",
  robots: { index: false, follow: true },
};

/**
 * Global 404 (GitHub Pages serves it as 404.html for any unknown URL).
 * The site has two root layouts (uk / en), so this renders the Ukrainian shell
 * and links to the English version.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument locale="uk">
      <NotFoundView locale="uk" />
    </RootDocument>
  );
}
