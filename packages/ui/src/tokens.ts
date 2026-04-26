// Zenkai Design Tokens — single source of truth
// Import in any app: import { tokens } from "@zenkai/ui"

export const tokens = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg:       "#F5F3EC",  // warm off-white — page ground
  bgDark:   "#0F0E0E",  // near-black — inverted sections
  surface:  "rgba(15,14,14,0.03)",
  surface2: "rgba(15,14,14,0.06)",

  // ── Text ─────────────────────────────────────────────────────────────────
  ink:       "#0F0E0E",
  ink2:      "rgba(15,14,14,0.5)",
  ink3:      "rgba(15,14,14,0.28)",
  inkOnDark: "#F5F3EC",
  inkOnDark2:"rgba(245,243,236,0.5)",

  // ── Borders ──────────────────────────────────────────────────────────────
  border:       "rgba(15,14,14,0.1)",
  borderStrong: "rgba(15,14,14,0.2)",
  borderDark:   "rgba(245,243,236,0.08)",

  // ── Product accent colors ─────────────────────────────────────────────────
  scan:     "#0284C7",  // SenseiScan   — sky blue
  scanDim:  "rgba(2,132,199,0.06)",
  fin:      "#15803D",  // Financios    — forest green
  finDim:   "rgba(21,128,61,0.06)",
  jobs:     "#B45309",  // Sollicitatie — amber
  jobsDim:  "rgba(180,83,9,0.06)",
  workout:  "#C2410C",  // Workout      — burnt orange
  workoutDim:"rgba(194,65,12,0.06)",

  // ── Typography ────────────────────────────────────────────────────────────
  fontDisplay: "'Fraunces', Georgia, serif",
  fontMono:    "'IBM Plex Mono', monospace",

  // ── Spacing scale (rem) ──────────────────────────────────────────────────
  space: {
    xs:   "4px",
    sm:   "8px",
    md:  "16px",
    lg:  "32px",
    xl:  "64px",
    "2xl": "100px",
  },

  // ── Border radius ─────────────────────────────────────────────────────────
  // Zenkai uses sharp corners (radius: 0) by default — editorial aesthetic
  radius: "0px",
} as const;

// ── CSS variables string — paste into :root for any subdomain ─────────────
export const cssVariables = `
  --z-bg:         ${tokens.bg};
  --z-bg-dark:    ${tokens.bgDark};
  --z-ink:        ${tokens.ink};
  --z-ink-2:      ${tokens.ink2};
  --z-ink-3:      ${tokens.ink3};
  --z-border:     ${tokens.border};
  --z-scan:       ${tokens.scan};
  --z-fin:        ${tokens.fin};
  --z-jobs:       ${tokens.jobs};
  --z-workout:    ${tokens.workout};
  --z-font-display: ${tokens.fontDisplay};
  --z-font-mono:    ${tokens.fontMono};
`;
