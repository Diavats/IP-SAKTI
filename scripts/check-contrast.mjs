// Contrast gate for the design tokens.
//
// CLAUDE.md §4 makes 4.5:1 a hard floor for body text, and §9 fixes the palette
// that has to clear it. Checking by eye does not scale past a handful of pairs,
// and the tokens were just re-tinted, so this reads the real values out of
// globals.css and computes the ratios.
//
//   node scripts/check-contrast.mjs
//
// Exits non-zero if any pair drops below its floor.

import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

/** Pull `--token: #hex;` declarations from the :root block. */
function readTokens(css) {
  const out = {};
  for (const [, name, hex] of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    // First declaration wins: :root comes before any later override.
    if (!(name in out)) out[name] = hex;
  }
  return out;
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const t = readTokens(CSS);

// [foreground token, background token, floor, what it is]
// 3.0 is the floor for large text and for non-text boundaries like borders;
// everything carrying body copy is held to 4.5.
const PAIRS = [
  ["foreground", "background", 4.5, "body text on the page"],
  ["foreground", "card", 4.5, "body text on cards"],
  ["muted-foreground", "background", 4.5, "secondary text on the page"],
  ["muted-foreground", "card", 4.5, "secondary text on cards"],
  ["muted-foreground", "muted", 4.5, "secondary text on muted fills"],
  ["secondary-foreground", "secondary", 4.5, "text on secondary fills"],
  ["primary-foreground", "primary", 4.5, "text on primary buttons"],
  ["on-brand", "brand", 4.5, "text on brand chrome"],
  ["accent-foreground", "accent", 4.5, "text on amber"],
  ["statute", "statute-bg", 4.5, "citation chips"],
  ["statute", "card", 4.5, "citation text on cards"],
  ["verdict-open", "verdict-open-bg", 4.5, "open verdict chips"],
  ["verdict-barred", "verdict-barred-bg", 4.5, "barred verdict chips"],
  ["verdict-draft", "verdict-draft-bg", 4.5, "draft verdict chips"],
  ["agent-prahari", "agent-prahari-bg", 4.5, "Prahari identity chips"],
  ["agent-sahayak", "agent-sahayak-bg", 4.5, "Sahayak identity chips"],
  ["destructive", "card", 4.5, "urgent text on cards"],
  ["border", "background", 1.2, "border against the page"],
];

let failed = 0;
console.log("contrast gate\n");

for (const [fg, bg, floor, label] of PAIRS) {
  if (!t[fg] || !t[bg]) {
    console.log(`  SKIP  ${label} (missing --${fg} or --${bg})`);
    continue;
  }
  const r = ratio(t[fg], t[bg]);
  const ok = r >= floor;
  if (!ok) failed++;
  console.log(
    `  ${ok ? "ok  " : "FAIL"}  ${r.toFixed(2)}:1  (min ${floor})  ${label}` +
      `  [${t[fg]} on ${t[bg]}]`,
  );
}

console.log(`\n${PAIRS.length - failed}/${PAIRS.length} pairs pass`);
if (failed) process.exitCode = 1;
