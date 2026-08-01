---
name: Design system
description: @workspace/fel7o-ds — tokens, colors, fonts, and how the portfolio consumes it.
---

# Fel7o Design System (`artifacts/fel7o-ds`)

## Theme colors
| CSS Variable | Dark value | Light value | Usage |
|---|---|---|---|
| `--background` | `#050816` | `#F0F4FF` | Page background |
| `--foreground` | `#F0F4FF` | `#050816` | Body text |
| `--primary` | `#00D4FF` | `#0099CC` | Electric cyan — glows, rings, CTAs |
| `--accent` | `#7C3AED` | `#6D28D9` | Violet — secondary highlights |
| `--card` | `#0D1224` | `#FFFFFF` | Card backgrounds |
| `--border` | `#1A2540` | `#D1D8F0` | Dividers, outlines |
| `--muted` | (dark neutral) | (light neutral) | Muted text |

Always use `hsl(var(--primary))` form — never hardcode hex values.

## Typography
- `--app-font-sans: Inter` — loaded via Google Fonts in `artifacts/portfolio/index.html`
- `--app-font-mono: Fira Code` — loaded via Google Fonts in `artifacts/portfolio/index.html`

## How the portfolio consumes it

### CSS (tokens + Tailwind setup)
`artifacts/portfolio/src/index.css` starts with:
```css
@import "@workspace/fel7o-ds/styles.css";
```
This pulls ALL theme variables and Tailwind config. Do NOT add a second Tailwind `@import` or another `:root {}` block in the portfolio — it will conflict.

### Components
```ts
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Toaster } from "@workspace/fel7o-ds/components/ui/toaster";
import { TooltipProvider } from "@workspace/fel7o-ds/components/ui/tooltip";
```

### Package reference in portfolio's package.json
```json
"devDependencies": {
  "@workspace/fel7o-ds": "workspace:*"
}
```

## Design system docs
Located at `artifacts/fel7o-ds/docs/`:
- `consuming-web.md` — full guide for React/Vite consumers
- `consuming-expo.md` — Expo guide (not implemented)
- `migrating-web.md` — migration notes

**Why devDependencies:** pnpm workspace local packages go in devDependencies by convention in this monorepo.
