"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";

/** WAI-ARIA tabs with automatic activation and roving tabindex. */
export function Tabs({ tabs, label, className }: { tabs: { id: string; label: ReactNode; content: ReactNode }[]; label: string; className?: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-[18px] bg-fg/[0.06] p-1 no-scrollbar">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "min-h-11 shrink-0 rounded-[14px] px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-all duration-200",
              i === active ? "bg-bg-elevated text-fg shadow-[0_1px_3px_rgb(0_0_0/0.1)]" : "text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-6 animate-[nd-fade-up_320ms_var(--ease-out)] outline-none"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
