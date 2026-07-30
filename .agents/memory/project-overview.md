---
name: Project overview
description: High-level facts about the Fel7o Portfolio project — stack, owner, key content.
---

# Fel7o Portfolio — Project Overview

**Owner:** Ahmed El-Falah — UI/UX Designer, Python Dev, Network Engineer, DevOps enthusiast. Based in Port Said, Egypt.

**Stack:** pnpm monorepo → `artifacts/portfolio` (Vite + React + Tailwind v4), `artifacts/fel7o-ds` (custom design system), `artifacts/api-server` (Express, not used by portfolio), `artifacts/mockup-sandbox`.

**Portfolio is purely frontend** — no API routes, no database. All content is hardcoded in the components.

**Key content per section:**
- Hero: Hi I'm Ahmed, typing effect (5 roles), social links (LinkedIn/Facebook/YouTube/Email), portrait orb
- About: timeline 2022→Now, values grid
- Skills: tech skills with levels
- Projects: project cards
- Services: offered services
- Experience: work timeline
- Stats: numbers section
- Testimonials
- Contact: contact form (client-side only, no backend)
- Footer

**Entry point:** `artifacts/portfolio/src/pages/Home.tsx` — initialises Lenis smooth scroll + loading state.

**Why:** Imported from Vercel, ported to Replit pnpm workspace.
