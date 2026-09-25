import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { detailRoute, route } from "@/i18n/routes";
import { getService } from "@/content/services";
import type { getHomeCopy } from "@/content/home";
import type { ServiceId } from "@/content/types";
import { cn, formatPrice } from "@/lib/format";

type Tile = { id: ServiceId; size: "xl" | "wide" | "sm"; photo?: boolean };

const tiles: Tile[] = [
  { id: "implants", size: "xl", photo: true },
  { id: "veneers", size: "wide", photo: true },
  { id: "aligners", size: "sm" },
  { id: "whitening", size: "sm" },
  { id: "all-on-4", size: "wide", photo: true },
  { id: "endodontics", size: "sm" },
  { id: "kids", size: "sm" },
];

/** Apple-style bento: tiles of different weight; photo tiles carry text on a glass plate. */
export function ServicesBento({ locale, copy }: { locale: Locale; copy: ReturnType<typeof getHomeCopy>["services"] }) {
  const d = getDictionary(locale);
  return (
    <section className="section bg-bg-sand" aria-labelledby="services-title">
      <div className="container-wide">
        <SectionHeader
          id="services-title"
          overline={copy.overline}
          title={copy.title}
          lead={copy.lead}
          action={
            <Button href={route(locale, "services")} variant="secondary" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {d.nav.allServices}
            </Button>
          }
        />
        <ul className="mt-12 grid auto-rows-[minmax(220px,auto)] grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => {
            const s = getService(locale, t.id);
            const href = detailRoute(locale, "service", s.slug);
            const price = formatPrice(s.priceFrom, locale, { from: true });
            return (
              <li
                key={t.id}
                data-reveal="scale"
                style={{ "--i": i } as React.CSSProperties}
                className={cn(
                  t.size === "xl" && "col-span-2 row-span-2 min-h-[440px] lg:min-h-[560px]",
                  t.size === "wide" && "col-span-2 min-h-[280px]",
                  t.size === "sm" && "col-span-1",
                )}
              >
                {t.photo ? (
                  <Link href={href} className="group relative block h-full overflow-hidden rounded-[28px] md:rounded-[32px]">
                    <ImageSlot
                      id={s.image}
                      alt=""
                      fill
                      sizes={t.size === "xl" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
                      imgClassName="transition-transform duration-[1200ms] ease-(--ease-out) group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4">
                      <div className="glass glass--prominent flex items-end justify-between gap-4 rounded-[22px] p-4 md:p-5" data-shine="">
                        <div className="flex flex-col gap-1">
                          <h3 className={cn("font-semibold tracking-[-0.02em]", t.size === "xl" ? "t-h3" : "t-title")}>{s.text.name}</h3>
                          <p className={cn("text-fg-muted", t.size === "xl" ? "text-[1rem]" : "line-clamp-2 text-[0.9375rem]")}>{s.text.short}</p>
                          <p className="t-num mt-1 text-[0.9375rem] font-semibold text-accent">
                            {price} · <span className="font-medium text-fg-muted">{s.text.duration}</span>
                          </p>
                        </div>
                        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-transform duration-300 group-hover:scale-110">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={href} className="group lift flex h-full flex-col justify-between gap-6 rounded-[28px] bg-bg-elevated p-5 ring-1 ring-line md:rounded-[32px] md:p-7">
                    <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-soft-fg">
                      <Icon name={s.icon} size={24} />
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <h3 className="text-[1.125rem] leading-tight font-semibold tracking-[-0.015em] md:text-[1.375rem]">{s.text.name}</h3>
                      <span className="hidden text-[0.9375rem] text-fg-muted md:line-clamp-2">{s.text.short}</span>
                      <span className="t-num text-[0.875rem] font-semibold text-accent md:text-[0.9375rem]">{price}</span>
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
