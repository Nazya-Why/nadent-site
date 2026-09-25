"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { BookingWizardProps } from "./BookingWizard";

// Lazy even on /zapys so that prefetching this route never pulls zod + react-hook-form
const BookingWizard = dynamic(() => import("./BookingWizard").then((m) => m.BookingWizard), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-3xl bg-fg/[0.04]" aria-hidden />,
});

/** /zapys: the same wizard as the sheet, preset from ?service= / ?doctor= query params. */
export function BookingPageClient(props: Omit<BookingWizardProps, "preset" | "mode" | "onDone">) {
  const params = useSearchParams();
  const service = params.get("service") ?? undefined;
  const doctor = params.get("doctor") ?? undefined;
  return <BookingWizard key={`${service}-${doctor}`} {...props} mode="page" preset={{ service, doctor, source: "book_page" }} />;
}
