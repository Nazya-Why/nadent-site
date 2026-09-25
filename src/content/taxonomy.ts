import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { IconName, ProblemId, ServiceCategory, ServiceId } from "./types";

interface ProblemDef {
  id: ProblemId;
  icon: IconName;
  target: ServiceId;
  also: ServiceId[];
  text: Localized<{ label: string; hint: string }>;
}

const problems: ProblemDef[] = [
  {
    id: "missing-tooth",
    icon: "tooth-gap",
    target: "implants",
    also: ["all-on-4", "prosthetics"],
    text: {
      uk: { label: "Немає зуба", hint: "Імплант, коронка або All-on-4" },
      en: { label: "A missing tooth", hint: "Implant, crown or All-on-4" },
    },
  },
  {
    id: "smile",
    icon: "sparkle",
    target: "whitening",
    also: ["veneers"],
    text: {
      uk: { label: "Хочу білі зуби", hint: "Відбілювання та вініри" },
      en: { label: "Whiter teeth", hint: "Whitening and veneers" },
    },
  },
  {
    id: "crooked",
    icon: "zigzag",
    target: "aligners",
    also: ["braces"],
    text: {
      uk: { label: "Криві зуби", hint: "Елайнери та брекети" },
      en: { label: "Crooked teeth", hint: "Aligners and braces" },
    },
  },
  {
    id: "pain",
    icon: "siren",
    target: "emergency",
    also: ["caries", "endodontics"],
    text: {
      uk: { label: "Болить зараз", hint: "Приймемо сьогодні" },
      en: { label: "Pain right now", hint: "We'll see you today" },
    },
  },
  {
    id: "kids",
    icon: "child",
    target: "kids",
    also: ["braces"],
    text: {
      uk: { label: "Для дитини", hint: "Без страху і сліз" },
      en: { label: "For my child", hint: "No fear, no tears" },
    },
  },
  {
    id: "fear",
    icon: "moon",
    target: "sedation",
    also: [],
    text: {
      uk: { label: "Боюся лікування", hint: "Седація і спокійний темп" },
      en: { label: "I'm afraid", hint: "Sedation and a gentle pace" },
    },
  },
  {
    id: "prevention",
    icon: "droplet",
    target: "hygiene",
    also: ["whitening"],
    text: {
      uk: { label: "Профілактика", hint: "Гігієна раз на пів року" },
      en: { label: "Prevention", hint: "Hygiene twice a year" },
    },
  },
];

const categories: Record<ServiceCategory, Localized<string>> = {
  restoration: { uk: "Відновлення", en: "Restoration" },
  aesthetics: { uk: "Естетика", en: "Aesthetics" },
  orthodontics: { uk: "Ортодонтія", en: "Orthodontics" },
  treatment: { uk: "Лікування", en: "Treatment" },
  prevention: { uk: "Профілактика", en: "Prevention" },
  special: { uk: "Особливі випадки", en: "Special care" },
};

export interface Problem extends Omit<ProblemDef, "text"> {
  label: string;
  hint: string;
}

export function getProblems(locale: Locale): Problem[] {
  return problems.map(({ text, ...p }) => ({ ...p, ...deepTypo(text[locale], locale) }));
}

export function categoryLabel(locale: Locale, category: ServiceCategory): string {
  return categories[category][locale];
}
