import { getImageProps, type ImageLoader } from "next/image";
import { preload } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import manifest from "@/generated/images.json";
import { asset } from "@/config/site";
import { imageRegistry, type ImageId } from "@/content/image-registry";
import { cn } from "@/lib/format";
import { PlaceholderArt } from "./PlaceholderArt";

type ManifestEntry = { w: number; h: number; widths: number[]; blur: string };
const images = manifest as Record<string, ManifestEntry>;

export interface ImageSlotProps {
  id: ImageId;
  alt: string;
  /** Art-directed variant below 768px */
  mobileId?: ImageId;
  /** CSS aspect-ratio, e.g. "4/5". Defaults to the registry value. `fill` ignores it. */
  aspect?: string;
  mobileAspect?: string;
  sizes?: string;
  /** LCP image: eager + high fetch priority + preload */
  priority?: boolean;
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
  /** Apple-style zoom-out while scrolling into view */
  scrollZoom?: boolean;
  /** Hide the id/description caption on the placeholder (e.g. tiny avatars) */
  quietPlaceholder?: boolean;
  children?: ReactNode;
}

function makeLoader(id: string, format: "avif" | "webp"): ImageLoader {
  const widths = images[id]?.widths ?? [];
  return ({ width }) => {
    const w = widths.find((x) => x >= width) ?? widths.at(-1) ?? width;
    return asset(`/images/_opt/${id}-${w}.${format}`);
  };
}

function sources(id: string, alt: string, sizes: string, priority: boolean) {
  const entry = images[id];
  const common = { src: id, alt, width: entry.w, height: entry.h, sizes } as const;
  const avif = getImageProps({ ...common, loader: makeLoader(id, "avif") }).props;
  const webp = getImageProps({
    ...common,
    loader: makeLoader(id, "webp"),
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
  }).props;
  return { avif, webp, entry };
}

export function ImageSlot({
  id,
  alt,
  mobileId,
  aspect,
  mobileAspect,
  sizes = "100vw",
  priority = false,
  fill = false,
  className,
  imgClassName,
  objectPosition,
  scrollZoom = false,
  quietPlaceholder = false,
  children,
}: ImageSlotProps) {
  const meta = imageRegistry[id];
  const ratio = aspect ?? meta.aspect;
  const mRatio = mobileAspect ?? (mobileId ? imageRegistry[mobileId].aspect : undefined);

  const style: CSSProperties & Record<string, string | undefined> = fill
    ? {}
    : { "--ar": ratio.replace(":", "/"), "--ar-m": (mRatio ?? ratio).replace(":", "/") };

  const wrapperClass = cn(
    "overflow-hidden",
    fill ? "absolute inset-0" : "relative aspect-(--ar-m) md:aspect-(--ar)",
    className,
  );

  const hasMain = Boolean(images[id]);
  const hasMobile = mobileId ? Boolean(images[mobileId]) : false;

  if (!hasMain) {
    return (
      <div className={wrapperClass} style={style}>
        <PlaceholderArt id={mobileId && !hasMobile ? `${id} · ${mobileId}` : id} kind={meta.kind} alt={alt} quiet={quietPlaceholder} />
        {children}
      </div>
    );
  }

  const main = sources(id, alt, sizes, priority);
  const mobile = mobileId && hasMobile ? sources(mobileId, alt, "100vw", priority) : null;

  if (priority) {
    // Preload the format most browsers pick; the media query keeps mobile and desktop from both loading.
    if (mobile) {
      preload(mobile.avif.src, { as: "image", imageSrcSet: mobile.avif.srcSet, imageSizes: "100vw", type: "image/avif", fetchPriority: "high", media: "(max-width: 767px)" });
      preload(main.avif.src, { as: "image", imageSrcSet: main.avif.srcSet, imageSizes: sizes, type: "image/avif", fetchPriority: "high", media: "(min-width: 768px)" });
    } else {
      preload(main.avif.src, { as: "image", imageSrcSet: main.avif.srcSet, imageSizes: sizes, type: "image/avif", fetchPriority: "high" });
    }
  }

  const { width, height, srcSet: _s, ...imgRest } = main.webp;
  void _s;

  return (
    <div
      className={wrapperClass}
      style={{ ...style, backgroundImage: `url(${main.entry.blur})`, backgroundSize: "cover", backgroundPosition: objectPosition ?? "center" }}
    >
      <picture>
        {mobile && <source media="(max-width: 767px)" type="image/avif" srcSet={mobile.avif.srcSet} sizes="100vw" />}
        {mobile && <source media="(max-width: 767px)" type="image/webp" srcSet={mobile.webp.srcSet} sizes="100vw" />}
        <source type="image/avif" srcSet={main.avif.srcSet} sizes={sizes} />
        <source type="image/webp" srcSet={main.webp.srcSet} sizes={sizes} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- props come from getImageProps */}
        <img
          {...imgRest}
          width={width}
          height={height}
          decoding="async"
          data-scroll-zoom={scrollZoom ? "" : undefined}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
          style={{ objectPosition }}
        />
      </picture>
      {children}
    </div>
  );
}
