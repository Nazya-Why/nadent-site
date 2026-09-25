"use client";

import { Phone } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { messengerHref, type Messenger } from "@/lib/contact";
import { cn } from "@/lib/format";

export interface MessengerLabels {
  title: string;
  subtitle: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  prefill: string;
  call: string;
}

const brand: Record<Messenger, { bg: string; icon: React.ReactElement }> = {
  telegram: {
    bg: "bg-[#229ED9]",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="currentColor">
        <path d="M21.4 4.6 2.9 11.7c-1.3.5-1.2 2.3.1 2.7l4.6 1.4 1.8 5.6c.3.9 1.5 1.2 2.2.5l2.6-2.5 4.7 3.5c.8.6 2 .1 2.2-.9L24 6c.3-1.3-1-2.2-2.6-1.4ZM9.6 15l-.4 4.2-1.3-4.3 10-6.3-8.3 6.4Z" />
      </svg>
    ),
  },
  viber: {
    bg: "bg-[#7360F2]",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="currentColor">
        <path d="M12 2C6.6 2 3 4.8 3 10.4c0 3 1 5.2 2.9 6.6V21c0 .7.8 1 1.3.6l2.6-2.4c.7.1 1.4.2 2.2.2 5.4 0 9-2.8 9-8.4S17.4 2 12 2Zm4.4 12.3c-.3.8-1.5 1.5-2.1 1.5-.6.1-1.2.3-3.9-.8-3.3-1.3-5.3-4.7-5.5-4.9-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.2 1.5Z" />
      </svg>
    ),
  },
  whatsapp: {
    bg: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.7-3.1-1.3-5.1-4.5-5.3-4.7-.2-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.2 1.6Z" />
      </svg>
    ),
  },
};

export function MessengerButtons({ labels, location, className }: { labels: MessengerLabels; location: string; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {(["telegram", "viber", "whatsapp"] as const).map((m) => (
        <a
          key={m}
          href={messengerHref(m, labels.prefill)}
          target={m === "viber" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="pressable flex h-14 items-center gap-4 rounded-2xl bg-bg-elevated px-4 font-semibold shadow-sm ring-1 ring-line hover:ring-line-strong"
          data-track="messenger_click"
          data-track-channel={m}
          data-track-location={location}
        >
          <span className={cn("grid size-9 place-items-center rounded-xl text-white", brand[m].bg)}>{brand[m].icon}</span>
          {labels[m]}
        </a>
      ))}
    </div>
  );
}

export function MessengerSheet({
  open,
  onClose,
  labels,
  closeLabel,
  phone,
  location,
}: {
  open: boolean;
  onClose: () => void;
  labels: MessengerLabels;
  closeLabel: string;
  phone: { tel: string; display: string };
  location: string;
}) {
  return (
    <Sheet open={open} onClose={onClose} label={labels.title} closeLabel={closeLabel} size="sm">
      <div className="px-5 pt-2 pb-6 md:p-8">
        <p className="t-h3 pr-12">{labels.title}</p>
        <p className="mt-2 text-fg-muted">{labels.subtitle}</p>
        <MessengerButtons labels={labels} location={location} className="mt-6" />
        <a
          href={`tel:${phone.tel}`}
          className="pressable mt-2 flex h-14 items-center gap-4 rounded-2xl px-4 font-semibold hover:bg-fg/[0.05]"
          data-track="phone_click"
          data-track-location={location}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-fg">
            <Phone aria-hidden size={18} />
          </span>
          <span>
            {labels.call} · <span className="t-num">{phone.display}</span>
          </span>
        </a>
      </div>
    </Sheet>
  );
}
