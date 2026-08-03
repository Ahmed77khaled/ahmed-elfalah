# Ahmed El-Falah Portfolio - Project Handover

> Last updated: 2026-08-03
>
> Keep this document current after every material website, content, deployment, or data-model change. Never put passwords, database URLs, tokens, or private keys here.

## Product position

Ahmed El-Falah is presented as a Computer Engineering student focused on:

- Aspiring DevOps engineering
- Cybersecurity and SOC concepts
- Infrastructure, networking, and automation
- Long-term DevSecOps development

The public site is an engineering opportunity portfolio. It must not position Ahmed as a generic web developer or freelance services provider.

## Live environments

| Item | Value |
| --- | --- |
| Production site | https://ahmed-elfalah.vercel.app |
| GitHub repository | https://github.com/Ahmed77khaled/ahmed-elfalah |
| Main branch | `master` |
| Vercel project | `fel7o/ahmed-elfalah` |
| Production deployment | Vercel, manually promoted after Preview validation |
| Frontend | React, TypeScript, Vite, Tailwind/custom design system, Framer Motion |
| Routing | Wouter |
| API | Vercel serverless function in `api/index.js` |
| Database | PostgreSQL / Supabase |

## Public information architecture

The only public navigation and page sections are listed below, in this order. The order is controlled by `artifacts/portfolio/src/pages/Home.tsx`.

| Order | Section | File | Content source | Purpose |
| --- | --- | --- | --- | --- |
| 1 | Home | `components/sections/Hero.tsx` | Static | Establish DevOps, cybersecurity, infrastructure, and automation focus immediately. |
| 2 | About | `components/sections/About.tsx` | Static | Engineering path and DevSecOps direction. |
| 3 | Journey | `components/sections/Journey.tsx` | Database: `/api/journey` | Personal engineering milestone timeline & photo gallery. |
| 4 | Experience | `components/sections/Experience.tsx` | Database: `/api/experience` | Internships, training programs, and practical technical experience. |
| 5 | Projects | `components/sections/Projects.tsx` | Database: `/api/projects` | Strongest evidence of real technical work. |
| 6 | Skills | `components/sections/Skills.tsx` | Database: `/api/skills` | Grouped technical capabilities. |
| 7 | Certifications | `components/sections/Certifications.tsx` | Static | Certificate evidence, skills covered, and related labs where applicable. |
| 8 | Contact | `components/sections/Contact.tsx` | API | Opportunity and contact path. |

### Intentionally removed from the public page

- Credentials: duplicated Certifications and Experience.
- Services: incorrect for an engineering opportunity portfolio.
- Current Focus and Developer Stats: removed to keep the information architecture focused.

The component files may remain in the repository but must not be rendered by `Home.tsx` or linked from navigation/footer unless the owner makes a deliberate product decision to restore them.

## Current messaging rules

- Use: DevOps, cybersecurity, infrastructure, automation, networking, systems, secure operations, and DevSecOps.
- Avoid positioning as: UI/UX designer, general web developer, AI builder, freelancer, or full-stack service provider.
- Use opportunity language: internships, entry-level engineering roles, technical programs, and professional collaboration.
- Do not label training as a completed certification before an official certificate is issued.
- Maintain the current design system, animations, cards, spacing, and responsive behavior. Information architecture and content may change; visual identity should not be redesigned without owner approval.

## SEO and social metadata

`artifacts/portfolio/index.html` contains the production title, description, Open Graph, and Twitter metadata.

Current title:

```text
Ahmed El-Falah | Aspiring DevOps & Cybersecurity Engineer
```

Current metadata describes Ahmed as a Computer Engineering student focused on DevOps, cybersecurity, infrastructure, and automation. Keep this aligned with the Hero and About sections.

## Key implementation notes

### Certifications

- Certifications are currently curated in `components/sections/Certifications.tsx`.
- Each card should have an image when authentic evidence is available, issuer, date/detail, and skills covered.
- CCNA has a `Related Labs` description that points to routing, switching, IP configuration, and troubleshooting work.
- Do not create a generic gallery. High-value screenshots belong in their certification or project context.

### Projects

