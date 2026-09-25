import type { Locale } from "@/i18n/config";
import { detailRoute } from "@/i18n/routes";
import { deepTypo } from "@/lib/typograph";
import { getServices } from "./services";
import type { ServiceId } from "./types";

/**
 * Cost estimator. Ranges are DEMO values derived from src/content/prices.ts.
 * The result is always framed as an estimate; the doctor fixes the price after diagnostics.
 */

export type Concern = "missing" | "aesthetics" | "crooked" | "pain" | "checkup";
export type Extent = "one" | "few" | "many" | "all";

export const estimateTable: Record<Concern, Record<Extent, [number, number]>> = {
  missing: { one: [34000, 48000], few: [68000, 140000], many: [130000, 260000], all: [240000, 360000] },
  aesthetics: { one: [9500, 16000], few: [13000, 48000], many: [52000, 128000], all: [100000, 190000] },
  crooked: { one: [45000, 65000], few: [65000, 90000], many: [80000, 120000], all: [100000, 140000] },
  pain: { one: [2400, 8900], few: [7000, 25000], many: [20000, 50000], all: [40000, 90000] },
  checkup: { one: [2200, 5000], few: [2200, 9000], many: [2200, 15000], all: [2200, 20000] },
};

export const concernService: Record<Concern, Record<Extent, ServiceId>> = {
  missing: { one: "implants", few: "implants", many: "implants", all: "all-on-4" },
  aesthetics: { one: "whitening", few: "veneers", many: "veneers", all: "veneers" },
  crooked: { one: "aligners", few: "aligners", many: "aligners", all: "braces" },
  pain: { one: "caries", few: "caries", many: "endodontics", all: "endodontics" },
  checkup: { one: "hygiene", few: "hygiene", many: "hygiene", all: "hygiene" },
};

export interface QuizQuestion {
  id: "concern" | "extent" | "priority" | "lastVisit" | "fear";
  title: string;
  options: { value: string; label: string; hint?: string }[];
}

export interface QuizContent {
  title: string;
  step: string;
  back: string;
  questions: QuizQuestion[];
  result: {
    title: string;
    rangeLabel: string;
    monthlyLabel: string;
    recommend: string;
    sedationNote: string;
    longAgoNote: string;
    disclaimer: string;
    formTitle: string;
    formLead: string;
    submit: string;
    restart: string;
    more: string;
  };
  services: Record<ServiceId, { name: string; href: string }>;
}

const uk = {
  title: "Орієнтовна вартість лікування",
  step: "Питання {n} з {total}",
  back: "Назад",
  questions: [
    {
      id: "concern",
      title: "Що вас турбує найбільше?",
      options: [
        { value: "missing", label: "Немає одного або кількох зубів" },
        { value: "aesthetics", label: "Колір або форма зубів" },
        { value: "crooked", label: "Криві зуби або прикус" },
        { value: "pain", label: "Болить зуб або є карієс" },
        { value: "checkup", label: "Хочу профілактичний огляд і чистку" },
      ],
    },
    {
      id: "extent",
      title: "Скільки зубів потребують уваги?",
      options: [
        { value: "one", label: "Один" },
        { value: "few", label: "2–3 зуби" },
        { value: "many", label: "4 і більше" },
        { value: "all", label: "Майже всі або вся щелепа" },
      ],
    },
    {
      id: "priority",
      title: "Що для вас найважливіше?",
      options: [
        { value: "price", label: "Оптимальна ціна" },
        { value: "speed", label: "Швидкий результат" },
        { value: "aesthetics", label: "Максимальна естетика" },
        { value: "durability", label: "Надійність на десятиліття" },
      ],
    },
    {
      id: "lastVisit",
      title: "Коли ви востаннє були в стоматолога?",
      options: [
        { value: "recent", label: "Менше року тому" },
        { value: "mid", label: "1–3 роки тому" },
        { value: "long", label: "Більше 3 років тому" },
      ],
    },
    {
      id: "fear",
      title: "Наскільки вам тривожно перед лікуванням?",
      options: [
        { value: "none", label: "Спокійно" },
        { value: "some", label: "Трохи хвилююся" },
        { value: "strong", label: "Дуже страшно", hint: "Розповімо про лікування уві сні" },
      ],
    },
  ],
  result: {
    title: "Ваш орієнтовний результат",
    rangeLabel: "Орієнтовна вартість",
    monthlyLabel: "У розстрочку 0 % на 12 місяців — від",
    recommend: "Рекомендуємо почати з",
    sedationNote: "Усе лікування можна провести уві сні під наглядом анестезіолога.",
    longAgoNote: "Оскільки від останнього візиту минуло чимало часу, радимо почати з огляду і професійної гігієни.",
    disclaimer: "Це попередня оцінка. Точну вартість лікар зафіксує в плані після огляду й діагностики.",
    formTitle: "Отримайте точний план лікування",
    formLead: "Залиште контакти — адміністратор запише вас на консультацію й надішле цю оцінку в месенджер.",
    submit: "Отримати план лікування",
    restart: "Пройти ще раз",
    more: "Детальніше про послугу",
  },
};

