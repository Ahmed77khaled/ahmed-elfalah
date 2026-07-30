---
name: Artifact layout
description: All artifacts in the workspace, their preview paths, ports, and confirmed-running status.
---

# Artifact Layout

| Artifact | Dir | Preview path | Port | Kind | Status |
|---|---|---|---|---|---|
| Fel7o Portfolio | `artifacts/portfolio` | `/` | 21113 | web | ✅ Confirmed running |
| Fel7o Design System | `artifacts/fel7o-ds` | `/fel7o-ds/` | 19468 | design-system | Not started (not needed for portfolio dev) |
| API Server | `artifacts/api-server` | `/api` | — | api | Not started (not used by portfolio) |
| Mockup Sandbox | `artifacts/mockup-sandbox` | `/__mockup` | — | design | Not started |

**Workflow name for portfolio:** `artifacts/portfolio: web`  
**Dev command:** `pnpm --filter @workspace/portfolio run dev`

**Confirmed facts:**
- `pnpm install` runs cleanly — 2 new packages added (gsap, lenis) on first install after migration.
- The portfolio imports `@workspace/fel7o-ds` which lives at `artifacts/fel7o-ds/` — it is a pnpm workspace package, NOT in node_modules remotely. The package exports components via `./src/components/*.tsx` paths directly.
- `.migration-backup/` artifacts (portfolio, fel7o-ds, api-server, mockup-sandbox) got auto-registered as ghost artifacts — they do NOT run and should be ignored. The real artifacts are under `artifacts/`.
- Lenis smooth scroll: duration set to 0.7 (was 1.2 — felt sluggish). Easing: cubic ease-out `1 - (1-t)^3`.
