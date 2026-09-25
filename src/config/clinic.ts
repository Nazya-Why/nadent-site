import type { Localized } from "@/i18n/config";

/**
 * Facts about the clinic. NaDent is a demo brand: every value marked DEMO must
 * be replaced with real data before launch (see docs/TODO_CONTENT.md).
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, like Date#getDay

export interface OpeningSlot {
  days: Weekday[];
  open: string; // "HH:MM", Europe/Kyiv
  close: string;
}

export const clinic = {
  name: "NaDent",
  legalName: 'ТОВ «НаДент Клінік»', // DEMO
  edrpou: "00000000", // DEMO
  foundedYear: 2014, // DEMO
  demoMode: true,

  address: {
    street: { uk: "вул. Кульпарківська, 226А", en: "226A Kulparkivska St" },
    city: { uk: "Львів", en: "Lviv" },
    postalCode: "79071", // DEMO: verify
    region: { uk: "Львівська область", en: "Lviv Oblast" },
    country: "UA",
    geo: { lat: 49.8067, lng: 23.9812 }, // DEMO: verify on the map
  } satisfies {
    street: Localized<string>;
    city: Localized<string>;
    postalCode: string;
    region: Localized<string>;
    country: string;
    geo: { lat: number; lng: number };
  },

  phones: {
    main: { display: "+38 (032) 000-22-60", tel: "+380320002260" }, // DEMO
    mobile: { display: "+38 (067) 000-22-60", tel: "+380670002260" }, // DEMO, messengers
  },
  email: "hello@nadent.example", // DEMO
  messengers: {
    telegram: "nadent_lviv", // DEMO
    viber: "+380670002260", // DEMO
    whatsapp: "380670002260", // DEMO
  },
  social: {
    instagram: "https://www.instagram.com/nadent.lviv/", // DEMO
    facebook: "https://www.facebook.com/nadent.lviv/", // DEMO
    youtube: "https://www.youtube.com/@nadent.lviv", // DEMO
    googleReviews: "https://www.google.com/maps/search/?api=1&query=NaDent+Lviv", // DEMO: place URL
  },

  timezone: "Europe/Kyiv",
  hours: [
    { days: [1, 2, 3, 4, 5], open: "08:00", close: "21:00" },
    { days: [6], open: "09:00", close: "18:00" },
    { days: [0], open: "10:00", close: "16:00" },
  ] satisfies OpeningSlot[],
  /** Replies are promised within this many minutes during opening hours. */
  replyMinutes: 15,

  license: {
    number: { uk: "Ліцензія МОЗ України, наказ № 0000 від 12.03.2015", en: "Ministry of Health of Ukraine licence, order No. 0000 of 12 March 2015" }, // DEMO
  },

  stats: {
    years: new Date().getFullYear() - 2014,
    patients: 14000, // DEMO
    implants: 4200, // DEMO
    doctors: 9, // DEMO
    implantSuccess: 98, // DEMO: % survival, cite manufacturer / own data
  },

  /** Ratings are shown on the page; they go into schema.org only when verified. */
  rating: {
    value: 4.9, // DEMO
    count: 612, // DEMO
    source: "Google",
    verified: false,
  },

  consultation: {
    price: 500, // DEMO
    implantWithCt: 900, // DEMO
    creditedToTreatment: true,
  },

  installments: {
    maxMonths: 12,
    zeroPercentMonths: 12,
    partners: ["monobank", "ПриватБанк"],
    minAmount: 3000,
  },

  mapUrls: {
    google: "https://www.google.com/maps/dir/?api=1&destination=49.8067,23.9812",
    apple: "https://maps.apple.com/?daddr=49.8067,23.9812&dirflg=d",
    embed:
      "https://www.google.com/maps?q=%D0%9B%D1%8C%D0%B2%D1%96%D0%B2,+%D0%9A%D1%83%D0%BB%D1%8C%D0%BF%D0%B0%D1%80%D0%BA%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+226%D0%90&output=embed",
  },
} as const;

export type Clinic = typeof clinic;
