import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/root-meta";

export const metadata: Metadata = rootMetadata("en");
export const viewport: Viewport = rootViewport;

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
