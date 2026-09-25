import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { detailRoute, route } from "@/i18n/routes";
import type { getHomeCopy } from "@/content/home";
import { getTechnologies } from "@/content/technologies";
import { getCases } from "@/content/cases";
import { getService } from "@/content/services";
import { getDoctor } from "@/content/doctors";
import { TechScroller } from "./TechScroller";
import { CasesShowcase } from "./CasesShowcase";

type Copy = ReturnType<typeof getHomeCopy>;

export function TechSection({ locale, copy }: { locale: Locale; copy: Copy["tech"] }) {
  const items = getTechnologies(locale)
    .filter((t) => t.id !== "sterilization")
    .map((t) => ({
      id: t.id,
      name: t.text.name,
      model: t.text.model,
      title: t.text.title,
      benefits: t.text.benefits,
      services: t.services.slice(0, 3).map((id) => {
        const s = getService(locale, id);
        return { label: s.text.name, href: detailRoute(locale, "service", s.slug) };
      }),
      media: <ImageSlot id={t.image} alt={`${t.text.name} ${t.text.model}`} fill sizes="(min-width: 1024px) 55vw, 85vw" />,
    }));
  return (
    <section className="section bg-bg-sand" aria-labelledby="tech-title">
      <div className="container-wide">
        <SectionHeader
          id="tech-title"
          overline={copy.overline}
          title={copy.title}
          lead={copy.lead}
          action={
            <Button href={route(locale, "technology")} variant="secondary" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {copy.more}
            </Button>
          }
        />
        <div className="mt-10 lg:mt-4">
          <TechScroller items={items} usedIn={locale === "uk" ? "Використовуємо в послугах" : "Used in"} />
        </div>
      </div>
    </section>
  );
}

export function CasesSection({ locale, copy }: { locale: Locale; copy: Copy["cases"] }) {
  const d = getDictionary(locale);
  const cases = getCases(locale).map((c) => {
    const s = getService(locale, c.service);
    const doc = getDoctor(locale, c.doctor);
    return {
      id: c.id,
      service: c.service,
      serviceLabel: s.text.name,
      title: c.text.title,
      patient: c.text.patient,
      task: c.text.task,
      solution: c.text.solution,
      result: c.text.result,
      duration: c.text.duration,
      visits: c.text.visits,
      doctor: { name: doc.text.name, href: detailRoute(locale, "doctor", doc.slug) },
      href: detailRoute(locale, "case", c.slug),
      before: <ImageSlot id={c.before} alt={`${copy.before}: ${c.text.title}`} fill sizes="(min-width: 1024px) 55vw, 100vw" />,
      after: <ImageSlot id={c.after} alt={`${copy.after}: ${c.text.title}`} fill sizes="(min-width: 1024px) 55vw, 100vw" />,
    };
  });
  return (
    <section className="section" aria-labelledby="cases-title">
      <div className="container-wide">
        <SectionHeader
          id="cases-title"
          overline={copy.overline}
          title={copy.title}
          lead={copy.lead}
          action={
            <Button href={route(locale, "cases")} variant="secondary" iconEnd={<ArrowRight aria-hidden size={18} />}>
              {d.cta.allCases}
            </Button>
          }
        />
        <div className="mt-10 md:mt-14">
          <CasesShowcase
            cases={cases}
            labels={{ ...copy, filter: copy.overline, more: d.cta.more, note: d.common.demoPhotosNote }}
          />
        </div>
      </div>
    </section>
  );
}
