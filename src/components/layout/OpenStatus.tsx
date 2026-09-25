"use client";

import { useSyncExternalStore } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { cn } from "@/lib/format";

export interface OpenStatusLabels {
  openUntil: string;
  closingSoon: string;
  closedOpensToday: string;
  closedOpensTomorrow: string;
  closedOpensOn: string;
  days: readonly string[];
}

function subscribe(cb: () => void) {
  const t = window.setInterval(cb, 60_000);
  return () => window.clearInterval(t);
}

let cached: { at: number; value: Status } | null = null;
function snapshot(): Status {
  const minute = Math.floor(Date.now() / 60_000);
  if (!cached || cached.at !== minute) cached = { at: minute, value: getOpenStatus() };
  return cached.value;
}

export function formatStatus(s: Status, l: OpenStatusLabels): string {
  if (s.open) return (s.closingSoon ? l.closingSoon : l.openUntil).replace("{time}", s.closesAt ?? "");
  if (!s.opensAt) return "";
  const { time, isToday, isTomorrow, day } = s.opensAt;
  const tpl = isToday ? l.closedOpensToday : isTomorrow ? l.closedOpensTomorrow : l.closedOpensOn;
  return tpl.replace("{time}", time).replace("{day}", l.days[day]);
}

/** Live "Open until 21:00" badge. Renders nothing on the server (time-dependent). */
export function OpenStatus({ labels, className }: { labels: OpenStatusLabels; className?: string }) {
  const status = useSyncExternalStore(subscribe, snapshot, () => null);
  if (!status) return <span className={cn("inline-block min-w-[9rem]", className)} aria-hidden />;
  return (
    <span className={cn("inline-flex items-center gap-2 text-[0.875rem] font-medium", className)}>
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          status.open ? "bg-success text-success [animation:nd-pulse_2.4s_ease-out_infinite]" : "bg-fg-subtle",
        )}
      />
      <span>{formatStatus(status, labels)}</span>
    </span>
  );
}
