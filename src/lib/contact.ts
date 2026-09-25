import { clinic } from "@/config/clinic";
import { site } from "@/config/site";

/** The one place that decides which phone is shown (call tracking swaps it via env). */
export function phone() {
  if (site.trackingPhone.tel && site.trackingPhone.display) return site.trackingPhone;
  return clinic.phones.main;
}

export type Messenger = "telegram" | "viber" | "whatsapp";

export function messengerHref(channel: Messenger, text?: string): string {
  const m = clinic.messengers;
  const encoded = text ? encodeURIComponent(text) : "";
  switch (channel) {
    case "telegram":
      return `https://t.me/${m.telegram}${encoded ? `?text=${encoded}` : ""}`;
    case "viber":
      return `viber://chat?number=${encodeURIComponent(m.viber)}${encoded ? `&draft=${encoded}` : ""}`;
    case "whatsapp":
      return `https://wa.me/${m.whatsapp}${encoded ? `?text=${encoded}` : ""}`;
  }
}
