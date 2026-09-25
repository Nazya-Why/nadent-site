"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/format";

/**
 * Map facade: a lightweight branded preview; the Google Maps iframe (≈1 MB and
 * third-party cookies) loads only after an explicit click.
 */
export function MapFacade({ embedUrl, title, buttonLabel, address, className }: { embedUrl: string; title: string; buttonLabel: string; address: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative isolate overflow-hidden bg-bg-sunken", className)}>
      {loaded ? (
        <iframe src={embedUrl} title={title} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <>
          {/* Stylised street grid */}
          <svg aria-hidden className="absolute inset-0 h-full w-full text-fg/[0.07]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
            <g stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round">
              <path d="M-20 90 C 120 70, 220 120, 420 80" />
              <path d="M-20 210 C 140 230, 260 170, 420 220" />
              <path d="M90 -20 C 110 120, 70 200, 120 320" />
              <path d="M270 -20 C 250 110, 300 190, 260 320" />
            </g>
            <g stroke="currentColor" strokeWidth="3" fill="none">
              <path d="M-20 150 H 420" />
              <path d="M190 -20 V 320" />
              <path d="M-20 40 L 420 260" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0,var(--bg-sunken)_75%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="relative grid size-14 place-items-center rounded-full bg-accent text-accent-fg shadow-[0_10px_30px_-8px_rgb(var(--accent-rgb)/0.7)]">
              <span className="absolute inset-0 rounded-full bg-accent/40 [animation:nd-ping_2.4s_var(--ease-out)_infinite]" aria-hidden />
              <MapPin aria-hidden size={24} />
            </span>
            <p className="font-semibold">{address}</p>
            <button type="button" onClick={() => setLoaded(true)} className="glass pressable h-11 rounded-full px-5 font-semibold">
              {buttonLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
