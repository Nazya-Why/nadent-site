"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/format";

export interface TechItem {
  id: string;
  name: string;
  model: string;
  title: string;
  benefits: string[];
  media: ReactNode;
  services: { label: string; href: string }[];
}

/**
 * apple.com-style sticky storytelling on desktop: text blocks scroll, the device image
 * stays pinned and cross-fades. On phones it becomes a swipeable card row (no scroll hijacking).
 */
export function TechScroller({ items, usedIn }: { items: TechItem[]; usedIn: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-16 lg:grid lg:grid-cols-[1fr_1.15fr]">
        <ol>
          {items.map((t, i) => (
            <li
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={cn(
                "flex min-h-[72vh] flex-col justify-center border-l-2 py-10 pl-8 transition-[border-color] duration-500",
                active === i ? "border-accent" : "border-line",
              )}
            >
              <p className="t-overline text-accent">
                {String(i + 1).padStart(2, "0")} · {t.name}
              </p>
              <h3 className={cn("t-h2 mt-4 max-w-md transition-colors duration-500", active === i ? "text-fg" : "text-fg-muted")}>{t.title}</h3>
              <ul className="mt-6 flex max-w-md flex-col gap-3">
                {t.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-fg-muted">
                    <Check aria-hidden size={20} className="mt-0.5 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.875rem] text-fg-muted">
                {usedIn}:{" "}
                {t.services.map((s, j) => (
                  <span key={s.href}>
                    <Link href={s.href} className="text-fg underline-offset-2 hover:underline">
                      {s.label}
                    </Link>
                    {j < t.services.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
        <div className="relative">
          <div className="sticky top-[calc(var(--header-h)+48px)] h-[min(78vh,720px)] overflow-hidden rounded-[40px] bg-bg-sunken">
            {items.map((t, i) => (
              <div
                key={t.id}
                aria-hidden={active !== i}
                className={cn("absolute inset-0 transition-[opacity,transform] duration-700 ease-(--ease-out)", active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0")}
              >
                {t.media}
              </div>
            ))}
            <div className="glass glass--prominent absolute bottom-5 left-5 rounded-full px-4 py-2 text-[0.875rem] font-semibold">{items[active]?.model}</div>
            <div aria-hidden className="absolute top-6 right-6 flex flex-col gap-2">
              {items.map((t, i) => (
                <span key={t.id} className={cn("h-6 w-1.5 rounded-full transition-colors duration-500", active === i ? "bg-accent" : "bg-white/60")} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <ul className="-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pb-2 no-scrollbar lg:hidden">
        {items.map((t) => (
          <li key={t.id} className="w-[82vw] max-w-[380px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-bg-elevated ring-1 ring-line">
            <div className="relative aspect-[4/3]">{t.media}</div>
            <div className="flex flex-col gap-3 p-5">
              <p className="t-overline text-accent">{t.name}</p>
              <h3 className="t-title">{t.title}</h3>
              <ul className="flex flex-col gap-2 text-[0.9375rem] text-fg-muted">
                {t.benefits.slice(0, 2).map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
