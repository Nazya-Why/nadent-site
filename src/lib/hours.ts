import { clinic, type OpeningSlot, type Weekday } from "@/config/clinic";

export interface OpenStatus {
  open: boolean;
  /** "HH:MM" of today's closing time while open */
  closesAt?: string;
  /** Next opening: weekday + "HH:MM" */
  opensAt?: { day: Weekday; time: string; isToday: boolean; isTomorrow: boolean };
  closingSoon: boolean;
}

function kyivNow(date = new Date()): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: clinic.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: days.indexOf(get("weekday")) as Weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function slotFor(day: Weekday, hours: readonly OpeningSlot[] = clinic.hours): OpeningSlot | undefined {
  return hours.find((s) => s.days.includes(day));
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = kyivNow(date);
  const today = slotFor(day);
  if (today) {
    const o = toMinutes(today.open);
    const c = toMinutes(today.close);
    if (minutes >= o && minutes < c) {
      return { open: true, closesAt: today.close, closingSoon: c - minutes <= 45 };
    }
    if (minutes < o) {
      return { open: false, opensAt: { day, time: today.open, isToday: true, isTomorrow: false }, closingSoon: false };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = ((day + i) % 7) as Weekday;
    const slot = slotFor(d);
    if (slot) {
      return { open: false, opensAt: { day: d, time: slot.open, isToday: false, isTomorrow: i === 1 }, closingSoon: false };
    }
  }
  return { open: false, closingSoon: false };
}

/** Today's weekday in Kyiv, for highlighting the schedule. */
export function kyivWeekday(date = new Date()): Weekday {
  return kyivNow(date).day;
}
