import type { Locale } from "@/i18n/config";

/**
 * Ukrainian / English typography for content strings:
 * «ялинки», апостроф ʼ, нерозривні пробіли після коротких слів, перед тире
 * і між числом та одиницею, вузький пробіл у тисячах.
 */

const NBSP = " ";
const NNBSP = " ";

const UK_SHORT = [
  "в", "у", "з", "із", "зі", "і", "й", "а", "та", "на", "до", "за", "по", "від", "під", "над",
  "не", "ні", "що", "як", "це", "ми", "ви", "їх", "ці", "до", "о", "об", "для", "без", "при", "або",
];
const EN_SHORT = ["a", "an", "the", "of", "to", "in", "on", "at", "by", "for", "and", "or", "no", "is", "it", "we", "up"];

const UNITS =
  "грн|₴|UAH|€|EUR|\\$|USD|міс\\.?|місяців|місяці|місяць|тиж\\.?|тижнів|тижні|днів|дні|день|год\\.?|годин|години|хв\\.?|хвилин|хвилини|років|роки|рік|р\\.|%|мм|см|мл|шт\\.?|зубів|зуби|зуб|імплантів|імпланти|пацієнтів|лікарів|months?|weeks?|days?|hours?|min|minutes|years?|teeth|tooth|implants|patients|doctors|visits?|візитів|візити|візит";

const cache = new Map<string, string>();

function groupThousands(text: string): string {
  // 15000 -> 15 000 (only standalone integers of 5+ digits, not phone numbers, years or codes)
  return text.replace(/(^|[\s(«"„>])(\d{5,7})(?=[\s.,)»"<]|$)/g, (_m, pre: string, num: string) => {
    return pre + num.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  });
}

export function typo(input: string, locale: Locale): string {
  if (!input || input.length < 2) return input;
  const key = locale + input;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let s = input;

  if (locale === "uk") {
    // Apostrophe between letters
    s = s.replace(/([А-Яа-яЁёЇїІіЄєҐґ])['’]([А-Яа-яЇїІіЄєҐґ])/g, "$1ʼ$2");
    // Straight double quotes -> «ялинки»
    s = s.replace(/"([^"]*)"/g, "«$1»");
  } else {
    s = s.replace(/"([^"]*)"/g, "“$1”");
    s = s.replace(/(\w)'(\w)/g, "$1’$2");
  }

  // Spaced hyphen -> em dash, glued to the preceding word
  s = s.replace(/ (-|–|—) /g, `${NBSP}— `);
  // Numeric ranges 2-4 -> 2–4
  // (chains like phone numbers 000-22-60 stay untouched)
  s = s.replace(/(?<![\d-])(\d{1,4})-(\d{1,4})(?![\d-])/g, "$1–$2");

  s = groupThousands(s);

  // Number + unit
  s = s.replace(new RegExp(`(\\d) (${UNITS})(?=[\\s.,;:!?)»”]|$)`, "gu"), `$1${NBSP}$2`);
  // "від 18 000", "до 12", "from 3"
  s = s.replace(/(^|\s)(від|до|з|по|from|to|up to|№|No\.) (\d)/gu, `$1$2${NBSP}$3`);

  // Short words glue to the next word
  const shorts = locale === "uk" ? UK_SHORT : EN_SHORT;
  const re = new RegExp(`(^|[\\s(«“„])(${shorts.join("|")}) (?=\\S)`, "giu");
  // Two passes handle chains like "і в"
  s = s.replace(re, `$1$2${NBSP}`).replace(re, `$1$2${NBSP}`);

  cache.set(key, s);
  return s;
}

const SKIP_KEYS = new Set([
  "id", "slug", "href", "url", "src", "image", "imageId", "icon", "key", "email", "tel",
  "phone", "video", "videoId", "anchor", "tag", "tags", "date", "reviewedAt", "publishedAt",
  "doctorId", "doctorIds", "serviceId", "serviceIds", "techIds", "caseIds", "related",
  "category", "problems", "aspect", "variant", "tone", "sourceUrl",
]);

function looksLikeCode(value: string): boolean {
  return /^(\/|https?:|#|mailto:|tel:|[a-z0-9-]+$)/.test(value);
}

/** Recursively typographs every human-readable string in a content object. */
export function deepTypo<T>(value: T, locale: Locale, parentKey?: string): T {
  if (typeof value === "string") {
    if (parentKey && SKIP_KEYS.has(parentKey)) return value;
    if (looksLikeCode(value)) return value;
    return typo(value, locale) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepTypo(v, locale, parentKey)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepTypo(v, locale, k);
    }
    return out as T;
  }
  return value;
}
