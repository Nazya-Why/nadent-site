import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { ImageId } from "./image-registry";
import type { DoctorId, ServiceId } from "./types";

/**
 * Before/after cases. Photos MUST be real (with written consent) — see IMAGE_PROMPTS.md.
 * The stories below are DEMO descriptions to show the layout.
 */

interface CaseText {
  title: string;
  task: string;
  solution: string;
  result: string;
  duration: string;
  visits: string;
  patient: string;
}

interface CaseBase {
  id: string;
  service: ServiceId;
  doctor: DoctorId;
  text: Localized<CaseText>;
}

const base: CaseBase[] = [
  {
    id: "implant-molar",
    service: "implants",
    doctor: "andrii-solovii",
    text: {
      uk: {
        title: "Новий жувальний зуб без шліфування сусідніх",
        patient: "Олег, 57 років",
        task: "Три роки тому видалили нижній моляр. Жувати на цьому боці було незручно, сусідні зуби почали нахилятися в порожнину.",
        solution: "КТ і 3D-план, імплант Straumann за навігаційним шаблоном, через 3 місяці — коронка з цирконію, виготовлена за один день.",
        result: "Повноцінне жування, сусідні зуби цілі. Операція тривала 35 хвилин під місцевою анестезією.",
        duration: "3,5 місяця",
        visits: "4 візити",
      },
      en: {
        title: "A new molar without grinding the neighbours",
        patient: "Oleh, 57",
        task: "A lower molar had been extracted three years earlier. Chewing on that side was uncomfortable and the neighbouring teeth had started to tilt into the gap.",
        solution: "CBCT and a 3D plan, a Straumann implant placed with a surgical guide, and three months later a zirconia crown made in a single day.",
        result: "Full chewing function with healthy neighbouring teeth. Surgery took 35 minutes under local anaesthesia.",
        duration: "3.5 months",
        visits: "4 visits",
      },
    },
  },
  {
    id: "all-on-4-upper",
    service: "all-on-4",
    doctor: "ostap-klymko",
    text: {
      uk: {
        title: "Нерухомі зуби на верхній щелепі за 2 дні",
        patient: "Галина, 64 роки",
        task: "Знімний протез постійно рухався й натирав, жінка уникала їсти на людях і перестала усміхатися на фото.",
        solution: "All-on-4 на імплантах Nobel Biocare під седацією. Тимчасовий незнімний протез наступного дня, постійний на титановому каркасі — через 4 місяці.",
        result: "Нерухомі зуби, природна усмішка і тверда їжа без побоювань.",
        duration: "4 місяці",
        visits: "5 візитів",
      },
      en: {
        title: "Fixed upper teeth in 2 days",
        patient: "Halyna, 64",
        task: "Her removable denture kept moving and rubbing; she avoided eating in public and stopped smiling in photos.",
        solution: "All-on-4 on Nobel Biocare implants under sedation. A fixed temporary bridge the next day and a final titanium-framed bridge four months later.",
        result: "Fixed teeth, a natural smile and solid food without worry.",
        duration: "4 months",
        visits: "5 visits",
      },
    },
  },
  {
    id: "veneers-8",
    service: "veneers",
    doctor: "olena-kovalchuk",
    text: {
      uk: {
        title: "8 керамічних вінірів у природному відтінку",
        patient: "Анна, 31 рік",
        task: "Старі пломби різного кольору на передніх зубах, стерті краї, асиметрія усмішки.",
        solution: "Цифровий дизайн усмішки й примірка mock-up. Мінімальне препарування, 8 вінірів E.max.",
        result: "Природна симетрична усмішка. Відтінок підібрано під колір очей і шкіри, а не «білий як папір».",
        duration: "2 тижні",
        visits: "3 візити",
      },
      en: {
        title: "Eight ceramic veneers in a natural shade",
        patient: "Anna, 31",
        task: "Old mismatched fillings on the front teeth, worn edges and an asymmetric smile.",
        solution: "Digital smile design and a mock-up try-in. Minimal preparation and eight E.max veneers.",
        result: "A natural, symmetrical smile. The shade was matched to her eyes and skin — not “paper white”.",
        duration: "2 weeks",
        visits: "3 visits",
      },
    },
  },
  {
    id: "aligners-crowding",
    service: "aligners",
    doctor: "marta-hnatyshyn",
    text: {
      uk: {
        title: "Рівні зуби без брекетів",
        patient: "Максим, 28 років",
        task: "Скупченість нижніх зубів, важко чистити, соромився усміхатися на відеодзвінках.",
        solution: "3D-симуляція руху зубів і 22 пари прозорих елайнерів, контроль раз на 6 тижнів.",
        result: "Рівний зубний ряд за 11 місяців, і ніхто з колег не помітив лікування.",
        duration: "11 місяців",
        visits: "8 візитів",
      },
      en: {
        title: "Straight teeth without braces",
        patient: "Maksym, 28",
        task: "Crowded lower teeth that were hard to clean; he was self-conscious on video calls.",
        solution: "3D movement simulation, 22 pairs of clear aligners and a check-up every six weeks.",
        result: "A straight arch in 11 months — and none of his colleagues noticed the treatment.",
        duration: "11 months",
        visits: "8 visits",
      },
    },
  },
  {
    id: "whitening-bright",
    service: "whitening",
    doctor: "yuliia-panchyshyn",
    text: {
      uk: {
        title: "На 6 тонів світліше за один візит",
        patient: "Ірина, 36 років",
        task: "Пігментація від кави й чаю, тьмяний колір зубів перед весіллям.",
        solution: "Професійна гігієна, потім офісне відбілювання Philips Zoom з захистом ясен.",
        result: "Зуби на 6 тонів світліші без чутливості. Рекомендації, як зберегти результат.",
        duration: "1 день",
        visits: "1 візит",
      },
      en: {
        title: "Six shades lighter in one visit",
        patient: "Iryna, 36",
        task: "Coffee and tea stains and dull teeth ahead of her wedding.",
        solution: "Professional hygiene followed by in-office Philips Zoom whitening with gum protection.",
        result: "Teeth six shades lighter with no sensitivity, plus a plan to keep the result.",
        duration: "1 day",
        visits: "1 visit",
      },
    },
  },
  {
    id: "endo-saved-tooth",
    service: "endodontics",
    doctor: "taras-boiko",
    text: {
      uk: {
        title: "Зуб, який пропонували видалити",
        patient: "Андрій, 38 років",
        task: "В іншій клініці сказали, що зуб «тільки видаляти»: запалення біля кореня і зламаний інструмент у каналі.",
        solution: "Під мікроскопом дістали уламок, повторно пролікували три канали, відновили зуб керамічною вкладкою.",
        result: "Зуб збережено. Контрольний знімок через рік показав повне загоєння кістки.",
        duration: "2 тижні",
        visits: "3 візити",
      },
      en: {
        title: "The tooth they said had to go",
        patient: "Andrii, 38",
        task: "Another clinic said the tooth could only be extracted: infection at the root tip and a broken instrument in the canal.",
        solution: "Under the microscope we removed the fragment, retreated three canals and restored the tooth with a ceramic inlay.",
        result: "The tooth was saved. A follow-up X-ray a year later showed complete bone healing.",
        duration: "2 weeks",
        visits: "3 visits",
      },
    },
  },
];

export interface Case extends Omit<CaseBase, "text"> {
  slug: string;
  before: ImageId;
  after: ImageId;
  text: CaseText;
}

export function getCases(locale: Locale): Case[] {
  return base.map((c) => ({
    ...c,
    slug: c.id,
    before: `case-${c.id}-before` as ImageId,
    after: `case-${c.id}-after` as ImageId,
    text: deepTypo(c.text[locale], locale),
  }));
}
