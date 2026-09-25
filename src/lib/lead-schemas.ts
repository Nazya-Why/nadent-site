import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { channels, dayParts, phoneDigits } from "./leads";

/* Zod schemas live apart from leads.ts so light forms don't ship zod. */

const messages = {
  uk: {
    nameMin: "Вкажіть, будь ласка, ваше ім'я",
    nameMax: "Ім'я занадто довге",
    phone: "Номер має містити 9 цифр після +380",
    phoneCode: "Перевірте код оператора: номер не може починатися з 0",
    consent: "Потрібна ваша згода, щоб ми могли зв'язатися з вами",
    comment: "Коментар занадто довгий (до 1000 символів)",
  },
  en: {
    nameMin: "Please enter your name",
    nameMax: "The name is too long",
    phone: "The number must have 9 digits after +380",
    phoneCode: "Please check the operator code: the number can't start with 0",
    consent: "We need your consent to contact you",
    comment: "The comment is too long (up to 1000 characters)",
  },
} as const;

export function makeSchemas(locale: Locale) {
  const m = messages[locale];
  const name = z.string().trim().min(2, m.nameMin).max(60, m.nameMax);
  const phone = z
    .string()
    .transform(phoneDigits)
    .refine((d) => d.length === 9, m.phone)
    .refine((d) => !d.startsWith("0"), m.phoneCode);
  const consent = z.literal(true, { error: m.consent });

  const contact = z.object({
    name,
    phone,
    channel: z.enum(channels),
    comment: z.string().max(1000, m.comment).optional().default(""),
    consent,
    website: z.string().max(0).optional().default(""), // honeypot
  });

  const booking = contact.extend({
    service: z.string().min(1),
    doctor: z.string().optional().default("any"),
    date: z.string().optional().default(""),
    dayPart: z.enum(dayParts).default("asap"),
  });

  const quick = z.object({
    name,
    phone,
    channel: z.enum(channels).default("call"),
    consent,
    website: z.string().max(0).optional().default(""),
  });

  const callback = quick.extend({ time: z.string().default("asap") });

  return { contact, booking, quick, callback };
}

export type BookingInput = z.input<ReturnType<typeof makeSchemas>["booking"]>;
export type BookingData = z.output<ReturnType<typeof makeSchemas>["booking"]>;
export type QuickData = z.output<ReturnType<typeof makeSchemas>["quick"]>;

