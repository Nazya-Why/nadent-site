"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { cn } from "@/lib/format";

export interface ShowcaseCase {
  id: string;
  service: string;
  serviceLabel: string;
  title: string;
  patient: string;
  task: string;
  solution: string;
  result: string;
  duration: string;
  visits: string;
  doctor: { name: string; href: string };
  href: string;
  before: ReactNode;
  after: ReactNode;
}

export interface ShowcaseLabels {
  all: string;
  task: string;
  solution: string;
  result: string;
  duration: string;
  visits: string;
  doctor: string;
  slider: string;
  before: string;
  after: string;
  filter: string;
  more: string;
  note: string;
}

/** Filterable before/after viewer with the story of each case. */
export function CasesShowcase({ cases, labels }: { cases: ShowcaseCase[]; labels: ShowcaseLabels }) {
  const services = Array.from(new Map(cases.map((c) => [c.service, c.serviceLabel])).entries());
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? cases : cases.filter((c) => c.service === filter);
  const [index, setIndex] = useState(0);
  const current = visible[Math.min(index, visible.length - 1)];

  return (
    <div>
      <div role="group" aria-label={labels.filter} className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-2 no-scrollbar">
        {[["all", labels.all] as const, ...services].map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => {
              setFilter(id);
              setIndex(0);
            }}
            className={cn(
              "pressable h-11 shrink-0 rounded-full px-5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors",
              filter === id ? "bg-fg text-bg" : "bg-fg/[0.06] hover:bg-fg/[0.1]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {current && (
        <div key={current.id} className="mt-8 grid animate-[nd-fade-up_420ms_var(--ease-out)] grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14">
          <div>
            <BeforeAfter
              trackId={current.id}
              className="aspect-[4/3] rounded-[28px] md:rounded-[36px]"
              labels={{ before: labels.before, after: labels.after, slider: labels.slider }}
              before={current.before}
              after={current.after}
            />
            <p className="mt-3 text-[0.8125rem] text-fg-muted">{labels.note}</p>
          </div>
          <div className="flex flex-col gap-5">
            <p className="t-overline text-accent">
              {current.serviceLabel} · {current.patient}
            </p>
            <h3 className="t-h3">{current.title}</h3>
            <dl className="flex flex-col gap-4">
              {[
                [labels.task, current.task],
                [labels.solution, current.solution],
                [labels.result, current.result],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.875rem] font-semibold">{k}</dt>
                  <dd className="mt-1 text-fg-muted">{v}</dd>
                </div>
              ))}
            </dl>
            <dl className="grid grid-cols-3 gap-3 rounded-[22px] bg-fg/[0.04] p-4 text-[0.875rem] [&>div]:min-w-0 [&_dd]:break-words">
              <div>
                <dt className="text-fg-muted">{labels.duration}</dt>
                <dd className="mt-0.5 font-semibold">{current.duration}</dd>
              </div>
              <div>
                <dt className="text-fg-muted">{labels.visits}</dt>
                <dd className="mt-0.5 font-semibold">{current.visits}</dd>
              </div>
              <div>
                <dt className="text-fg-muted">{labels.doctor}</dt>
                <dd className="mt-0.5 font-semibold">
                  <Link href={current.doctor.href} className="hover:text-accent">
                    {current.doctor.name}
                  </Link>
                </dd>
              </div>
            </dl>
            {visible.length > 1 && (
              <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {visible.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}. ${c.title}`}
                    aria-current={c.id === current.id}
                    className="grid size-11 place-items-center"
                  >
                    <span className={cn("block h-2 rounded-full transition-all duration-300", c.id === current.id ? "w-7 bg-accent" : "w-2 bg-fg/20")} />
                  </button>
                ))}
                <Link href={current.href} className="ml-auto text-[0.9375rem] font-semibold text-accent hover:underline">
                  {labels.more} →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
