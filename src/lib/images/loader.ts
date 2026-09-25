/**
 * Default next/image loader for the static export. Pre-optimized variants live in
 * /images/_opt and are produced by scripts/images.mjs; ImageSlot passes its own
 * format-specific loaders, so this one only serves plain <Image> usages.
 */
export default function staticLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
