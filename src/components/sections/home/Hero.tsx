import Link from "next/link";
import { ArrowRight, Box, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { activeHero, ctaCopy, heroVariants } from "@/config/experiments";
import type { Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { typo } from "@/lib/typograph";
import type { getHomeCopy } from "@/content/home";

/**
 * Apple-style hero: statement headline on a calm background (fast text LCP),
 * then a large rounded photo with floating glass cards and gentle parallax.
 */
export function Hero({ locale, copy }: { locale: Locale; copy: ReturnType<typeof getHomeCopy>["hero"] }) {
  const h = heroVariants[activeHero][locale];
  const chipIcons = [Star, null, ShieldCheck, null];
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] md:pt-[calc(var(--header-h)+72px)]" data-tone="light" aria-labelledby="hero-title">
      {/* Soft ambient light */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] bg-[radial-gradient(60%_50%_at_20%_0%,rgb(var(--accent-rgb)/0.10),transparent_70%),radial-gradient(50%_40%_at_90%_10%,color-mix(in_srgb,var(--bg-sand)_90%,transparent),transparent_70%)]" />

      <div className="container-page">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="t-overline text-accent animate-[nd-fade-up_700ms_var(--ease-out)_both]">{copy.overline}</p>
          <h1 id="hero-title" className="t-display mt-5 animate-[nd-rise_900ms_var(--ease-out)_both] text-[clamp(2.625rem,1.35rem+5.2vw,5.75rem)]! leading-[1.03]!">
            {typo(h.title, locale)}{" "}
            <span className="text-gradient md:block">{typo(h.titleAccent, locale)}</span>
          </h1>
          <p className="t-body-lg mt-6 max-w-2xl text-fg-muted animate-[nd-rise_900ms_var(--ease-out)_60ms_both]">{typo(h.lead, locale)}</p>

          <div data-hero-cta className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row animate-[nd-fade-up_900ms_var(--ease-out)_240ms_both]">
            <Button href={route(locale, "book")} data-book="" data-book-source="hero" size="lg" className="w-full sm:w-auto" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {ctaCopy.primary[locale]}
            </Button>
            <Button href="#quiz" data-quiz="" variant="secondary" size="lg" className="w-full sm:w-auto">
              {ctaCopy.secondary[locale]}
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.9375rem] text-fg-muted animate-[nd-fade-up_900ms_var(--ease-out)_320ms_both]">
            {copy.chips.map((c, i) => {
              const I = chipIcons[i];
              return (
                <li key={c} className="flex items-center gap-1.5">
                  {I ? <I aria-hidden size={16} className={i === 0 ? "fill-[#F5A524] text-[#F5A524]" : "text-accent"} /> : <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
                  {c}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="container-wide mt-12 md:mt-16">
        <div className="relative animate-[nd-rise_1100ms_var(--ease-out)_120ms_both]">
          <div className="overflow-hidden rounded-[32px] md:rounded-[44px]">
            <div className="nd-parallax">
              <ImageSlot
                id="hero-desktop"
                mobileId="hero-mobile"
                alt={copy.mediaAlt}
                priority
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="scale-[1.06]"
              />
            </div>
          </div>

          {/* Floating glass cards */}
          <div className="glass glass--prominent absolute bottom-4 left-4 flex items-center gap-3 rounded-[22px] p-2.5 pr-5 md:bottom-8 md:left-8 md:rounded-[26px] md:p-3 md:pr-6" data-shine="">
            <span className="relative block size-11 overflow-hidden rounded-full md:size-14">
              <ImageSlot id="doctor-andrii-solovii" alt="" fill sizes="56px" quietPlaceholder objectPosition="50% 20%" />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-[0.9375rem] font-semibold md:text-[1.0625rem]">{copy.floatingDoctor.name}</span>
              <span className="text-[0.8125rem] text-fg-muted">{copy.floatingDoctor.role}</span>
            </span>
          </div>
          <Link
            href={route(locale, "technology")}
            className="glass glass--prominent absolute top-8 right-8 hidden items-center gap-3 rounded-[26px] p-4 pr-6 transition-transform duration-500 ease-(--ease-out) hover:-translate-y-1 md:flex"
            data-shine=""
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-fg">
              <Box aria-hidden size={24} strokeWidth={1.6} />
            </span>
            <span className="flex flex-col text-left">
              <span className="font-semibold">{copy.floatingPlan.title}</span>
              <span className="text-[0.875rem] text-fg-muted">{copy.floatingPlan.text}</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
