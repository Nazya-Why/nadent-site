import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Accordion } from "@/components/ui/Accordion";
import { Rating } from "@/components/ui/Rating";
import { Timeline } from "@/components/ui/Timeline";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState, ErrorState, Skeleton, Tooltip } from "@/components/ui/States";
import { Badge, Chip, SectionHeader } from "@/components/ui/SectionHeader";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { Counter } from "@/components/ui/Counter";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { MapFacade } from "@/components/ui/MapFacade";
import { Icon } from "@/components/ui/Icon";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { SuccessCheck } from "@/components/forms/SuccessCheck";
import { getServices } from "@/content/services";
import { getDoctors } from "@/content/doctors";
import { clinic } from "@/config/clinic";
import type { IconName } from "@/content/types";
import { FormDemos } from "./StyleguideDemos";

export const metadata: Metadata = {
  title: "Дизайн-система",
  robots: { index: false, follow: false },
};

const colors: { name: string; v: string; fg?: string }[] = [
  { name: "--bg", v: "var(--bg)" },
  { name: "--bg-elevated", v: "var(--bg-elevated)" },
  { name: "--bg-sand", v: "var(--bg-sand)" },
  { name: "--bg-sunken", v: "var(--bg-sunken)" },
  { name: "--bg-inverse", v: "var(--bg-inverse)", fg: "#f5f5f7" },
  { name: "--fg", v: "var(--fg)", fg: "var(--bg)" },
  { name: "--fg-muted", v: "var(--fg-muted)", fg: "var(--bg)" },
  { name: "--accent", v: "var(--accent)", fg: "var(--accent-fg)" },
  { name: "--accent-hover", v: "var(--accent-hover)", fg: "var(--accent-fg)" },
  { name: "--accent-soft", v: "var(--accent-soft)", fg: "var(--accent-soft-fg)" },
  { name: "--success", v: "var(--success)", fg: "#fff" },
  { name: "--warning", v: "var(--warning)", fg: "#fff" },
  { name: "--error", v: "var(--error)", fg: "#fff" },
  { name: "--info", v: "var(--info)", fg: "#fff" },
];

const type = [
  ["t-display", "Display", "Нова усмішка."],
  ["t-h1", "H1", "Спокійна стоматологія"],
  ["t-h2", "H2", "З чим ви до нас прийшли?"],
  ["t-h3", "H3", "Імплантація під ключ"],
  ["t-title", "Title", "Лікування каналів під мікроскопом"],
  ["t-body-lg", "Body Large", "Ми показуємо результат у 3D ще до початку лікування."],
  ["t-body", "Body", "Консультація триває 40 хвилин і коштує 500 грн — ця сума враховується у вартість лікування."],
  ["t-caption", "Caption", "Ціни актуальні на вересень 2026 року"],
  ["t-overline", "Overline", "Технології"],
];

