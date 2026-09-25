import { ImageSlot } from "@/components/ui/ImageSlot";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { route } from "@/i18n/routes";
import { getDoctors } from "@/content/doctors";
import { getServices } from "@/content/services";
import { getProblems } from "@/content/taxonomy";
import type { BookingWizardProps, WizardDoctor, WizardOption } from "./BookingWizard";

/** Server-side assembly of everything the booking wizard needs (serialisable + avatars). */
export function getBookingProps(locale: Locale): Omit<BookingWizardProps, "preset" | "onDone" | "mode"> {
  const d = getDictionary(locale);
  const services = getServices(locale);

  // Step 1 shows concerns (Hick's law: 8 cards instead of 14 services)…
  const primary: WizardOption[] = [
    ...getProblems(locale).map((p) => ({
      value: p.target,
      label: p.label,
      hint: p.hint,
      icon: p.icon,
      services: [p.target, ...p.also],
      primary: true,
    })),
    { value: "consultation", label: d.forms.wizard.notSure, hint: d.forms.wizard.notSureHint, services: [], primary: true },
  ];

  // …but every service stays addressable as a preset from its own page.
  const rest: WizardOption[] = services
    .filter((s) => !primary.some((o) => o.value === s.id))
    .map((s) => ({ value: s.id, label: s.text.name, hint: s.text.duration, icon: s.icon, services: [s.id], primary: false }));

  const doctors: WizardDoctor[] = getDoctors(locale).map((doc) => ({
    id: doc.id,
    name: doc.text.name,
    role: doc.text.role,
    services: doc.services,
    avatar: <ImageSlot id={doc.image} alt="" fill sizes="56px" quietPlaceholder objectPosition="50% 20%" />,
  }));

  return {
    locale,
    t: d.forms,
    daysShort: d.daysShort,
    options: [...primary, ...rest],
    doctors,
    privacyHref: route(locale, "privacy"),
    thanksHref: route(locale, "thanks"),
  };
}
