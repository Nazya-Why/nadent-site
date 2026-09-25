import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { cn } from "@/lib/format";

export interface Crumb {
  name: string;
  href: string;
}

/** Full trail on desktop, "← Parent" on mobile. Emits BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, label, className }: { items: Crumb[]; label: string; className?: string }) {
  const parent = items.at(-2);
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label={label} className={cn("text-[0.875rem] text-fg-muted", className)}>
        {parent && (
          <Link href={parent.href} className="inline-flex min-h-11 items-center gap-1 font-medium hover:text-fg md:hidden">
            <ChevronLeft aria-hidden size={16} />
            {parent.name}
          </Link>
        )}
        <ol className="hidden flex-wrap items-center gap-1 md:flex">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="rounded-md hover:text-fg">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden size={14} className="opacity-50" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
