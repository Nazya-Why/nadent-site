import type { Locale } from "@/i18n/config";
import type { SearchItem } from "@/lib/search-index";

/**
 * FAQ and blog entries for the site search. Filled once those collections exist;
 * kept separate to avoid circular imports between content modules.
 */
export function getSearchExtras(locale: Locale): SearchItem[] {
  void locale;
  return [];
}
