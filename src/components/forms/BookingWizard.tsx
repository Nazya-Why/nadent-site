"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, HelpCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/uk";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { getOpenStatus, slotFor } from "@/lib/hours";
import { rememberLead, submitLead, toE164, type DayPart } from "@/lib/leads";
import { makeSchemas, type BookingInput } from "@/lib/lead-schemas";
import type { IconName } from "@/content/types";
import type { Weekday } from "@/config/clinic";
import { ChoiceCard, Checkbox, ConsentText, PhoneField, Segmented, TextArea, TextField } from "./fields";
import { Turnstile } from "./Turnstile";
import { SuccessCheck } from "./SuccessCheck";

export interface WizardOption {
  value: string;
  label: string;
  hint?: string;
  icon?: IconName;
  /** Service ids this option maps to (for filtering doctors) */
  services: string[];
  /** Shown on step 1; others appear only when preset */
  primary?: boolean;
}

export interface WizardDoctor {
  id: string;
  name: string;
  role: string;
  services: string[];
  avatar: ReactNode;
}

export interface BookingWizardProps {
  locale: Locale;
  t: Dictionary["forms"];
  daysShort: readonly string[];
  options: WizardOption[];
  doctors: WizardDoctor[];
  preset?: { service?: string; doctor?: string; source?: string };
  privacyHref: string;
  thanksHref: string;
  onDone?: () => void;
  /** Rendered inside a Sheet (compact paddings) or as a page */
  mode?: "sheet" | "page";
}

const DRAFT_KEY = "nd-booking-draft";
const TOTAL = 4;

function kyivDateParts(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 864e5);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")) as Weekday;
  return { iso: `${get("year")}-${get("month")}-${get("day")}`, day: Number(get("day")), weekday, date: d };
}

function dayPartAvailable(weekday: Weekday, part: Exclude<DayPart, "asap">, isToday: boolean): boolean {
  const slot = slotFor(weekday);
  if (!slot) return false;
  const [oh] = slot.open.split(":").map(Number);
  const [ch] = slot.close.split(":").map(Number);
  const ranges = { morning: [8, 12], day: [12, 17], evening: [17, 21] } as const;
  const [from, to] = ranges[part];
  const overlaps = oh < to && ch > from;
  if (!overlaps) return false;
  if (isToday) {
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
    return hour + 1 < Math.min(to, ch);
  }
  return true;
}

