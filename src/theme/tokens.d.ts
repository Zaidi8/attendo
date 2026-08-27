// Type declarations for tokens.js so TypeScript consumers get full typing
// without enabling allowJs. Runtime values come from tokens.js.

export const colors: {
  primary: { DEFAULT: string; deep: string };
  secondary: { DEFAULT: string; deep: string };
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  present: string;
  absent: string;
  warning: string;
  info: string;
};

export const borderRadius: Record<string, string>;

export const fontFamily: Record<string, string[]>;

export const fontSize: Record<string, [string, string]>;
