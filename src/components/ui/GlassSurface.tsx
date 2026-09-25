import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

export type GlassVariant = "regular" | "clear" | "tinted" | "prominent";

export interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: GlassVariant;
  /** Specular highlight that follows the pointer (desktop only) */
  shine?: boolean;
  /** SVG displacement refraction (Chromium desktop only, see GlassDefs) */
  refract?: boolean;
  /** What sits underneath: flips the tint to keep text contrast */
  under?: "light" | "dark";
  children?: ReactNode;
}

/**
 * Liquid Glass surface. Styling lives in src/styles/glass.css; this component only
 * maps props to classes and data attributes so it stays a server component.
 */
export function GlassSurface({
  as: Tag = "div",
  variant = "regular",
  shine = false,
  refract = false,
  under,
  className,
  children,
  ...rest
}: GlassSurfaceProps) {
  return (
    <Tag
      className={cn("glass", variant !== "regular" && `glass--${variant}`, className)}
      data-shine={shine ? "" : undefined}
      data-refract={refract ? "" : undefined}
      data-under={under}
      {...rest}
    >
      {children}
    </Tag>
  );
}
