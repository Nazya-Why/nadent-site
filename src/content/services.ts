import type { Locale } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { ProblemId, Service, ServiceBase, ServiceCategory, ServiceId } from "./types";

/** Prices are DEMO values for Lviv, 2026 (UAH). */
const base: ServiceBase[] = [
  {
    id: "implants",
    slug: { uk: "implantatsiia", en: "dental-implants" },
    category: "restoration",
    problems: ["missing-tooth"],
    icon: "implant",
    priceFrom: 18000,
    priceUnit: { uk: "за імплант", en: "per implant" },
    image: "service-implants",
    doctorIds: ["andrii-solovii", "ostap-klymko"],
    techIds: ["ct", "scanner", "cadcam", "sterilization"],
    related: ["all-on-4", "prosthetics", "surgery"],
    text: {
      uk: {
        name: "Імплантація",
        ctaObject: "консультацію з імплантації",
        short: "Новий зуб, який не відрізнити від свого. Без шліфування сусідніх зубів.",
        duration: "2–4 місяці",
        guarantee: "Довічна на імплант",
      },
      en: {
        name: "Dental implants",
        ctaObject: "an implant consultation",
        short: "A new tooth that looks and feels like your own — without grinding down the neighbours.",
        duration: "2–4 months",
        guarantee: "Lifetime on the implant",
      },
    },
  },
  {
    id: "all-on-4",
    slug: { uk: "all-on-4", en: "all-on-4" },
    category: "restoration",
    problems: ["missing-tooth"],
    icon: "arch",
    priceFrom: 240000,
    priceUnit: { uk: "за щелепу", en: "per arch" },
    image: "service-all-on-4",
    doctorIds: ["andrii-solovii", "ostap-klymko", "roman-levytskyi"],
    techIds: ["ct", "scanner", "sedation", "cadcam"],
    related: ["implants", "prosthetics", "sedation"],
    text: {
      uk: {
        name: "All-on-4 / All-on-6",
        ctaObject: "консультацію з All-on-4",
        short: "Повна щелепа нерухомих зубів на 4–6 імплантах. Тимчасові зуби вже за 1–3 дні.",
        duration: "Зуби за 1–3 дні",
        guarantee: "Довічна на імпланти, 5 років на конструкцію",
      },
      en: {
        name: "All-on-4 / All-on-6",
        ctaObject: "an All-on-4 consultation",
        short: "A full arch of fixed teeth on 4–6 implants. Temporary teeth in just 1–3 days.",
        duration: "Teeth in 1–3 days",
        guarantee: "Lifetime on implants, 5 years on the bridge",
      },
    },
  },
  {
    id: "veneers",
    slug: { uk: "viniry", en: "veneers" },
    category: "aesthetics",
    problems: ["smile"],
    icon: "sparkle",
    priceFrom: 6500,
    priceUnit: { uk: "за зуб", en: "per tooth" },
    image: "service-veneers",
    doctorIds: ["olena-kovalchuk", "ostap-klymko"],
    techIds: ["scanner", "cadcam", "microscope"],
    related: ["whitening", "aligners", "prosthetics"],
    text: {
      uk: {
        name: "Вініри та естетична реставрація",
        ctaObject: "консультацію з вінірів",
        short: "Природна усмішка, яку ви побачите в 3D ще до початку лікування.",
        duration: "2–3 візити",
        guarantee: "5 років",
      },
      en: {
        name: "Veneers & cosmetic bonding",
        ctaObject: "a veneers consultation",
        short: "A natural smile you can preview in 3D before treatment starts.",
        duration: "2–3 visits",
        guarantee: "5 years",
      },
    },
  },
  {
    id: "aligners",
    slug: { uk: "elainery", en: "clear-aligners" },
    category: "orthodontics",
    problems: ["crooked"],
    icon: "aligner",
    priceFrom: 65000,
    image: "service-aligners",
    doctorIds: ["marta-hnatyshyn"],
    techIds: ["scanner", "ct"],
    related: ["braces", "veneers", "whitening"],
    text: {
      uk: {
        name: "Елайнери",
        ctaObject: "консультацію з елайнерів",
        short: "Рівні зуби без брекетів: прозорі капи, яких майже не видно.",
        duration: "6–18 місяців",
        guarantee: "Контроль результату 12 місяців",
      },
      en: {
        name: "Clear aligners",
        ctaObject: "an aligner consultation",
        short: "Straight teeth without braces: nearly invisible clear trays.",
        duration: "6–18 months",
        guarantee: "12-month result follow-up",
      },
    },
  },
  {
    id: "braces",
    slug: { uk: "brekety", en: "braces" },
    category: "orthodontics",
    problems: ["crooked", "kids"],
    icon: "braces",
    priceFrom: 36000,
    priceUnit: { uk: "за щелепу", en: "per arch" },
    image: "service-braces",
    doctorIds: ["marta-hnatyshyn"],
    techIds: ["scanner", "ct"],
    related: ["aligners", "kids", "hygiene"],
    text: {
      uk: {
        name: "Брекети",
        ctaObject: "консультацію ортодонта",
        short: "Надійне виправлення навіть складного прикусу. Металеві, керамічні, самолігуючі.",
        duration: "12–24 місяці",
        guarantee: "Контроль результату 12 місяців",
      },
      en: {
        name: "Braces",
        ctaObject: "an orthodontic consultation",
        short: "Reliable correction of even complex bites. Metal, ceramic and self-ligating.",
        duration: "12–24 months",
        guarantee: "12-month result follow-up",
      },
    },
  },
  {
    id: "whitening",
    slug: { uk: "vidbiliuvannia", en: "teeth-whitening" },
    category: "aesthetics",
    problems: ["smile"],
    icon: "sun",
    priceFrom: 9500,
    image: "service-whitening",
    doctorIds: ["yuliia-panchyshyn", "olena-kovalchuk", "sofiia-dmytruk"],
    techIds: ["laser"],
    related: ["hygiene", "veneers"],
    text: {
      uk: {
        name: "Відбілювання",
        ctaObject: "відбілювання",
        short: "До 8 тонів світліше за один візит. Безпечно для емалі.",
        duration: "1,5 години",
      },
      en: {
        name: "Teeth whitening",
        ctaObject: "teeth whitening",
        short: "Up to 8 shades lighter in one visit. Safe for enamel.",
        duration: "1.5 hours",
      },
    },
  },
  {
    id: "hygiene",
    slug: { uk: "hihiiena", en: "dental-hygiene" },
    category: "prevention",
    problems: ["prevention"],
    icon: "droplet",
    priceFrom: 2200,
    image: "service-hygiene",
    doctorIds: ["yuliia-panchyshyn"],
    techIds: ["sterilization"],
    related: ["whitening", "caries"],
    text: {
      uk: {
        name: "Професійна гігієна",
        ctaObject: "професійну гігієну",
        short: "Чистка Air Flow і ультразвуком без болю. Свіжість і здорові ясна.",
        duration: "60 хвилин",
      },
      en: {
        name: "Professional hygiene",
        ctaObject: "a hygiene appointment",
        short: "Gentle Air Flow and ultrasonic cleaning. Fresh breath and healthy gums.",
        duration: "60 minutes",
      },
    },
  },
  {
    id: "caries",
    slug: { uk: "likuvannia-kariiesu", en: "cavity-treatment" },
    category: "treatment",
    problems: ["pain"],
    icon: "shield",
    priceFrom: 2400,
    image: "service-caries",
    doctorIds: ["sofiia-dmytruk", "olena-kovalchuk", "taras-boiko"],
    techIds: ["microscope", "laser"],
    related: ["endodontics", "hygiene", "prosthetics"],
    text: {
      uk: {
        name: "Лікування карієсу",
        ctaObject: "лікування зуба",
        short: "Непомітні пломби під колір зуба. Без болю — з комп'ютерною анестезією.",
        duration: "1 візит",
        guarantee: "3 роки",
      },
      en: {
        name: "Cavity treatment",
        ctaObject: "a filling appointment",
        short: "Invisible tooth-coloured fillings. Pain-free with computer-controlled anaesthesia.",
        duration: "1 visit",
        guarantee: "3 years",
      },
    },
  },
  {
    id: "endodontics",
    slug: { uk: "endodontiia-pid-mikroskopom", en: "microscope-root-canal" },
    category: "treatment",
    problems: ["pain"],
    icon: "microscope",
    priceFrom: 5500,
    priceUnit: { uk: "за канал", en: "per canal" },
    image: "service-endodontics",
    doctorIds: ["taras-boiko"],
    techIds: ["microscope", "ct"],
    related: ["caries", "prosthetics", "emergency"],
    text: {
      uk: {
        name: "Лікування каналів під мікроскопом",
        ctaObject: "лікування каналів",
        short: "Рятуємо зуби, які інші пропонують видалити. Збільшення до 25 разів.",
        duration: "1–2 візити",
        guarantee: "3 роки",
      },
      en: {
        name: "Microscope root canal treatment",
        ctaObject: "a root canal appointment",
        short: "We save teeth others would extract. Up to 25× magnification.",
        duration: "1–2 visits",
        guarantee: "3 years",
      },
    },
  },
  {
    id: "prosthetics",
    slug: { uk: "protezuvannia", en: "crowns-and-prosthetics" },
    category: "restoration",
    problems: ["missing-tooth", "smile"],
    icon: "crown",
    priceFrom: 12000,
    priceUnit: { uk: "за коронку", en: "per crown" },
    image: "service-prosthetics",
    doctorIds: ["ostap-klymko", "olena-kovalchuk"],
    techIds: ["scanner", "cadcam"],
    related: ["implants", "veneers", "endodontics"],
    text: {
      uk: {
        name: "Протезування",
        ctaObject: "консультацію з протезування",
        short: "Коронки з цирконію та кераміки за 1 день. Мости і протези на імплантах.",
        duration: "Від 1 дня",
        guarantee: "5 років",
      },
      en: {
        name: "Crowns & prosthetics",
        ctaObject: "a prosthetics consultation",
        short: "Zirconia and ceramic crowns in a day. Bridges and implant-supported dentures.",
        duration: "From 1 day",
        guarantee: "5 years",
      },
    },
  },
  {
    id: "surgery",
    slug: { uk: "khirurhiia", en: "oral-surgery" },
    category: "special",
    problems: ["pain", "missing-tooth"],
    icon: "scalpel",
    priceFrom: 1500,
    image: "service-surgery",
    doctorIds: ["andrii-solovii"],
    techIds: ["ct", "laser", "sedation"],
    related: ["implants", "sedation", "emergency"],
    text: {
      uk: {
        name: "Хірургія",
        ctaObject: "консультацію хірурга",
        short: "Видалення зубів, зокрема мудрості, і кісткова пластика. Швидко та дбайливо.",
        duration: "20–60 хвилин",
      },
      en: {
        name: "Oral surgery",
        ctaObject: "a surgical consultation",
        short: "Extractions including wisdom teeth, and bone grafting. Quick and gentle.",
        duration: "20–60 minutes",
      },
    },
  },
  {
    id: "kids",
    slug: { uk: "dytiacha-stomatolohiia", en: "kids-dentistry" },
    category: "special",
    problems: ["kids"],
    icon: "child",
    priceFrom: 900,
    image: "service-kids",
    doctorIds: ["iryna-savchuk"],
    techIds: ["laser", "sedation"],
    related: ["braces", "hygiene", "sedation"],
    text: {
      uk: {
        name: "Дитяча стоматологія",
        ctaObject: "прийом дитячого стоматолога",
        short: "Спершу знайомство, потім лікування. Щоб дитина не боялася стоматологів.",
        duration: "30–45 хвилин",
        guarantee: "1 рік на пломби",
      },
      en: {
        name: "Kids' dentistry",
        ctaObject: "a kids' dentist appointment",
        short: "First we make friends, then we treat — so your child never fears the dentist.",
        duration: "30–45 minutes",
        guarantee: "1 year on fillings",
      },
    },
  },
  {
    id: "sedation",
    slug: { uk: "likuvannia-uvi-sni", en: "sedation-dentistry" },
    category: "special",
    problems: ["fear"],
    icon: "moon",
    priceFrom: 6500,
    priceUnit: { uk: "за годину", en: "per hour" },
    image: "service-sedation",
    doctorIds: ["roman-levytskyi", "andrii-solovii", "iryna-savchuk"],
    techIds: ["sedation"],
    related: ["all-on-4", "kids", "surgery"],
    text: {
      uk: {
        name: "Лікування уві сні",
        ctaObject: "консультацію щодо седації",
        short: "Ви засинаєте — прокидаєтеся з вилікуваними зубами. Під наглядом анестезіолога.",
        duration: "1–4 години",
      },
      en: {
        name: "Sedation dentistry",
        ctaObject: "a sedation consultation",
        short: "You drift off — and wake up with the work done. Supervised by an anaesthesiologist.",
        duration: "1–4 hours",
      },
    },
  },
  {
    id: "emergency",
    slug: { uk: "terminova-dopomoha", en: "emergency-dentist" },
    category: "special",
    problems: ["pain"],
    icon: "siren",
    priceFrom: 900,
    image: "service-emergency",
    doctorIds: ["taras-boiko", "sofiia-dmytruk"],
    techIds: ["ct", "microscope"],
    related: ["endodontics", "caries", "surgery"],
    text: {
      uk: {
        name: "Термінова допомога",
        ctaObject: "термінову допомогу",
        short: "Гострий біль? Черговий лікар приймає щодня, навіть у неділю.",
        duration: "Сьогодні",
      },
      en: {
        name: "Emergency dentist",
        ctaObject: "an emergency appointment",
        short: "Acute pain? A duty dentist sees patients every day, Sundays included.",
        duration: "Today",
      },
    },
  },
];

const cache = new Map<Locale, Service[]>();

export function getServices(locale: Locale): Service[] {
  let list = cache.get(locale);
  if (!list) {
    list = base.map((s) => ({
      ...s,
      slug: s.slug[locale],
      slugs: s.slug,
      priceUnit: s.priceUnit?.[locale],
      text: deepTypo(s.text[locale], locale),
    }));
    cache.set(locale, list);
  }
  return list;
}

export function getService(locale: Locale, id: ServiceId): Service {
  const s = getServices(locale).find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service ${id}`);
  return s;
}

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((x) => x.slug === slug);
}

export const serviceIds = base.map((s) => s.id);

export const categoryOrder: ServiceCategory[] = ["restoration", "aesthetics", "orthodontics", "treatment", "prevention", "special"];

export const problemOrder: ProblemId[] = ["missing-tooth", "smile", "crooked", "pain", "kids", "fear", "prevention"];
