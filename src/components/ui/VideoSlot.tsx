"use client";

import { useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";

/**
 * Click-to-play video facade: only the poster loads until the visitor asks for the
 * video (no 1 MB player on page load). Accepts a YouTube id or an mp4 URL.
 * Without a source it stays an honest placeholder.
 */
export function VideoSlot({
  poster,
  youtubeId,
  src,
  title,
  playLabel,
  soonLabel,
  className,
  caption,
}: {
  poster: ReactNode;
  youtubeId?: string;
  src?: string;
  title: string;
  playLabel: string;
  soonLabel?: string;
  className?: string;
  caption?: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  const available = Boolean(youtubeId || src);

  return (
    <figure className={cn("relative isolate overflow-hidden", className)}>
      {playing && youtubeId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : playing && src ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={src} controls autoPlay playsInline title={title} />
      ) : (
        <>
          <div className="absolute inset-0">{poster}</div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
          <button
            type="button"
            onClick={() => {
              if (!available) return;
              setPlaying(true);
              track("video_play", { title });
            }}
            aria-label={`${playLabel}: ${title}`}
            aria-disabled={!available}
            className="group absolute inset-0 grid place-items-center"
          >
            <span className="glass glass--clear grid size-16 place-items-center rounded-full text-white transition-transform duration-300 ease-(--ease-out) group-hover:scale-110 md:size-20">
              <Play aria-hidden size={26} fill="currentColor" className="translate-x-0.5" />
            </span>
          </button>
          {!available && soonLabel && (
            <span className="absolute top-3 left-3 hidden rounded-full bg-black/45 md:block px-3 py-1 text-[0.75rem] font-medium text-white backdrop-blur">{soonLabel}</span>
          )}
          {caption && <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white md:p-5">{caption}</figcaption>}
        </>
      )}
    </figure>
  );
}