const icons: IconName[] = ["implant", "arch", "sparkle", "aligner", "braces", "sun", "droplet", "shield", "microscope", "crown", "scalpel", "child", "moon", "siren", "heart", "smile", "tooth-gap", "zigzag"];

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line py-16">
      <h2 id={`${id}-h`} className="t-h3 mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  const services = getServices("uk");
  const doctors = getDoctors("uk");
  return (
    <div className="container-page pt-32 pb-24">
      <SectionHeader as="h1" size="h1" overline="NaDent Design System" title="Дизайн-система" lead="Токени, компоненти та їхні стани. Сторінка прихована від індексації. Джерело правди: src/styles/tokens.css і docs/DESIGN_SYSTEM.md." />

      <nav aria-label="Розділи" className="mt-10 flex flex-wrap gap-2">
        {["colors", "type", "glass", "buttons", "forms", "cards", "content", "media", "feedback", "icons"].map((s) => (
          <a key={s} href={`#${s}`} className="rounded-full bg-fg/[0.06] px-4 py-2 text-[0.875rem] font-medium hover:bg-fg/[0.1]">
            {s}
          </a>
        ))}
      </nav>

      <Block id="colors" title="Колір">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {colors.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-2xl ring-1 ring-line">
              <div className="flex h-24 items-end p-3 text-[0.8125rem] font-semibold" style={{ background: c.v, color: c.fg ?? "var(--fg)" }}>
                Aa 123
              </div>
              <p className="bg-bg-elevated px-3 py-2 font-mono text-[0.75rem]">{c.name}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.875rem] text-fg-muted">Контраст: fg/bg 16.3:1 · fg-muted/bg 5.1:1 · білий/accent 6.0:1 · темна тема: accent/bg 9.9:1. Перевірка: scripts/check-contrast.mjs.</p>
      </Block>

      <Block id="type" title="Типографіка">
        <div className="flex flex-col gap-6">
          {type.map(([cls, name, sample]) => (
            <div key={cls} className="grid gap-2 md:grid-cols-[160px_1fr] md:items-baseline">
              <span className="font-mono text-[0.75rem] text-fg-muted">
                {name} · .{cls}
              </span>
              <p className={cls}>{sample}</p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[160px_1fr]">
            <span className="font-mono text-[0.75rem] text-fg-muted">Кирилиця</span>
            <p className="t-h3">Ґанок, їжак, єнот, пʼять, «лапки» — 15 000 грн, 2–4 міс</p>
          </div>
        </div>
      </Block>

      <Block id="glass" title="Liquid Glass">
        <div className="relative overflow-hidden rounded-[32px] p-6 md:p-10" style={{ background: "radial-gradient(circle at 20% 20%, #5ec8cc, transparent 45%), radial-gradient(circle at 80% 70%, #e9c89b, transparent 50%), linear-gradient(135deg,#0b6e75,#1d1d1f)" }}>
          <div className="grid gap-4 md:grid-cols-4">
            {(["regular", "clear", "tinted", "prominent"] as const).map((v) => (
              <GlassSurface key={v} variant={v} shine className="rounded-[24px] p-5">
                <p className="font-semibold">{v}</p>
                <p className="mt-1 text-[0.875rem] opacity-80">{v === "clear" ? "Лише декор / з темним скрімом" : "Текст AA на будь-якому фоні"}</p>
              </GlassSurface>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GlassSurface refract shine className="rounded-[24px] p-6">
              <p className="t-title">Refraction (Chromium)</p>
              <p className="mt-1 text-[0.875rem] text-fg-muted">SVG displacement у backdrop-filter; в інших браузерах звичайний blur.</p>
            </GlassSurface>
            <GlassSurface under="dark" className="rounded-[24px] p-6">
              <p className="t-title">Adaptive tint: under dark</p>
              <p className="mt-1 text-[0.875rem] opacity-80">Header перемикає тон над темними секціями.</p>
            </GlassSurface>
          </div>
        </div>
      </Block>

      <Block id="buttons" title="Кнопки">
        <div className="flex flex-col gap-6">
          {(["primary", "secondary", "ghost", "glass", "inverse", "link"] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3">
              <span className="w-24 font-mono text-[0.75rem] text-fg-muted">{v}</span>
              <Button variant={v} size="sm">
                Small
              </Button>
              <Button variant={v}>Записатися</Button>
              <Button variant={v} size="lg" iconEnd={<ArrowRight aria-hidden size={18} />}>
                Large з іконкою
              </Button>
              <Button variant={v} disabled>
                Disabled
              </Button>
              <Button variant={v} loading>
                Loading
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="w-24 font-mono text-[0.75rem] text-fg-muted">icon</span>
            <Button variant="secondary" aria-label="Подзвонити" className="px-0">
              <Phone aria-hidden size={18} />
            </Button>
          </div>
        </div>
      </Block>

      <Block id="forms" title="Форми">
        <FormDemos />
      </Block>

      <Block id="cards" title="Картки">
        <div className="grid gap-6 md:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s.id} service={s} locale="uk" />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {doctors.slice(0, 4).map((d) => (
            <DoctorCard key={d.id} doctor={d} locale="uk" />
          ))}
        </div>
      </Block>

      <Block id="content" title="Контент">
        <div className="flex flex-col gap-12">
          <Breadcrumbs label="Хлібні крихти" items={[{ name: "Головна", href: "/" }, { name: "Послуги", href: "/posluhy/" }, { name: "Імплантація", href: "/posluhy/implantatsiia/" }]} />
          <div className="flex flex-wrap items-center gap-3">
            <Chip>від 18 000 грн</Chip>
            <Chip tone="accent">2–4 місяці</Chip>
            <Chip tone="success">Гарантія</Chip>
            <Badge>Найчастіше обирають</Badge>
            <Rating value={4.9} label="Рейтинг 4,9 з 5" className="text-[1.25rem]" />
            <Tooltip id="tt-demo" tip="Точну вартість визначає лікар після діагностики">
              <span className="rounded-full bg-fg/[0.06] px-3 py-1.5 text-[0.875rem]" tabIndex={0}>
                Tooltip (hover / focus)
              </span>
            </Tooltip>
          </div>
          <Accordion
            name="sg-faq"
            items={[
              { q: "Чи боляче ставити імплант?", a: "Ні. Операція проходить під місцевою анестезією, а за бажання — під седацією." },
              { q: "Скільки триває лікування?", a: "Від 2 до 4 місяців: імплант має прижитися перед встановленням коронки." },
            ]}
          />
          <Timeline
            horizontal
            steps={[
              { title: "Консультація", text: "Огляд, КТ, план", meta: "40 хв" },
              { title: "Операція", text: "Імплант за шаблоном", meta: "40–60 хв" },
              { title: "Приживлення", text: "Тимчасова коронка", meta: "2–4 міс" },
              { title: "Коронка", text: "Цирконій за 1 день", meta: "1 візит" },
            ]}
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              [clinic.stats.years, " років"],
              [clinic.stats.implants, "+"],
              [clinic.stats.implantSuccess, "%"],
              [clinic.stats.patients, "+"],
            ].map(([v, s], i) => (
              <p key={i} className="t-h2">
                <Counter value={v as number} suffix={s as string} locale="uk" />
              </p>
            ))}
          </div>
        </div>
      </Block>

      <Block id="media" title="Медіа">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageSlot id="hero-desktop" alt="Плейсхолдер фото" className="rounded-[28px]" />
          <BeforeAfter
            className="aspect-[4/3] rounded-[28px]"
            labels={{ before: "До", after: "Після", slider: "Порівняння до і після" }}
            before={<ImageSlot id="case-veneers-8-before" alt="До лікування" fill />}
            after={<ImageSlot id="case-veneers-8-after" alt="Після лікування" fill />}
          />
          <VideoSlot className="aspect-video rounded-[28px]" poster={<ImageSlot id="doctor-video-poster" alt="" fill />} title="Знайомство з лікарем" playLabel="Відтворити" soonLabel="Відео незабаром" />
          <MapFacade className="aspect-video rounded-[28px]" embedUrl={clinic.mapUrls.embed} title="Карта" buttonLabel="Показати карту" address="вул. Кульпарківська, 226А" />
        </div>
        <div className="mt-8">
          <ScrollRow label="Carousel demo" prevLabel="Попередній" nextLabel="Наступний" itemClassName="w-[70vw] sm:w-[320px]">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} locale="uk" />
            ))}
          </ScrollRow>
        </div>
      </Block>

      <Block id="feedback" title="Стани та зворотний звʼязок">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-[28px] p-6 ring-1 ring-line">
            <Skeleton className="h-40" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <EmptyState title="Нічого не знайшли" text="Спробуйте інший запит або напишіть нам." action={<Button variant="secondary">Написати</Button>} />
          <ErrorState title="Не вдалося надіслати" text="Перевірте інтернет і спробуйте ще раз." action={<Button>Спробувати ще</Button>} />
        </div>
        <div className="mt-8 flex items-center gap-6">
          <SuccessCheck />
          <div role="status" className="glass glass--prominent flex items-center gap-3 rounded-2xl px-4 py-3 font-medium">
            <span className="size-2 rounded-full bg-success" /> Toast: адресу скопійовано
          </div>
          <div className="h-1.5 w-60 overflow-hidden rounded-full bg-fg/[0.08]" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={4} aria-label="Прогрес">
            <div className="h-full w-1/2 rounded-full bg-accent" />
          </div>
        </div>
      </Block>

      <Block id="icons" title="Іконки">
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {icons.map((n) => (
            <li key={n} className="flex flex-col items-center gap-2 rounded-2xl bg-bg-elevated p-4 ring-1 ring-line">
              <Icon name={n} size={28} className="text-accent" />
              <span className="font-mono text-[0.6875rem] text-fg-muted">{n}</span>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}
