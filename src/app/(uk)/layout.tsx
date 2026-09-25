import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/root-meta";

export const metadata: Metadata = rootMetadata("uk");
export const viewport: Viewport = rootViewport;

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="uk">{children}</RootDocument>;
}
