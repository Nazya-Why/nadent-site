"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up when scrolled into view. The final value is rendered on the server
 * (SEO, no-JS, reduced motion), the animation only starts from 0 on the client.
 */
export function Counter({ value, locale, suffix = "", prefix = "", duration = 1400 }: { value: number; locale: "uk" | "en"; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const fmt = (n: number) => new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB").format(n).replace(/\s/g, " ");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        setDisplay(0);
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    // Only animate numbers that start below the fold; the final value stays if the observer never fires
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="t-num">
      <span className="sr-only">{`${prefix}${fmt(value)}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        {fmt(display)}
        {suffix}
      </span>
    </span>
  );
}