export function BookingWizard({ locale, t, daysShort, options, doctors, preset, privacyHref, thanksHref, onDone, mode = "sheet" }: BookingWizardProps) {
  const router = useRouter();
  const schemas = useMemo(() => makeSchemas(locale), [locale]);
  const w = t.wizard;

  const hasPresetService = Boolean(preset?.service);
  const [step, setStep] = useState(hasPresetService ? 1 : 0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState("");
  const [resume, setResume] = useState<BookingInput | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<BookingInput>({
    resolver: zodResolver(schemas.booking),
    mode: "onTouched",
    defaultValues: {
      service: preset?.service ?? "",
      doctor: preset?.doctor ?? "any",
      date: "asap",
      dayPart: "asap",
      name: "",
      phone: "",
      channel: "call",
      comment: "",
      consent: false as unknown as true,
      website: "",
    },
  });
  const { register, control, watch, setValue, trigger, handleSubmit, formState } = form;
  const values = watch();

  // Offer to resume a draft (only when nothing was preset)
  useEffect(() => {
    if (preset?.service || preset?.doctor) return;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as BookingInput & { step?: number };
        if (draft.service || draft.name) setResume(draft);
      }
    } catch {
      /* ignore */
    }
  }, [preset?.service, preset?.doctor]);

  // Persist the draft (no consent / honeypot)
  useEffect(() => {
    if (status === "success") return;
    const id = window.setTimeout(() => {
      try {
        const { consent: _c, website: _w, ...rest } = values;
        void _c;
        void _w;
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...rest, step }));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [values, step, status]);

  useEffect(() => {
    track("booking_step", { step: step + 1, source: preset?.source });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, preset?.source]);

  const selectedOption = options.find((o) => o.value === values.service);
  const serviceFilter = selectedOption?.services ?? (values.service ? [values.service] : []);
  const relevantDoctors = serviceFilter.length ? doctors.filter((d) => d.services.some((s) => serviceFilter.includes(s))) : doctors;
  const doctorList = relevantDoctors.length ? relevantDoctors : doctors;

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ ...kyivDateParts(i), offset: i })), []);
  const selectedDay = days.find((d) => d.iso === values.date);

  const stepFields: (keyof BookingInput)[][] = [["service"], ["doctor"], ["date", "dayPart"], ["name", "phone", "channel", "comment", "consent"]];

  const next = async () => {
    const ok = await trigger(stepFields[step]);
    if (!ok) return;
    if (step === 0 && !values.service) return;
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setErrorMsg("");
    track("booking_submit", { service: data.service, doctor: data.doctor, dayPart: data.dayPart });
    const serviceLabel = options.find((o) => o.value === data.service)?.label ?? data.service;
    const doctorLabel = doctors.find((d) => d.id === data.doctor)?.name ?? w.anyDoctor;
    const res = await submitLead({
      kind: "booking",
      locale,
      name: data.name as string,
      phone: toE164(data.phone as string),
      channel: data.channel,
      service: serviceLabel,
      doctor: doctorLabel,
      date: data.date === "asap" ? w.asap : data.date,
      dayPart: data.dayPart,
      comment: data.comment,
      website: data.website,
      turnstileToken: token || undefined,
    });
    if (res.ok) {
      setStatus("success");
      track("lead_success", { form: "booking", service: data.service, demo: res.demo ?? false });
      rememberLead(data.name as string, "booking");
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        onDone?.();
        router.push(`${thanksHref}?kind=booking${res.demo ? "&demo=1" : ""}`);
      }, 1100);
    } else {
      setStatus("error");
      track("lead_error", { form: "booking", reason: res.error });
      setErrorMsg(res.error === "rate_limit" ? t.errorRate : res.error === "spam" ? t.errorSpam : t.errorGeneric);
    }
  }, () => setErrorMsg(t.fixErrors));

  const pad = mode === "sheet" ? "px-5 md:px-8" : "px-0";

  if (status === "success") {
    return (
      <div className={cn("flex min-h-[420px] flex-col items-center justify-center gap-5 py-16 text-center", pad)} role="status">
        <SuccessCheck />
        <p className="t-h3">{t.success}</p>
      </div>
    );
  }

  if (resume) {
    return (
      <div className={cn("flex flex-col gap-6 py-10", pad)}>
        <p className="t-h3 pr-12">{w.resume}</p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              const { step: savedStep, ...rest } = resume as BookingInput & { step?: number };
              form.reset({ ...form.getValues(), ...rest, consent: false as unknown as true });
              setStep(Math.min(savedStep ?? 0, TOTAL - 1));
              setResume(null);
            }}
          >
            {w.resumeYes}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              try {
                sessionStorage.removeItem(DRAFT_KEY);
              } catch {
                /* ignore */
              }
              setResume(null);
            }}
          >
            {w.resumeNo}
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-full flex-col" aria-describedby="booking-step-hint">
      {/* Progress */}
      <div className={cn("pt-3 pb-5 md:pt-8", pad)}>
        <div className="mb-4 flex items-center gap-3 pr-12 text-[0.875rem] font-medium text-fg-muted">
          <span aria-live="polite">{w.step.replace("{n}", String(step + 1)).replace("{total}", String(TOTAL))}</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-fg/[0.08]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-valuenow={step + 1}
          aria-label={w.title}
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-(--ease-out)" style={{ width: `${progress}%` }} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="t-h3 mt-6 outline-none">
          {w.steps[step]}
        </h2>
        <p id="booking-step-hint" className="mt-2 text-fg-muted">
          {w.stepHints[step]}
        </p>
      </div>

      <div key={step} className={cn("flex-1 animate-[nd-fade-up_360ms_var(--ease-out)] pb-6", pad)}>
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">{w.steps[0]}</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {options.filter((o) => o.primary || o.value === values.service).map((o) => (
                <ChoiceCard
                  key={o.value}
                  name="service"
                  value={o.value}
                  checked={values.service === o.value}
                  onChange={(v) => {
                    setValue("service", v, { shouldValidate: true });
                    setValue("doctor", "any");
                  }}
                  onActivate={() => window.setTimeout(() => setStep(1), 240)}
                  title={o.label}
                  hint={o.hint}
                  media={
                    <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent-soft text-accent-soft-fg">
                      {o.icon ? <Icon name={o.icon} size={22} /> : <HelpCircle aria-hidden size={22} strokeWidth={1.5} />}
                    </span>
                  }
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="sr-only">{w.steps[1]}</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <ChoiceCard
                name="doctor"
                value="any"
                checked={values.doctor === "any"}
                onChange={(v) => setValue("doctor", v)}
                onActivate={() => window.setTimeout(() => setStep(2), 240)}
                title={w.anyDoctor}
                hint={w.anyDoctorHint}
                media={
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-soft-fg">
                    <Users aria-hidden size={24} strokeWidth={1.5} />
                  </span>
                }
              />
              {doctorList.map((d) => (
                <ChoiceCard
                  key={d.id}
                  name="doctor"
                  value={d.id}
                  checked={values.doctor === d.id}
                  onChange={(v) => setValue("doctor", v)}
                  onActivate={() => window.setTimeout(() => setStep(2), 240)}
                  title={d.name}
                  hint={d.role}
                  media={<span className="relative block size-14 shrink-0 overflow-hidden rounded-full">{d.avatar}</span>}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <fieldset>
              <legend className="mb-2 text-[0.9375rem] font-medium">{w.pickDay}</legend>
              <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 no-scrollbar md:mx-0 md:flex-wrap md:px-0" data-lenis-prevent>
                <DayChip
                  checked={values.date === "asap"}
                  onSelect={() => {
                    setValue("date", "asap");
                    setValue("dayPart", "asap");
                  }}
                  top={<Sparkles aria-hidden size={16} />}
                  main={w.asap}
                  bottom={w.asapHint}
                  wide
                />
                {days.map((d) => {
                  const open = Boolean(slotFor(d.weekday));
                  const isToday = d.offset === 0;
                  const todayOpen = !isToday || getOpenStatus().open;
                  return (
                    <DayChip
                      key={d.iso}
                      checked={values.date === d.iso}
                      disabled={!open || (isToday && !todayOpen)}
                      onSelect={() => {
                        setValue("date", d.iso);
                        if (values.dayPart === "asap" || !dayPartAvailable(d.weekday, values.dayPart as Exclude<DayPart, "asap">, isToday)) {
                          const first = (["morning", "day", "evening"] as const).find((p) => dayPartAvailable(d.weekday, p, isToday));
                          setValue("dayPart", first ?? "asap");
                        }
                      }}
                      top={isToday ? w.today : d.offset === 1 ? w.tomorrow : daysShort[d.weekday]}
                      main={String(d.day)}
                      bottom={d.weekday === 0 ? w.duty : new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-GB", { month: "short", timeZone: "Europe/Kyiv" }).format(d.date)}
                    />
                  );
                })}
              </div>
            </fieldset>
            {values.date !== "asap" && selectedDay && (
              <Segmented
                name="dayPart"
                legend={w.pickTime}
                value={(values.dayPart === "asap" ? "morning" : values.dayPart) as Exclude<DayPart, "asap">}
                onChange={(v) => setValue("dayPart", v)}
                options={(["morning", "day", "evening"] as const).map((p) => ({
                  value: p,
                  disabled: !dayPartAvailable(selectedDay.weekday, p, selectedDay.offset === 0),
                  label: (
                    <span className="flex flex-col py-1 leading-tight">
                      <span>{w.dayParts[p]}</span>
                      <span className="text-[0.75rem] font-normal opacity-70">{w.dayPartHours[p]}</span>
                    </span>
                  ),
                }))}
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <TextField label={t.name} autoComplete="given-name" placeholder={t.namePlaceholder} error={formState.errors.name?.message} {...register("name")} />
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <PhoneField label={t.phone} name={field.name} value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
              )}
            />
            <Segmented
              name="channel"
              legend={t.channel}
              value={values.channel ?? "call"}
              onChange={(v) => setValue("channel", v)}
              size="sm"
              options={(["call", "telegram", "viber", "whatsapp"] as const).map((c) => ({ value: c, label: t.channels[c] }))}
            />
            <TextArea label={t.comment} optional={t.commentOptional} placeholder={t.commentPlaceholder} error={formState.errors.comment?.message} {...register("comment")} />
            {/* Honeypot: invisible to people, tempting for bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" {...register("website")} />
              </label>
            </div>
            <Controller
              control={control}
              name="consent"
              render={({ field, fieldState }) => (
                <Checkbox name="consent" checked={Boolean(field.value)} onChange={field.onChange} error={fieldState.error?.message}>
                  <ConsentText before={t.consentBefore} link={t.consentLink} after={t.consentAfter} href={privacyHref} />
                </Checkbox>
              )}
            />
            <Turnstile onToken={setToken} locale={locale} />
            <ul className="flex flex-col gap-2 rounded-2xl bg-fg/[0.04] p-4 text-[0.875rem] text-fg-muted">
              <li className="flex items-center gap-2">
                <Clock aria-hidden size={16} className="text-accent" /> {t.triggers.reply}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck aria-hidden size={16} className="text-accent" /> {t.triggers.privacy}
              </li>
            </ul>
          </div>
        )}
      </div>

      {errorMsg && (
        <p role="alert" className={cn("mb-3 rounded-2xl bg-error-soft p-3 text-[0.9375rem] text-error", mode === "sheet" ? "mx-5 md:mx-8" : "")}>
          {errorMsg}
        </p>
      )}

      <div
        className={cn(
          "sticky bottom-0 z-10 flex items-center gap-3 border-t border-line py-3",
          mode === "sheet" ? "glass glass--prominent px-5 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-none md:px-8 md:pb-4" : "bg-bg/85 backdrop-blur-xl",
        )}
      >
        {step > 0 ? (
          <Button type="button" variant="secondary" size="lg" onClick={back} icon={<ArrowLeft aria-hidden size={18} />} aria-label={w.back} className="px-4">
            <span className="hidden sm:inline">{w.back}</span>
          </Button>
        ) : null}
        {step < TOTAL - 1 ? (
          <Button key="next" type="button" size="lg" className="flex-1" onClick={next} disabled={step === 0 && !values.service}>
            {w.next}
          </Button>
        ) : (
          <Button key="submit" type="submit" size="lg" className="flex-1" loading={status === "sending"}>
            {status === "sending" ? t.sending : t.submitBooking}
          </Button>
        )}
      </div>
    </form>
  );
}

function DayChip({
  checked,
  disabled,
  onSelect,
  top,
  main,
  bottom,
  wide,
}: {
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  top: ReactNode;
  main: ReactNode;
  bottom: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={cn("shrink-0 snap-start", disabled && "pointer-events-none opacity-35")}>
      <input type="radio" name="date" className="peer sr-only" checked={checked} disabled={disabled} onChange={onSelect} />
      <span
        className={cn(
          "pressable flex h-[88px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[18px] border border-line bg-bg-elevated px-3 text-center transition-all",
          "peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          wide ? "min-w-[140px]" : "min-w-[68px]",
        )}
      >
        <span className="text-[0.75rem] font-medium opacity-75">{top}</span>
        <span className={cn("leading-none font-semibold", wide ? "text-[0.9375rem]" : "t-num text-[1.375rem]")}>{main}</span>
        <span className="text-[0.75rem] opacity-75">{bottom}</span>
      </span>
    </label>
  );
}
