import { Suspense } from "react";
import { Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { BookingPageClient } from "@/components/forms/BookingPageClient";
import { getBookingProps } from "@/components/forms/booking-data";
import { QuickForm } from "@/components/forms/QuickForm";
import { MessengerButtons } from "@/components/layout/MessengerSheet";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { route } from "@/i18n/routes";
import { phone } from "@/lib/contact";

export function BookView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const booking = getBookingProps(locale);
  const p = phone();
  const t = locale === "uk"
    ? { title: "Онлайн-запис", lead: "4 коротких кроки — і адміністратор підтвердить зручний час. Або оберіть інший спосіб праворуч.", other: "Інші способи", call: "Подзвонити", write: "Написати в месенджер", quick: "Поспішаєте? Тільки ім'я і телефон" }
    : { title: "Online booking", lead: "Four short steps — and our coordinator will confirm a convenient time. Or choose another way on the right.", other: "Other ways", call: "Call us", write: "Message us", quick: "In a hurry? Just your name and phone" };
  return (
    <section className="container-page pt-[calc(var(--header-h)+48px)] pb-24">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <h1 className="t-h1">{t.title}</h1>
          <p className="t-body-lg mt-4 max-w-2xl text-fg-muted">{t.lead}</p>
          <div className="mt-8 rounded-[32px] bg-bg-elevated p-5 ring-1 ring-line md:p-8">
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-3xl bg-fg/[0.04]" />}>
              <BookingPageClient {...booking} />
            </Suspense>
          </div>
        </div>
        <aside className="flex flex-col gap-6 lg:pt-4" aria-label={t.other}>
          <div className="rounded-[28px] bg-bg-sand p-6">
            <p className="t-overline text-fg-muted">{t.other}</p>
            <OpenStatus labels={{ ...d.status, days: d.days }} className="mt-4" />
            <a href={`tel:${p.tel}`} className="t-h3 mt-3 block" data-track="phone_click" data-track-location="book_page">
              {p.display}
            </a>
            <p className="mt-6 mb-3 flex items-center gap-2 font-semibold">
              <MessageCircle aria-hidden size={18} className="text-accent" /> {t.write}
            </p>
            <MessengerButtons labels={{ ...d.messengers, call: d.cta.call }} location="book_page" />
          </div>
          <div className="rounded-[28px] bg-bg-elevated p-6 ring-1 ring-line">
            <p className="t-title mb-5">{t.quick}</p>
            <QuickForm locale={locale} t={d.forms} privacyHref={route(locale, "privacy")} thanksHref={route(locale, "thanks")} source="book_page_quick" showChannel={false} showTriggers={false} />
          </div>
          <ul className="flex flex-col gap-2 text-[0.9375rem] text-fg-muted">
            <li className="flex items-center gap-2">
              <Clock aria-hidden size={16} className="text-accent" /> {d.forms.triggers.reply}
            </li>
            <li className="flex items-center gap-2">
              <Phone aria-hidden size={16} className="text-accent" /> {d.forms.triggers.consultation}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden size={16} className="text-accent" /> {d.forms.triggers.privacy}
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
