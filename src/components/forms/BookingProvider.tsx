"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { track } from "@/lib/analytics";
import type { BookingWizardProps } from "./BookingWizard";

const loadWizard = () => import("./BookingWizard").then((m) => m.BookingWizard);
const BookingWizard = dynamic(loadWizard, {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 p-8" aria-hidden>
      <div className="h-2 w-full animate-pulse rounded-full bg-fg/[0.08]" />
      <div className="h-8 w-2/3 animate-pulse rounded-xl bg-fg/[0.08]" />
      <div className="grid gap-2.5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-[18px] bg-fg/[0.06]" />
        ))}
      </div>
    </div>
  ),
});

type Preset = NonNullable<BookingWizardProps["preset"]>;

/** Programmatic opening from client components. */
export function openBooking(preset: Preset = {}) {
  window.dispatchEvent(new CustomEvent<Preset>("nd:book", { detail: preset }));
}

/**
 * Turns every link with [data-book] into a booking sheet. Without JS (or with a
 * modifier key) the link simply navigates to the /zapys page, so nothing breaks.
 */
export function BookingProvider(props: Omit<BookingWizardProps, "preset" | "onDone" | "mode"> & { title: string; closeLabel: string }) {
  const { title, closeLabel, ...wizard } = props;
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>({});
  const [session, setSession] = useState(0);

  useEffect(() => {
    const openWith = (p: Preset) => {
      window.dispatchEvent(new Event("nd:overlay-open"));
      setPreset(p);
      setSession((s) => s + 1);
      setOpen(true);
      track("booking_open", { source: p.source, service: p.service, doctor: p.doctor });
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-book]");
      if (!el) return;
      // Capture phase on window runs before next/link's own handler; stop it from navigating.
      e.preventDefault();
      e.stopPropagation();
      const href = el.getAttribute("href") ?? "";
      const q = new URLSearchParams(href.split("?")[1] ?? "");
      openWith({
        service: el.dataset.bookService ?? q.get("service") ?? undefined,
        doctor: el.dataset.bookDoctor ?? q.get("doctor") ?? undefined,
        source: el.dataset.bookSource ?? "link",
      });
    };
    const onEvent = (e: Event) => openWith((e as CustomEvent<Preset>).detail ?? {});
    // Warm the chunk as soon as the user shows intent
    const warm = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-book]")) void loadWizard();
    };
    window.addEventListener("click", onClick, { capture: true });
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    window.addEventListener("nd:book", onEvent);
    return () => {
      window.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
      window.removeEventListener("nd:book", onEvent);
    };
  }, []);

  return (
    <Sheet open={open} onClose={() => setOpen(false)} label={title} closeLabel={closeLabel} size="lg">
      {session > 0 && <BookingWizard key={session} {...wizard} preset={preset} mode="sheet" onDone={() => setOpen(false)} />}
    </Sheet>
  );
}
