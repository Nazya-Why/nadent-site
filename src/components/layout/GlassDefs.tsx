/**
 * Shared SVG filter for Liquid Glass refraction. Referenced from
 * `backdrop-filter: url(#glass-refraction)` (Chromium only, see glass.css).
 * Low-frequency noise → soft displacement: the backdrop bends like thick glass
 * without looking distorted.
 */
export function GlassDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <filter id="glass-refraction" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="11" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2.5" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="22" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
