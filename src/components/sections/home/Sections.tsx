import Link from "next/link";
import { ArrowRight, BadgeCheck, Bus, Car, Check, Clock, ExternalLink, MapPin, Navigation, Phone, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timeline } from "@/components/ui/Timeline";
import { Accordion } from "@/components/ui/Accordion";
import { Rating } from "@/components/ui/Rating";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { MapFacade } from "@/components/ui/MapFacade";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { InstallmentCalculator } from "@/components/forms/InstallmentCalculator";
import { QuickForm } from "@/components/forms/QuickForm";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { clinic } from "@/config/clinic";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { detailRoute, route } from "@/i18n/routes";
import type { getHomeCopy } from "@/content/home";
import { getDoctors } from "@/content/doctors";
import { getPopularPrices } from "@/content/prices";
import { getReviews } from "@/content/reviews";
import { getFaq } from "@/content/faq";
import { getService } from "@/content/services";
import { cn, formatDate, formatPrice } from "@/lib/format";
import { phone } from "@/lib/contact";

type Copy = ReturnType<typeof getHomeCopy>;

export function DoctorsRow({ locale, copy }: { locale: Locale; copy: Copy["doctors"] }) {
  const d = getDictionary(locale);
  return (
    <section className="section" aria-labelledby="doctors-title">
      <div className="container-wide">
        <SectionHeader
          id="doctors-title"
          overline={copy.overline}
          title={copy.title}
          lead={copy.lead}
          action={
            <Button href={route(locale, "doctors")} variant="secondary" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {d.cta.allDoctors}
            </Button>
          }
        />
        <div className="mt-12 md:mt-16">
          <ScrollRow label={copy.title} prevLabel={d.a11y.previous} nextLabel={d.a11y.next} itemClassName="w-[72vw] sm:w-[300px] lg:w-[calc((100%-48px)/4)]">
            {getDoctors(locale).map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} locale={locale} />
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  );
}

