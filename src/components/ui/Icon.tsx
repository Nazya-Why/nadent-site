import { Baby, Droplets, HeartHandshake, Microscope, Moon, ShieldCheck, Siren, Smile, Sparkles, Sun } from "lucide-react";
import type { SVGProps } from "react";
import type { IconName } from "@/content/types";

type Props = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

/** Hairline icons in the spirit of SF Symbols: 24px grid, 1.5px stroke, round caps. */
function Svg({ size = 24, strokeWidth = 1.5, children, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const custom: Partial<Record<IconName, (p: Props) => React.ReactElement>> = {
  implant: (p) => (
    <Svg {...p}>
      <path d="M7 4.6C7 3.7 7.8 3 8.8 3h6.4c1 0 1.8.7 1.8 1.6V6.9c0 1-.8 1.9-1.9 1.9H8.9C7.8 8.8 7 7.9 7 6.9Z" />
      <path d="M10.2 8.8v2h3.6v-2" />
      <path d="M10 10.8h4l-.45 8.6c-.05.9-.72 1.6-1.55 1.6s-1.5-.7-1.55-1.6Z" />
      <path d="M9.7 13.4h4.6M9.9 16h4.2M10.2 18.6h3.6" />
    </Svg>
  ),
  arch: (p) => (
    <Svg {...p}>
      <path d="M4 5c0 8.2 3.6 14 8 14s8-5.8 8-14" />
      <circle cx="6.1" cy="12.2" r="1.1" />
      <circle cx="9.6" cy="17.3" r="1.1" />
      <circle cx="14.4" cy="17.3" r="1.1" />
      <circle cx="17.9" cy="12.2" r="1.1" />
    </Svg>
  ),
  aligner: (p) => (
    <Svg {...p}>
      <path d="M3.5 6.5c0 7 3.8 12 8.5 12s8.5-5 8.5-12" />
      <path d="M7 6.5c0 4.7 2.2 8.3 5 8.3s5-3.6 5-8.3" />
      <path d="M3.5 6.5H7M17 6.5h3.5" />
    </Svg>
  ),
  braces: (p) => (
    <Svg {...p}>
      <path d="M2 12h20" />
      <rect x="3.5" y="9.5" width="4" height="5" rx="1" />
      <rect x="10" y="9.5" width="4" height="5" rx="1" />
      <rect x="16.5" y="9.5" width="4" height="5" rx="1" />
    </Svg>
  ),
  "tooth-gap": (p) => (
    <Svg {...p}>
      <path d="M2 7.5h20" />
      <path d="M2.5 7.5h5v6.5a2.5 2.5 0 0 1-5 0Z" />
      <path d="M16.5 7.5h5v6.5a2.5 2.5 0 0 1-5 0Z" />
      <path d="M9.5 7.5h5v6.5a2.5 2.5 0 0 1-5 0Z" strokeDasharray="2 2.2" />
    </Svg>
  ),
  crown: (p) => (
    <Svg {...p}>
      <path d="M5 9.2C5 6 6.9 4 9 4c1.2 0 2 .7 3 .7S13.8 4 15 4c2.1 0 4 2 4 5.2 0 2.4-1 3.6-1.5 6.2-.4 2.3-.9 4.6-2.4 4.6-1.6 0-1.6-4-3.1-4s-1.5 4-3.1 4c-1.5 0-2-2.3-2.4-4.6C6 12.8 5 11.6 5 9.2Z" />
    </Svg>
  ),
  scalpel: (p) => (
    <Svg {...p}>
      <path d="M3 21 11 13" />
      <path d="M11 13 17.6 6.4a2.1 2.1 0 0 1 3 3L14 16l-4.5 1.2Z" />
    </Svg>
  ),
  zigzag: (p) => (
    <Svg {...p}>
      <path d="M3 15.5 7 9l4 5.5L15 8l3 4.5 3-2" />
    </Svg>
  ),
};

const lucide = {
  sparkle: Sparkles,
  sun: Sun,
  droplet: Droplets,
  shield: ShieldCheck,
  microscope: Microscope,
  child: Baby,
  moon: Moon,
  siren: Siren,
  heart: HeartHandshake,
  smile: Smile,
} as const;

export function Icon({ name, size = 24, strokeWidth = 1.5, ...rest }: Props & { name: IconName }) {
  const C = custom[name];
  if (C) return <C size={size} strokeWidth={strokeWidth} {...rest} />;
  const L = lucide[name as keyof typeof lucide];
  return <L size={size} strokeWidth={strokeWidth} aria-hidden focusable="false" {...rest} />;
}
