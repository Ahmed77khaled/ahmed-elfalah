---
name: Admin Dashboard
description: Architecture and key decisions for the /admin CMS built into the portfolio
---

## What was built
A password-protected admin CMS at `/admin` routes inside the portfolio artifact. The backend lives in `artifacts/api-server`.

## Auth
- Single-admin, password-only. `ADMIN_PASSWORD` secret compared in `POST /api/auth/login`.
- JWT signed with `SESSION_SECRET`, 7-day expiry. Stored in `localStorage` under key `admin_token`.
- `requireAuth` middleware in `artifacts/api-server/src/lib/auth.ts` validates the Bearer token on all `/api/admin/*` routes.

**Why:** No user table needed for a solo portfolio owner. Keeps auth dead simple.

## API routes
All under `/api` (path-routed by Replit to `artifacts/api-server`, port 8080):
- `POST /api/auth/login` — public
- `GET/POST /api/admin/projects` + `PUT/DELETE /api/admin/projects/:id`
- `GET/POST /api/admin/skills` + `PUT/DELETE /api/admin/skills/:id`
- `GET/POST /api/admin/experience` + `PUT/DELETE /api/admin/experience/:id`
- `GET/PUT/DELETE /api/admin/messages/:id/read` — admin inbox
- `GET/PUT /api/admin/settings` — key-value store
- `GET /api/admin/stats` — dashboard counts
- `POST /api/messages` — public, contact form saves to DB

## Database tables (Drizzle + PostgreSQL)
Defined in `lib/db/src/schema/`: projects, skills, experience, settings, messages.
Push schema: `cd lib/db && pnpm run push`.

## Frontend files
- `artifacts/portfolio/src/lib/admin-api.ts` — typed fetch wrapper + all types
- `artifacts/portfolio/src/components/admin/AdminLayout.tsx` — sidebar nav
- `artifacts/portfolio/src/components/admin/ProtectedRoute.tsx` — redirects to /admin/login if no valid token
- `artifacts/portfolio/src/pages/admin/` — Login, Dashboard, Projects, Skills, Experience, Messages, Settings

## Important: api-server must be rebuilt after route changes
`cd artifacts/api-server && pnpm run build` — uses esbuild, produces `dist/index.mjs`.
The managed workflow runs `pnpm run dev` which rebuilds then starts.

## What's still hardcoded in the portfolio
The public-facing sections (Hero, About, Skills, Projects, Experience, etc.) still read from their hardcoded local arrays — they are NOT yet wired to the DB. The admin CRUD manages DB data only. Connecting DB data to public sections is a follow-up task.
