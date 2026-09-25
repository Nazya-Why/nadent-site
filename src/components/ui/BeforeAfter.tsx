"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/format";

/**
 * Drag-to-compare slider. The handle is a native range input, so it works with
 * keyboard (arrows, Home/End) and screen readers; pointer drag works anywhere on the image.
 */
export function BeforeAfter({
  before,
  after,
  labels,
  className,
  trackId,
}: {
  before: ReactNode;
  after: ReactNode;
  labels: { before: string; after: string; slider: string };
  className?: string;
  trackId?: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const tracked = useRef(false);

  const fromPointer = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
    if (!tracked.current) {
      tracked.current = true;
      track("before_after_drag", { case: trackId });
    }
  };

  return (
    <div
      ref={box}
      className={cn("relative isolate cursor-ew-resize touch-pan-y overflow-hidden select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-accent", className)}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        // Touch: wait for movement so a vertical scroll never jumps the handle
        if (e.pointerType === "mouse") fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[0.8125rem] font-semibold text-white backdrop-blur-md">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[0.8125rem] font-semibold text-white backdrop-blur-md">
        {labels.after}
      </span>

      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]" style={{ left: `${pos}%` }}>
        <span className="glass absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-fg">
          <ChevronsLeftRight size={22} strokeWidth={1.75} />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={labels.slider}
        aria-valuetext={`${labels.before} ${Math.round(pos)}% · ${labels.after} ${100 - Math.round(pos)}%`}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0"
      />
    </div>
  );
}
