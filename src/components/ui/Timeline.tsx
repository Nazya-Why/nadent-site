import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export interface TimelineStep {
  title: ReactNode;
  text?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
}

/** Numbered vertical timeline; horizontal on large screens when `horizontal`. */
export function Timeline({ steps, horizontal, className }: { steps: TimelineStep[]; horizontal?: boolean; className?: string }) {
  return (
    <ol className={cn("relative grid gap-0", horizontal && "lg:grid-flow-col lg:auto-cols-fr lg:gap-6", className)}>
      {steps.map((s, i) => (
        <li
          key={i}
          className={cn("relative grid grid-cols-[48px_1fr] gap-x-5 pb-10 last:pb-0", horizontal && "lg:grid-cols-1 lg:gap-y-5 lg:pb-0")}
          data-reveal
          style={{ "--i": i } as React.CSSProperties}
        >
          {/* connector */}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 to-line",
                horizontal && "lg:top-6 lg:right-0 lg:bottom-auto lg:left-14 lg:h-px lg:w-auto lg:translate-x-0 lg:bg-gradient-to-r",
              )}
            />
          )}
          <span className="t-num relative grid size-12 place-items-center rounded-full bg-accent-soft text-[1.0625rem] font-semibold text-accent-soft-fg ring-8 ring-bg">
            {i + 1}
          </span>
          <div className="flex flex-col gap-1.5 pt-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="t-title">{s.title}</h3>
              {s.badge}
            </div>
            {s.meta && <p className="text-[0.875rem] font-medium text-accent">{s.meta}</p>}
            {s.text && <p className="text-fg-muted">{s.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
