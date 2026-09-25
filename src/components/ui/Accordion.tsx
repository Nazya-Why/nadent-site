import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/**
 * Accordion on native <details>: keyboard, screen readers and find-in-page work
 * without JS. Height animates where ::details-content is supported.
 */
export function Accordion({ items, className, name }: { items: { q: ReactNode; a: ReactNode; id?: string }[]; className?: string; name?: string }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((it, i) => (
        <details key={it.id ?? i} id={it.id} name={name} className="nd-acc group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold tracking-[-0.01em] md:text-[1.1875rem] [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg/[0.06] transition-[transform,background-color] duration-300 ease-(--ease-out) group-open:rotate-45 group-open:bg-accent group-open:text-accent-fg">
              <Plus aria-hidden size={18} strokeWidth={2} />
            </span>
          </summary>
          <div className="t-body measure pr-12 pb-6 text-fg-muted [&_a]:text-accent [&_a]:underline [&_p+p]:mt-3">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
