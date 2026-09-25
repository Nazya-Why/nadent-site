import Link from "next/link";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { Button } from "@/components/ui/Button";
import { SearchTrigger } from "@/components/layout/SearchTrigger";

export function NotFoundView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const links = [
    { href: route(locale, "services"), label: d.nav.services },
    { href: route(locale, "prices"), label: d.nav.prices },
    { href: route(locale, "doctors"), label: d.nav.doctors },
    { href: route(locale, "contacts"), label: d.nav.contacts },
  ];
  return (
    <section className="container-narrow flex min-h-[80dvh] flex-col items-center justify-center pt-32 pb-24 text-center">
      <p aria-hidden className="text-gradient text-[clamp(6rem,22vw,12rem)] leading-none font-bold tracking-[-0.06em]">
        404
      </p>
      <h1 className="t-h2 mt-4">{d.notFound.title}</h1>
      <p className="t-body-lg mt-4 max-w-xl text-fg-muted">{d.notFound.text}</p>
      <SearchTrigger label={d.search.placeholder} className="mt-8 w-full max-w-md" />
      <p className="t-overline mt-10 text-fg-muted">{d.notFound.popular}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex h-11 items-center rounded-full bg-fg/[0.06] px-5 font-medium hover:bg-fg/[0.1]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href={route(locale, "book")} data-book="" data-book-source="404" size="lg">
          {d.cta.bookConsultation}
        </Button>
        <Button href={route(locale, "home")} variant="secondary" size="lg">
          {d.cta.toHome}
        </Button>
      </div>
      {locale === "uk" && (
        <p className="mt-10 text-[0.875rem] text-fg-muted">
          Looking for the English version?{" "}
          <Link href={route("en", "home")} className="underline underline-offset-2" hrefLang="en">
            Go to /en
          </Link>
        </p>
      )}
    </section>
  );
}
