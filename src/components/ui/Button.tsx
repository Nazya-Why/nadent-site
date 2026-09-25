import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "inverse" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "pressable relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] outline-offset-4 disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_6px_20px_-6px_rgb(var(--accent-rgb)/0.55)] hover:bg-accent-hover active:bg-accent-active",
  secondary: "bg-fg/[0.06] text-fg hover:bg-fg/[0.1] active:bg-fg/[0.14] dark:bg-white/10 dark:hover:bg-white/15",
  ghost: "text-fg hover:bg-fg/[0.06] active:bg-fg/[0.1]",
  glass: "glass text-fg hover:[--glass-bg:var(--glass-prominent)]",
  inverse: "bg-fg text-bg hover:opacity-90",
  link: "rounded-md px-0! text-accent underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 min-w-9 px-4 text-[0.9375rem]",
  md: "h-11 min-w-11 px-5 text-[1rem]",
  lg: "h-13 min-w-13 px-7 text-[1.0625rem]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

function Spinner() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 m-auto size-5 rounded-full border-2 border-current border-r-transparent [animation:nd-spin_0.7s_linear_infinite]"
    />
  );
}

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", icon, iconEnd, loading, className, children, ...rest } = props;
  const cls = buttonClass(variant, size, className);
  const content = (
    <>
      {loading && <Spinner />}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {icon}
        {children}
        {iconEnd}
      </span>
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, external, ...anchor } = rest as AsLink;
    const isExternal = external || /^(https?:|tel:|mailto:|viber:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} prefetch={"data-book" in anchor ? false : undefined} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...button } = rest as AsButton;
  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...button}>
      {content}
    </button>
  );
}
