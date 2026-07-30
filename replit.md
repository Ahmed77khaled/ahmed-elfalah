# Fel7o Portfolio

Personal portfolio website for **Ahmed El-Falah** — UI/UX Designer, Python Developer, Network Engineer, and DevOps Enthusiast based in Port Said, Egypt. Brand handle: **Fel7o**.

---

## Run & Operate

```bash
# Start the portfolio dev server (main artifact)
pnpm --filter @workspace/portfolio run dev

# Typecheck everything
pnpm run typecheck

# Build all packages
pnpm run build
```

**Workflow name:** `artifacts/portfolio: web`
**Port:** assigned via `PORT` env var (21113 in dev)
**Preview path:** `/` (root — the entire app is the portfolio)

No backend, no database. Purely frontend.

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| Frontend | Vite 7 + React 19 + Tailwind CSS v4 |
| Routing | wouter (hash-free, uses BASE_URL from Vite) |
| Animations | Framer Motion + GSAP 3 |
| Smooth scroll | @studio-freight/lenis (duration 0.7, cubic ease-out) |
| Design system | @workspace/fel7o-ds (local package, see below) |
| Icons | lucide-react + react-icons |
| State | React hooks only — no global store |
| Build | vite build → dist/public |

---

## Where Things Live

```
artifacts/
  portfolio/              ← Main frontend app (@workspace/portfolio)
    src/
      pages/
        Home.tsx          ← Single page — renders all sections in order
        not-found.tsx     ← 404 page
      components/
        effects/
          LoadingScreen.tsx   ← 2.3s animated intro screen (HUD style)
          AnimatedBackground.tsx
          CustomCursor.tsx
          MouseGlow.tsx
          ScrollProgress.tsx
        sections/
          Navbar.tsx
          Hero.tsx            ← PortraitOrb + typing effect + social links
          About.tsx           ← Timeline (2022→Now) + values grid
          Skills.tsx          ← Skill cards with proficiency levels
          Projects.tsx        ← Project cards
          Services.tsx        ← Offered services
          Experience.tsx      ← Work timeline
          Stats.tsx           ← Numbers section
          Testimonials.tsx    ← Client quotes
          Contact.tsx         ← Contact form (client-side only)
          Footer.tsx
        ui/                 ← Shadcn-style UI components (local copies)
      App.tsx               ← Router (wouter) + QueryClient + TooltipProvider
      index.css             ← Imports @workspace/fel7o-ds/styles.css + portfolio animations
    vite.config.ts
    package.json

  fel7o-ds/               ← Design system package (@workspace/fel7o-ds)
    src/
      index.css            ← All CSS variables (:root tokens + dark/light)
      components/ui/       ← Button, Card, Toast, Tooltip, etc.
      generated/tokens.tsx ← Token object generated from tokens.json
    docs/
      consuming-web.md     ← How to use in React/Vite apps
      consuming-expo.md    ← How to use in Expo (not implemented)
      migrating-web.md
      migrating-expo.md

  api-server/             ← Express 5 API (@workspace/api-server) — NOT USED by portfolio
  mockup-sandbox/         ← Design canvas sandbox — dev/design tool only

attached_assets/
  IMG-20260724-WA0036.jpg_1785384762208.jpeg  ← Ahmed's personal photo (used in Hero)

.agents/memory/           ← Agent long-term memory (see MEMORY.md index)
```

---

## Architecture Decisions

