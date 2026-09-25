import { Building2, Camera, Cpu, HeartHandshake, ImageIcon, ScanFace, Sparkles, UserRound, Video } from "lucide-react";
import type { ImageKind } from "@/content/image-registry";

const icons: Record<ImageKind, typeof Camera> = {
  hero: Sparkles,
  interior: Building2,
  equipment: Cpu,
  portrait: UserRound,
  people: HeartHandshake,
  service: Camera,
  case: ScanFace,
  video: Video,
  og: ImageIcon,
};

/**
 * Brand-coloured stand-in shown until a real photo is dropped into public/images.
 * Soft mesh gradient + hairline icon + slot id, so the layout reads as finished.
 */
export function PlaceholderArt({ id, kind, alt, quiet }: { id: string; kind: ImageKind; alt: string; quiet?: boolean }) {
  const Icon = icons[kind];
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 15% 10%, var(--ph-c) 0%, transparent 55%), radial-gradient(90% 80% at 90% 100%, var(--ph-b) 0%, transparent 60%), linear-gradient(160deg, var(--ph-a), var(--ph-b))",
      }}
    >
      <div aria-hidden className="ph-noise absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 grid place-items-center">
        <Icon aria-hidden strokeWidth={1} className="size-[clamp(28px,12%,56px)] text-(--ph-fg) opacity-60" />
      </div>
      {!quiet && (
        <span
          aria-hidden
          className="absolute right-[max(12px,4%)] bottom-[max(12px,5%)] max-w-[calc(100%-24px)] truncate rounded-full bg-white/55 px-2.5 py-1 font-mono text-[11px] leading-none tracking-tight text-(--ph-fg) backdrop-blur-sm dark:bg-black/30"
        >
          {id}
        </span>
      )}
    </div>
  );
}
