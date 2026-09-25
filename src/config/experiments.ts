import type { Localized } from "@/i18n/config";

/**
 * A/B-ready copy. Switch the active variant here (or wire it to a GTM/Optimize flag via
 * NEXT_PUBLIC_HERO_VARIANT) — components read only `heroCopy()` / `ctaCopy()`.
 */

export const heroVariants = {
  calm: {
    uk: {
      title: "Спокійна стоматологія.",
      titleAccent: "Без болю і сюрпризів.",
      lead: "Плануємо лікування в 3D, фіксуємо ціну до початку і працюємо так, що страх лишається за дверима.",
    },
    en: {
      title: "Calm dentistry.",
      titleAccent: "No pain, no surprises.",
      lead: "We plan your treatment in 3D, fix the price before we start and work so gently that anxiety stays at the door.",
    },
  },
  smile: {
    uk: {
      title: "Нова усмішка.",
      titleAccent: "Спершу — у 3D.",
      lead: "Побачте результат ще до початку лікування. Імплантація, вініри та елайнери з гарантією до 5 років.",
    },
    en: {
      title: "A new smile.",
      titleAccent: "See it in 3D first.",
      lead: "Preview your result before treatment starts. Implants, veneers and aligners with up to a 5-year guarantee.",
    },
  },
} satisfies Record<string, Localized<{ title: string; titleAccent: string; lead: string }>>;

export type HeroVariant = keyof typeof heroVariants;

export const activeHero: HeroVariant = (process.env.NEXT_PUBLIC_HERO_VARIANT as HeroVariant) in heroVariants
  ? (process.env.NEXT_PUBLIC_HERO_VARIANT as HeroVariant)
  : "calm";

export const ctaCopy = {
  primary: { uk: "Записатися на консультацію", en: "Book a consultation" },
  secondary: { uk: "Розрахувати вартість", en: "Estimate the cost" },
} satisfies Record<string, Localized<string>>;
