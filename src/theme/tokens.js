// Attendo design tokens — "Academic Precision" (Stitch is the visual source of truth).
//
// This is the single source of truth for design tokens, shared by both
// tailwind.config.js (require) and TypeScript code (src/theme). Authored in
// CommonJS so Tailwind can require it directly; typed via tokens.d.ts.
//
// Font family "Hanken Grotesk" is wired here but only takes effect once the
// font is loaded via expo-font (a later sprint); until then RN falls back to
// the system font.

/** Semantic color palette. */
const colors = {
  primary: { DEFAULT: '#1a2b3c', deep: '#041627' },
  secondary: { DEFAULT: '#4a90e2', deep: '#0060ac' },
  background: '#f8f9fb',
  surface: '#ffffff',
  foreground: '#1a1a1a', // text-primary
  muted: '#667085', // text-secondary
  border: '#e4e7ec', // border-subtle
  present: '#27ae60', // attendance: present
  absent: '#eb5757', // attendance: absent
  warning: '#f2994a',
  info: '#2f80ed',
  // Stitch "Academic Precision" tonal containers (auth + surfaces)
  'primary-fixed': '#d2e4fb',
  'secondary-fixed': '#d4e3ff',
  'on-secondary': '#ffffff',
  'on-primary': '#ffffff',
  'surface-container-low': '#f2f4f6',
};

/** Corner radii (design.md: 8px small, 10–14px primary). */
const borderRadius = {
  none: '0px',
  sm: '8px',
  DEFAULT: '10px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  '2xl': '16px',
  full: '9999px',
};

/** Font families. */
const fontFamily = {
  sans: ['Hanken Grotesk', 'System', 'sans-serif'],
  display: ['Hanken Grotesk', 'System', 'sans-serif'],
};

/** Type scale as [fontSize, lineHeight] pairs. */
const fontSize = {
  caption: ['12px', '16px'],
  label: ['12px', '16px'],
  'body-sm': ['14px', '20px'],
  body: ['16px', '24px'],
  headline: ['20px', '28px'],
  stat: ['24px', '30px'],
  display: ['32px', '38px'],
};

module.exports = { colors, borderRadius, fontFamily, fontSize };
