---
name: Photo integration
description: How Ahmed's personal photo is integrated into the portfolio Hero section.
---

# Personal Photo — Hero PortraitOrb

## Current state (as of 2026-07-30)
Photo is **live**. File: `attached_assets/IMG-20260724-WA0036.jpg_1785384762208.jpeg`

Imported in `artifacts/portfolio/src/components/sections/Hero.tsx`:
```ts
import portraitPhoto from "@assets/IMG-20260724-WA0036.jpg_1785384762208.jpeg";
const PORTRAIT_SRC: string | null = portraitPhoto;
```
(`@assets` is aliased to the monorepo-root `attached_assets/` dir in `artifacts/portfolio/vite.config.ts`)

## What the orb shows when PORTRAIT_SRC is set
- `<img>` with `object-cover object-top` so the face is prioritised
- Subtle gradient fade at bottom blends photo into dark background
- Cyan rim-light ring overlay (inset box-shadow) maintains the futuristic aesthetic
- Spinning outer rings and floating badges stay intact around the orb

## To swap the photo later
1. Upload the new image to `attached_assets/`.
2. Change the `import portraitPhoto from ...` line at the top of `Hero.tsx` to point to the new file.
3. No other changes needed.

## To revert to placeholder silhouette
Set `const PORTRAIT_SRC: string | null = null;` — the abstract SVG with scan-line animation will render instead.

**Why this location:** Hero orb is the first thing visitors see — makes the portfolio personal and memorable.
