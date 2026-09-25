"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { captureAttribution } from "@/lib/utm";

/**
 * One small client island for page-wide behaviour, so sections can stay server components:
 * scroll reveal, smooth scrolling, glass shine, refraction capability, delegated analytics
 * and UTM capture.
 */
export function ClientRuntime() {
  const pathname = usePathname();

  // Capture attribution + decide on refraction once
  useEffect(() => {
    captureAttribution();
    const nav = navigator as Navigator & { userAgentData?: { brands: { brand: string }[] }; deviceMemory?: number };
    const chromium = nav.userAgentData?.brands.some((b) => /Chromium/i.test(b.brand)) ?? false;
    const capable =
      chromium &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-transparency: reduce)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (navigator.hardwareConcurrency ?? 0) >= 4 &&
      (nav.deviceMemory ?? 8) >= 4;
    document.documentElement.classList.toggle("glass-refract", capable);
  }, []);

  // Scroll reveal (re-scanned on every route)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in), [data-reveal-lines]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Smooth scroll: desktop + fine pointer only, never with reduced motion
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { stop: () => void; start: () => void; destroy: () => void } | null = null;
    let cancelled = false;
    const onLock = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis?.stop() : lenis?.start());
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.14,
        wheelMultiplier: 1,
        smoothWheel: true,
        anchors: { offset: -88 },
        autoRaf: true,
        prevent: (node: HTMLElement) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
      });
      window.addEventListener("nd:scroll-lock", onLock);
    });
    return () => {
      cancelled = true;
      window.removeEventListener("nd:scroll-lock", onLock);
      lenis?.destroy();
    };
  }, []);

  // Specular highlight that follows the pointer on [data-shine] glass
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const el = (last.target as Element | null)?.closest<HTMLElement>("[data-shine]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Delegated analytics for links and buttons marked with data-track
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track], a[href^='tel:']");
      if (!el) return;
      const name = (el.dataset.track ?? "phone_click") as AnalyticsEvent;
      track(name, {
        location: el.dataset.trackLocation ?? pathnameRef(),
        channel: el.dataset.trackChannel ?? (name === "phone_click" ? "phone" : undefined),
        label: el.dataset.trackLabel,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Scroll depth (25/50/75/100) per page
  useEffect(() => {
    const marks = new Set<number>();
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      const pct = (window.scrollY / h) * 100;
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m - 1 && !marks.has(m)) {
          marks.add(m);
          track("scroll_depth", { percent: m, page: pathname });
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

function pathnameRef() {
  return typeof window === "undefined" ? "" : window.location.pathname;
}
