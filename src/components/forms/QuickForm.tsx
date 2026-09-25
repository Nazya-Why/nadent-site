"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Clock, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/uk";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import { phoneDigits, rememberLead, submitLead, toE164, type Channel, type LeadKind } from "@/lib/leads";
import { Checkbox, ConsentText, PhoneField, Segmented, TextField } from "./fields";
import { Turnstile } from "./Turnstile";

/**
 * Short lead form (name + phone + channel). Deliberately free of zod/RHF: it ships on
 * many pages, so validation is a few lines of plain code with the same messages.
 */
export function QuickForm({
  locale,
  t,
  privacyHref,
  thanksHref,
  source,
  kind = "quick",
  service,
  doctor,
  extra,
  submitLabel,
  showChannel = true,
  showTriggers = true,
  className,
  onSuccess,
}: {
  locale: Locale;
  t: Dictionary["forms"];
  privacyHref: string;
  thanksHref: string;
  source: string;
  kind?: LeadKind;
  service?: string;
  doctor?: string;
  extra?: { quiz?: Record<string, string | string[]>; estimate?: string; time?: string };
  submitLabel?: string;
  showChannel?: boolean;
  showTriggers?: boolean;
  className?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("call");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  const m =
    locale === "uk"
      ? { name: "Вкажіть, будь ласка, ваше ім'я", phone: "Номер має містити 9 цифр після +380", consent: "Потрібна ваша згода, щоб ми могли зв'язатися з вами" }
      : { name: "Please enter your name", phone: "The number must have 9 digits after +380", consent: "We need your consent to contact you" };

  const validate = () => {
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = m.name;
    if (phoneDigits(phone).length !== 9) e.phone = m.phone;
    if (!consent) e.consent = m.consent;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      setMessage(t.fixErrors);
      return;
    }
    setStatus("sending");
    setMessage("");
    track(kind === "callback" ? "callback_submit" : "quick_form_submit", { source, service });
    const res = await submitLead({
      kind,
      locale,
      name: name.trim(),
      phone: toE164(phoneDigits(phone)),
      channel,
      service,
      doctor,
      website,
      turnstileToken: token || undefined,
      ...extra,
    });
    if (res.ok) {
      track("lead_success", { form: kind, source, service, demo: res.demo ?? false });
      rememberLead(name.trim(), kind);
      onSuccess?.();
      router.push(`${thanksHref}?kind=${kind}${res.demo ? "&demo=1" : ""}`);
    } else {
      setStatus("error");
      track("lead_error", { form: kind, reason: res.error });
      setMessage(res.error === "rate_limit" ? t.errorRate : res.error === "spam" ? t.errorSpam : t.errorGeneric);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-4", className)} aria-label={submitLabel ?? t.submit}>
      <TextField
        label={t.name}
        name="name"
        autoComplete="given-name"
        placeholder={t.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name && name.trim().length < 2 && setErrors((x) => ({ ...x, name: m.name }))}
        error={errors.name}
      />
      <PhoneField
        label={t.phone}
        name="phone"
        value={phone}
        onChange={(v) => {
          setPhone(v);
          if (errors.phone && phoneDigits(v).length === 9) setErrors((x) => ({ ...x, phone: undefined }));
        }}
        onBlur={() => phone && phoneDigits(phone).length !== 9 && setErrors((x) => ({ ...x, phone: m.phone }))}
        error={errors.phone}
      />
      {showChannel && (
        <Segmented
          name={`channel-${source}`}
          legend={t.channel}
          size="sm"
          value={channel}
          onChange={setChannel}
          options={(["call", "telegram", "viber", "whatsapp"] as const).map((c) => ({ value: c, label: t.channels[c] }))}
        />
      )}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <Checkbox
        name={`consent-${source}`}
        checked={consent}
        onChange={(v) => {
          setConsent(v);
          if (v) setErrors((x) => ({ ...x, consent: undefined }));
        }}
        error={errors.consent}
      >
        <ConsentText before={t.consentBefore} link={t.consentLink} after={t.consentAfter} href={privacyHref} />
      </Checkbox>
      <Turnstile onToken={setToken} locale={locale} />
      {message && (
        <p role="alert" className={cn("rounded-2xl p-3 text-[0.9375rem]", status === "error" ? "bg-error-soft text-error" : "text-error")}>
          {message}
        </p>
      )}
      <Button type="submit" size="lg" loading={status === "sending"} className="w-full">
        {status === "sending" ? t.sending : (submitLabel ?? t.submit)}
      </Button>
      {showTriggers && (
        <ul className="flex flex-col gap-1.5 text-[0.8125rem] text-fg-muted">
          <li className="flex items-center gap-2">
            <Clock aria-hidden size={15} className="text-accent" /> {t.triggers.reply}
          </li>
          <li className="flex items-center gap-2">
            <Wallet aria-hidden size={15} className="text-accent" /> {t.triggers.consultation}
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck aria-hidden size={15} className="text-accent" /> {t.triggers.privacy}
          </li>
        </ul>
      )}
    </form>
  );
}
