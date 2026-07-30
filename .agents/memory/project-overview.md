---
name: Project overview
description: High-level facts about the Fel7o Portfolio — owner, stack, content, key constraints.
---

# Fel7o Portfolio — Project Overview

## Owner
**Ahmed El-Falah** — Brand handle: **Fel7o** (always spelled exactly: capital F, number 7, lowercase o)
- Roles: UI/UX Designer, Python Developer, Network Engineer, DevOps Enthusiast
- Location: Port Said, Egypt
- Social: LinkedIn, Facebook, YouTube, Email (all linked in Hero section)
- GitHub: https://github.com/Ahmed77khaled/ahmed-elfalah

## What this is
A personal portfolio website. 100% static frontend — no backend, no database, no API calls.

## Stack summary
- pnpm monorepo → `artifacts/portfolio` (Vite + React 19 + Tailwind v4)
- Design system: `@workspace/fel7o-ds` (local workspace package)
- Animations: Framer Motion + GSAP
- Smooth scroll: @studio-freight/lenis
- Routing: wouter (single route — just `/`)

## Communication preference
Ahmed writes in Arabic. Always respond in Arabic for this project unless he switches to English.

## Color identity
- Primary: electric cyan `#00D4FF` — used for glow, rings, accents
- Accent: violet `#7C3AED` — used for highlights
- Background: deep navy `#050816`
- No warm colors anywhere in the design

## Section order (as rendered in Home.tsx)
LoadingScreen → CustomCursor + ScrollProgress + MouseGlow → AnimatedBackground → Navbar → Hero → About → Skills → Projects → Services → Experience → Stats → Testimonials → Contact → Footer

## Key file: `artifacts/portfolio/src/pages/Home.tsx`
This is the app entry point and controls: Lenis init, loading screen timer, section rendering order.
