import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { ImageId } from "./image-registry";
import type { DoctorId, ServiceId } from "./types";

/** DEMO team. Names, biographies and credentials are fictional. */

export type DoctorGroup = "implant" | "aesthetic" | "ortho" | "therapy" | "surgery" | "kids" | "anesthesia" | "hygiene";

interface DoctorText {
  name: string;
  role: string;
  short: string;
  quote: string;
  bio: string[];
  education: { year: string; title: string }[];
  courses: string[];
  languages: string[];
}

interface DoctorBase {
  id: DoctorId;
  since: number;
  groups: DoctorGroup[];
  services: ServiceId[];
  /** Headline number for the card: implants placed, cases, etc. */
  metric?: { value: number; label: Localized<string> };
  text: Localized<DoctorText>;
}

const base: DoctorBase[] = [
  {
    id: "andrii-solovii",
    since: 2008,
    groups: ["implant", "surgery"],
    services: ["implants", "all-on-4", "surgery"],
    metric: { value: 2600, label: { uk: "встановлених імплантів", en: "implants placed" } },
    text: {
      uk: {
        name: "Андрій Соловій",
        role: "Головний лікар, хірург-імплантолог",
        short: "Імплантація, All-on-4, кісткова пластика",
        quote: "Хороша імплантація починається не з операції, а з точного плану. Коли план ідеальний, сама операція триває менше години.",
        bio: [
          "Андрій заснував NaDent у 2014 році з простою ідеєю: пацієнт має розуміти кожен крок свого лікування й знати його вартість ще до початку.",
          "Спеціалізується на складних випадках імплантації: при нестачі кістки, повній втраті зубів, одномоментній імплантації після видалення. Кожну операцію планує в 3D і проводить за навігаційним шаблоном.",
        ],
        education: [
          { year: "2008", title: "Львівський національний медичний університет імені Данила Галицького, стоматологічний факультет" },
          { year: "2010", title: "Інтернатура та клінічна ординатура з хірургічної стоматології" },
          { year: "2016", title: "ITI Education Week, Берн (Швейцарія)" },
        ],
        courses: ["Straumann Guided Surgery", "Nobel Biocare All-on-4® Treatment Concept", "Синус-ліфтинг і кісткова пластика, Бухарест", "Член ITI (International Team for Implantology)"],
        languages: ["українська", "англійська", "польська"],
      },
      en: {
        name: "Dr Andrii Solovii",
        role: "Medical director, implant surgeon",
        short: "Implants, All-on-4, bone grafting",
        quote: "Good implant work starts with a precise plan, not with surgery. When the plan is right, the procedure takes under an hour.",
        bio: [
          "Andrii founded NaDent in 2014 with a simple idea: patients should understand every step of their treatment and know the cost before it begins.",
          "He focuses on complex implant cases — limited bone, full tooth loss, immediate implants after extraction. Every surgery is planned in 3D and performed with a surgical guide.",
        ],
        education: [
          { year: "2008", title: "Danylo Halytsky Lviv National Medical University, Faculty of Dentistry" },
          { year: "2010", title: "Residency in oral surgery" },
          { year: "2016", title: "ITI Education Week, Bern (Switzerland)" },
        ],
        courses: ["Straumann Guided Surgery", "Nobel Biocare All-on-4® Treatment Concept", "Sinus lift and bone grafting, Bucharest", "ITI member (International Team for Implantology)"],
        languages: ["Ukrainian", "English", "Polish"],
      },
    },
  },
  {
    id: "olena-kovalchuk",
    since: 2012,
    groups: ["aesthetic", "therapy"],
    services: ["veneers", "whitening", "caries"],
    metric: { value: 1400, label: { uk: "вінірів і реставрацій", en: "veneers and restorations" } },
    text: {
      uk: {
        name: "Олена Ковальчук",
        role: "Лікарка-стоматологиня, естетична реставрація",
        short: "Вініри, цифровий дизайн усмішки, реставрації",
        quote: "Найкращий комплімент для моєї роботи — коли ніхто не здогадується, що зуби не «рідні».",
        bio: [
          "Олена відповідає в NaDent за естетичні зміни усмішки: від однієї непомітної реставрації до повного набору вінірів.",
          "Працює за протоколом цифрового дизайну усмішки: пацієнт бачить майбутній результат на екрані та в роті (mock-up) ще до того, як ми торкнемося зубів.",
        ],
        education: [
          { year: "2012", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2017", title: "Digital Smile Design Master Course, Мадрид" },
        ],
        courses: ["Style Italiano: Anterior Composite", "Мінімально інвазивні керамічні вініри, Варшава", "Сертифікат IPS e.max"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Dr Olena Kovalchuk",
        role: "Cosmetic dentist",
        short: "Veneers, digital smile design, restorations",
        quote: "The best compliment for my work is when nobody can tell the teeth aren't your own.",
        bio: [
          "Olena leads smile makeovers at NaDent — from a single invisible restoration to a full set of veneers.",
          "She works with a digital smile design protocol: you see the future result on screen and as a mock-up in your mouth before we touch a single tooth.",
        ],
        education: [
          { year: "2012", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2017", title: "Digital Smile Design Master Course, Madrid" },
        ],
        courses: ["Style Italiano: Anterior Composite", "Minimally invasive ceramic veneers, Warsaw", "IPS e.max certification"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
  {
    id: "marta-hnatyshyn",
    since: 2015,
    groups: ["ortho"],
    services: ["aligners", "braces"],
    metric: { value: 900, label: { uk: "завершених ортодонтичних випадків", en: "completed orthodontic cases" } },
    text: {
      uk: {
        name: "Марта Гнатишин",
        role: "Лікарка-ортодонтка",
        short: "Елайнери, брекети, дитяча ортодонтія",
        quote: "Я показую пацієнтові весь шлях його зубів ще до першої капи. Так легше дочекатися результату.",
        bio: [
          "Марта вирівнює зуби дорослим і дітям. Понад половину її пацієнтів лікуються прозорими елайнерами, які майже непомітні на роботі та на фото.",
          "Кожне лікування починає з 3D-скану й цифрової симуляції: ви бачите, як зуби рухатимуться тиждень за тижнем.",
        ],
        education: [
          { year: "2015", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2018", title: "Клінічна ординатура з ортодонтії" },
        ],
        courses: ["Invisalign Certified Provider", "Damon System Mastery", "Раннє ортодонтичне лікування дітей"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Dr Marta Hnatyshyn",
        role: "Orthodontist",
        short: "Aligners, braces, children's orthodontics",
        quote: "I show patients the whole journey of their teeth before the first aligner. It makes waiting for the result much easier.",
        bio: [
          "Marta straightens teeth for adults and children. More than half of her patients use clear aligners that are almost invisible at work and in photos.",
          "Every treatment starts with a 3D scan and a digital simulation: you see how your teeth will move week by week.",
        ],
        education: [
          { year: "2015", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2018", title: "Residency in orthodontics" },
        ],
        courses: ["Invisalign Certified Provider", "Damon System Mastery", "Early orthodontic treatment for children"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
  {
    id: "taras-boiko",
    since: 2013,
    groups: ["therapy"],
    services: ["endodontics", "caries", "emergency"],
    metric: { value: 3100, label: { uk: "вилікуваних каналів", en: "root canals treated" } },
    text: {
      uk: {
        name: "Тарас Бойко",
        role: "Лікар-ендодонтист",
        short: "Лікування каналів під мікроскопом, повторне лікування",
        quote: "Свій зуб завжди кращий за будь-який імплант. Тому я борюся за кожен.",
        bio: [
          "Тарас лікує канали виключно під мікроскопом. До нього часто приходять із висновком «тільки видаляти» — і значну частину таких зубів вдається зберегти.",
          "Також чергує в неділю: якщо у вас гострий біль, найімовірніше, вас прийме саме він.",
        ],
        education: [
          { year: "2013", title: "Івано-Франківський національний медичний університет" },
          { year: "2019", title: "Курс ендодонтії під мікроскопом, Прага" },
        ],
        courses: ["Повторне ендодонтичне лікування", "Інструменти Reciproc та WaveOne", "Член Української асоціації ендодонтистів"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Dr Taras Boiko",
        role: "Endodontist",
        short: "Microscope root canal treatment and retreatment",
        quote: "Your own tooth is always better than any implant. That's why I fight for every one.",
        bio: [
          "Taras treats root canals exclusively under a microscope. Patients often come to him told “it can only be extracted” — and many of those teeth can be saved.",
          "He is also the Sunday duty dentist: if you're in acute pain, he is most likely the one who will see you.",
        ],
        education: [
          { year: "2013", title: "Ivano-Frankivsk National Medical University" },
          { year: "2019", title: "Microscope endodontics course, Prague" },
        ],
        courses: ["Endodontic retreatment", "Reciproc and WaveOne systems", "Member of the Ukrainian Endodontic Association"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
  {
    id: "iryna-savchuk",
    since: 2016,
    groups: ["kids"],
    services: ["kids"],
    text: {
      uk: {
        name: "Ірина Савчук",
        role: "Дитяча лікарка-стоматологиня",
        short: "Лікування дітей від 2 років, адаптаційні візити",
        quote: "Перший візит — це знайомство. Якщо дитина пішла від нас усміхненою, решта обов'язково вийде.",
        bio: [
          "Ірина лікує дітей від двох років. Спершу — знайомство й гра з інструментами, і лише потім, коли дитина готова, лікування.",
          "Батьки можуть бути поруч у кабінеті весь час. Якщо дитині дуже страшно або зубів багато, пропонуємо лікування уві сні разом з анестезіологом.",
        ],
        education: [
          { year: "2016", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2018", title: "Клінічна ординатура з дитячої стоматології" },
        ],
        courses: ["Поведінкова психологія в дитячій стоматології", "Лікування молочних зубів: сучасні протоколи", "Член EAPD (European Academy of Paediatric Dentistry)"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Dr Iryna Savchuk",
        role: "Paediatric dentist",
        short: "Children from age 2, adaptation visits",
        quote: "The first visit is about getting to know each other. If a child leaves smiling, everything else will follow.",
        bio: [
          "Iryna treats children from the age of two. First comes getting acquainted and playing with the instruments — treatment only starts when the child is ready.",
          "Parents can stay in the room the whole time. If a child is very anxious or needs a lot of work, we offer treatment under sedation with an anaesthesiologist.",
        ],
        education: [
          { year: "2016", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2018", title: "Residency in paediatric dentistry" },
        ],
        courses: ["Behaviour management in paediatric dentistry", "Modern protocols for primary teeth", "EAPD member (European Academy of Paediatric Dentistry)"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
  {
    id: "ostap-klymko",
    since: 2006,
    groups: ["implant", "aesthetic"],
    services: ["prosthetics", "all-on-4", "implants", "veneers"],
    metric: { value: 5200, label: { uk: "коронок і конструкцій", en: "crowns and prostheses" } },
    text: {
      uk: {
        name: "Остап Климко",
        role: "Лікар-ортопед",
        short: "Коронки, протезування на імплантах, All-on-4",
        quote: "Коронка має бути такою, щоб через десять років ви забули, який саме зуб лікували.",
        bio: [
          "Остап — ортопед із двадцятирічним досвідом. Відповідає за все, що ставиться на імпланти й зуби: коронки, мости, повні конструкції All-on-4.",
          "Працює в тандемі з цифровою лабораторією: більшість коронок виготовляємо в клініці за один день.",
        ],
        education: [
          { year: "2006", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2009", title: "Клінічна ординатура з ортопедичної стоматології" },
        ],
        courses: ["CEREC Masterclass", "Протезування на імплантах: повна адентія", "Функціональна оклюзія, Відень"],
        languages: ["українська", "англійська", "німецька"],
      },
      en: {
        name: "Dr Ostap Klymko",
        role: "Prosthodontist",
        short: "Crowns, implant prosthetics, All-on-4",
        quote: "A crown should be so good that ten years later you forget which tooth was treated.",
        bio: [
          "Ostap is a prosthodontist with twenty years of experience. He is responsible for everything that goes on implants and teeth: crowns, bridges and full All-on-4 restorations.",
          "He works hand in hand with our digital lab: most crowns are made in-house in a single day.",
        ],
        education: [
          { year: "2006", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2009", title: "Residency in prosthodontics" },
        ],
        courses: ["CEREC Masterclass", "Implant prosthetics for fully edentulous patients", "Functional occlusion, Vienna"],
        languages: ["Ukrainian", "English", "German"],
      },
    },
  },
  {
    id: "sofiia-dmytruk",
    since: 2019,
    groups: ["therapy"],
    services: ["caries", "emergency", "whitening"],
    text: {
      uk: {
        name: "Софія Дмитрук",
        role: "Лікарка-стоматологиня, терапевтка",
        short: "Лікування карієсу, реставрації, невідкладна допомога",
        quote: "Я завжди пояснюю, що роблю, ще до того, як почати. Коли людина розуміє процес, їй не страшно.",
        bio: [
          "Софія лікує карієс і відновлює зуби композитом так, що пломбу не видно навіть зблизька.",
          "Працює з комп'ютерною анестезією: укол майже не відчувається, а щока не німіє на пів дня.",
        ],
        education: [
          { year: "2019", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2021", title: "Інтернатура з терапевтичної стоматології" },
        ],
        courses: ["Адгезивні реставрації жувальних зубів", "Комп'ютерна анестезія The Wand STA"],
        languages: ["українська", "англійська", "польська"],
      },
      en: {
        name: "Dr Sofiia Dmytruk",
        role: "General dentist",
        short: "Cavity treatment, restorations, emergency care",
        quote: "I always explain what I'm going to do before I start. When you understand the process, it isn't scary.",
        bio: [
          "Sofiia treats cavities and rebuilds teeth with composite so well that you can't see the filling even up close.",
          "She uses computer-controlled anaesthesia: you barely feel the injection, and your cheek doesn't stay numb for half a day.",
        ],
        education: [
          { year: "2019", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2021", title: "Internship in restorative dentistry" },
        ],
        courses: ["Adhesive posterior restorations", "The Wand STA computer-controlled anaesthesia"],
        languages: ["Ukrainian", "English", "Polish"],
      },
    },
  },
  {
    id: "roman-levytskyi",
    since: 2010,
    groups: ["anesthesia"],
    services: ["sedation", "all-on-4", "kids"],
    text: {
      uk: {
        name: "Роман Левицький",
        role: "Лікар-анестезіолог",
        short: "Седація, лікування уві сні для дорослих і дітей",
        quote: "Моя робота — щоб ви заснули спокійно й прокинулися без неприємних спогадів. І щоб усі показники весь час були в нормі.",
        bio: [
          "Роман — анестезіолог-реаніматолог із досвідом роботи в багатопрофільній лікарні. У NaDent відповідає за медикаментозну седацію під час тривалих і складних процедур.",
          "Перед кожною седацією проводить окрему консультацію, збирає анамнез і пояснює, як підготуватися.",
        ],
        education: [
          { year: "2010", title: "Львівський національний медичний університет імені Данила Галицького, медичний факультет" },
          { year: "2013", title: "Спеціалізація з анестезіології та інтенсивної терапії" },
        ],
        courses: ["Седація в амбулаторній стоматології", "Сертифікат ACLS / BLS"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Dr Roman Levytskyi",
        role: "Anaesthesiologist",
        short: "Sedation dentistry for adults and children",
        quote: "My job is to make sure you fall asleep calmly and wake up with no unpleasant memories — with every vital sign in range the whole time.",
        bio: [
          "Roman is an anaesthesiologist and intensive care specialist with a background in a multidisciplinary hospital. At NaDent he provides sedation for long and complex procedures.",
          "Before every sedation he holds a separate consultation, reviews your medical history and explains how to prepare.",
        ],
        education: [
          { year: "2010", title: "Danylo Halytsky Lviv National Medical University, Faculty of Medicine" },
          { year: "2013", title: "Specialisation in anaesthesiology and intensive care" },
        ],
        courses: ["Sedation in outpatient dentistry", "ACLS / BLS certification"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
  {
    id: "yuliia-panchyshyn",
    since: 2020,
    groups: ["hygiene"],
    services: ["hygiene", "whitening"],
    text: {
      uk: {
        name: "Юлія Панчишин",
        role: "Гігієністка, пародонтологиня",
        short: "Професійна гігієна, відбілювання, здоров'я ясен",
        quote: "Гігієна — це не про «почистити». Це про те, щоб наступні двадцять років вам не знадобився хірург.",
        bio: [
          "Юлія проводить професійну гігієну так дбайливо, що на неї записуються навіть ті, хто раніше боявся «чистки».",
          "Також проводить відбілювання й підбирає домашній догляд: щітку, пасту, іригатор — під ваші зуби і ясна.",
        ],
        education: [
          { year: "2020", title: "Львівський національний медичний університет імені Данила Галицького" },
          { year: "2022", title: "Guided Biofilm Therapy (EMS), Swiss Dental Academy" },
        ],
        courses: ["Пародонтологія для практика", "Philips Zoom WhiteSpeed"],
        languages: ["українська", "англійська"],
      },
      en: {
        name: "Yuliia Panchyshyn",
        role: "Dental hygienist, periodontal care",
        short: "Professional hygiene, whitening, gum health",
        quote: "Hygiene isn't just “a clean”. It's what keeps you away from the surgeon for the next twenty years.",
        bio: [
          "Yuliia's hygiene appointments are so gentle that even people who used to dread “a clean” book with her again.",
          "She also performs whitening and recommends home care — brush, toothpaste, water flosser — tailored to your teeth and gums.",
        ],
        education: [
          { year: "2020", title: "Danylo Halytsky Lviv National Medical University" },
          { year: "2022", title: "Guided Biofilm Therapy (EMS), Swiss Dental Academy" },
        ],
        courses: ["Periodontology for practitioners", "Philips Zoom WhiteSpeed"],
        languages: ["Ukrainian", "English"],
      },
    },
  },
];

export interface Doctor extends Omit<DoctorBase, "text" | "metric"> {
  slug: string;
  image: ImageId;
  years: number;
  metric?: { value: number; label: string };
  text: DoctorText;
}

const cache = new Map<Locale, Doctor[]>();

export function getDoctors(locale: Locale): Doctor[] {
  let list = cache.get(locale);
  if (!list) {
    const year = new Date().getFullYear();
    list = base.map((d) => ({
      ...d,
      slug: d.id,
      image: `doctor-${d.id}` as ImageId,
      years: year - d.since,
      metric: d.metric ? { value: d.metric.value, label: d.metric.label[locale] } : undefined,
      text: deepTypo(d.text[locale], locale),
    }));
    cache.set(locale, list);
  }
  return list;
}

export function getDoctor(locale: Locale, id: DoctorId): Doctor {
  const d = getDoctors(locale).find((x) => x.id === id);
  if (!d) throw new Error(`Unknown doctor ${id}`);
  return d;
}

export const doctorGroupLabels: Record<DoctorGroup, Localized<string>> = {
  implant: { uk: "Імплантологи й ортопеди", en: "Implants & prosthetics" },
  aesthetic: { uk: "Естетика", en: "Aesthetics" },
  ortho: { uk: "Ортодонти", en: "Orthodontists" },
  therapy: { uk: "Терапевти", en: "General dentists" },
  surgery: { uk: "Хірурги", en: "Surgeons" },
  kids: { uk: "Дитячі", en: "Kids" },
  anesthesia: { uk: "Анестезіологи", en: "Anaesthesia" },
  hygiene: { uk: "Гігієністи", en: "Hygiene" },
};
