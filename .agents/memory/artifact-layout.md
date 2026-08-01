---
name: Artifact layout
description: All artifacts in the workspace, their preview paths, ports, and status.
---

# Artifact Layout

## Active artifacts (work on these)

| Artifact | Dir | Preview path | Port | Kind | Status |
|---|---|---|---|---|---|
| Fel7o Portfolio | `artifacts/portfolio` | `/` | 21113 | web | ✅ Running |
| Fel7o Design System | `artifacts/fel7o-ds` | `/fel7o-ds/` | (auto) | design-system | Running (not needed for portfolio dev) |
| API Server | `artifacts/api-server` | `/api` | (auto) | api | Not started — not used by portfolio |
| Mockup Sandbox | `artifacts/mockup-sandbox` | `/__mockup` | (auto) | design | Not started — design tool only |

## Ghost artifacts (ignore)
`.migration-backup/artifacts/` contains: api-server, mockup-sandbox, fel7o-ds, portfolio — all auto-registered when the project was migrated from Vercel. Their workflows always fail on start. They are harmless but cannot be deleted from the Replit UI. Ignore them completely.

## Workflow command for portfolio
```
pnpm --filter @workspace/portfolio run dev
```
Workflow name: `artifacts/portfolio: web`

## Important path facts
- `@assets` alias (in `vite.config.ts`) resolves to `<repo-root>/attached_assets/`
- `@` alias resolves to `artifacts/portfolio/src/`
- Design system is imported in portfolio's `index.css` as `@import "@workspace/fel7o-ds/styles.css"`
- Design system components imported as: `import { Button } from "@workspace/fel7o-ds/components/ui/button"`

## pnpm workspace
Packages defined in `pnpm-workspace.yaml` under `packages: - artifacts/*`. Install deps from repo root: `pnpm install`.
