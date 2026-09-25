import type { Locale, Localized } from "@/i18n/config";
import { deepTypo } from "@/lib/typograph";
import type { FaqItem } from "./types";

/** General FAQ (page /faq, home page picks the ones flagged `home`). Service FAQs live with each service. */

interface RawFaq {
  id: string;
  group: FaqGroup;
  home?: boolean;
  q: Localized<string>;
  a: Localized<string>;
}

export type FaqGroup = "price" | "pain" | "implants" | "aesthetics" | "kids" | "guarantee" | "org";

export const faqGroups: Record<FaqGroup, Localized<string>> = {
  price: { uk: "Ціни і оплата", en: "Prices & payment" },
  pain: { uk: "Біль і страх", en: "Pain & anxiety" },
  implants: { uk: "Імплантація", en: "Implants" },
  aesthetics: { uk: "Естетика", en: "Aesthetics" },
  kids: { uk: "Діти", en: "Children" },
  guarantee: { uk: "Гарантії і безпека", en: "Guarantees & safety" },
  org: { uk: "Організаційні питання", en: "Practical questions" },
};

const raw: RawFaq[] = [
  {
    id: "consult-price",
    group: "price",
    home: true,
    q: { uk: "Скільки коштує консультація?", en: "How much is a consultation?" },
    a: {
      uk: "500 грн. Лікар оглядає зуби, за потреби робить знімок і складає план лікування з варіантами та цінами. Якщо ви починаєте лікування в нас, ці 500 грн враховуються в його вартість.",
      en: "UAH 500. The doctor examines your teeth, takes an X-ray if needed and prepares a treatment plan with options and prices. If you go ahead with treatment, the UAH 500 is credited towards it.",
    },
  },
  {
    id: "price-fixed",
    group: "price",
    home: true,
    q: { uk: "Чи може ціна зрости під час лікування?", en: "Can the price go up during treatment?" },
    a: {
      uk: "Ні. Після діагностики ви отримуєте письмовий план лікування з фіксованою вартістю. Якщо в процесі виникне щось непередбачене (наприклад, лікар під мікроскопом знайде додатковий канал), ми спершу пояснимо ситуацію й узгодимо зміну з вами — і тільки тоді продовжимо.",
      en: "No. After diagnostics you receive a written treatment plan with a fixed price. If something unexpected comes up (for example, an extra canal found under the microscope), we explain it and agree any change with you before continuing.",
    },
  },
  {
    id: "installments",
    group: "price",
    home: true,
    q: { uk: "Чи можна оплатити частинами?", en: "Can I pay in instalments?" },
    a: {
      uk: "Так. Розстрочка 0 % до 12 місяців через monobank «Покупка частинами» та ПриватБанк «Оплата частинами» — оформлення за 2 хвилини в клініці. Для тривалого лікування можна також платити поетапно: за кожен етап окремо.",
      en: "Yes. 0% instalments for up to 12 months via monobank and PrivatBank — arranged in two minutes at the clinic. For long treatments you can also pay stage by stage.",
    },
  },
  {
    id: "payment-methods",
    group: "price",
    q: { uk: "Як можна оплатити?", en: "How can I pay?" },
    a: {
      uk: "Готівкою, карткою, Apple Pay чи Google Pay, розстрочкою або переказом на рахунок. Для пацієнтів з-за кордону — карткою будь-якого банку.",
      en: "Cash, card, Apple Pay or Google Pay, instalments or bank transfer. Patients from abroad can pay with a card from any bank.",
    },
  },
  {
    id: "painful",
    group: "pain",
    home: true,
    q: { uk: "Чи буде боляче?", en: "Will it hurt?" },
    a: {
      uk: "Ні. Ми використовуємо сучасну анестезію та комп'ютерну систему її введення — укол майже не відчувається. Під час лікування ви можете підняти руку, і ми одразу зупинимося. Для тих, кому дуже страшно, є лікування уві сні під наглядом анестезіолога.",
      en: "No. We use modern anaesthesia delivered by a computer-controlled system, so you barely feel the injection. Raise your hand at any moment and we stop immediately. If you're very anxious, we offer treatment under sedation supervised by an anaesthesiologist.",
    },
  },
  {
    id: "fear",
    group: "pain",
    home: true,
    q: { uk: "Я дуже боюся стоматологів. Що робити?", en: "I'm really scared of dentists. What can I do?" },
    a: {
      uk: "Прийти просто поговорити. Перший візит може бути без жодних процедур: знайомство з лікарем, огляд і розмова про те, чого саме ви боїтеся. Жодного осуду — ми бачимо різні ситуації щодня. Далі разом обираємо темп: кілька коротких візитів або лікування уві сні.",
      en: "Come in just to talk. Your first visit can be free of any procedures: meet the doctor, have a quick look and talk about what worries you. No judgement — we see all kinds of situations every day. Then we choose the pace together: several short visits or treatment under sedation.",
    },
  },
  {
    id: "sedation-safe",
    group: "pain",
    q: { uk: "Наскільки безпечне лікування уві сні?", en: "How safe is sedation?" },
    a: {
      uk: "Ми використовуємо медикаментозну седацію, а не загальний наркоз: ви дихаєте самостійно, а анестезіолог увесь час поруч і контролює тиск, пульс і насичення киснем. Перед седацією обов'язкова консультація анестезіолога.",
      en: "We use conscious sedation rather than general anaesthesia: you breathe on your own while an anaesthesiologist stays with you and monitors blood pressure, pulse and oxygen. A consultation with the anaesthesiologist is required beforehand.",
    },
  },
  {
    id: "implant-duration",
    group: "implants",
    home: true,
    q: { uk: "Скільки триває імплантація?", en: "How long does an implant take?" },
    a: {
      uk: "Сама операція займає 30–60 хвилин. Потім імплант приживається 2–4 місяці (у цей час можна носити тимчасову коронку), після чого встановлюємо постійну коронку — часто за один день завдяки власному фрезерному центру.",
      en: "The surgery itself takes 30–60 minutes. The implant then integrates for 2–4 months (you can wear a temporary crown), after which we fit the final crown — often in a single day thanks to our in-house milling centre.",
    },
  },
  {
    id: "implant-reject",
    group: "implants",
    home: true,
    q: { uk: "А раптом імплант не приживеться?", en: "What if the implant doesn't integrate?" },
    a: {
      uk: "Імпланти преміальних систем приживаються в 97–98 % випадків. Ризик ще менший, коли все сплановано в 3D і встановлено за шаблоном. Якщо імплант все ж не прижився, ми замінимо його безкоштовно згідно з гарантією.",
      en: "Premium implant systems integrate in 97–98% of cases, and the risk is lower still with 3D planning and a surgical guide. If an implant does fail, we replace it free of charge under our guarantee.",
    },
  },
  {
    id: "implant-age",
    group: "implants",
    q: { uk: "Чи не пізно ставити імпланти в 60+?", en: "Am I too old for implants at 60+?" },
    a: {
      uk: "Вік не є протипоказанням. Важливіші загальний стан здоров'я та кількість кістки — це ми оцінюємо на КТ. Серед наших пацієнтів з імплантами є люди за 80.",
      en: "Age isn't a contraindication. General health and bone volume matter more — we assess them on a CBCT scan. Some of our implant patients are over 80.",
    },
  },
  {
    id: "veneers-grind",
    group: "aesthetics",
    home: true,
    q: { uk: "Чи сточують зуби під вініри?", en: "Do you grind teeth down for veneers?" },
    a: {
      uk: "Мінімально або зовсім ні. Ультратонкі вініри часто встановлюються без препарування, а класичні керамічні — зі зняттям 0,3–0,5 мм емалі. Перед початком ви «приміряєте» майбутню усмішку (mock-up) і вирішуєте, чи подобається результат.",
      en: "Minimally or not at all. Ultra-thin veneers are often placed without preparation; classic ceramic veneers need 0.3–0.5 mm of enamel removed. Before we start you “try on” your future smile (mock-up) and decide whether you like it.",
    },
  },
  {
    id: "whitening-harm",
    group: "aesthetics",
    q: { uk: "Чи шкідливе відбілювання для емалі?", en: "Is whitening harmful to enamel?" },
    a: {
      uk: "Професійне відбілювання під контролем лікаря безпечне: ми захищаємо ясна, підбираємо концентрацію гелю та завершуємо процедуру ремінералізацією. Тимчасова чутливість можлива 1–2 дні й минає сама.",
      en: "Professional whitening under a dentist's supervision is safe: we protect the gums, choose the right gel concentration and finish with remineralisation. Temporary sensitivity may last 1–2 days and passes on its own.",
    },
  },
  {
    id: "kids-age",
    group: "kids",
    q: { uk: "З якого віку можна вести дитину до стоматолога?", en: "At what age should a child first see a dentist?" },
    a: {
      uk: "Перший профілактичний візит — після появи перших зубів, приблизно в 1–2 роки. Ми лікуємо дітей від 2 років, а першу зустріч завжди робимо адаптаційною: знайомство без лікування.",
      en: "The first check-up should be after the first teeth appear, around age 1–2. We treat children from age 2, and the first visit is always an adaptation visit: getting acquainted without treatment.",
    },
  },
  {
    id: "kids-milk",
    group: "kids",
    home: true,
    q: { uk: "Навіщо лікувати молочні зуби, якщо вони випадуть?", en: "Why treat baby teeth if they'll fall out anyway?" },
    a: {
      uk: "Інфекція з молочного зуба може пошкодити зачаток постійного, а передчасна втрата молочного зуба — призвести до кривих постійних зубів. До того ж дитина з болем погано їсть і спить.",
      en: "Infection in a baby tooth can damage the permanent tooth developing beneath it, and losing a baby tooth too early can lead to crooked permanent teeth. A child in pain also eats and sleeps poorly.",
    },
  },
  {
    id: "guarantee",
    group: "guarantee",
    home: true,
    q: { uk: "Які гарантії ви даєте?", en: "What guarantees do you offer?" },
    a: {
      uk: "Довічна гарантія виробника на імпланти Straumann і Nobel Biocare, 5 років — на коронки, вініри й протези, 3 роки — на пломби та лікування каналів. Умова одна: профгігієна раз на 6 місяців. Усі умови прописані в договорі.",
      en: "Lifetime manufacturer's guarantee on Straumann and Nobel Biocare implants, 5 years on crowns, veneers and prostheses, and 3 years on fillings and root canals. The only condition is a professional clean every six months. All terms are in your contract.",
    },
  },
  {
    id: "sterile",
    group: "guarantee",
    q: { uk: "Як ви стерилізуєте інструменти?", en: "How do you sterilise instruments?" },
    a: {
      uk: "П'ять етапів: дезінфекція, ультразвукове очищення, пакування в крафт-пакети з індикатором, стерилізація в автоклаві класу B та зберігання в закритих шафах. Пакет відкриваємо при вас.",
      en: "Five stages: disinfection, ultrasonic cleaning, packing in sealed pouches with indicators, sterilisation in a class B autoclave and storage in closed cabinets. Pouches are opened in front of you.",
    },
  },
  {
    id: "war",
    group: "guarantee",
    q: { uk: "Що буде під час повітряної тривоги?", en: "What happens during an air-raid alert?" },
    a: {
      uk: "Якщо процедуру можна безпечно перервати, ми разом переходимо до найближчого укриття. Якщо ні (наприклад, під час операції), завершуємо критичний етап. Клініка має генератор і автономне освітлення, тож лікування не зупиняється через відключення світла.",
      en: "If the procedure can safely be paused, we go to the nearest shelter together. If not (for example, mid-surgery), we complete the critical step. The clinic has a generator and backup lighting, so power cuts don't stop treatment.",
    },
  },
  {
    id: "what-to-bring",
    group: "org",
    q: { uk: "Що взяти з собою на перший візит?", en: "What should I bring to my first visit?" },
    a: {
      uk: "Паспорт або ID-картку, знімки й виписки з інших клінік (якщо є) і список ліків, які приймаєте постійно. Приходьте за 10 хвилин до початку, щоб спокійно заповнити анкету.",
      en: "Your passport or ID, any X-rays or records from other clinics, and a list of medications you take regularly. Please arrive 10 minutes early to fill in the form without rushing.",
    },
  },
  {
    id: "parking",
    group: "org",
    home: true,
    q: { uk: "Де припаркуватися?", en: "Where can I park?" },
    a: {
      uk: "Біля клініки є велика безкоштовна парковка. Докладна схема проїзду та зупинки громадського транспорту — на сторінці «Контакти».",
      en: "There is a large free car park next to the clinic. Directions and public transport stops are on the Contacts page.",
    },
  },
  {
    id: "abroad",
    group: "org",
    q: { uk: "Я живу за кордоном. Чи можна отримати план лікування заздалегідь?", en: "I live abroad. Can I get a treatment plan in advance?" },
    a: {
      uk: "Так. Надішліть нам свіжий панорамний знімок або КТ і фото усмішки в Telegram чи на email — лікар складе попередній план з кількістю візитів і вартістю. Лікування плануємо так, щоб вкластися в 1–2 приїзди.",
      en: "Yes. Send us a recent panoramic X-ray or CBCT and photos of your smile via Telegram or email — the doctor will prepare a preliminary plan with the number of visits and cost. We plan treatment to fit into 1–2 trips.",
    },
  },
];

export interface FaqEntry extends FaqItem {
  id: string;
  group: FaqGroup;
  home: boolean;
}

export function getFaq(locale: Locale): FaqEntry[] {
  return deepTypo(
    raw.map((f) => ({ id: f.id, group: f.group, home: Boolean(f.home), q: f.q[locale], a: f.a[locale] })),
    locale,
  );
}
