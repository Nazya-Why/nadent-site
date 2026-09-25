import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function SectionHeader({
  overline,
  title,
  lead,
  align = "left",
  as: H = "h2",
  size = "h2",
  action,
  className,
  id,
}: {
  overline?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2" | "h3";
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", center ? "max-w-3xl items-center" : "max-w-3xl")}>
        {overline && (
          <p className="t-overline text-accent" data-reveal>
            {overline}
          </p>
        )}
        <H id={id} className={cn(`t-${size}`)} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          {title}
        </H>
        {lead && (
          <p className="t-body-lg text-fg-muted measure" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            {lead}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          {action}
        </div>
      )}
    </div>
  );
}

export function Chip({ children, className, tone = "neutral" }: { children: ReactNode; className?: string; tone?: "neutral" | "accent" | "success" | "glass" }) {
  const tones = {
    neutral: "bg-fg/[0.05] text-fg dark:bg-white/[0.08]",
    accent: "bg-accent-soft text-accent-soft-fg",
    success: "bg-success-soft text-success",
    glass: "glass glass--clear text-fg",
  };
  return (
    <span className={cn("inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.875rem] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-full bg-accent px-2.5 text-[0.75rem] font-semibold tracking-wide text-accent-fg", className)}>
      {children}
    </span>
  );
}
