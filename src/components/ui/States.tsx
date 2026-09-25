import type { ReactNode } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import { cn } from "@/lib/format";

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-xl bg-[linear-gradient(90deg,var(--bg-sunken)_0%,color-mix(in_srgb,var(--bg-sunken)_40%,var(--bg-elevated))_50%,var(--bg-sunken)_100%)] bg-[length:200%_100%] [animation:nd-shimmer_1.6s_linear_infinite]",
        className,
      )}
    />
  );
}

export function EmptyState({ title, text, action, className }: { title: string; text?: string; action?: ReactNode; className?: string }) {
  return (
    <div role="status" className={cn("flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-line-strong px-6 py-14 text-center", className)}>
      <span className="grid size-14 place-items-center rounded-2xl bg-fg/[0.05] text-fg-muted">
        <SearchX aria-hidden size={26} strokeWidth={1.5} />
      </span>
      <p className="t-title">{title}</p>
      {text && <p className="max-w-sm text-fg-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, text, action, className }: { title: string; text?: string; action?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-[28px] bg-error-soft px-6 py-12 text-center", className)}>
      <span className="grid size-14 place-items-center rounded-2xl bg-bg-elevated text-error">
        <AlertTriangle aria-hidden size={26} strokeWidth={1.5} />
      </span>
      <p className="t-title">{title}</p>
      {text && <p className="max-w-sm text-fg-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** CSS-only tooltip for supplementary info (content is also exposed via aria-describedby). */
export function Tooltip({ id, tip, children }: { id: string; tip: string; children: ReactNode }) {
  return (
    <span className="group/tip relative inline-flex">
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 w-max max-w-[240px] -translate-x-1/2 translate-y-1 rounded-xl bg-fg px-3 py-2 text-[0.8125rem] leading-snug font-medium text-bg opacity-0 shadow-lg transition-all duration-200 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}
