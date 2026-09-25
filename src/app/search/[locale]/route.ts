import { locales, type Locale } from "@/i18n/config";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: `${locale}.json` }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ locale: string }> }) {
  const { locale } = await ctx.params;
  const l = locale.replace(/\.json$/, "") as Locale;
  return Response.json(buildSearchIndex(locales.includes(l) ? l : "uk"));
}