- **No backend.** The portfolio is 100% static frontend. The `api-server` artifact exists in the workspace but is not imported or called by the portfolio. If contact form submissions are ever needed, add EmailJS or Resend directly from the client.
- **Design system as local package.** `@workspace/fel7o-ds` is consumed via pnpm workspace protocol (`workspace:*`). It exports CSS variables (not Tailwind config). The portfolio's `index.css` starts with `@import "@workspace/fel7o-ds/styles.css"` — do NOT add a second Tailwind `@import` or a duplicate `:root` block.
- **`@assets` alias points to repo root `attached_assets/`.** Any image dropped into `attached_assets/` can be imported as `import x from "@assets/filename.ext"` inside any portfolio component.
- **Lenis smooth scroll is optional/graceful.** The import is dynamic (`await import(...)`) with a try/catch, so the portfolio works even if Lenis fails to load.
- **Custom cursor replaces default OS cursor.** `cursor: none !important` is set globally in `index.css`. Never remove this — it breaks the `CustomCursor` component UX.
- **`scroll-behavior: auto` on html.** Lenis owns all smooth scrolling. Native CSS smooth scroll is disabled to avoid double-smoothing.

---

## Product (Portfolio Sections)

| Section | Content |
|---|---|
| LoadingScreen | HUD-style 2.3s intro: spinning F logo, letter-by-letter "Fel7o", % counter, corner brackets, floating code fragments |
| Navbar | Fixed top nav with section links |
| Hero | "Hi I'm Ahmed" + 5-role typing effect + social icons (LinkedIn, Facebook, YouTube, Email) + circular portrait orb (Ahmed's real photo) |
| About | Career timeline (2022→Present) + values grid |
| Skills | Tech skill cards with percentage levels |
| Projects | Project showcase cards |
| Services | Services offered (UI/UX, dev, DevOps…) |
| Experience | Work history timeline |
| Stats | Key achievement numbers (animated counters) |
| Testimonials | Client/colleague testimonials |
| Contact | Contact form — client-side only, no backend |
| Footer | Links + copyright |

---

## Design System Tokens (Key Values)

| Token | Dark mode | Light mode |
|---|---|---|
| `--background` | `#050816` (deep navy) | `#F0F4FF` |
| `--foreground` | `#F0F4FF` | `#050816` |
| `--primary` | `#00D4FF` (electric cyan) | `#0099CC` |
| `--accent` | `#7C3AED` (violet) | `#6D28D9` |
| `--card` | `#0D1224` | `#FFFFFF` |
| `--border` | `#1A2540` | `#D1D8F0` |

Fonts: `Inter` (sans) + `Fira Code` (mono) — loaded via Google Fonts in `artifacts/portfolio/index.html`.

Usage in code: always use `hsl(var(--primary))` CSS variable form — never hardcode hex values.

---

## Gotchas

1. **`PORT` and `BASE_PATH` env vars are required.** `vite.config.ts` throws if either is missing. In Replit these are injected automatically; locally you must set them.
2. **Push to GitHub needs a Personal Access Token.** The Replit Git UI has a bug. Use shell: `git push https://Ahmed77khaled:${GITHUB_TOKEN}@github.com/Ahmed77khaled/ahmed-elfalah.git main`. Store the token as a Replit Secret named `GITHUB_TOKEN`.
3. **`.migration-backup/` artifacts are ghost entries.** They were auto-registered when the project was migrated. Their workflows fail on start — ignore them. The real artifacts are under `artifacts/`.
4. **Do NOT add `cursor: auto` or `cursor: pointer` anywhere.** The custom cursor handles all pointer states.
5. **Lenis duration is intentionally 0.7** (was 1.2 — felt too slow). Do not increase it without user approval.
6. **`@workspace/fel7o-ds` must be in `devDependencies`**, not `dependencies`, in the portfolio's `package.json` (pnpm workspace local package convention).

---

## User Preferences

- Language: Ahmed writes in Arabic, agent should respond in Arabic by default for this project.
- Branding: Always spell "Fel7o" exactly — capital F, number 7, lowercase o.
- Primary color identity: electric cyan (`#00D4FF`) for primary, violet (`#7C3AED`) for accent. No warm colors.
- Scroll speed: keep Lenis duration at 0.7 or lower — user prefers snappy scroll.
- No placeholders: use real content in all sections. If something is missing, ask Ahmed rather than leaving "Lorem ipsum" or placeholder copy.
