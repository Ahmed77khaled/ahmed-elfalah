---
name: Photo integration
description: How to add Ahmed's personal photo to the portfolio Hero section.
---

# Adding a Personal Photo to the Portfolio

## Where the photo goes
**Best location: Hero section → `PortraitOrb` component** — this is the circular frame on the right side of the hero. It currently shows an abstract glowing SVG silhouette as a placeholder.

## How to add it (2 steps)
1. Upload the photo file to `attached_assets/` (e.g. `attached_assets/ahmed.jpg`).
2. Open `artifacts/portfolio/src/components/sections/Hero.tsx` and change line:
   ```ts
   const PORTRAIT_SRC: string | null = null;
   ```
   to:
   ```ts
   const PORTRAIT_SRC: string | null = "@assets/ahmed.jpg";
   ```
   (`@assets` is aliased to `../../attached_assets` in `artifacts/portfolio/vite.config.ts`)

## What happens when photo is set
- The orb shows the real photo (`object-cover object-top` so face is prioritised).
- A subtle gradient fade at the bottom blends the photo into the dark background.
- A cyan rim-light ring overlay keeps the futuristic aesthetic.
- The spinning rings and floating badges stay exactly as before.

## Why this location
The Hero orb is the most prominent visual in the portfolio — first thing visitors see. A real photo here makes the portfolio personal and memorable. The About section is text-only, so there is no natural photo slot there.
