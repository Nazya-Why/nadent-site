import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { getDictionary } from "@/i18n";
import { htmlLang, type Locale } from "@/i18n/config";
import { route } from "@/i18n/routes";
import { BookingProvider } from "@/components/forms/BookingProvider";
import { getBookingProps } from "@/components/forms/booking-data";
import { QuizProvider } from "@/components/forms/QuizProvider";
import { getQuiz } from "@/content/quiz";
import { ClientRuntime } from "./ClientRuntime";
import { CommandSearch } from "./CommandSearch";
import { ConsentManager } from "./ConsentManager";
import { Footer } from "./Footer";
import { GlassDefs } from "./GlassDefs";
import { Header } from "./Header";
import { MobileActionBar } from "./MobileActionBar";
import { getNavData } from "./nav-data";
import { ClinicJsonLd } from "@/components/seo/JsonLd";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  // optional: never re-lays out the LCP headline after load; cached on repeat visits
  display: "optional",
  axes: ["opsz"],
});

/**
 * Runs before paint: theme (no flash), `js` class for reveal animations and
 * Consent Mode v2 defaults (everything denied until the visitor decides).
 */
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('nd-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.theme=d?'dark':'light';}catch(e){r.dataset.theme='light'}window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDictionary(locale);
  const nav = getNavData(locale);
  const booking = getBookingProps(locale);

  const statusLabels = { ...d.status, days: d.days };
  const theme = { ...d.theme, group: d.a11y.themeToggle };

  return (
    <html lang={htmlLang[locale]} className={inter.variable} suppressHydrationWarning data-theme="light">
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout owns <head> */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <ClinicJsonLd locale={locale} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed top-3 left-3 z-[60] rounded-full bg-accent px-5 py-3 font-semibold text-accent-fg shadow-lg"
        >
          {d.a11y.skipToContent}
        </a>
        <GlassDefs />
        <Header
          nav={nav}
          labels={{
            book: d.cta.book,
            openMenu: d.a11y.openMenu,
            mainNav: d.a11y.mainNav,
            search: d.a11y.search,
            home: d.a11y.home,
            byProblem: d.nav.byProblem,
            byService: d.nav.byService,
            allServices: d.nav.allServices,
            call: d.cta.call,
            status: statusLabels,
            mobileNav: d.a11y.mobileNav,
            closeMenu: d.a11y.closeMenu,
            languageSwitch: d.a11y.languageSwitch,
            clinic: d.nav.clinic,
            theme,
            searchPlaceholder: d.search.placeholder,
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} nav={nav} />
        <MobileActionBar
          phone={nav.phone}
          bookHref={nav.book}
          hideOn={[route(locale, "book"), route(locale, "thanks")]}
          labels={{
            call: d.cta.call,
            write: d.cta.write,
            book: d.cta.bookShort,
            mobileNav: d.a11y.mobileNav,
            close: d.a11y.close,
            messengers: { ...d.messengers, call: d.cta.call },
          }}
        />
        <BookingProvider {...booking} title={d.forms.wizard.title} closeLabel={d.a11y.close} />
        <QuizProvider locale={locale} content={getQuiz(locale)} forms={d.forms} privacyHref={route(locale, "privacy")} thanksHref={route(locale, "thanks")} closeLabel={d.a11y.close} />
        <CommandSearch
          locale={locale}
          labels={{ ...d.search, title: d.a11y.search, close: d.a11y.close }}
          popular={
            locale === "uk"
              ? ["Імплантація", "Вініри", "Ціни", "Елайнери", "Дитячий стоматолог", "Болить зуб"]
              : ["Implants", "Veneers", "Prices", "Aligners", "Kids' dentist", "Toothache"]
          }
        />
        <ConsentManager labels={d.cookie} policyHref={route(locale, "privacy")} />
        <ClientRuntime />
      </body>
    </html>
  );
}
