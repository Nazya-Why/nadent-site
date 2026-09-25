import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { ServiceId } from "./types";

/** DEMO price list (UAH, Lviv 2026). Edit here — every page reads from this file. */
export const PRICES_UPDATED = "2026-09-01";

interface RawItem {
  id: string;
  name: Localized<string>;
  price: number;
  /** Upper bound for ranges */
  to?: number;
  /** Shown as "від" */
  from?: boolean;
  unit?: Localized<string>;
  note?: Localized<string>;
  popular?: boolean;
}

interface RawCategory {
  id: string;
  name: Localized<string>;
  service?: ServiceId;
  items: RawItem[];
}

const L = (uk: string, en: string): Localized<string> => ({ uk, en });
const perTooth = L("за зуб", "per tooth");
const perArch = L("за щелепу", "per arch");
const perCanal = L("за канал", "per canal");

const raw: RawCategory[] = [
  {
    id: "diagnostics",
    name: L("Діагностика і консультації", "Diagnostics & consultations"),
    items: [
      { id: "consult", name: L("Консультація лікаря зі складанням плану лікування", "Consultation with a treatment plan"), price: 500, note: L("враховується у вартість лікування", "credited towards treatment"), popular: true },
      { id: "consult-implant", name: L("Консультація імплантолога з КТ", "Implant consultation with CBCT"), price: 900 },
      { id: "ct-one", name: L("КТ однієї щелепи", "CBCT, one jaw"), price: 900 },
      { id: "ct-both", name: L("КТ обох щелеп", "CBCT, both jaws"), price: 1400 },
      { id: "xray", name: L("Прицільний знімок", "Periapical X-ray"), price: 250 },
      { id: "scan", name: L("3D-сканування та цифрова модель", "3D intraoral scan and digital model"), price: 1200 },
      { id: "dsd", name: L("Цифровий дизайн усмішки (DSD)", "Digital smile design (DSD)"), price: 3500 },
    ],
  },
  {
    id: "hygiene",
    name: L("Гігієна і профілактика", "Hygiene & prevention"),
    service: "hygiene",
    items: [
      { id: "hyg", name: L("Професійна гігієна: ультразвук + Air Flow + полірування", "Professional hygiene: ultrasonic + Air Flow + polishing"), price: 2200, popular: true },
      { id: "hyg-plus", name: L("Гігієна + фторування + рекомендації з домашнього догляду", "Hygiene + fluoride + home-care plan"), price: 2600 },
      { id: "hyg-kids", name: L("Дитяча професійна гігієна", "Children's professional hygiene"), price: 1200 },
      { id: "hyg-braces", name: L("Гігієна при брекетах або елайнерах", "Hygiene with braces or aligners"), price: 1800 },
      { id: "perio", name: L("Лікування ясен (1 сегмент)", "Gum treatment (1 segment)"), price: 1500 },
    ],
  },
  {
    id: "whitening",
    name: L("Відбілювання", "Whitening"),
    service: "whitening",
    items: [
      { id: "zoom", name: L("Офісне відбілювання Philips Zoom (1,5 години)", "In-office Philips Zoom whitening (1.5 hours)"), price: 9500, popular: true },
      { id: "home-white", name: L("Домашнє відбілювання: індивідуальні капи + гель", "Take-home whitening: custom trays + gel"), price: 6500 },
      { id: "internal-white", name: L("Внутрішнє відбілювання одного зуба", "Internal whitening of one tooth"), price: 1800 },
    ],
  },
  {
    id: "caries",
    name: L("Лікування карієсу", "Cavity treatment"),
    service: "caries",
    items: [
      { id: "fill-small", name: L("Пломба при поверхневому карієсі", "Filling, shallow cavity"), price: 2400, popular: true },
      { id: "fill-mid", name: L("Пломба при середньому карієсі", "Filling, medium cavity"), price: 2900 },
      { id: "fill-front", name: L("Естетична реставрація переднього зуба", "Aesthetic restoration of a front tooth"), price: 3800 },
      { id: "anest", name: L("Комп'ютерна анестезія", "Computer-controlled anaesthesia"), price: 450 },
      { id: "dam", name: L("Ізоляція коффердамом", "Rubber dam isolation"), price: 350 },
    ],
  },
  {
    id: "endo",
    name: L("Лікування каналів під мікроскопом", "Microscope root canal treatment"),
    service: "endodontics",
    items: [
      { id: "endo-1", name: L("Однокореневий зуб", "Single-canal tooth"), price: 5500, popular: true },
      { id: "endo-2", name: L("Двокореневий зуб", "Two-canal tooth"), price: 7000 },
      { id: "endo-3", name: L("Трикореневий зуб", "Three-canal tooth"), price: 8900 },
      { id: "endo-re", name: L("Повторне лікування (додатково)", "Retreatment (additional)"), price: 2000, unit: perCanal },
      { id: "endo-frag", name: L("Видалення уламка інструмента з каналу", "Removal of a broken instrument"), price: 3000 },
    ],
  },
  {
    id: "implants",
    name: L("Імплантація", "Dental implants"),
    service: "implants",
    items: [
      { id: "impl-turnkey", name: L("Імплантація під ключ: імплант Osstem + абатмент + коронка з цирконію", "Turnkey implant: Osstem implant + abutment + zirconia crown"), price: 34000, popular: true },
      { id: "impl-osstem", name: L("Імплант Osstem (Південна Корея)", "Osstem implant (South Korea)"), price: 18000 },
      { id: "impl-nobel", name: L("Імплант Nobel Biocare (Швеція)", "Nobel Biocare implant (Sweden)"), price: 26000 },
      { id: "impl-straumann", name: L("Імплант Straumann (Швейцарія)", "Straumann implant (Switzerland)"), price: 28000 },
      { id: "abut", name: L("Абатмент індивідуальний", "Custom abutment"), price: 4500 },
      { id: "guide", name: L("Навігаційний хірургічний шаблон", "Surgical guide"), price: 4500 },
      { id: "sinus-closed", name: L("Закритий синус-ліфтинг", "Closed sinus lift"), price: 9000 },
      { id: "sinus-open", name: L("Відкритий синус-ліфтинг", "Open sinus lift"), price: 16000 },
      { id: "graft", name: L("Кісткова пластика", "Bone grafting"), price: 8000, from: true },
    ],
  },
  {
    id: "all-on-4",
    name: L("All-on-4 / All-on-6", "All-on-4 / All-on-6"),
    service: "all-on-4",
    items: [
      { id: "ao4-osstem", name: L("All-on-4 Osstem з тимчасовим протезом за 1–3 дні", "All-on-4 Osstem with temporary bridge in 1–3 days"), price: 240000, unit: perArch, popular: true },
      { id: "ao6-straumann", name: L("All-on-6 Straumann з тимчасовим протезом", "All-on-6 Straumann with temporary bridge"), price: 360000, unit: perArch },
      { id: "ao-final", name: L("Постійний протез на титановому каркасі (включено в пакети)", "Final bridge on a titanium frame (included in packages)"), price: 0, note: L("включено", "included") },
    ],
  },
  {
    id: "prosthetics",
    name: L("Протезування", "Crowns & prosthetics"),
    service: "prosthetics",
    items: [
      { id: "crown-zr", name: L("Коронка з діоксиду цирконію", "Zirconia crown"), price: 12000, popular: true },
      { id: "crown-emax", name: L("Коронка з кераміки E.max", "E.max ceramic crown"), price: 14000 },
      { id: "crown-impl", name: L("Коронка на імпланті (цирконій)", "Implant crown (zirconia)"), price: 14500 },
      { id: "inlay", name: L("Керамічна вкладка (CEREC, за 1 день)", "Ceramic inlay (CEREC, same day)"), price: 9500 },
      { id: "temp-crown", name: L("Тимчасова коронка", "Temporary crown"), price: 1500 },
      { id: "removable", name: L("Знімний протез", "Removable denture"), price: 18000, from: true },
      { id: "clasp", name: L("Бюгельний протез", "Cast partial denture"), price: 32000, from: true },
    ],
  },
  {
    id: "veneers",
    name: L("Вініри та естетика", "Veneers & aesthetics"),
    service: "veneers",
    items: [
      { id: "ven-comp", name: L("Композитний вінір", "Composite veneer"), price: 6500, unit: perTooth, popular: true },
      { id: "ven-emax", name: L("Керамічний вінір E.max", "E.max ceramic veneer"), price: 16000, unit: perTooth },
      { id: "ven-ultra", name: L("Ультратонкий вінір без препарування", "Ultra-thin no-prep veneer"), price: 19000, unit: perTooth },
      { id: "mockup", name: L("Примірка майбутньої усмішки (mock-up)", "Smile try-in (mock-up)"), price: 4000 },
    ],
  },
  {
    id: "ortho",
    name: L("Ортодонтія", "Orthodontics"),
    service: "aligners",
    items: [
      { id: "ortho-consult", name: L("Консультація ортодонта з 3D-скануванням", "Orthodontic consultation with 3D scan"), price: 700 },
      { id: "aligners-light", name: L("Елайнери: легкий випадок (до 20 кап)", "Aligners: mild case (up to 20 trays)"), price: 65000, popular: true },
      { id: "aligners-full", name: L("Елайнери: комплексний випадок", "Aligners: comprehensive case"), price: 120000, from: true },
      { id: "braces-metal", name: L("Брекети металеві", "Metal braces"), price: 36000, unit: perArch },
      { id: "braces-ceramic", name: L("Брекети керамічні", "Ceramic braces"), price: 48000, unit: perArch },
      { id: "braces-self", name: L("Самолігуючі брекети", "Self-ligating braces"), price: 52000, unit: perArch },
      { id: "retainer", name: L("Ретейнер", "Retainer"), price: 3500, unit: perArch },
    ],
  },
  {
    id: "surgery",
    name: L("Хірургія", "Oral surgery"),
    service: "surgery",
    items: [
      { id: "ext-simple", name: L("Видалення зуба (просте)", "Simple extraction"), price: 1500 },
      { id: "ext-complex", name: L("Видалення зуба (складне)", "Surgical extraction"), price: 2800 },
      { id: "ext-wisdom", name: L("Видалення зуба мудрості", "Wisdom tooth removal"), price: 3500, popular: true },
      { id: "ext-impacted", name: L("Видалення ретинованого зуба мудрості", "Impacted wisdom tooth removal"), price: 5500 },
      { id: "apex", name: L("Резекція верхівки кореня", "Apicoectomy"), price: 6000 },
    ],
  },
  {
    id: "kids",
    name: L("Дитяча стоматологія", "Kids' dentistry"),
    service: "kids",
    items: [
      { id: "kids-adapt", name: L("Адаптаційний візит (знайомство)", "Adaptation visit (getting acquainted)"), price: 900, popular: true },
      { id: "kids-fill", name: L("Лікування молочного зуба", "Primary tooth filling"), price: 1800 },
      { id: "kids-seal", name: L("Герметизація фісур", "Fissure sealant"), price: 900, unit: perTooth },
      { id: "kids-ext", name: L("Видалення молочного зуба", "Primary tooth extraction"), price: 900 },
    ],
  },
  {
    id: "sedation",
    name: L("Седація (лікування уві сні)", "Sedation"),
    service: "sedation",
    items: [
      { id: "sed-consult", name: L("Консультація анестезіолога", "Anaesthesiologist consultation"), price: 700 },
      { id: "sed-first", name: L("Медикаментозна седація, перша година", "IV sedation, first hour"), price: 6500, popular: true },
      { id: "sed-next", name: L("Кожна наступна година", "Each additional hour"), price: 3500 },
    ],
  },
  {
    id: "emergency",
    name: L("Невідкладна допомога", "Emergency care"),
    service: "emergency",
    items: [
      { id: "emerg", name: L("Невідкладний прийом зі зняттям болю", "Emergency visit with pain relief"), price: 900, popular: true },
      { id: "emerg-sun", name: L("Невідкладний прийом у неділю", "Emergency visit on Sunday"), price: 1200 },
    ],
  },
];

