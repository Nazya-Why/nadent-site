import { Counter } from "@/components/ui/Counter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Locale } from "@/i18n/config";
import type { getHomeCopy } from "@/content/home";

export function WhyUs({ locale, copy }: { locale: Locale; copy: ReturnType<typeof getHomeCopy>["why"] }) {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container-page">
        <SectionHeader id="why-title" overline={copy.overline} title={copy.title} />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[32px] bg-line ring-1 ring-line md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((it, i) => (
            <li key={i} className="flex flex-col gap-3 bg-bg-elevated p-7 md:p-9" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <p className="flex items-baseline gap-2">
                <span className="text-gradient text-[clamp(3rem,2.2rem+3vw,4.5rem)] leading-none font-bold tracking-[-0.045em]">
                  <Counter value={it.value} suffix={it.suffix} locale={locale} />
                </span>
                <span className="text-[1.25rem] font-semibold tracking-[-0.02em]">{it.unit}</span>
              </p>
              <p className="max-w-xs text-fg-muted">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
