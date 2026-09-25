"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/format";

/** Looks like a search field, opens the command palette. */
export function SearchTrigger({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("nd:search"))}
      className={cn(
        "flex h-13 items-center gap-3 rounded-2xl bg-fg/[0.06] px-4 text-left text-fg-muted transition-colors hover:bg-fg/[0.09]",
        className,
      )}
    >
      <Search aria-hidden size={20} strokeWidth={1.75} />
      <span className="flex-1 truncate">{label}</span>
      <kbd className="hidden rounded-md border border-line-strong px-1.5 py-0.5 font-sans text-[0.75rem] md:inline">⌘K</kbd>
    </button>
  );
}
