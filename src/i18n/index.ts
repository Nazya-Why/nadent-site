import { deepTypo } from "@/lib/typograph";
import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { uk, type Dictionary } from "./dictionaries/uk";

const raw: Record<Locale, Dictionary> = { uk, en };
const cache = new Map<Locale, Dictionary>();

export function getDictionary(locale: Locale): Dictionary {
  let dict = cache.get(locale);
  if (!dict) {
    dict = deepTypo(raw[locale], locale);
    cache.set(locale, dict);
  }
  return dict;
}

/** "Відчинено до {time}" + { time: "21:00" } */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

export type { Dictionary };
export { type Locale } from "./config";
