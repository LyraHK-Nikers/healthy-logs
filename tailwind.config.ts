import type { Config } from "tailwindcss";

/**
 * Design tokens live as CSS custom properties in app/globals.css (see DESIGN_SYSTEM.md).
 * Tailwind references them so colors stay in ONE place and remain themeable.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        highlight: "var(--highlight)",
        highlightText: "var(--highlight-text)",
      },
      fontFamily: {
        // wired to next/font CSS variables in app/layout.tsx
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // type scale from DESIGN_SYSTEM.md (rem)
        xs: "0.8rem",
        sm: "0.9rem",
        base: "1rem",
        md: "1.125rem",
        lg: "1.375rem",
        xl: "1.75rem",
        "2xl": "2.25rem",
        "3xl": "3rem",
      },
      maxWidth: {
        article: "720px",
        container: "1140px",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
