"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/format";
import { track } from "@/lib/analytics";
import { Logo } from "./Logo";
import { OpenStatus, type OpenStatusLabels } from "./OpenStatus";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu, type MobileMenuLabels } from "./MobileMenu";
import type { NavData } from "./nav-data";

export interface HeaderLabels extends MobileMenuLabels {
  book: string;
  openMenu: string;
  mainNav: string;
  search: string;
  home: string;
  byProblem: string;
  byService: string;
  allServices: string;
  call: string;
  status: OpenStatusLabels;
}

type MenuKey = "services" | "clinic";

export function openSearch() {
  window.dispatchEvent(new CustomEvent("nd:search"));
}

export function Header({
  nav,
  labels,
}: {
  nav: NavData;
  labels: HeaderLabels;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [under, setUnder] = useState<"light" | "dark">("light");
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const openTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef<
    Partial<Record<MenuKey, HTMLButtonElement | null>>
  >({});
  const baseId = useId();

  // Hide on scroll down, reveal on scroll up; detect dark sections underneath.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const darkSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]'));
    let sections = darkSections();

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      setScrolled(y > 8);
      if (y < 80) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      lastY = y;

      const h = headerRef.current?.getBoundingClientRect();
      const probe = h ? h.top + h.height / 2 : 36;
      setUnder(
        sections.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        })
          ? "dark"
          : "light",
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const mo = new MutationObserver(() => {
      sections = darkSections();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  // Close menus on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route change is an external event
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Another overlay (booking, quiz) takes over: close our menus
  useEffect(() => {
    const close = () => {
      setMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener("nd:overlay-open", close);
    return () => window.removeEventListener("nd:overlay-open", close);
  }, []);

  const closeMenu = useCallback((returnFocus?: MenuKey) => {
    setMenu(null);
    if (returnFocus) triggerRefs.current[returnFocus]?.focus();
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(menu);
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu, closeMenu]);

  const hoverOpen = (key: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setMenu(key), menu ? 0 : 120);
  };
  const hoverClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 220);
  };
  const keepOpen = () => window.clearTimeout(closeTimer.current);

  const isActive = (href: string) =>
    href !== nav.home && pathname.startsWith(href);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-2 pt-2 transition-transform duration-500 ease-(--ease-out) lg:px-4 lg:pt-3",
          hidden && !menu && !mobileOpen && "-translate-y-[120%]",
        )}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hoverClose();
        }}
      >
        <div
          className={cn(
            "glass mx-auto flex h-(--header-h) max-w-[calc(var(--container-wide)+32px)] items-center gap-2 rounded-[22px] pr-2 pl-4 transition-[height,box-shadow] duration-300 lg:gap-6 lg:rounded-[26px] lg:pl-5",
            scrolled && "lg:h-[60px]",
          )}
          data-refract=""
          data-under={under === "dark" && !menu ? "dark" : undefined}
        >
          <Link
            href={nav.home}
            aria-label={labels.home}
            className="shrink-0 rounded-xl"
          >
            <Logo />
          </Link>

          <nav aria-label={labels.mainNav} className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-center gap-1 xl:gap-2">
              {nav.primary.map((item) => {
                const panelId = `${baseId}-${item.menu}`;
                if (item.menu) {
                  const key = item.menu;
                  const open = menu === key;
                  return (
                    <li
                      key={item.key}
                      onPointerEnter={(e) =>
                        e.pointerType === "mouse" && hoverOpen(key)
                      }
                    >
                      <button
                        ref={(el) => {
                          triggerRefs.current[key] = el;
                        }}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setMenu(open ? null : key)}
                        className={cn(
                          "inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors hover:bg-fg/[0.06]",
                          (open || isActive(item.href)) && "bg-fg/[0.06]",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          size={16}
                          strokeWidth={2}
                          className={cn(
                            "transition-transform duration-300",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                    </li>
                  );
                }
                return (
                  <li
                    key={item.key}
                    onPointerEnter={() => menu && hoverClose()}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors hover:bg-fg/[0.06]",
                        isActive(item.href) && "bg-fg/[0.06]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <span className="mr-2 hidden 2xl:inline-flex">
              <OpenStatus labels={labels.status} />
            </span>
            <a
              href={`tel:${nav.phone.tel}`}
              className="hidden h-10 items-center rounded-full px-3 text-[0.9375rem] font-semibold tracking-tight transition-colors hover:bg-fg/[0.06] xl:inline-flex"
              data-track="phone_click"
              data-track-location="header"
            >
              {nav.phone.display}
            </a>
            <a
              href={`tel:${nav.phone.tel}`}
              aria-label={`${labels.call}: ${nav.phone.display}`}
              className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-fg/[0.06] lg:size-10 xl:hidden"
              data-track="phone_click"
              data-track-location="header"
            >
              <Phone aria-hidden size={19} strokeWidth={1.75} />
            </a>
            <button
              type="button"
              onClick={() => {
                openSearch();
                track("search_open", { location: "header" });
              }}
              aria-label={labels.search}
              className="hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-fg/[0.06] lg:inline-flex"
            >
              <Search aria-hidden size={19} strokeWidth={1.75} />
            </button>
            <LanguageSwitch
              fallback={nav.otherLocaleHome}
              label={labels.languageSwitch}
              current={nav.locale}
              className="hidden lg:inline-flex"
            />
            <Link
              href={nav.book}
              prefetch={false}
              data-book=""
              data-book-source="header"
              className={buttonClass(
                "primary",
                "sm",
                "ml-1 max-sm:hidden lg:h-10 lg:px-5",
              )}
            >
              {labels.book}
            </Link>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-fg/[0.06] lg:hidden"
              aria-label={labels.openMenu}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Services mega menu */}
        <div
          id={`${baseId}-services`}
          hidden={menu !== "services"}
          onPointerEnter={keepOpen}
          className="mx-auto mt-2 hidden max-w-[calc(var(--container-wide)+32px)] lg:block"
        >
          {menu === "services" && (
            <div className="glass glass--prominent grid grid-cols-[1fr_2fr_1fr] gap-8 rounded-[28px] p-8 animate-[nd-menu-in_280ms_var(--ease-out)]">
              <div>
                <p className="t-overline mb-4 text-fg-muted">
                  {labels.byProblem}
                </p>
                <ul className="flex flex-col gap-1">
                  {nav.problems.map((p) => (
                    <li key={p.label}>
                      <Link
                        href={p.href}
                        className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-fg/[0.05]"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-soft-fg">
                          {p.icon && <Icon name={p.icon} size={20} />}
                        </span>
                        <span className="flex flex-col">
                          <span className="font-semibold leading-tight">
                            {p.label}
                          </span>
                          <span className="text-[0.8125rem] text-fg-muted">
                            {p.hint}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="t-overline mb-4 text-fg-muted">
                  {labels.byService}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {nav.serviceGroups.map((g) => (
                    <div key={g.label}>
                      <p className="mb-1.5 text-[0.8125rem] font-semibold text-fg-muted">
                        {g.label}
                      </p>
                      <ul>
                        {g.items.map((s) => (
                          <li key={s.href}>
                            <Link
                              href={s.href}
                              className="flex items-baseline justify-between gap-3 rounded-lg py-1.5 text-[0.9375rem] font-medium hover:text-accent"
                            >
                              <span>{s.label}</span>
                              <span className="t-num shrink-0 text-[0.8125rem] font-normal text-fg-muted">
                                {s.hint}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-1 flex-col justify-between gap-6 rounded-3xl bg-bg-inverse p-6 text-fg-inverse">
                  <div>
                    <p className="t-title">{nav.emergency.title}</p>
                    <p className="mt-2 text-[0.9375rem] text-[#a1a1a6]">
                      {nav.emergency.text}
                    </p>
                  </div>
                  <a
                    href={`tel:${nav.emergency.phone.tel}`}
                    className={buttonClass(
                      "primary",
                      "md",
                      "w-full bg-[#5ec8cc] text-[#0b0c0e] hover:bg-[#7ad4d7]",
                    )}
                    data-track="phone_click"
                    data-track-location="mega_menu"
                  >
                    <Phone aria-hidden size={18} />{" "}
                    {nav.emergency.phone.display}
                  </a>
                </div>
                <Link
                  href={nav.allServices.href}
                  className={buttonClass("secondary", "md", "w-full")}
                >
                  {nav.allServices.label} →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Clinic dropdown */}
        <div
          id={`${baseId}-clinic`}
          hidden={menu !== "clinic"}
          onPointerEnter={keepOpen}
          className="mx-auto mt-2 hidden max-w-[calc(var(--container-wide)+32px)] lg:block"
        >
          {menu === "clinic" && (
            <div className="glass glass--prominent ml-auto mr-[18%] w-[360px] rounded-[24px] p-3 animate-[nd-menu-in_280ms_var(--ease-out)]">
              <ul>
                {nav.clinicLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex h-11 items-center rounded-xl px-3 font-medium transition-colors hover:bg-fg/[0.05]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        nav={nav}
        labels={labels}
      />
    </>
  );
}
