"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/format";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name */
  label: string;
  /** bottom sheet on mobile + centred card on desktop (default) · full-screen menu */
  variant?: "sheet" | "fullscreen";
  closeLabel: string;
  className?: string;
  /** Desktop max width */
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  /** Rendered above scrolling content (e.g. progress bar) */
  header?: ReactNode;
  /** Sticky footer (e.g. form navigation) */
  footer?: ReactNode;
}

let openCount = 0;
function lockScroll(lock: boolean) {
  openCount = Math.max(0, openCount + (lock ? 1 : -1));
  const root = document.documentElement;
  if (openCount > 0) {
    root.style.setProperty("--scrollbar-w", `${window.innerWidth - root.clientWidth}px`);
    root.classList.add("nd-locked");
  } else {
    root.classList.remove("nd-locked");
  }
  window.dispatchEvent(new CustomEvent("nd:scroll-lock", { detail: openCount > 0 }));
}

/**
 * Modal built on native <dialog>: focus trap, Esc, inert background and top layer
 * come from the platform. On phones it slides up as an iOS-style sheet and can be
 * dragged down to close.
 */
export function Sheet({
  open,
  onClose,
  label,
  variant = "sheet",
  closeLabel,
  className,
  size = "md",
  children,
  header,
  footer,
}: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lockScroll(true);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      lockScroll(false);
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) lockScroll(false);
    };
  }, []);

  // Drag-to-dismiss (touch, sheet variant only)
  useEffect(() => {
    const panel = panelRef.current;
    const dialog = ref.current;
    if (!panel || !dialog || variant !== "sheet") return;
    const handle = panel.querySelector<HTMLElement>("[data-sheet-handle]");
    if (!handle) return;
    let startY = 0;
    let dy = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      dragging = true;
      startY = e.clientY;
      dy = 0;
      handle.setPointerCapture(e.pointerId);
      dialog.style.transition = "none";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      dialog.style.transform = `translate3d(0, ${dy}px, 0)`;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      dialog.style.transition = "";
      dialog.style.transform = "";
      if (dy > 120) dialog.close();
    };
    handle.addEventListener("pointerdown", down);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    return () => {
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
    };
  }, [variant]);

  const sizes = { sm: "md:max-w-md", md: "md:max-w-xl", lg: "md:max-w-3xl", xl: "md:max-w-5xl" };

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={cn("nd-dialog", variant === "fullscreen" ? "nd-dialog--full" : "nd-dialog--sheet", sizes[size], className)}
      onClick={(e) => {
        // Backdrop click: the dialog itself is the target only outside the panel
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div ref={panelRef} className="glass glass--prominent nd-dialog__panel">
        {variant === "sheet" && (
          <div data-sheet-handle className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center md:hidden" aria-hidden>
            <span className="h-1.5 w-10 rounded-full bg-fg/20" />
          </div>
        )}
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
          className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-fg/[0.06] transition-colors hover:bg-fg/[0.1] md:top-4 md:right-4"
        >
          <X aria-hidden size={20} strokeWidth={1.75} />
        </button>
        {header}
        <div className="nd-dialog__body">{children}</div>
        {footer && <div className="nd-dialog__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
