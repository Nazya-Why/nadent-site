"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";

export interface CalculatorLabels {
  title: string;
  lead: string;
  amount: string;
  months: string;
  monthly: string;
  partners: string;
  monthsShort: string;
  uah: string;
  cta: string;
}

const MONTHS = [3, 6, 10, 12] as const;

function fmt(n: number, locale: "uk" | "en") {
  const s = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB").format(n).replace(/\s/g, " ");
  return locale === "uk" ? `${s} грн` : `UAH ${s}`;
}

/** Instalment calculator: amount slider + months segmented control → monthly payment. */
export function InstallmentCalculator({
  labels,
  locale,
  initial = 34000,
  min = 3000,
  max = 400000,
  bookHref,
  service,
  className,
}: {
  labels: CalculatorLabels;
  locale: "uk" | "en";
  initial?: number;
  min?: number;
  max?: number;
  bookHref: string;
  service?: string;
  className?: string;
}) {
  const [amount, setAmount] = useState(initial);
  const [months, setMonths] = useState<(typeof MONTHS)[number]>(10);
  const monthly = Math.ceil(amount / months / 10) * 10;
  const pct = ((amount - min) / (max - min)) * 100;
  const tracked = useRef(false);

  useEffect(() => {
    if (amount === initial && months === 10) return;
    if (tracked.current) return;
    tracked.current = true;
    track("calculator_use", { amount, months, service });
  }, [amount, months, initial, service]);

  return (
    <div className={cn("flex flex-col gap-6 rounded-[32px] bg-bg-elevated p-6 ring-1 ring-line md:p-8", className)}>
      <div>
        <p className="t-title">{labels.title}</p>
        <p className="mt-1 text-[0.9375rem] text-fg-muted">{labels.lead}</p>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="calc-amount" className="text-[0.9375rem] font-medium">
            {labels.amount}
          </label>
          <output htmlFor="calc-amount" className="t-num text-[1.125rem] font-semibold">
            {fmt(amount, locale)}
          </output>
        </div>
        <input
          id="calc-amount"
          type="range"
          min={min}
          max={max}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          aria-valuetext={fmt(amount, locale)}
          className="nd-slider mt-4 w-full"
          style={{ "--p": `${pct}%` } as React.CSSProperties}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-[0.9375rem] font-medium">{labels.months}</legend>
        <div className="grid grid-cols-4 gap-1 rounded-[16px] bg-fg/[0.06] p-1">
          {MONTHS.map((m) => (
            <label key={m} className="relative">
              <input type="radio" name="calc-months" value={m} checked={months === m} onChange={() => setMonths(m)} className="peer sr-only" />
              <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-[12px] text-[0.9375rem] font-medium text-fg-muted transition-all peer-checked:bg-bg-elevated peer-checked:text-fg peer-checked:shadow-[0_1px_3px_rgb(0_0_0/0.1)] peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {m} {labels.monthsShort}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 rounded-[22px] bg-accent-soft p-5 text-accent-soft-fg sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.875rem] font-medium">{labels.monthly}</p>
          <p className="t-num mt-1 text-[2rem] leading-none font-bold tracking-[-0.03em]" aria-live="polite">
            {fmt(monthly, locale)}
          </p>
        </div>
        <p className="text-[0.8125rem] sm:text-right">
          0 % · {months} {labels.monthsShort}
          <br />
          {labels.partners}
        </p>
      </div>

      <a href={bookHref} data-book="" data-book-source="calculator" data-book-service={service} className="pressable inline-flex h-13 items-center justify-center rounded-full bg-accent px-7 font-semibold text-accent-fg hover:bg-accent-hover">
        {labels.cta}
      </a>
    </div>
  );
}
