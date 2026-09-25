"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/format";
import { MessengerSheet, type MessengerLabels } from "./MessengerSheet";

export interface ActionBarLabels {
  call: string;
  write: string;
  book: string;
  mobileNav: string;
  close: string;
  messengers: MessengerLabels;
}

/**
 * iOS-style glass action bar: call · message · book. Hidden while the hero's own
 * CTAs are on screen, on the booking page, and while the keyboard is open.
 */
export function MobileActionBar({
  labels,
  phone,
  bookHref,
  hideOn,
}: {
  labels: ActionBarLabels;
  phone: { tel: string; display: string };
  bookHref: string;
  hideOn: string[];
}) {
  const pathname = usePathname();
  const [heroVisible, setHeroVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const target = document.querySelector("[data-hero-cta]");
    if (!target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on the DOM of the new route
      setHeroVisible(false);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.matches("input:not([type=checkbox]):not([type=radio]), textarea, select") || el.isContentEditable);
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const hiddenRoute = hideOn.some((p) => pathname.startsWith(p));
  const hidden = hiddenRoute || heroVisible || typing;

  const item = "pressable flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.75rem] font-semibold";

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 px-2 pb-[calc(8px+env(safe-area-inset-bottom))] transition-[transform,opacity] duration-500 ease-(--ease-out) lg:hidden",
          hidden ? "pointer-events-none translate-y-[130%] opacity-0" : "translate-y-0 opacity-100",
        )}
        inert={hidden}
      >
        <nav aria-label={labels.mobileNav} className="glass mx-auto flex max-w-md items-center gap-1 rounded-[26px] p-1.5" data-refract="">
          <a href={`tel:${phone.tel}`} className={cn(item, "hover:bg-fg/[0.06]")} data-track="phone_click" data-track-location="action_bar">
            <Phone aria-hidden size={20} strokeWidth={1.75} />
            {labels.call}
          </a>
          <button type="button" className={cn(item, "hover:bg-fg/[0.06]")} onClick={() => setSheet(true)} aria-haspopup="dialog">
            <MessageCircle aria-hidden size={20} strokeWidth={1.75} />
            {labels.write}
          </button>
          <Link
            href={bookHref}
            prefetch={false}
            data-book=""
            data-book-source="action_bar"
            className={cn(item, "flex-[1.4] flex-row gap-2 bg-accent text-[0.9375rem] text-accent-fg shadow-[0_6px_20px_-6px_rgb(var(--accent-rgb)/0.6)]")}
          >
            <CalendarCheck aria-hidden size={19} strokeWidth={1.9} />
            {labels.book}
          </Link>
        </nav>
      </div>
      <MessengerSheet open={sheet} onClose={() => setSheet(false)} labels={labels.messengers} closeLabel={labels.close} phone={phone} location="action_bar" />
    </>
  );
}