export function FearBlock({ locale, copy }: { locale: Locale; copy: Copy["fear"] }) {
  const sedation = getService(locale, "sedation");
  return (
    <section className="tone-dark section relative overflow-hidden" data-tone="dark" aria-labelledby="fear-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_circle_at_85%_0%,rgb(94_200_204/0.16),transparent_70%)]" />
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <ImageSlot id="people-calm-patient" alt={copy.mediaAlt} aspect="4:5" sizes="(min-width: 1024px) 45vw, 100vw" className="rounded-[36px]" scrollZoom />
        </div>
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeader id="fear-title" overline={copy.overline} title={copy.title} lead={copy.lead} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {copy.points.map((p, i) => (
              <li key={p.title} className="glass rounded-[24px] p-5" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <p className="flex items-center gap-2 font-semibold">
                  <Check aria-hidden size={18} className="text-accent" />
                  {p.title}
                </p>
                <p className="mt-2 text-[0.9375rem] text-fg-muted">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={detailRoute(locale, "service", sedation.slug)} size="lg" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {copy.cta}
            </Button>
            <Button href={route(locale, "book")} data-book="" data-book-service="consultation" data-book-source="fear_block" variant="secondary" size="lg">
              {copy.ctaAlt}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FirstVisit({ locale, copy }: { locale: Locale; copy: Copy["firstVisit"] }) {
  return (
    <section className="section" aria-labelledby="visit-title">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start">
            <SectionHeader id="visit-title" overline={copy.overline} title={copy.title} lead={copy.lead} />
            <ImageSlot id="people-consultation" alt="" aspect="4:3" sizes="(min-width: 1024px) 40vw, 100vw" className="hidden rounded-[32px] lg:block" />
          </div>
          <div className="flex flex-col gap-8">
            <Timeline steps={copy.steps.map((s) => ({ title: s.title, meta: s.meta, text: s.text }))} />
            <div className="flex flex-col gap-4 rounded-[24px] bg-accent-soft p-5 text-accent-soft-fg sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">{copy.note}</p>
              <Link href={route(locale, "firstVisit")} className="shrink-0 font-semibold underline-offset-2 hover:underline">
                {copy.cta} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricesSection({ locale, copy }: { locale: Locale; copy: Copy["prices"] }) {
  const d = getDictionary(locale);
  const items = getPopularPrices(locale);
  return (
    <section className="section bg-bg-sand" aria-labelledby="prices-title">
      <div className="container-page">
        <SectionHeader id="prices-title" overline={copy.overline} title={copy.title} lead={copy.lead} />
        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <div className="flex flex-col overflow-hidden rounded-[32px] bg-bg-elevated ring-1 ring-line">
            <ul className="divide-y divide-line">
              {items.map((it) => {
                const svc = it.category.service ? getService(locale, it.category.service) : null;
                const content = (
                  <>
                    <span className="flex flex-col">
                      <span className="text-[0.8125rem] font-medium text-fg-muted">{it.category.name}</span>
                      <span className="font-semibold">{it.name}</span>
                    </span>
                    <span className="t-num shrink-0 font-semibold text-accent sm:text-right sm:text-fg">
                      {formatPrice(it.price, locale, { from: true })}
                      {it.unit && <span className="block text-[0.8125rem] font-normal text-fg-muted">{it.unit}</span>}
                    </span>
                  </>
                );
                return (
                  <li key={it.id}>
                    {svc ? (
                      <Link href={detailRoute(locale, "service", svc.slug)} className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-fg/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-8">
                        {content}
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-8">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto flex flex-col gap-3 border-t border-line p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <p className="text-[0.875rem] text-fg-muted">{d.footer.disclaimer}</p>
              <Button href={route(locale, "prices")} variant="secondary" iconEnd={<ArrowRight aria-hidden size={18} />} data-track="price_view" data-track-location="home">
                {d.cta.allPrices}
              </Button>
            </div>
          </div>
          <InstallmentCalculator
            locale={locale}
            bookHref={route(locale, "book")}
            labels={{ title: copy.calcTitle, lead: copy.calcLead, amount: copy.amount, months: copy.months, monthly: copy.monthly, partners: copy.partners, monthsShort: copy.monthsShort, uah: d.price.uah, cta: d.cta.bookConsultation }}
          />
        </div>
      </div>
    </section>
  );
}

export function QuizTeaser({ copy }: { copy: Copy["quiz"] }) {
  return (
    <section id="quiz" className="section-tight scroll-mt-24" aria-labelledby="quiz-title">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-[32px] p-3 sm:p-8 md:rounded-[40px] md:p-14" style={{ background: "radial-gradient(80% 120% at 0% 0%, #1a8a91 0%, transparent 60%), radial-gradient(70% 120% at 100% 100%, #c9a878 0%, transparent 55%), linear-gradient(135deg,#0a5a61,#0b0c0e)" }}>
          <div className="glass relative max-w-2xl rounded-[30px] p-7 md:p-10" data-under="dark" data-shine="">
            <p className="t-overline text-[#8adfe2]">{copy.overline}</p>
            <h2 id="quiz-title" className="t-h2 mt-3 text-white">
              {copy.title}
            </h2>
            <p className="t-body-lg mt-4 text-white/80">{copy.lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#quiz" data-quiz="" className="pressable inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 font-semibold text-[#0b0c0e] hover:bg-white/90">
                {copy.cta} <ArrowRight aria-hidden size={18} />
              </a>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem] text-white/75">
                {copy.meta.map((m) => (
                  <li key={m} className="flex items-center gap-1.5">
                    <Check aria-hidden size={14} /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <span aria-hidden className="absolute -right-6 -bottom-10 hidden text-[16rem] leading-none font-bold tracking-[-0.06em] text-white/[0.06] select-none md:block">
            ₴
          </span>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ locale, copy }: { locale: Locale; copy: Copy["reviews"] }) {
  const d = getDictionary(locale);
  const reviews = getReviews(locale).slice(0, 8);
  const ratingText = locale === "uk" ? `${String(clinic.rating.value).replace(".", ",")} ${copy.of}` : `${clinic.rating.value} ${copy.of}`;
  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container-wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader id="reviews-title" overline={copy.overline} title={copy.title} />
          <div className="flex items-center gap-5 rounded-[26px] bg-bg-elevated p-5 ring-1 ring-line" data-reveal>
            <p className="t-h1 t-num leading-none">{String(clinic.rating.value).replace(".", locale === "uk" ? "," : ".")}</p>
            <div className="flex flex-col gap-1.5">
              <Rating value={clinic.rating.value} label={ratingText} className="text-[1.25rem]" />
              <p className="text-[0.875rem] text-fg-muted">
                {clinic.rating.count} · Google
              </p>
              <a href={clinic.social.googleReviews} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[0.875rem] font-semibold text-accent hover:underline">
                {d.cta.readReviewsGoogle} <ExternalLink aria-hidden size={14} />
                <span className="sr-only">{d.a11y.newTab}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-3 md:mt-16 md:gap-4">
          {[1, 2, 3].map((n) => (
            <VideoSlot
              key={n}
              className="aspect-[9/16] rounded-[24px] md:aspect-[4/5] md:rounded-[32px] lg:aspect-[4/3]"
              poster={<ImageSlot id={`review-video-${n as 1 | 2 | 3}`} alt="" fill sizes="(min-width: 768px) 30vw, 33vw" quietPlaceholder />}
              title={`${copy.videoTitle} ${n}`}
              playLabel={d.a11y.playVideo}
              soonLabel={n === 1 ? copy.videoSoon : undefined}
            />
          ))}
        </div>

        <div className="mt-8">
          <ScrollRow label={copy.title} prevLabel={d.a11y.previous} nextLabel={d.a11y.next} itemClassName="w-[84vw] sm:w-[380px]">
            {reviews.map((r) => {
              const svc = getService(locale, r.service);
              return (
                <figure key={r.id} className="flex h-full flex-col gap-4 rounded-[28px] bg-bg-elevated p-6 ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <Rating value={r.rating} label={`${r.rating} ${copy.of}`} />
                    <span className="text-[0.8125rem] font-medium text-fg-muted">Google</span>
                  </div>
                  <blockquote className="flex-1 text-[1rem] leading-relaxed">«{r.text}»</blockquote>
                  <figcaption className="flex items-center justify-between gap-3 border-t border-line pt-4 text-[0.875rem]">
                    <span>
                      <span className="font-semibold">{r.author}</span>
                      <span className="text-fg-muted"> · {svc.text.name}</span>
                    </span>
                    <time dateTime={r.date} className="shrink-0 whitespace-nowrap text-fg-muted">
                      {formatDate(r.date, locale)}
                    </time>
                  </figcaption>
                </figure>
              );
            })}
          </ScrollRow>
        </div>
      </div>
    </section>
  );
}

export function Guarantees({ copy }: { copy: Copy["guarantees"] }) {
  const icons = [ShieldCheck, BadgeCheck, Shield, Clock];
  return (
    <section className="section bg-bg-sand" aria-labelledby="guarantees-title">
      <div className="container-page">
        <SectionHeader id="guarantees-title" overline={copy.overline} title={copy.title} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {copy.items.map((g, i) => {
            const I = icons[i];
            return (
              <li key={g.title} className={cn("flex flex-col gap-4 rounded-[28px] p-6 md:p-7", i === 3 ? "bg-accent text-accent-fg" : "bg-bg-elevated ring-1 ring-line")} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <I aria-hidden size={26} strokeWidth={1.6} className={i === 3 ? "" : "text-accent"} />
                <p className="text-[0.9375rem] font-medium opacity-80">{g.title}</p>
                <p className="t-h3 -mt-2">{g.value}</p>
                <p className={cn("text-[0.9375rem]", i === 3 ? "opacity-90" : "text-fg-muted")}>{g.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-[0.875rem] text-fg-muted">{copy.note}</p>
      </div>
    </section>
  );
}

export function Sterility({ copy }: { copy: Copy["sterile"] }) {
  return (
    <section className="section" aria-labelledby="sterile-title">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <ImageSlot id="interior-sterilization" alt={copy.mediaAlt} aspect="4:3" sizes="(min-width: 1024px) 45vw, 100vw" className="rounded-[36px]" scrollZoom />
        <div className="flex flex-col gap-8">
          <SectionHeader id="sterile-title" overline={copy.overline} title={copy.title} lead={copy.lead} />
          <ol className="flex flex-col gap-3">
            {copy.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-[20px] bg-bg-elevated p-4 ring-1 ring-line" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="t-num grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-[0.9375rem] font-semibold text-accent-soft-fg">{i + 1}</span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ locale, copy }: { locale: Locale; copy: Copy["faq"] }) {
  const items = getFaq(locale).filter((f) => f.home);
  return (
    <section className="section" aria-labelledby="faq-title">
      <JsonLd data={faqSchema(items)} />
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
        <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader id="faq-title" overline={copy.overline} title={copy.title} />
          <Link href={route(locale, "faq")} className="font-semibold text-accent hover:underline" data-reveal>
            {copy.more} →
          </Link>
        </div>
        <Accordion name="home-faq" items={items.map((f) => ({ id: `faq-${f.id}`, q: f.q, a: f.a }))} />
      </div>
    </section>
  );
}

export function FinalCta({ locale, copy }: { locale: Locale; copy: Copy["finalCta"] }) {
  const d = getDictionary(locale);
  return (
    <section className="section-tight" aria-labelledby="final-title">
      <div className="container-wide">
        <div className="relative isolate overflow-hidden rounded-[40px] md:rounded-[48px]">
          <ImageSlot id="people-final-cta" alt="" fill sizes="100vw" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="relative grid gap-10 p-6 md:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <div className="text-white">
              <h2 id="final-title" className="t-h1 [text-shadow:0_2px_24px_rgb(0_0_0/0.25)]">
                {copy.title}
              </h2>
              <p className="t-body-lg mt-5 max-w-md text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.3)]">{copy.lead}</p>
            </div>
            <div className="glass glass--prominent rounded-[32px] p-6 md:p-8">
              <p className="t-title mb-5">{d.forms.quickTitle}</p>
              <QuickForm locale={locale} t={d.forms} privacyHref={route(locale, "privacy")} thanksHref={route(locale, "thanks")} source="home_final" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactsSection({ locale, copy }: { locale: Locale; copy: Copy["contacts"] }) {
  const d = getDictionary(locale);
  const p = phone();
  const addr = `${clinic.address.street[locale]}, ${clinic.address.city[locale]}`;
  const rows = [
    { Icon: Car, title: copy.parking, text: copy.parkingText },
    { Icon: Bus, title: copy.transport, text: copy.transportText },
    { Icon: Shield, title: copy.shelter, text: copy.shelterText },
  ];
  return (
    <section className="section" aria-labelledby="contacts-title">
      <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeader id="contacts-title" overline={copy.overline} title={copy.title} />
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <MapPin aria-hidden className="mt-0.5 shrink-0 text-accent" size={22} />
              <div>
                <p className="text-[0.875rem] text-fg-muted">{copy.address}</p>
                <p className="t-title">{addr}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone aria-hidden className="mt-0.5 shrink-0 text-accent" size={22} />
              <div>
                <p className="text-[0.875rem] text-fg-muted">{copy.phone}</p>
                <p>
                  <a href={`tel:${p.tel}`} className="t-title hover:text-accent" data-track="phone_click" data-track-location="home_contacts">
                    {p.display}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock aria-hidden className="mt-0.5 shrink-0 text-accent" size={22} />
              <div>
                <p className="text-[0.875rem] text-fg-muted">{copy.hours}</p>
                <div className="flex flex-col gap-1">
                  <OpenStatus labels={{ ...d.status, days: d.days }} className="text-success" />
                  {clinic.hours.map((h) => (
                    <span key={h.open + h.days.join()} className="t-num">
                      {h.days.length > 2 ? `${d.daysShort[h.days[0]]}–${d.daysShort[h.days.at(-1)!]}` : d.daysShort[h.days[0]]} · {h.open}–{h.close}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ul className="grid gap-3">
            {rows.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-[22px] bg-bg-elevated p-4 ring-1 ring-line">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
                  <Icon aria-hidden size={20} strokeWidth={1.6} />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-[0.9375rem] text-fg-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={clinic.mapUrls.google} variant="primary" icon={<Navigation aria-hidden size={18} />} data-track="route_click" data-track-channel="google">
              {d.cta.routeGoogle}
            </Button>
            <Button href={clinic.mapUrls.apple} variant="secondary" data-track="route_click" data-track-channel="apple">
              {d.cta.routeApple}
            </Button>
          </div>
        </div>
        <MapFacade className="min-h-[360px] rounded-[36px] lg:min-h-full" embedUrl={clinic.mapUrls.embed} title={`${clinic.name}: ${addr}`} buttonLabel={d.cta.showMap} address={addr} />
      </div>
    </section>
  );
}

