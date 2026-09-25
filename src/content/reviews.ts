import type { Locale } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { DoctorId, ServiceId } from "./types";

/**
 * DEMO reviews that show the layout. Replace with real Google reviews (quote them
 * verbatim, keep the author's first name and the link) before launch.
 */
export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  service: ServiceId;
  doctor?: DoctorId;
  text: string;
  source: "Google";
  sourceUrl: string;
  lang: Locale;
}

const G = "https://www.google.com/maps/search/?api=1&query=NaDent+Lviv";

const uk: Omit<Review, "source" | "sourceUrl" | "lang">[] = [
  { id: "r1", author: "Олег", date: "2026-08-12", rating: 5, service: "implants", doctor: "andrii-solovii", text: "Дуже боявся імплантації, відкладав два роки. Андрій Ігорович показав усе на 3D-знімку, назвав точну ціну і дотримався її до гривні. Сама операція — 40 хвилин, нічого не відчував. Через тиждень уже жував." },
  { id: "r2", author: "Анна", date: "2026-07-29", rating: 5, service: "veneers", doctor: "olena-kovalchuk", text: "Робила вініри в Олени. Найбільше сподобалося, що перед початком я «приміряла» нову усмішку й могла щось змінити. Результат природний — подруги питають, чи я просто добре виспалась 😊" },
  { id: "r3", author: "Ірина", date: "2026-07-15", rating: 5, service: "kids", doctor: "iryna-savchuk", text: "Донька після іншої клініки плакала від слова «стоматолог». Тут перший візит був просто знайомством, а на другому вона сама відкрила рот і дала вилікувати зуб. Дякуємо за терпіння!" },
  { id: "r4", author: "Максим", date: "2026-06-30", rating: 5, service: "emergency", doctor: "taras-boiko", text: "Заболів зуб у неділю ввечері. Залишив заявку на сайті, о 8:05 мені вже перетелефонували й прийняли о 9:00. Біль зняли за один візит, пояснили план лікування без нав'язування." },
  { id: "r5", author: "Світлана", date: "2026-06-18", rating: 5, service: "sedation", doctor: "roman-levytskyi", text: "8 років не могла змусити себе піти до стоматолога. Лікувалася уві сні: заснула, прокинулась — і п'ять зубів вилікувані. Ніхто не дорікнув, що я «запустила». Нарешті не соромлюся усміхатися." },
  { id: "r6", author: "Андрій", date: "2026-05-27", rating: 5, service: "endodontics", doctor: "taras-boiko", text: "Мені в іншому місці сказали видаляти зуб. Тарас під мікроскопом дістав уламок інструмента з каналу і зуб зберіг. Рік потому — все добре." },
  { id: "r7", author: "Галина", date: "2026-05-09", rating: 5, service: "all-on-4", doctor: "ostap-klymko", text: "Після знімного протеза — ніби нове життя. Зуби поставили за два дні, їм яблука й горіхи. Дуже уважний персонал, усе пояснювали." },
  { id: "r8", author: "Марія", date: "2026-04-22", rating: 5, service: "hygiene", doctor: "yuliia-panchyshyn", text: "Найприємніша чистка в моєму житті. Юлія працює дуже делікатно, ясна не кровили, а ще отримала персональні рекомендації щодо догляду." },
  { id: "r9", author: "Тарас", date: "2026-04-03", rating: 4, service: "aligners", doctor: "marta-hnatyshyn", text: "Лікуюся елайнерами пів року, результат уже видно. Мінус один — довелося раз почекати 15 хвилин на прийом. Але лікарка все компенсувала уважністю." },
];

const en: Omit<Review, "source" | "sourceUrl" | "lang">[] = [
  { id: "r1", author: "Oleh", date: "2026-08-12", rating: 5, service: "implants", doctor: "andrii-solovii", text: "I was scared of implants and put it off for two years. Dr Solovii showed me everything on the 3D scan, gave an exact price and stuck to it. The surgery took 40 minutes and I felt nothing. A week later I was chewing normally." },
  { id: "r2", author: "Anna", date: "2026-07-29", rating: 5, service: "veneers", doctor: "olena-kovalchuk", text: "I had veneers done by Olena. What I loved most was “trying on” my new smile before we started and being able to tweak it. The result is so natural — friends just ask if I've been sleeping well 😊" },
  { id: "r3", author: "Iryna", date: "2026-07-15", rating: 5, service: "kids", doctor: "iryna-savchuk", text: "After another clinic my daughter cried at the word “dentist”. Here the first visit was just getting to know each other, and on the second she opened her mouth by herself. Thank you for the patience!" },
  { id: "r4", author: "Maksym", date: "2026-06-30", rating: 5, service: "emergency", doctor: "taras-boiko", text: "Toothache on a Sunday night. I sent a request on the website, got a call at 8:05 and was seen at 9:00. The pain was gone after one visit and the treatment plan was explained without any pressure." },
  { id: "r5", author: "Svitlana", date: "2026-06-18", rating: 5, service: "sedation", doctor: "roman-levytskyi", text: "I couldn't make myself see a dentist for 8 years. I had treatment under sedation: fell asleep, woke up — five teeth done. Nobody judged me. I'm finally not ashamed to smile." },
  { id: "r6", author: "Andrii", date: "2026-05-27", rating: 5, service: "endodontics", doctor: "taras-boiko", text: "Another clinic told me to extract the tooth. Taras removed a broken instrument from the canal under the microscope and saved it. A year later — all good." },
  { id: "r7", author: "Halyna", date: "2026-05-09", rating: 5, service: "all-on-4", doctor: "ostap-klymko", text: "After a removable denture it feels like a new life. Fixed teeth in two days, and I eat apples and nuts. Very caring staff who explained everything." },
  { id: "r8", author: "Mariia", date: "2026-04-22", rating: 5, service: "hygiene", doctor: "yuliia-panchyshyn", text: "The most pleasant clean of my life. Yuliia is incredibly gentle, my gums didn't bleed, and I got a personal home-care plan." },
  { id: "r9", author: "Taras", date: "2026-04-03", rating: 4, service: "aligners", doctor: "marta-hnatyshyn", text: "Six months into aligners and I can already see the result. One minus — I once had to wait 15 minutes. The doctor made up for it with her attention." },
];

export function getReviews(locale: Locale): Review[] {
  const list = locale === "uk" ? uk : en;
  return deepTypo(list.map((r) => ({ ...r, source: "Google" as const, sourceUrl: G, lang: locale })), locale);
}
