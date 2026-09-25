"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/format";

/**
 * Horizontal scroll-snap carousel. Native scrolling (touch, trackpad, keyboard)
 * plus prev/next buttons on desktop. No autoplay: the visitor stays in control.
 */
export function ScrollRow({
  children,
  label,
  prevLabel,
  nextLabel,
  className,
  itemClassName,
  bleed = true,
}: {
  children: ReactNode[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  className?: string;
  itemClassName?: string;
  /** Extend to the viewport edges on mobile */
  bleed?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector("li");
    const step = item ? item.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={ref}
        aria-label={label}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 no-scrollbar",
          bleed && "-mx-(--gutter) scroll-px-(--gutter) px-(--gutter)",
        )}
        data-lenis-prevent-wheel=""
      >
        {children.map((child, i) => (
          <li key={i} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={edges.start}
          aria-label={prevLabel}
          className="pressable grid size-11 place-items-center rounded-full bg-fg/[0.06] transition-opacity hover:bg-fg/[0.1] disabled:opacity-30"
        >
          <ChevronLeft aria-hidden size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={edges.end}
          aria-label={nextLabel}
          className="pressable grid size-11 place-items-center rounded-full bg-fg/[0.06] transition-opacity hover:bg-fg/[0.1] disabled:opacity-30"
        >
          <ChevronRight aria-hidden size={20} />
        </button>
      </div>
    </div>
  );
}
