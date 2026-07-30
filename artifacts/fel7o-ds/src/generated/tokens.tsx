/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#F0F4FF",
      "foreground": "#050816",
      "card": "#FFFFFF",
      "cardForeground": "#050816",
      "popover": "#FFFFFF",
      "popoverForeground": "#050816",
      "primary": "#0099CC",
      "primaryForeground": "#FFFFFF",
      "secondary": "#EEF0FF",
      "secondaryForeground": "#050816",
      "muted": "#EEF0FF",
      "mutedForeground": "#6B7280",
      "accent": "#6D28D9",
      "accentForeground": "#FFFFFF",
      "destructive": "#DC2626",
      "destructiveForeground": "#FFFFFF",
      "border": "#D1D8F0",
      "input": "#D1D8F0",
      "ring": "#0099CC",
      "chart1": "#0099CC",
      "chart2": "#6D28D9",
      "chart3": "#059669",
      "chart4": "#DC2626",
      "chart5": "#D97706",
      "sidebar": "#F8FAFF",
      "sidebarForeground": "#374151",
      "sidebarBorder": "#D1D8F0",
      "sidebarPrimary": "#0099CC",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#EEF0FF",
      "sidebarAccentForeground": "#050816",
      "sidebarRing": "#0099CC"
    },
    "dark": {
      "background": "#050816",
      "foreground": "#FFFFFF",
      "card": "#0A0D1A",
      "cardForeground": "#FFFFFF",
      "popover": "#0A0D1A",
      "popoverForeground": "#FFFFFF",
      "primary": "#00D4FF",
      "primaryForeground": "#050816",
      "secondary": "#0D1220",
      "secondaryForeground": "#FFFFFF",
      "muted": "#0D1220",
      "mutedForeground": "#B5BFD0",
      "accent": "#7C3AED",
      "accentForeground": "#FFFFFF",
      "destructive": "#FF4444",
      "destructiveForeground": "#FFFFFF",
      "border": "#1A2040",
      "input": "#1A2040",
      "ring": "#00D4FF",
      "chart1": "#00D4FF",
      "chart2": "#7C3AED",
      "chart3": "#00FF88",
      "chart4": "#FF6B6B",
      "chart5": "#FFD700",
      "sidebar": "#07091A",
      "sidebarForeground": "#B5BFD0",
      "sidebarBorder": "#1A2040",
      "sidebarPrimary": "#00D4FF",
      "sidebarPrimaryForeground": "#050816",
      "sidebarAccent": "#0D1220",
      "sidebarAccentForeground": "#FFFFFF",
      "sidebarRing": "#00D4FF"
    }
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "Fira Code",
      "Menlo",
      "monospace"
    ]
  },
  "radius": "1.5rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
