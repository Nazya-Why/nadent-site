import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { detailRoute, route } from "@/i18n/routes";
import type { Doctor } from "@/content/doctors";
import { cn, pluralUk } from "@/lib/format";

export function yearsLabel(n: number, locale: Locale) {
  if (locale === "uk") return `${n} ${pluralUk(n, ["рік", "роки", "років"])} досвіду`;
  return `${n} years of experience`;
}

export function DoctorCard({ doctor, locale, className, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw" }: { doctor: Doctor; locale: Locale; className?: string; sizes?: string }) {
  const d = getDictionary(locale);
  const href = detailRoute(locale, "doctor", doctor.slug);
  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <div className="relative overflow-hidden rounded-[28px]">
        <ImageSlot
          id={doctor.image}
          alt={`${doctor.text.name}, ${doctor.text.role}`}
          aspect="4:5"
          sizes={sizes}
          objectPosition="50% 20%"
          imgClassName="transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.03]"
        />
        <span className="glass glass--prominent absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold">
          {yearsLabel(doctor.years, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-4">
        <h3 className="t-title">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {doctor.text.name}
          </Link>
        </h3>
        <p className="mb-3 text-[0.9375rem] text-fg-muted">{doctor.text.role}</p>
        <Link
          href={`${route(locale, "book")}?doctor=${doctor.id}`}
          prefetch={false}
              data-book=""
          data-book-doctor={doctor.id}
          data-book-source="doctor_card"
          className="relative z-10 mt-auto inline-flex h-11 items-center self-start rounded-full bg-accent-soft px-4 text-[0.9375rem] font-semibold text-accent-soft-fg transition-colors hover:bg-accent hover:text-accent-fg"
        >
          {d.cta.bookWithDoctor}
        </Link>
      </div>
    </article>
  );
}
