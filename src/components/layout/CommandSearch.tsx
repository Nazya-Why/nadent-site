"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, FileText, HelpCircle, Search, Stethoscope, UserRound } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { asset } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";
import type { SearchGroup, SearchItem } from "@/lib/search-index";

export interface SearchLabels {
  placeholder: string;
  empty: string;
  emptyHint: string;
  popular: string;
  groups: Record<SearchGroup, string>;
  title: string;
  close: string;
}

const icons: Record<SearchGroup, typeof Search> = {
  service: Stethoscope,
  doctor: UserRound,
  faq: HelpCircle,
  article: FileText,
  page: ArrowRight,
};

/** Case-, apostrophe- and ґ/г-insensitive normalisation for Ukrainian queries. */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʼ'’`]/g, "")
    .replace(/ґ/g, "г")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

function score(item: SearchItem, tokens: string[]): number {
  const t = norm(item.t);
  const rest = norm(`${item.d ?? ""} ${item.k ?? ""}`);
  let s = 0;
  for (const tok of tokens) {
    if (t.startsWith(tok)) s += 6;
    else if (t.includes(` ${tok}`)) s += 4;
    else if (t.includes(tok)) s += 3;
    else if (rest.includes(tok)) s += 1;
    else return 0;
  }
  return s + (item.g === "service" ? 1 : 0);
}

export function CommandSearch({ locale, labels, popular }: { locale: Locale; labels: SearchLabels; popular: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        track("search_open", { location: "shortcut" });
      }
    };
    window.addEventListener("nd:search", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("nd:search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    if (!index) {
      fetch(asset(`/search/${locale}.json`))
        .then((r) => r.json() as Promise<SearchItem[]>)
        .then(setIndex)
        .catch(() => setIndex([]));
    }
    return () => window.clearTimeout(t);
  }, [open, index, locale]);

  const results = useMemo(() => {
    if (!index || !query.trim()) return [];
    const tokens = norm(query).split(/\s+/).filter(Boolean);
    return index
      .map((item) => ({ item, s: score(item, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.item);
  }, [index, query]);

  useEffect(() => {
    if (!query.trim()) return;
    const t = window.setTimeout(() => track("search_query", { q: query.trim().slice(0, 60), results: results.length }), 800);
    return () => window.clearTimeout(t);
  }, [query, results.length]);

  const go = (item: SearchItem) => {
    setOpen(false);
    router.push(item.h);
  };

  const grouped = useMemo(() => {
    const order: SearchGroup[] = ["service", "doctor", "page", "faq", "article"];
    return order.map((g) => ({ g, items: results.filter((r) => r.g === g) })).filter((x) => x.items.length);
  }, [results]);
  const flat = grouped.flatMap((x) => x.items);

  return (
    <Sheet
      open={open}
      onClose={() => {
        setOpen(false);
        setQuery("");
        setActive(0);
      }}
      label={labels.title}
      closeLabel={labels.close}
      size="md"
    >
      <div className="px-4 pt-2 pb-4 md:px-5 md:pt-5">
        <div className="relative mr-12">
          <Search aria-hidden size={20} strokeWidth={1.75} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-muted" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? `${listId}-${active}` : undefined}
            aria-label={labels.title}
            placeholder={labels.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(flat.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && flat[active]) {
                e.preventDefault();
                go(flat[active]);
              }
            }}
            className="h-13 w-full rounded-2xl bg-fg/[0.06] pr-4 pl-12 text-[1.0625rem] outline-none placeholder:text-fg-muted focus:bg-fg/[0.08] focus-visible:shadow-[0_0_0_3px_rgb(var(--accent-rgb)/0.35)] [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      </div>

      <div className="max-h-[60dvh] overflow-y-auto px-2 pb-4 md:px-3" data-lenis-prevent>
        {!query.trim() && (
          <div className="px-3 pb-2">
            <p className="t-overline mb-3 text-fg-muted">{labels.popular}</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((p) => (
                <button key={p} type="button" onClick={() => setQuery(p)} className="h-10 rounded-full bg-fg/[0.06] px-4 text-[0.9375rem] font-medium hover:bg-fg/[0.1]">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && index && flat.length === 0 && (
          <div className="px-3 py-10 text-center" role="status">
            <p className="font-semibold">{labels.empty.replace("{q}", query.trim())}</p>
            <p className="mt-1 text-fg-muted">{labels.emptyHint}</p>
          </div>
        )}

        <ul id={listId} role="listbox" aria-label={labels.title} className={cn(!flat.length && "hidden")}>
          {grouped.map(({ g, items }) => (
            <li key={g} role="presentation">
              <p className="t-overline px-3 pt-3 pb-1.5 text-fg-muted" aria-hidden>
                {labels.groups[g]}
              </p>
              <ul role="presentation">
                {items.map((item) => {
                  const i = flat.indexOf(item);
                  const Icon = icons[item.g];
                  return (
                    <li
                      key={item.h + item.t}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item)}
                      className={cn("flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5", i === active && "bg-fg/[0.06]")}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
                        <Icon aria-hidden size={18} strokeWidth={1.6} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{item.t}</span>
                        {item.d && <span className="truncate text-[0.8125rem] text-fg-muted">{item.d}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
