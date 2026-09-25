/**
 * WCAG contrast check for design-token pairs in both themes.
 * Reads src/styles/tokens.css, resolves hex values and fails (exit 1) on any pair below its target.
 * Usage: node scripts/check-contrast.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const css = await readFile(path.resolve(import.meta.dirname, "../src/styles/tokens.css"), "utf8");

function block(selector) {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  return "";
}

function vars(text) {
  const out = {};
  for (const m of text.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[m[1]] = m[2];
  return out;
}

const light = vars(block(":root {"));
const dark = { ...light, ...vars(block(':root[data-theme="dark"]')) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum]
const pairs = [
  ["fg", "bg", 4.5],
  ["fg", "bg-elevated", 4.5],
  ["fg", "bg-sand", 4.5],
  ["fg-muted", "bg", 4.5],
  ["fg-muted", "bg-elevated", 4.5],
  ["fg-muted", "bg-sand", 4.5],
  ["fg-subtle", "bg", 3],
  ["accent", "bg", 4.5],
  ["accent", "bg-elevated", 4.5],
  ["accent-fg", "accent", 4.5],
  ["accent-fg", "accent-hover", 4.5],
  ["accent-soft-fg", "accent-soft", 4.5],
  ["success", "bg", 4.5],
  ["success", "success-soft", 4.5],
  ["warning", "bg", 4.5],
  ["error", "bg", 4.5],
  ["error", "error-soft", 4.5],
  ["info", "bg", 4.5],
  ["fg-inverse", "bg-inverse", 4.5],
  ["fg-inverse-muted", "bg-inverse", 4.5],
];

let failed = 0;
for (const [theme, t] of [["light", light], ["dark", dark]]) {
  console.log(`\n${theme}`);
  for (const [f, b, min] of pairs) {
    if (!t[f] || !t[b]) continue;
    const r = ratio(t[f], t[b]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "✓" : "✗"} ${f.padEnd(18)} on ${b.padEnd(14)} ${r.toFixed(2)}:1 (min ${min})`);
  }
}
if (failed) {
  console.error(`\n${failed} pair(s) below target`);
  process.exit(1);
}
console.log("\nAll token pairs pass.");
