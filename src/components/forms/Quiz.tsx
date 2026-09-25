"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Moon, RotateCcw, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/uk";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { concernService, estimateTable, type Concern, type Extent, type QuizContent } from "@/content/quiz";
import { QuickForm } from "./QuickForm";

function money(n: number, locale: Locale) {
  const s = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB").format(n).replace(/\s/g, " ");
  return locale === "uk" ? `${s} грн` : `UAH ${s}`;
}

/** Rounds to a "human" number: 13 500 → 14 000 */
const soft = (n: number) => (n < 10000 ? Math.round(n / 100) * 100 : Math.round(n / 1000) * 1000);

export function estimate(a: Record<string, string>) {
  const concern = (a.concern ?? "checkup") as Concern;
  const extent = (a.extent ?? "one") as Extent;
  let [lo, hi] = estimateTable[concern][extent];
  if (a.priority === "price") hi = lo + (hi - lo) * 0.6;
  if (a.priority === "aesthetics" || a.priority === "durability") lo = lo + (hi - lo) * 0.3;
  if (a.lastVisit === "long" && concern !== "checkup") {
    lo += 2200;
    hi *= 1.1;
  }
  if (a.fear === "strong") {
    lo += 6500;
    hi += 13000;
  }
  return { lo: soft(lo), hi: soft(hi), service: concernService[concern][extent] };
}

export function Quiz({
  locale,
  content,
  forms,
  privacyHref,
  thanksHref,
  onDone,
}: {
  locale: Locale;
  content: QuizContent;
  forms: Dictionary["forms"];
  privacyHref: string;
  thanksHref: string;
  onDone?: () => void;
}) {
  const qs = content.questions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const headRef = useRef<HTMLHeadingElement>(null);
  const done = step >= qs.length;

  useEffect(() => {
    headRef.current?.focus({ preventScroll: true });
    if (step === 0) track("quiz_start");
    else if (!done) track("quiz_step", { step: step + 1 });
    else track("quiz_complete", { ...answers });
  }, [step, done, answers]);

  if (done) {
    const e = estimate(answers);
    const svc = content.services[e.service];
    const r = content.result;
    const estimateText = `${money(e.lo, locale)} – ${money(e.hi, locale)}`;
    return (
      <div className="grid gap-8 px-5 pt-3 pb-8 md:grid-cols-2 md:px-8 md:pt-8">
        <div className="flex flex-col gap-5">
          <h2 ref={headRef} tabIndex={-1} className="t-h3 pr-12 outline-none">
            {r.title}
          </h2>
          <div className="rounded-[26px] bg-accent p-6 text-accent-fg">
            <p className="text-[0.875rem] font-medium opacity-85">{r.rangeLabel}</p>
            <p className="t-num mt-1 text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)] leading-tight font-bold tracking-[-0.03em]">{estimateText}</p>
            <p className="mt-3 text-[0.9375rem] opacity-90">
              {r.monthlyLabel} <span className="t-num font-semibold">{money(Math.ceil(e.lo / 12 / 10) * 10, locale)}</span>
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-[22px] bg-fg/[0.04] p-4">
            <Sparkles aria-hidden size={20} className="mt-0.5 shrink-0 text-accent" />
            <p>
              {r.recommend}{" "}
              <Link href={svc.href} className="font-semibold text-accent underline-offset-2 hover:underline" onClick={onDone}>
                {svc.name}
              </Link>
              .
            </p>
          </div>
          {answers.fear === "strong" && (
            <p className="flex items-start gap-3 rounded-[22px] bg-fg/[0.04] p-4">
              <Moon aria-hidden size={20} className="mt-0.5 shrink-0 text-accent" /> {r.sedationNote}
            </p>
          )}
          {answers.lastVisit === "long" && <p className="text-[0.9375rem] text-fg-muted">{r.longAgoNote}</p>}
          <p className="text-[0.8125rem] text-fg-muted">{r.disclaimer}</p>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setStep(0);
            }}
            className="inline-flex h-11 items-center gap-2 self-start rounded-full px-1 font-medium text-fg-muted hover:text-fg"
          >
            <RotateCcw aria-hidden size={16} /> {r.restart}
          </button>
        </div>
        <div className="rounded-[28px] bg-bg-elevated p-5 ring-1 ring-line md:p-6">
          <p className="t-title">{r.formTitle}</p>
          <p className="mt-1 mb-5 text-[0.9375rem] text-fg-muted">{r.formLead}</p>
          <QuickForm
            locale={locale}
            t={forms}
            privacyHref={privacyHref}
            thanksHref={thanksHref}
            source="quiz"
            kind="quiz"
            service={svc.name}
            extra={{ quiz: answers, estimate: estimateText }}
            submitLabel={r.submit}
            showTriggers={false}
            onSuccess={onDone}
          />
        </div>
      </div>
    );
  }

  const q = qs[step];
  return (
    <div className="px-5 pt-3 pb-8 md:px-8 md:pt-8">
      <div className="mb-5 flex items-center gap-3 pr-12">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} aria-label={content.back} className="grid size-11 place-items-center rounded-full bg-fg/[0.06] hover:bg-fg/[0.1]">
            <ArrowLeft aria-hidden size={18} />
          </button>
        )}
        <p className="text-[0.875rem] font-medium text-fg-muted" aria-live="polite">
          {content.step.replace("{n}", String(step + 1)).replace("{total}", String(qs.length))}
        </p>
      </div>
      <div className="mb-6 flex gap-1.5" aria-hidden>
        {qs.map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-accent" : "bg-fg/[0.08]")} />
        ))}
      </div>
      <fieldset key={q.id} className="animate-[nd-fade-up_360ms_var(--ease-out)]">
        <legend className="w-full">
          <h2 ref={headRef} tabIndex={-1} className="t-h3 outline-none">
            {q.title}
          </h2>
        </legend>
        <div className="mt-6 grid gap-2.5">
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, [q.id]: o.value }));
                setStep((s) => s + 1);
              }}
              aria-pressed={answers[q.id] === o.value}
              className={cn(
                "pressable flex min-h-14 items-center justify-between gap-4 rounded-[18px] border px-5 py-3.5 text-left font-semibold transition-colors",
                answers[q.id] === o.value ? "border-accent bg-accent-soft/60" : "border-line bg-bg-elevated hover:border-line-strong",
              )}
            >
              <span>{o.label}</span>
              {o.hint && <span className="text-[0.8125rem] font-normal text-fg-muted">{o.hint}</span>}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
