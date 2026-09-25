import { intlLocale, type Locale } from "@/i18n/config";

const NNBSP = " ";
const NBSP = " ";

/** 18000 -> "18 000 грн" (uk) / "UAH 18,000" (en). */
export function formatPrice(value: number, locale: Locale, opts: { from?: boolean; to?: number } = {}): string {
  const num = (n: number) =>
    locale === "uk"
      ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP)
      : new Intl.NumberFormat("en-GB").format(n);
  const amount = opts.to ? `${num(value)}–${num(opts.to)}` : num(value);
  if (locale === "uk") return `${opts.from ? `від${NBSP}` : ""}${amount}${NBSP}грн`;
  return `${opts.from ? `from${NBSP}` : ""}UAH${NBSP}${amount}`;
}

/** Approximate EUR for visitors from abroad. Rate is a build-time constant, clearly labelled as approximate. */
export const EUR_RATE = 48; // DEMO: update or fetch at build
export function formatEur(valueUah: number): string {
  const eur = Math.round(valueUah / EUR_RATE / 10) * 10;
  return `≈${NBSP}€${new Intl.NumberFormat("en-GB").format(eur)}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value).replace(/\s/g, NNBSP);
}

export function monthlyPayment(total: number, months: number): number {
  return Math.ceil(total / months / 10) * 10;
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export function pluralUk(n: number, forms: [one: string, few: string, many: string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
