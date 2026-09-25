"use client";

import Link from "next/link";
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/format";
import { formatPhoneInput, phoneDigits } from "@/lib/leads";

const fieldBase =
  "peer w-full rounded-[14px] border bg-bg-elevated px-4 text-[1.0625rem] text-fg shadow-[inset_0_1px_2px_rgb(0_0_0/0.03)] transition-[border-color,box-shadow] duration-200 placeholder:text-fg-subtle focus:outline-none focus-visible:outline-none disabled:opacity-50";
const fieldOk = "border-line-strong hover:border-fg/30 focus:border-accent focus:shadow-[0_0_0_4px_rgb(var(--accent-rgb)/0.16)]";
const fieldErr = "border-error focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--error)_18%,transparent)]";

export function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-medium">
        {label}
        {optional && <span className="font-normal text-fg-muted"> · {optional}</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[0.875rem] text-error">
          <AlertCircle aria-hidden size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.875rem] text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode; optional?: string; shellClassName?: string };

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, error, hint, optional, id, className, shellClassName, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} error={error} hint={hint} optional={optional} className={shellClassName}>
      <input
        ref={ref}
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        className={cn(fieldBase, "h-13", error ? fieldErr : fieldOk, className)}
        {...rest}
      />
    </FieldShell>
  );
});

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: ReactNode; optional?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, AreaProps>(function TextArea({ label, error, hint, optional, id, className, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} error={error} hint={hint} optional={optional}>
      <textarea
        ref={ref}
        id={fid}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        className={cn(fieldBase, "min-h-24 resize-y py-3 leading-snug", error ? fieldErr : fieldOk, className)}
        {...rest}
      />
    </FieldShell>
  );
});

/** +380 mask: the prefix is fixed, the user types only the 9 national digits. */
export function PhoneField({
  label,
  error,
  value,
  onChange,
  onBlur,
  name,
  id,
  autoFocus,
}: {
  label: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  name: string;
  id?: string;
  autoFocus?: boolean;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} error={error}>
      <input
        id={fid}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        autoFocus={autoFocus}
        placeholder="+380 67 123 45 67"
        value={value}
        onFocus={(e) => {
          if (!e.currentTarget.value) onChange("+380 ");
        }}
        onChange={(e) => {
          const d = phoneDigits(e.target.value);
          onChange(d ? formatPhoneInput(d) : "+380 ");
        }}
        onBlur={(e) => {
          if (e.currentTarget.value.replace(/\D/g, "").length <= 3) onChange("");
          onBlur?.();
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={cn(fieldBase, "t-num h-13 tracking-wide", error ? fieldErr : fieldOk)}
      />
    </FieldShell>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
  id,
  name,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  error?: string;
  id?: string;
  name: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fid} className="group flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug text-fg-muted">
        <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
          <input
            id={fid}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fid}-error` : undefined}
            className="peer absolute inset-0 m-0 cursor-pointer appearance-none rounded-[7px] border-[1.5px] border-line-strong bg-bg-elevated transition-colors checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-error"
          />
          <Check aria-hidden size={15} strokeWidth={3} className="pointer-events-none relative text-accent-fg opacity-0 transition-opacity peer-checked:opacity-100" />
        </span>
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${fid}-error`} role="alert" className="flex items-start gap-1.5 pl-9 text-[0.875rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function ConsentText({ before, link, after, href }: { before: string; link: string; after: string; href: string }) {
  return (
    <>
      {before}
      <Link href={href} target="_blank" className="text-fg underline underline-offset-2 hover:text-accent">
        {link}
      </Link>
      {after}
    </>
  );
}

/** iOS-style segmented control built on native radios (arrow keys work out of the box). */
export function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  name: string;
  legend: string;
  options: { value: T; label: ReactNode; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-1.5 text-[0.9375rem] font-medium">{legend}</legend>
      <div className="flex gap-1 overflow-x-auto rounded-[16px] bg-fg/[0.06] p-1 no-scrollbar">
        {options.map((o) => (
          <label key={o.value} className={cn("relative min-w-0 flex-1", o.disabled && "opacity-40")}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1.5 rounded-[12px] text-center font-medium whitespace-nowrap text-fg-muted transition-all duration-200 peer-checked:bg-bg-elevated peer-checked:text-fg peer-checked:shadow-[0_1px_3px_rgb(0_0_0/0.1),0_1px_1px_rgb(0_0_0/0.04)] peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-disabled:cursor-not-allowed",
                size === "md" ? "min-h-11 px-3 text-[0.9375rem]" : "min-h-11 px-1.5 text-[0.8125rem] tracking-[-0.01em]",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Large selectable card (radio). */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  hint,
  media,
  className,
  onActivate,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  /** Pointer tap only: lets a step auto-advance without hijacking arrow-key navigation */
  onActivate?: (v: string) => void;
  title: ReactNode;
  hint?: ReactNode;
  media?: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("relative block cursor-pointer", className)} onPointerUp={() => onActivate?.(value)}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="peer sr-only" />
      <span
        className={cn(
          "pressable flex h-full items-center gap-3 rounded-[18px] border bg-bg-elevated p-3.5 transition-[border-color,box-shadow,background-color] duration-200",
          "border-line hover:border-line-strong peer-checked:border-accent peer-checked:bg-accent-soft/60 peer-checked:shadow-[0_0_0_1px_var(--accent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
        )}
      >
        {media}
        <span className="flex min-w-0 flex-col">
          <span className="leading-tight font-semibold">{title}</span>
          {hint && <span className="mt-0.5 text-[0.8125rem] leading-snug text-fg-muted">{hint}</span>}
        </span>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-2.5 right-2.5 grid size-5 scale-50 place-items-center rounded-full bg-accent text-accent-fg opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100"
      >
        <Check size={12} strokeWidth={3} />
      </span>
    </label>
  );
}