export interface PriceItem {
  id: string;
  name: string;
  price: number;
  to?: number;
  from?: boolean;
  unit?: string;
  note?: string;
  popular?: boolean;
}

export interface PriceCategory {
  id: string;
  name: string;
  service?: ServiceId;
  items: PriceItem[];
}

const cache = new Map<Locale, PriceCategory[]>();

export function getPriceList(locale: Locale): PriceCategory[] {
  let list = cache.get(locale);
  if (!list) {
    list = raw.map((c) => ({
      id: c.id,
      name: c.name[locale],
      service: c.service,
      items: c.items.map((i) => ({
        id: i.id,
        name: i.name[locale],
        price: i.price,
        to: i.to,
        from: i.from,
        unit: i.unit?.[locale],
        note: i.note?.[locale],
        popular: i.popular,
      })),
    }));
    list = deepTypo(list, locale);
    cache.set(locale, list);
  }
  return list;
}

/** Hand-picked "popular" prices for the home page. */
export function getPopularPrices(locale: Locale, ids = ["impl-turnkey", "ven-comp", "aligners-light", "zoom", "hyg", "endo-1"]) {
  const all = getPriceList(locale).flatMap((c) => c.items.map((i) => ({ ...i, category: c })));
  return ids.map((id) => all.find((x) => x.id === id)!).filter(Boolean);
}
