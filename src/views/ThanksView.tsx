import { CalendarCheck, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { clinic } from "@/config/clinic";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { ThanksGreeting } from "./ThanksGreeting";

export function ThanksView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t =
    locale === "uk"
      ? {
          next: "Що буде далі",
          steps: [
            { Icon: MessageCircle, title: "Звʼяжемося з вами", text: "Протягом 15 хвилин у робочий час. Якщо заявка надійшла ввечері — зранку, одразу після відкриття." },
            { Icon: CalendarCheck, title: "Підтвердимо час", text: "Підберемо зручний день і лікаря, надішлемо нагадування в месенджер." },
            { Icon: FileText, title: "Підготуйтеся до візиту", text: "Візьміть паспорт, знімки з інших клінік (якщо є) і список ліків, які приймаєте. Приходьте за 10 хвилин." },
          ],
          meanwhile: "Поки чекаєте",
          firstVisit: "Як проходить перший візит",
          insta: "Наш Instagram",
        }
      : {
          next: "What happens next",
          steps: [
            { Icon: MessageCircle, title: "We'll get in touch", text: "Within 15 minutes during opening hours. If you wrote in the evening, first thing in the morning." },
            { Icon: CalendarCheck, title: "We confirm the time", text: "We'll find a convenient day and doctor and send a reminder to your messenger." },
            { Icon: FileText, title: "Prepare for your visit", text: "Bring your passport, any X-rays from other clinics and a list of medications. Please arrive 10 minutes early." },
          ],
          meanwhile: "While you wait",
          firstVisit: "How the first visit works",
          insta: "Our Instagram",
        };
  return (
    <section className="container-narrow pt-[calc(var(--header-h)+64px)] pb-24 text-center">
      <ThanksGreeting locale={locale} success={d.forms.success} demoNote={d.forms.successDemo} />
      <h2 className="t-overline mt-16 text-fg-muted">{t.next}</h2>
      <ol className="mt-6 grid gap-3 text-left md:grid-cols-3">
        {t.steps.map(({ Icon, title, text }, i) => (
          <li key={title} className="rounded-[26px] bg-bg-elevated p-6 ring-1 ring-line" data-reveal style={{ "--i": i } as React.CSSProperties}>
            <Icon aria-hidden size={24} className="text-accent" strokeWidth={1.6} />
            <p className="t-title mt-4">
              {i + 1}. {title}
            </p>
            <p className="mt-2 text-[0.9375rem] text-fg-muted">{text}</p>
          </li>
        ))}
      </ol>
      <p className="t-overline mt-14 text-fg-muted">{t.meanwhile}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button href={route(locale, "firstVisit")} variant="secondary">
          {t.firstVisit}
        </Button>
        <Button href={clinic.social.instagram} variant="secondary" icon={<InstagramIcon size={18} />}>
          {t.insta}
        </Button>
        <Button href={route(locale, "home")} variant="ghost">
          {d.cta.toHome}
        </Button>
      </div>
    </section>
  );
}
