import { useId } from "react";
import { cn } from "@/lib/format";

/** NaDent mark: an arch that reads as a lowercase "n" and as a tooth crown. */
export function LogoMark({ className }: { className?: string }) {
  const gid = useId();
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden focusable="false">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a8a91" />
          <stop offset="1" stopColor="#0a5a61" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill={`url(#${gid})`} />
      <path d="M1 10.5C6 7 26 7 31 10.5" stroke="#fff" strokeOpacity=".22" strokeWidth="1" fill="none" />
      <path d="M10 23v-7.2a6 6 0 0 1 12 0V23" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[1.3125rem] leading-none tracking-[-0.035em]">
        <span className="font-bold">Na</span>
        <span className="font-medium">Dent</span>
      </span>
    </span>
  );
}
