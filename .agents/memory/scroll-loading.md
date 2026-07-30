---
name: Scroll and loading
description: Lenis smooth scroll config and loading screen timing — values the user has approved.
---

# Scroll & Loading Screen Settings

## Lenis smooth scroll
File: `artifacts/portfolio/src/pages/Home.tsx`

```ts
lenis = new Lenis({
  duration: 0.7,           // DO NOT increase — user wants snappy scroll (was 1.2, felt sluggish)
  easing: (t) => 1 - Math.pow(1 - t, 3),  // cubic ease-out — fast start, gentle stop
  orientation: "vertical",
  smoothWheel: true,
  prevent: (node) => node.closest('[role="dialog"]') !== null || node.closest('[data-lenis-prevent]') !== null,
});
```

Import is dynamic (`await import(...)`) with try/catch — Lenis is optional, portfolio works without it.

## Loading screen
File: `artifacts/portfolio/src/components/effects/LoadingScreen.tsx`

- Duration: **2300ms** (timer in `Home.tsx`)
- Design: HUD-style — spinning "F" logo ring, dashed counter-ring, letter-by-letter brand name, % counter (0→100), shimmer progress bar, corner bracket decorations, floating code fragment particles
- Exit: scale + fade out animation controlled by `isLoading` prop

**Why duration 2300ms:** balances the letter-by-letter animation completion with the % counter reaching 100.

## CSS note
`html { scroll-behavior: auto; }` in `index.css` — native smooth scroll is intentionally disabled so Lenis doesn't fight it.
