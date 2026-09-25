"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
    __ndTurnstile?: Promise<void>;
  }
}

function loadScript(): Promise<void> {
  if (window.__ndTurnstile) return window.__ndTurnstile;
  window.__ndTurnstile = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.__ndTurnstile;
}

/**
 * Cloudflare Turnstile (invisible-first "managed" mode). Loaded only when a site key
 * is configured and only when the contact step is shown. The Worker verifies the token.
 */
export function Turnstile({ onToken, locale }: { onToken: (t: string) => void; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!site.turnstileSiteKey || !ref.current) return;
    let id: string | undefined;
    let alive = true;
    loadScript()
      .then(() => {
        if (!alive || !ref.current || !window.turnstile) return;
        id = window.turnstile.render(ref.current, {
          sitekey: site.turnstileSiteKey,
          language: locale === "uk" ? "uk" : "en",
          appearance: "interaction-only",
          theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(""),
        });
      })
      .catch(() => onToken(""));
    return () => {
      alive = false;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [onToken, locale]);

  if (!site.turnstileSiteKey) return null;
  return <div ref={ref} className="min-h-0 empty:hidden" />;
}
