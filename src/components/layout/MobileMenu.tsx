"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Phone, Search } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeSwitch } from "./ThemeSwitch";
import { OpenStatus, type OpenStatusLabels } from "./OpenStatus";
import type { NavData } from "./nav-data";

export interface MobileMenuLabels {
  mobileNav: string;
  closeMenu: string;
  languageSwitch: string;
  byProblem: string;
  byService: string;
  clinic: string;
  search: string;
  book: string;
  call: string;
  theme: { system: string; light: string; dark: string; group: string };
  status: OpenStatusLabels;
  searchPlaceholder: string;
}

export function MobileMenu({
  open,
  onClose,
  nav,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavData;
  labels: MobileMenuLabels;
}) {
  // The menu tree is only mounted after the first open: keeps the initial DOM (and hydration) small
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-way latch on first open
    if (open) setMounted(true);
  }, [open]);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      label={labels.mobileNav}
      closeLabel={labels.closeMenu}
      variant="fullscreen"
      className="lg:hidden"
    >
      {mounted && (
        <nav
          aria-label={labels.mobileNav}
          className="flex min-h-full flex-col px-5 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))]"
        >
          <div className="flex h-11 items-center pr-14">
            <Link href={nav.home} onClick={onClose} className="rounded-xl">
              <Logo />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent("nd:search"));
            }}
            className="mt-6 flex h-12 w-full items-center gap-3 rounded-2xl bg-fg/[0.06] px-4 text-left text-fg-muted"
          >
            <Search aria-hidden size={18} strokeWidth={1.75} />
            {labels.searchPlaceholder}
          </button>

          <section className="mt-8" aria-labelledby="mm-problems">
            <h2 id="mm-problems" className="t-overline mb-3 text-fg-muted">
              {labels.byProblem}
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {nav.problems.map((p) => (
                <li key={p.label}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    className="flex h-full min-h-[76px] flex-col justify-between gap-2 rounded-2xl bg-bg-elevated p-3.5 shadow-sm"
                  >
                    {p.icon && (
                      <Icon name={p.icon} size={22} className="text-accent" />
                    )}
                    <span className="text-[0.9375rem] leading-tight font-semibold">
                      {p.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8" aria-labelledby="mm-services">
            <h2 id="mm-services" className="t-overline mb-1 text-fg-muted">
              {labels.byService}
            </h2>
            {nav.serviceGroups.map((g) => (
              <details key={g.label} className="group border-b border-line">
                <summary className="flex h-14 cursor-pointer list-none items-center justify-between text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {g.label}
                  <ChevronRight
                    aria-hidden
                    size={18}
                    className="text-fg-muted transition-transform duration-300 group-open:rotate-90"
                  />
                </summary>
                <ul className="pb-3">
                  {g.items.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        onClick={onClose}
                        className="flex min-h-11 items-center justify-between gap-3 py-1.5 pl-1"
                      >
                        <span>{s.label}</span>
                        <span className="t-num text-[0.8125rem] text-fg-muted">
                          {s.hint}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <Link
              href={nav.allServices.href}
              onClick={onClose}
              className="flex h-14 items-center justify-between text-[1.0625rem] font-semibold text-accent"
            >
              {nav.allServices.label}
              <ChevronRight aria-hidden size={18} />
            </Link>
          </section>

          <section className="mt-6" aria-labelledby="mm-clinic">
            <h2 id="mm-clinic" className="t-overline mb-1 text-fg-muted">
              {labels.clinic}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4">
              {nav.primary
                .filter((p) => !p.menu)
                .map((p) => ({ label: p.label, href: p.href }))
                .concat(nav.clinicLinks)
                .map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex min-h-12 items-center text-[1rem] font-medium"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>

          <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-bg-elevated p-4 shadow-sm">
            <OpenStatus labels={labels.status} />
            <a
              href={`tel:${nav.phone.tel}`}
              className="t-title"
              data-track="phone_click"
              data-track-location="mobile_menu"
            >
              {nav.phone.display}
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${nav.phone.tel}`}
                className={buttonClass("secondary", "lg")}
                data-track="phone_click"
                data-track-location="mobile_menu"
              >
                <Phone aria-hidden size={18} /> {labels.call}
              </a>
              <Link
                href={nav.book}
                onClick={onClose}
                prefetch={false}
                data-book=""
                data-book-source="mobile_menu"
                className={buttonClass("primary", "lg")}
              >
                {labels.book}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <LanguageSwitch
              variant="segmented"
              current={nav.locale}
              fallback={nav.otherLocaleHome}
              label={labels.languageSwitch}
            />
            <ThemeSwitch labels={labels.theme} />
          </div>
        </nav>
      )}
    </Sheet>
  );
}
