import { clinic } from "@/config/clinic";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { detailRoute, route, type StaticRoute } from "@/i18n/routes";
import { categoryOrder, getServices } from "@/content/services";
import { categoryLabel, getProblems } from "@/content/taxonomy";
import type { IconName } from "@/content/types";
import { formatPrice } from "@/lib/format";
import { phone } from "@/lib/contact";

export interface NavLink {
  label: string;
  href: string;
  hint?: string;
  icon?: IconName;
}

export interface NavData {
  locale: Locale;
  home: string;
  primary: { key: "services" | "clinic" | StaticRoute; label: string; href: string; menu?: "services" | "clinic" }[];
  problems: NavLink[];
  serviceGroups: { label: string; items: NavLink[] }[];
  clinicLinks: NavLink[];
  allServices: NavLink;
  emergency: { title: string; text: string; phone: { display: string; tel: string } };
  book: string;
  phone: { display: string; tel: string };
  otherLocaleHome: string;
}

/** Serializable navigation model shared by the header, mobile menu and footer. */
export function getNavData(locale: Locale): NavData {
  const d = getDictionary(locale);
  const services = getServices(locale);
  const byId = new Map(services.map((s) => [s.id, s]));

  const problems = getProblems(locale).map((p) => ({
    label: p.label,
    hint: p.hint,
    icon: p.icon,
    href: detailRoute(locale, "service", byId.get(p.target)!.slug),
  }));

  const serviceGroups = categoryOrder.map((cat) => ({
    label: categoryLabel(locale, cat),
    items: services
      .filter((s) => s.category === cat)
      .map((s) => ({
        label: s.text.name,
        href: detailRoute(locale, "service", s.slug),
        hint: formatPrice(s.priceFrom, locale, { from: true }),
        icon: s.icon,
      })),
  }));

  const link = (key: StaticRoute, label: string, hint?: string): NavLink => ({ label, href: route(locale, key), hint });

  return {
    locale,
    home: route(locale, "home"),
    primary: [
      { key: "services", label: d.nav.services, href: route(locale, "services"), menu: "services" },
      { key: "prices", label: d.nav.prices, href: route(locale, "prices") },
      { key: "doctors", label: d.nav.doctors, href: route(locale, "doctors") },
      { key: "cases", label: d.nav.cases, href: route(locale, "cases") },
      { key: "clinic", label: d.nav.clinic, href: route(locale, "about"), menu: "clinic" },
      { key: "contacts", label: d.nav.contacts, href: route(locale, "contacts") },
    ],
    problems,
    serviceGroups,
    clinicLinks: [
      link("about", d.nav.about),
      link("technology", d.nav.technology),
      link("reviews", d.nav.reviews),
      link("firstVisit", d.nav.firstVisit),
      link("payment", d.nav.payment),
      link("offers", d.nav.offers),
      link("blog", d.nav.blog),
      link("faq", d.nav.faq),
    ],
    allServices: link("services", d.nav.allServices),
    emergency: {
      title: locale === "uk" ? "Болить зараз?" : "In pain right now?",
      text:
        locale === "uk"
          ? "Черговий лікар приймає щодня, навіть у неділю."
          : "A duty dentist sees patients every day, Sundays included.",
      phone: phone(),
    },
    book: route(locale, "book"),
    phone: phone(),
    otherLocaleHome: route(locale === "uk" ? "en" : "uk", "home"),
  };
}

export const clinicHours = clinic.hours;
