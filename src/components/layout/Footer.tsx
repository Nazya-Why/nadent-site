import Link from "next/link";
import { FacebookIcon as Facebook, InstagramIcon as Instagram, YoutubeIcon as Youtube } from "@/components/ui/BrandIcons";
import { clinic } from "@/config/clinic";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";
import { LanguageSwitch } from "./LanguageSwitch";
import type { NavData } from "./nav-data";

export function Footer({ locale, nav }: { locale: Locale; nav: NavData }) {
  const d = getDictionary(locale);
  const year = new Date().getFullYear();
  const services = nav.serviceGroups.flatMap((g) => g.items);

  const patients = [
    { href: route(locale, "prices"), label: d.nav.prices },
    { href: route(locale, "firstVisit"), label: d.nav.firstVisit },
    { href: route(locale, "payment"), label: d.nav.payment },
    { href: route(locale, "offers"), label: d.nav.offers },
    { href: route(locale, "reviews"), label: d.nav.reviews },
    { href: route(locale, "faq"), label: d.nav.faq },
    { href: route(locale, "blog"), label: d.nav.blog },
  ];
  const clinicLinks = [
    { href: route(locale, "about"), label: d.nav.about },
    { href: route(locale, "doctors"), label: d.nav.doctors },
    { href: route(locale, "cases"), label: d.nav.cases },
    { href: route(locale, "technology"), label: d.nav.technology },
    { href: route(locale, "contacts"), label: d.nav.contacts },
  ];

  const hours = clinic.hours.map((h) => {
    const days = h.days.map((x) => d.daysShort[x]);
    const range = days.length > 2 ? `${days[0]}–${days.at(-1)}` : days.join(", ");
    return { range, time: `${h.open}–${h.close}` };
  });

  const social = [
    { href: clinic.social.instagram, label: "Instagram", Icon: Instagram },
    { href: clinic.social.facebook, label: "Facebook", Icon: Facebook },
    { href: clinic.social.youtube, label: "YouTube", Icon: Youtube },
  ];

  const heading = "mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-fg-muted";
  const linkCls = "inline-flex min-h-8 items-center text-[0.9375rem] text-fg/80 transition-colors hover:text-fg";

  return (
    <footer className="border-t border-line bg-bg-sand pb-28 lg:pb-0" data-tone="light">
      <div className="container-wide grid gap-12 pt-16 pb-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.3fr] lg:gap-10 lg:pt-20">
        <div className="flex flex-col gap-5">
          <Link href={nav.home} className="self-start rounded-xl" aria-label={d.a11y.home}>
            <Logo />
          </Link>
          <p className="max-w-xs text-[0.9375rem] text-fg-muted">{d.meta.defaultDescription.split(".")[0]}.</p>
          <div className="flex gap-2">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} ${d.a11y.newTab}`}
                className="grid size-11 place-items-center rounded-full bg-fg/[0.06] transition-colors hover:bg-fg/[0.1]"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className={heading}>{d.nav.services}</h2>
          <ul className="grid grid-cols-1 gap-y-0.5">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={linkCls}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-2 lg:grid-cols-2">
          <div>
            <h2 className={heading}>{d.footer.patients}</h2>
            <ul className="flex flex-col gap-0.5">
              {patients.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={heading}>{d.footer.clinic}</h2>
            <ul className="flex flex-col gap-0.5">
              {clinicLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className={heading}>{d.footer.contacts}</h2>
          <address className="flex flex-col gap-3 not-italic">
            <a href={`tel:${nav.phone.tel}`} className="t-title" data-track="phone_click" data-track-location="footer">
              {nav.phone.display}
            </a>
            <a href={`mailto:${clinic.email}`} className={linkCls}>
              {clinic.email}
            </a>
            <p className="text-[0.9375rem] text-fg/80">
              {clinic.address.city[locale]}, {clinic.address.street[locale]}
            </p>
          </address>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9375rem]">
            {hours.map((h) => (
              <div key={h.range} className="contents">
                <dt className="text-fg-muted">{h.range}</dt>
                <dd className="t-num">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-wide">
        <div className="flex flex-col gap-6 border-t border-line py-8 text-[0.8125rem] text-fg-muted lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-2">
            <p className="font-medium text-fg">{d.footer.disclaimer}</p>
            <p>
              {clinic.license.number[locale]} · {clinic.legalName} · ЄДРПОУ {clinic.edrpou}
            </p>
            <p>
              © {clinic.foundedYear}–{year} NaDent. {d.footer.rights}{" "}
              <Link href={route(locale, "privacy")} className="underline underline-offset-2 hover:text-fg">
                {locale === "uk" ? "Політика конфіденційності" : "Privacy policy"}
              </Link>
              {" · "}
              <Link href={route(locale, "terms")} className="underline underline-offset-2 hover:text-fg">
                {locale === "uk" ? "Умови використання" : "Terms of use"}
              </Link>
            </p>
            {clinic.demoMode && <p className="italic">{d.footer.demo}</p>}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitch variant="segmented" current={locale} fallback={nav.otherLocaleHome} label={d.a11y.languageSwitch} />
            <ThemeSwitch labels={{ ...d.theme, group: d.a11y.themeToggle }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
