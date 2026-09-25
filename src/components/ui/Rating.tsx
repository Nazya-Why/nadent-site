import { cn } from "@/lib/format";

function Star({ fill }: { fill: number }) {
  if (fill >= 1 || fill <= 0) {
    return (
      <svg viewBox="0 0 20 20" className="size-[1em]" aria-hidden focusable="false">
        <path fill="currentColor" fillOpacity={fill >= 1 ? 1 : 0.22} d="M10 1.6l2.47 5.13 5.63.72-4.13 3.9 1.04 5.58L10 14.2l-5.01 2.73 1.04-5.58-4.13-3.9 5.63-.72L10 1.6z" />
      </svg>
    );
  }
  const id = `s${Math.round(fill * 100)}`;
  return (
    <svg viewBox="0 0 20 20" className="size-[1em]" aria-hidden focusable="false">
      <defs>
        <linearGradient id={id}>
          <stop offset={fill} stopColor="currentColor" />
          <stop offset={fill} stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M10 1.6l2.47 5.13 5.63.72-4.13 3.9 1.04 5.58L10 14.2l-5.01 2.73 1.04-5.58-4.13-3.9 5.63-.72L10 1.6z"
      />
    </svg>
  );
}

/** Star rating with a text equivalent for assistive tech. */
export function Rating({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[#F5A524]", className)} role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={Math.max(0, Math.min(1, value - i))} />
      ))}
    </span>
  );
}
