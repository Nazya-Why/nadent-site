import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import { detailRoute } from "@/i18n/routes";
import type { Service } from "@/content/types";
import { cn, formatPrice } from "@/lib/format";

export function ServiceCard({ service, locale, className, priority, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" }: { service: Service; locale: Locale; className?: string; priority?: boolean; sizes?: string }) {
  const href = detailRoute(locale, "service", service.slug);
  return (
    <article className={cn("group lift relative flex flex-col overflow-hidden rounded-[28px] bg-bg-elevated shadow-(--shadow-sm) ring-1 ring-line", className)}>
      <ImageSlot id={service.image} alt="" aspect="16:10" sizes={sizes} priority={priority} className="bg-bg-sunken" imgClassName="transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.04]" />
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
          <Icon name={service.icon} size={22} />
        </span>
        <h3 className="t-title">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {service.text.name}
          </Link>
        </h3>
        <p className="text-[0.9375rem] text-fg-muted">{service.text.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex flex-col">
            <span className="t-num text-[1.0625rem] font-semibold">{formatPrice(service.priceFrom, locale, { from: true })}</span>
            <span className="flex items-center gap-1 text-[0.8125rem] text-fg-muted">
              <Clock aria-hidden size={13} /> {service.text.duration}
            </span>
          </div>
          <span aria-hidden className="grid size-11 place-items-center rounded-full bg-fg/[0.06] transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg">
            <ArrowUpRight size={20} />
          </span>
        </div>
      </div>
    </article>
  );
}
