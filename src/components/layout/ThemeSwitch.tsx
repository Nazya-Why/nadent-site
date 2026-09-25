"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/format";

type Mode = "system" | "light" | "dark";
const KEY = "nd-theme";

function read(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (read() === "system") apply("system");
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
  };
}

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  const swap = () => {
    root.dataset.theme = dark ? "dark" : "light";
    root.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b0c0e" : "#fbfbfd");
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(swap);
  else swap();
}

function set(mode: Mode) {
  try {
    if (mode === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {
    /* storage unavailable: still apply for this page view */
  }
  apply(mode);
  listeners.forEach((l) => l());
}

export function ThemeSwitch({ labels, className }: { labels: { system: string; light: string; dark: string; group: string }; className?: string }) {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as Mode);
  const options: { value: Mode; label: string; Icon: typeof Sun }[] = [
    { value: "system", label: labels.system, Icon: Monitor },
    { value: "light", label: labels.light, Icon: Sun },
    { value: "dark", label: labels.dark, Icon: Moon },
  ];
  return (
    <div role="group" aria-label={labels.group} className={cn("inline-flex rounded-full bg-fg/[0.06] p-1", className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          aria-label={label}
          title={label}
          onClick={() => set(value)}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full transition-colors",
            mode === value ? "bg-bg-elevated text-fg shadow-sm" : "text-fg-muted hover:text-fg",
          )}
        >
          <Icon aria-hidden size={16} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
