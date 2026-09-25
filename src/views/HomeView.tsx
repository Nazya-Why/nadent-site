import type { Locale } from "@/i18n/config";
import { getHomeCopy } from "@/content/home";
import { Hero } from "@/components/sections/home/Hero";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import { Problems } from "@/components/sections/home/Problems";
import { ServicesBento } from "@/components/sections/home/ServicesBento";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { CasesSection, TechSection } from "@/components/sections/home/Showcases";
import {
  ContactsSection,
  DoctorsRow,
  FaqSection,
  FearBlock,
  FinalCta,
  FirstVisit,
  Guarantees,
  PricesSection,
  QuizTeaser,
  ReviewsSection,
  Sterility,
} from "@/components/sections/home/Sections";

/**
 * Home: attention → interest → trust → objections → action.
 * Order follows docs/02_UX.md §6.2; each block has one conversion job.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const c = getHomeCopy(locale);
  return (
    <>
      <Hero locale={locale} copy={c.hero} />
      <TrustStrip locale={locale} copy={c.trust} />
      <Problems locale={locale} copy={c.problems} />
      <ServicesBento locale={locale} copy={c.services} />
      <WhyUs locale={locale} copy={c.why} />
      <TechSection locale={locale} copy={c.tech} />
      <CasesSection locale={locale} copy={c.cases} />
      <DoctorsRow locale={locale} copy={c.doctors} />
      <FearBlock locale={locale} copy={c.fear} />
      <FirstVisit locale={locale} copy={c.firstVisit} />
      <PricesSection locale={locale} copy={c.prices} />
      <QuizTeaser copy={c.quiz} />
      <ReviewsSection locale={locale} copy={c.reviews} />
      <Guarantees copy={c.guarantees} />
      <Sterility copy={c.sterile} />
      <FaqSection locale={locale} copy={c.faq} />
      <FinalCta locale={locale} copy={c.finalCta} />
      <ContactsSection locale={locale} copy={c.contacts} />
    </>
  );
}
