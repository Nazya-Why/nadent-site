"use client";

import { useEffect, useState } from "react";
import { SuccessCheck } from "@/components/forms/SuccessCheck";
import type { Locale } from "@/i18n/config";

/** Personal greeting from the lead just sent (sessionStorage), demo-mode note from ?demo=1. */
export function ThanksGreeting({ locale, success, demoNote }: { locale: Locale; success: string; demoNote: string }) {
  const [name, setName] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nd-last-lead");
      const lead = raw ? (JSON.parse(raw) as { name?: string }) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads client-only storage after hydration
      if (lead?.name) setName(lead.name);
    } catch {
      /* ignore */
    }
    setDemo(new URLSearchParams(window.location.search).get("demo") === "1");
  }, []);

  const title = locale === "uk" ? `Дякуємо${name ? `, ${name}` : ""}!` : `Thank you${name ? `, ${name}` : ""}!`;
  return (
    <div className="flex flex-col items-center">
      <SuccessCheck size={96} />
      <h1 className="t-h1 mt-6">{title}</h1>
      <p className="t-body-lg mt-4 text-fg-muted">{success}</p>
      {demo && <p className="mt-4 rounded-full bg-warning-soft px-4 py-2 text-[0.875rem] font-medium text-warning">{demoNote}</p>}
    </div>
  );
}
