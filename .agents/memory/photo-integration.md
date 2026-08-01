---
name: Photo integration
description: Ahmed's personal photo is live in the Hero PortraitOrb — how it works and how to change it.
---

# Personal Photo — Hero PortraitOrb

## Current state
Photo is **live** as of 2026-07-30.
File: `attached_assets/IMG-20260724-WA0036.jpg_1785384762208.jpeg`

## How it's wired
In `artifacts/portfolio/src/components/sections/Hero.tsx`:

```ts
// Static import at top of file:
import portraitPhoto from "@assets/IMG-20260724-WA0036.jpg_1785384762208.jpeg";

// Config constant (just below imports):
const PORTRAIT_SRC: string | null = portraitPhoto;
```

`@assets` is an alias in `vite.config.ts` that resolves to `<repo-root>/attached_assets/`.

**Important:** always use a static `import` statement — do NOT use `new URL(..., import.meta.url)` for this alias; Vite resolves `@assets` at build time via the alias, and `new URL` bypasses that.

## What the orb renders when PORTRAIT_SRC is set
- `<img>` with `object-cover object-top` (face is shown, not feet)
- Gradient overlay: `transparent 55% → background/55% 100%` — fades photo into dark background at bottom
- Cyan rim-light: `inset box-shadow hsl(var(--primary) / 0.15)` — futuristic glow preserved
- Spinning outer rings + dashed counter-ring + floating skill badges all stay around the orb

## To swap to a new photo
1. Upload new image to `attached_assets/`
2. Change the `import portraitPhoto from ...` line to the new filename
3. `PORTRAIT_SRC` stays as `portraitPhoto` — no other changes

## To revert to placeholder silhouette
Set `const PORTRAIT_SRC: string | null = null;` — renders the abstract SVG with head/shoulders silhouette + scan-line animation.

**Why Hero orb:** it's the first element visitors see — most impactful spot for a real photo.
