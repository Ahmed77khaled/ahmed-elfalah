---
name: Design system
description: How the Fel7o Design System works, its colors, and how the portfolio consumes it.
---

# Fel7o Design System (`artifacts/fel7o-ds`)

## Theme colors (from `tokens.json`)
| Token | Dark value | Light value |
|---|---|---|
| background | `#050816` (deep navy) | `#F0F4FF` |
| foreground | `#F0F4FF` | `#050816` |
| primary | `#00D4FF` (electric cyan) | `#0099CC` |
| accent | `#7C3AED` (violet) | `#6D28D9` |
| card | `#0D1224` | `#FFFFFF` |
| border | `#1A2540` | `#D1D8F0` |

**Fonts:** `--app-font-sans: Inter`, `--app-font-mono: Fira Code`

## How the portfolio consumes it
1. `artifacts/portfolio/src/index.css` starts with `@import "@workspace/fel7o-ds/styles.css"` — this pulls in ALL theme variables and Tailwind setup. The portfolio's own CSS adds only portfolio-specific animations/utilities on top.
2. Components are imported directly: `import { Button } from "@workspace/fel7o-ds/components/ui/button"`.
3. The generated token object lives at `artifacts/fel7o-ds/src/generated/tokens.tsx`.

## CSS variables pattern
All colors use `hsl(var(--primary))` pattern. The `:root` block is in `artifacts/fel7o-ds/src/index.css` (generated from tokens.json).

**Why:** Portfolio has no local `src/components/ui/` that it actually uses — all UI components come from the design system package.
