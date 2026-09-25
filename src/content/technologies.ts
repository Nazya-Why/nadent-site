import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { ImageId } from "./image-registry";
import type { ServiceId, TechId } from "./types";

interface TechText {
  name: string;
  model: string;
  /** One-line hook for sticky scroll */
  title: string;
  benefits: string[];
}

interface TechBase {
  id: TechId;
  image: ImageId;
  services: ServiceId[];
  text: Localized<TechText>;
}

const base: TechBase[] = [
  {
    id: "ct",
    image: "tech-ct",
    services: ["implants", "all-on-4", "endodontics", "surgery"],
    text: {
      uk: {
        name: "3D-томограф (КТ)",
        model: "Planmeca Viso G5",
        title: "Бачимо все в 3D ще до початку лікування",
        benefits: [
          "Точно знаємо об'єм кістки, тож імплант стає туди, де простоїть десятиліття",
          "Доза опромінення в 5–10 разів нижча, ніж у медичного КТ",
          "Знімок за 15 секунд, результат лікар показує вам одразу на екрані",
        ],
      },
      en: {
        name: "3D CBCT scanner",
        model: "Planmeca Viso G5",
        title: "We see everything in 3D before treatment starts",
        benefits: [
          "We know the exact bone volume, so the implant goes where it will last for decades",
          "5–10× lower radiation dose than a medical CT",
          "A 15-second scan; the doctor shows you the result on screen straight away",
        ],
      },
    },
  },
  {
    id: "scanner",
    image: "tech-scanner",
    services: ["veneers", "aligners", "braces", "prosthetics", "implants"],
    text: {
      uk: {
        name: "Інтраоральний 3D-сканер",
        model: "3Shape TRIOS 5",
        title: "Жодних відбитків і неприємної маси",
        benefits: [
          "Сканування займає 2–3 хвилини, і нудоти від відбиткової маси більше немає",
          "Ви одразу бачите свої зуби в 3D і розумієте, що саме лікуватимемо",
          "Цифрова модель дає точніші коронки, вініри й елайнери",
        ],
      },
      en: {
        name: "Intraoral 3D scanner",
        model: "3Shape TRIOS 5",
        title: "No impressions, no gag reflex",
        benefits: [
          "A 2–3 minute scan instead of messy impression material",
          "You see your teeth in 3D and understand exactly what needs treating",
          "A digital model means more precise crowns, veneers and aligners",
        ],
      },
    },
  },
  {
    id: "microscope",
    image: "tech-microscope",
    services: ["endodontics", "caries", "veneers"],
    text: {
      uk: {
        name: "Дентальний мікроскоп",
        model: "Carl Zeiss EXTARO 300",
        title: "Збільшення до 25 разів — рятуємо зуби, а не видаляємо",
        benefits: [
          "Знаходимо додаткові канали, які не видно неозброєним оком",
          "Лікування каналів з першого разу, без повторних загострень",
          "Реставрації з точністю до частки міліметра",
        ],
      },
      en: {
        name: "Dental operating microscope",
        model: "Carl Zeiss EXTARO 300",
        title: "Up to 25× magnification — we save teeth instead of extracting them",
        benefits: [
          "We find extra canals invisible to the naked eye",
          "Root canals done right the first time, no flare-ups later",
          "Restorations accurate to a fraction of a millimetre",
        ],
      },
    },
  },
  {
    id: "cadcam",
    image: "tech-cadcam",
    services: ["prosthetics", "veneers", "implants", "all-on-4"],
    text: {
      uk: {
        name: "Фрезерний центр CAD/CAM",
        model: "Dentsply Sirona CEREC Primemill",
        title: "Коронка за один візит",
        benefits: [
          "Керамічну коронку чи вкладку виготовляємо в клініці за 1–2 години",
          "Без тимчасових коронок і другого візиту",
          "Точна посадка завдяки цифровому моделюванню",
        ],
      },
      en: {
        name: "CAD/CAM milling centre",
        model: "Dentsply Sirona CEREC Primemill",
        title: "A crown in a single visit",
        benefits: [
          "Ceramic crowns and inlays milled in-house in 1–2 hours",
          "No temporary crown and no second appointment",
          "Precise fit thanks to digital design",
        ],
      },
    },
  },
  {
    id: "laser",
    image: "tech-laser",
    services: ["whitening", "surgery", "kids", "caries"],
    text: {
      uk: {
        name: "Діодний лазер",
        model: "Biolase Epic X",
        title: "М'яко до ясен, швидке загоєння",
        benefits: [
          "Корекція ясен і малі операції без скальпеля та швів",
          "Менше кровотечі й швидше загоєння",
          "Знижує чутливість зубів після відбілювання",
        ],
      },
      en: {
        name: "Diode laser",
        model: "Biolase Epic X",
        title: "Gentle on gums, fast healing",
        benefits: [
          "Gum contouring and minor surgery without a scalpel or stitches",
          "Less bleeding and faster healing",
          "Reduces sensitivity after whitening",
        ],
      },
    },
  },
  {
    id: "sedation",
    image: "tech-sedation",
    services: ["sedation", "all-on-4", "kids", "surgery"],
    text: {
      uk: {
        name: "Седація під контролем анестезіолога",
        model: "Моніторинг Mindray",
        title: "Лікування уві сні — безпечно й спокійно",
        benefits: [
          "Анестезіолог поруч увесь час, показники серця й дихання під постійним контролем",
          "Кілька годин роботи минають для вас як 15 хвилин",
          "Можна вилікувати все за 1–2 візити замість десяти",
        ],
      },
      en: {
        name: "Anaesthesiologist-led sedation",
        model: "Mindray patient monitoring",
        title: "Treatment while you sleep — safe and calm",
        benefits: [
          "An anaesthesiologist stays with you, heart and breathing monitored continuously",
          "Hours of work feel like 15 minutes",
          "Complete treatment in 1–2 visits instead of ten",
        ],
      },
    },
  },
  {
    id: "sterilization",
    image: "interior-sterilization",
    services: ["implants", "surgery", "hygiene"],
    text: {
      uk: {
        name: "Стерилізація класу B",
        model: "Автоклави Melag Vacuklav",
        title: "Стерильність, яку можна перевірити",
        benefits: [
          "Кожен інструмент проходить 5 етапів обробки",
          "Крафт-пакети з індикатором відкриваємо при вас",
          "Одноразові наконечники, рукавички, серветки та захисні плівки",
        ],
      },
      en: {
        name: "Class B sterilisation",
        model: "Melag Vacuklav autoclaves",
        title: "Sterility you can verify",
        benefits: [
          "Every instrument goes through 5 processing stages",
          "Sealed pouches with indicators are opened in front of you",
          "Single-use tips, gloves, bibs and barrier films",
        ],
      },
    },
  },
];

export interface Technology extends Omit<TechBase, "text"> {
  text: TechText;
}

export function getTechnologies(locale: Locale): Technology[] {
  return base.map((t) => ({ ...t, text: deepTypo(t.text[locale], locale) }));
}
