"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/format";
import { asset, site } from "@/config/site";

/**
 * Links to the same page in the other language. The target comes from the page's own
 * <link rel="alternate" hreflang> (set by metadata), so no route map ships to the client.
 */
export function LanguageSwitch({
  current,
  fallback,
  label,
  className,
  variant = "compact",
}: {
  current: Locale;
  fallback: string;
  label: string;
  className?: string;
  variant?: "compact" | "segmented";
}) {
  const pathname = usePathname();
  const target: Locale = current === "uk" ? "en" : "uk";
  const [href, setHref] = useState(fallback);

  useEffect(() => {
    const link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${target}"]`);
    const abs = link?.getAttribute("href");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads metadata injected into <head>
    setHref(abs ? asset(abs.startsWith(site.url) ? abs.slice(site.url.length) || "/" : new URL(abs).pathname) : fallback);
  }, [pathname, target, fallback]);

  if (variant === "segmented") {
    return (
      <div role="group" aria-label={label} className={cn("inline-flex rounded-full bg-fg/[0.06] p-1", className)}>
        {(["uk", "en"] as const).map((l) =>
          l === current ? (
            <span key={l} aria-current="true" className="inline-flex h-11 min-w-12 items-center justify-center rounded-full bg-bg-elevated px-3 text-[0.875rem] font-semibold shadow-sm">
              {l === "uk" ? "UA" : "EN"}
            </span>
          ) : (
            <a key={l} href={href} hrefLang={l} className="inline-flex h-11 min-w-12 items-center justify-center rounded-full px-3 text-[0.875rem] font-medium text-fg hover:bg-fg/[0.06]">
              {l === "uk" ? "UA" : "EN"}
            </a>
          ),
        )}
      </div>
    );
  }

  return (
    <a
      href={href}
      hrefLang={target}
      className={cn(
        "h-11 min-w-11 items-center lg:h-10 lg:min-w-10 justify-center rounded-full px-2.5 text-[0.8125rem] font-semibold tracking-wide transition-colors hover:bg-fg/[0.06]",
        className,
      )}
    >
      {target === "en" ? "EN" : "UA"}
      <span className="sr-only"> — {label}</span>
    </a>
  );
}
