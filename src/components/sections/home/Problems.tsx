import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Locale } from "@/i18n/config";
import { detailRoute } from "@/i18n/routes";
import { getProblems } from "@/content/taxonomy";
import { getServices } from "@/content/services";
import type { getHomeCopy } from "@/content/home";
import { formatPrice } from "@/lib/format";

/** "What brings you in?" — six glass cards over a soft colour field so the glass reads. */
export function Problems({ locale, copy }: { locale: Locale; copy: ReturnType<typeof getHomeCopy>["problems"] }) {
  const services = getServices(locale);
  const problems = getProblems(locale).filter((p) => p.id !== "prevention");
  return (
    <section className="section relative overflow-hidden" aria-labelledby="problems-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-[8%] size-[420px] rounded-full bg-[rgb(var(--accent-rgb)/0.18)] blur-[90px]" />
        <div className="absolute right-[6%] bottom-0 size-[380px] rounded-full bg-[#e9c89b]/40 blur-[90px] dark:bg-[#e9c89b]/10" />
      </div>
      <div className="container-page">
        <SectionHeader id="problems-title" overline={copy.overline} title={copy.title} lead={copy.lead} />
        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-3">
          {problems.map((p, i) => {
            const s = services.find((x) => x.id === p.target)!;
            return (
              <li key={p.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={detailRoute(locale, "service", s.slug)}
                  className="glass group lift flex h-full min-h-[168px] flex-col justify-between gap-6 rounded-[26px] p-4 md:min-h-[200px] md:rounded-[30px] md:p-7"
                  data-shine=""
                >
                  <span className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-fg shadow-[0_8px_20px_-8px_rgb(var(--accent-rgb)/0.6)] md:size-14">
                      <Icon name={p.icon} size={26} />
                    </span>
                    <ArrowUpRight aria-hidden size={22} className="text-fg-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[1.125rem] leading-tight font-semibold tracking-[-0.015em] md:text-[1.5rem]">{p.label}</span>
                    <span className="text-[0.875rem] text-fg-muted md:text-[0.9375rem]">{p.hint}</span>
                    <span className="t-num mt-1 text-[0.875rem] font-semibold text-accent md:text-[0.9375rem]">{formatPrice(s.priceFrom, locale, { from: true })}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
