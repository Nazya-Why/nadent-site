export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

/** Value that exists in every locale. */
export type Localized<T> = Record<Locale, T>;

export const htmlLang: Record<Locale, string> = { uk: "uk", en: "en" };
export const ogLocale: Record<Locale, string> = { uk: "uk_UA", en: "en_US" };
export const intlLocale: Record<Locale, string> = { uk: "uk-UA", en: "en-GB" };

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
