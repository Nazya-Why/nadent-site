import { BadgeCheck, Users } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { clinic } from "@/config/clinic";
import type { Locale } from "@/i18n/config";
import { brandWordmarks, type getHomeCopy } from "@/content/home";
import { formatNumber } from "@/lib/format";

export function TrustStrip({ locale, copy }: { locale: Locale; copy: ReturnType<typeof getHomeCopy>["trust"] }) {
  const ratingText = locale === "uk" ? `${String(clinic.rating.value).replace(".", ",")} з 5` : `${clinic.rating.value} out of 5`;
  return (
    <section aria-label={copy.brandsLabel} className="pt-16 md:pt-24">
      <div className="container-page">
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="flex items-center gap-4 rounded-[24px] bg-bg-elevated p-5 ring-1 ring-line" data-reveal>
            <span className="t-h3 t-num">{String(clinic.rating.value).replace(".", locale === "uk" ? "," : ".")}</span>
            <span className="flex flex-col gap-1">
              <Rating value={clinic.rating.value} label={ratingText} className="text-[1.0625rem]" />
              <a href={clinic.social.googleReviews} target="_blank" rel="noopener noreferrer" className="text-[0.875rem] text-fg-muted underline-offset-2 hover:text-fg hover:underline">
                {copy.rating}
              </a>
            </span>
          </li>
          <li className="flex items-center gap-4 rounded-[24px] bg-bg-elevated p-5 ring-1 ring-line" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-soft-fg">
              <Users aria-hidden size={22} strokeWidth={1.6} />
            </span>
            <span className="flex flex-col">
              <span className="t-title t-num">{formatNumber(clinic.stats.patients, locale)}+</span>
              <span className="text-[0.875rem] text-fg-muted">{copy.patients}</span>
            </span>
          </li>
          <li className="flex items-center gap-4 rounded-[24px] bg-bg-elevated p-5 ring-1 ring-line" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-soft-fg">
              <BadgeCheck aria-hidden size={22} strokeWidth={1.6} />
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">{copy.license}</span>
              <span className="text-[0.8125rem] text-fg-muted">{clinic.license.number[locale].replace(/^Ліцензія МОЗ України, |^Ministry of Health of Ukraine licence, /, "")}</span>
            </span>
          </li>
        </ul>

        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <p className="sr-only">
            {copy.brandsLabel}: {brandWordmarks.join(", ")}
          </p>
          <div aria-hidden className="flex w-max gap-14 [animation:nd-marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[...brandWordmarks, ...brandWordmarks].map((b, i) => (
              <span key={i} className="text-[1.25rem] font-semibold tracking-[-0.02em] whitespace-nowrap text-fg/70">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