- Data loads from `/api/projects`.
- The project detail modal presents the solution description, implementation/results list, technology stack, evidence images, GitHub, and demo/lab links.
- Only retain real technical work. Prefer infrastructure, automation, security, monitoring, cloud, networking, and engineering projects over course screenshots.
- When a project only has Ahmed's profile URL, the public action is labeled `GitHub Profile`; use `Source Code` only when the project has a dedicated repository URL.
- Do not invent a cloud project, architecture diagram, project result, or source repository. Add each item only when authentic work and evidence are available.

### Skills

- Data loads from `/api/skills` and groups automatically by category.
- Preferred groups are Networking, Systems, DevOps, Cloud, Security, and Programming.
- Avoid random icon walls and unsupported percentage claims.

### Experience

- Data loads from `/api/experience`.
- Use it for internships, technical programs, and real professional/training work, not as another certificate list.
- Entries should clearly identify the organization, duration, scope, technologies, and practical outcome whenever the source data supports it.

### Footer

- Footer navigation mirrors the approved public sections and contains no Services link.
- Footer copy invites internships, entry-level engineering opportunities, technical programs, and meaningful conversations.

## Repository map

```text
api/                         Vercel serverless API, auth, CMS, notifications
artifacts/portfolio/         Main Vite portfolio application
  public/                    Static assets deployed as site root
  src/components/sections/   Public section components
  src/pages/Home.tsx         Public section composition and order
  src/pages/admin/           CMS/admin interface
db/init.sql                  Database schema and initial data
lib/db/                      Drizzle database schema package
vercel.json                  Vercel build/output/routing configuration
HANDOVER.md                  Deployment runbook
PROJECT_HANDOVER.md          This product and technical handover
```

## Deployment workflow

1. Make the smallest scoped change.
2. Typecheck and build the portfolio.
3. Commit only intended files and push `master` to GitHub.
4. Wait for the Vercel Preview to become `Ready`.
5. Promote that exact Preview to Production:

```powershell
vercel ls --yes
vercel promote https://<latest-preview>.vercel.app --yes
```

6. Confirm the resulting Production deployment is `Ready` and that `https://ahmed-elfalah.vercel.app` resolves.

Git pushes to `master` currently generate a Vercel Preview, not an automatic Production deployment.

## Local verification

From the repository root:

```powershell
node_modules\.bin\tsc.cmd --noEmit -p artifacts\portfolio\tsconfig.json
```

From `artifacts/portfolio`:

```powershell
node_modules\.bin\vite.cmd build
```

The normal pnpm commands may be blocked by the existing `esbuild` build-script approval policy. Do not change the dependency policy merely to bypass that warning.

## API and environment variables

Public endpoints used by the frontend:

- `GET /api/projects`
- `GET /api/skills`
- `GET /api/experience`
- `POST /api/messages`
- `POST /api/track-visitor`
- `GET /api/healthz`

Required Vercel environment variable names:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL/Supabase connection string |
| `ADMIN_PASSWORD` | Admin console password |
| `SESSION_SECRET` | JWT/session signing secret |
| `CORS_ORIGIN` | Production domain |
| `NODE_ENV` | `production` in production |
| `CRON_SECRET` | Secures Vercel Cron calls |

## Recent change history

| Date | Commit | Change |
| --- | --- | --- |
| 2026-08-03 | `6464f54` | Aligned SEO, About, and Footer with the engineering portfolio position. |
| 2026-08-03 | `3bd06d5` | Refactored public structure around DevOps and cybersecurity; removed Credentials and Services from public composition. |
| 2026-08-03 | `9890c1f` | Added certification image preview cards and detailed certificate dialogs. |
| 2026-08-03 | `11b1302` | Added GitHub profile link to Hero social links; relabeled nav CTA from "Hire Me" to "Get in Touch"; distinguished profile vs. source-code links in project modal. |

## Next review checklist

- Verify every project is real and has accurate links, descriptions, tech stack, and evidence.
- Replace any assumed certificate date/skill data with owner-verified details.
- Move course screenshots into the relevant certification or project; do not add a general gallery.
- Add concrete technology and outcome fields to experience data as owner-provided details become available.
- Reassess the main JavaScript bundle only if performance becomes a visible issue.
