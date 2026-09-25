import { clinic } from "@/config/clinic";
import { absoluteUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { getDictionary } from "@/i18n";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to avoid closing the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const clinicId = (locale: Locale) => `${absoluteUrl(route(locale, "home"))}#clinic`;

/** Dentist (a LocalBusiness + MedicalOrganization subtype) for the whole site. */
export function clinicSchema(locale: Locale): Json {
  const d = getDictionary(locale);
  const schema: Json = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic"],
    "@id": clinicId(locale),
    name: clinic.name,
    legalName: clinic.legalName,
    description: d.meta.defaultDescription,
    url: absoluteUrl(route(locale, "home")),
    telephone: clinic.phones.main.tel,
    email: clinic.email,
    image: absoluteUrl("/og/default.png"),
    logo: absoluteUrl("/icon.svg"),
    priceRange: "₴₴₴",
    currenciesAccepted: "UAH",
    paymentAccepted: "Cash, Credit Card, Apple Pay, Google Pay, Instalments",
    foundingDate: String(clinic.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street[locale],
      addressLocality: clinic.address.city[locale],
      addressRegion: clinic.address.region[locale],
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: clinic.address.geo.lat, longitude: clinic.address.geo.lng },
    hasMap: clinic.mapUrls.google,
    openingHoursSpecification: clinic.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((x) => `https://schema.org/${dayMap[x]}`),
      opens: h.open,
      closes: h.close,
    })),
    availableLanguage: ["uk", "en", "pl"],
    medicalSpecialty: ["Dentistry", "https://schema.org/Dentistry"],
    isAcceptingNewPatients: true,
    sameAs: [clinic.social.instagram, clinic.social.facebook, clinic.social.youtube],
    inLanguage: locale,
  };
  if (clinic.rating.verified) {
    schema.aggregateRating = { "@type": "AggregateRating", ratingValue: clinic.rating.value, reviewCount: clinic.rating.count, bestRating: 5 };
  }
  return schema;
}

export function ClinicJsonLd({ locale }: { locale: Locale }) {
  return (
    <JsonLd
      data={[
        clinicSchema(locale),
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${absoluteUrl(route(locale, "home"))}#website`,
          name: clinic.name,
          url: absoluteUrl(route(locale, "home")),
          inLanguage: locale,
          publisher: { "@id": clinicId(locale) },
        },
      ]}
    />
  );
}

export function breadcrumbSchema(items: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
