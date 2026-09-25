/** Animated success mark: circle draws, then the check. Pure CSS/SVG. */
export function SuccessCheck({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" aria-hidden className="text-success">
      <circle
        cx="44"
        cy="44"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="252"
        strokeDashoffset="252"
        className="origin-center -rotate-90 [animation:nd-draw_700ms_var(--ease-out)_forwards]"
      />
      <path
        d="M28 45.5 39 56l22-24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="50"
        strokeDashoffset="50"
        className="[animation:nd-draw_420ms_var(--ease-out)_520ms_forwards]"
      />
    </svg>
  );
}
