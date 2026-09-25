"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/uk";
import type { QuizContent } from "@/content/quiz";

const load = () => import("./Quiz").then((m) => m.Quiz);
const Quiz = dynamic(load, { ssr: false });

/** Opens the cost estimator from any element with [data-quiz]; loads the quiz on demand. */
export function QuizProvider(props: { locale: Locale; content: QuizContent; forms: Dictionary["forms"]; privacyHref: string; thanksHref: string; closeLabel: string }) {
  const { closeLabel, ...quiz } = props;
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const el = (e.target as Element | null)?.closest("[data-quiz]");
      if (!el) return;
      // Capture phase on window runs before next/link's own handler; stop it from navigating.
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new Event("nd:overlay-open"));
      setSession((s) => s + 1);
      setOpen(true);
    };
    const warm = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-quiz]")) void load();
    };
    window.addEventListener("click", onClick, { capture: true });
    document.addEventListener("pointerover", warm, { passive: true });
    return () => {
      window.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("pointerover", warm);
    };
  }, []);

  return (
    <Sheet open={open} onClose={() => setOpen(false)} label={quiz.content.title} closeLabel={closeLabel} size="lg">
      {session > 0 && <Quiz key={session} {...quiz} onDone={() => setOpen(false)} />}
    </Sheet>
  );
}