const en: typeof uk = {
  title: "Estimated treatment cost",
  step: "Question {n} of {total}",
  back: "Back",
  questions: [
    {
      id: "concern",
      title: "What bothers you most?",
      options: [
        { value: "missing", label: "One or more missing teeth" },
        { value: "aesthetics", label: "The colour or shape of my teeth" },
        { value: "crooked", label: "Crooked teeth or bite" },
        { value: "pain", label: "Toothache or cavities" },
        { value: "checkup", label: "A check-up and clean" },
      ],
    },
    {
      id: "extent",
      title: "How many teeth need attention?",
      options: [
        { value: "one", label: "One" },
        { value: "few", label: "2–3 teeth" },
        { value: "many", label: "4 or more" },
        { value: "all", label: "Almost all or a whole arch" },
      ],
    },
    {
      id: "priority",
      title: "What matters most to you?",
      options: [
        { value: "price", label: "The best price" },
        { value: "speed", label: "A fast result" },
        { value: "aesthetics", label: "The best aesthetics" },
        { value: "durability", label: "Reliability for decades" },
      ],
    },
    {
      id: "lastVisit",
      title: "When did you last see a dentist?",
      options: [
        { value: "recent", label: "Less than a year ago" },
        { value: "mid", label: "1–3 years ago" },
        { value: "long", label: "More than 3 years ago" },
      ],
    },
    {
      id: "fear",
      title: "How anxious do you feel about treatment?",
      options: [
        { value: "none", label: "Calm" },
        { value: "some", label: "A little nervous" },
        { value: "strong", label: "Very scared", hint: "We'll tell you about sedation" },
      ],
    },
  ],
  result: {
    title: "Your estimated result",
    rangeLabel: "Estimated cost",
    monthlyLabel: "With 0% instalments over 12 months — from",
    recommend: "We recommend starting with",
    sedationNote: "All of the treatment can be done under sedation supervised by an anaesthesiologist.",
    longAgoNote: "As it's been a while since your last visit, we suggest starting with a check-up and professional clean.",
    disclaimer: "This is a preliminary estimate. Your doctor will fix the exact price in your plan after an examination.",
    formTitle: "Get your exact treatment plan",
    formLead: "Leave your details — our coordinator will book your consultation and send this estimate to your messenger.",
    submit: "Get my treatment plan",
    restart: "Start again",
    more: "More about this treatment",
  },
};

export function getQuiz(locale: Locale): QuizContent {
  const services = Object.fromEntries(
    getServices(locale).map((s) => [s.id, { name: s.text.name, href: detailRoute(locale, "service", s.slug) }]),
  ) as QuizContent["services"];
  return { ...deepTypo(locale === "uk" ? uk : en, locale), services } as QuizContent;
}
