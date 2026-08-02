# Ahmed El-Falah Portfolio — Project Handover

> Last updated: 2026-08-02
>
> This is the working handover for any future developer/agent. Keep it current after meaningful changes. **Never add passwords, database URLs, API tokens, Telegram tokens, or private keys to this file or Git.**

## 1. Product and live environments

| Item | Value |
| --- | --- |
| Production site | https://ahmed-elfalah.vercel.app |
| GitHub repository | `Ahmed77khaled/ahmed-elfalah` |
| Default local branch | `master` |
| Deployment platform | Vercel (`fel7o/ahmed-elfalah`) |
| Frontend | React + TypeScript + Vite + Tailwind/custom design system + Framer Motion |
| Routing | Wouter |
| API | Vercel serverless function at `api/index.js` |
| Database | PostgreSQL / Supabase |

### Important deployment behavior

- Git pushes to `master` currently create a **Vercel Preview**, not Production.
- After a verified Preview is ready, promote it manually:

```powershell
vercel ls ahmed-elfalah
vercel promote https://<latest-preview>.vercel.app --yes
```

- The production deployment should then appear as `Ready` in `vercel ls ahmed-elfalah`.
- `vercel.json` deliberately excludes paths containing file extensions from the SPA rewrite. This is required for static assets such as PDFs to work.

## 2. Repository map

```text
api/                         Vercel serverless API, auth, CMS, notifications
artifacts/portfolio/         Main Vite portfolio application
  public/                    Static assets deployed as site root
  src/components/sections/   Visible portfolio sections
  src/pages/Home.tsx         Public home composition and section order
  src/pages/admin/           CMS/admin interface
db/init.sql                  Database schema and initial data
lib/db/                      Drizzle database schema package
vercel.json                  Vercel build/output/routing configuration
PROJECT_HANDOVER.md          This document
```

## 3. Public site sections and their source files

The page order is defined in `artifacts/portfolio/src/pages/Home.tsx`.

| Section | Main file | Data source | Notes |
| --- | --- | --- | --- |
| Navigation | `components/sections/Navbar.tsx` | Static | Includes CV button; AR/EN toggle was removed because it was not functioning fully. |
| Hero | `components/sections/Hero.tsx` | Static | Includes the official CV download CTA. |
| Current Focus | `components/sections/CurrentFocus.tsx` | Static | Small current-learning card directly below Hero. Update dates/status manually when they change. |
| About | `components/sections/About.tsx` | Static | Personal overview. |
| Skills | `components/sections/Skills.tsx` | Database | Loads `/api/skills`. |
| Projects | `components/sections/Projects.tsx` | Database | Loads `/api/projects`; has animated category filter tabs. |
| Certifications | `components/sections/Certifications.tsx` | Static | 16 cards and a detail dialog. Needs real certificate photos/verification links next. |
| Services | `components/sections/Services.tsx` | Static | Services overview. |
| Experience | `components/sections/Experience.tsx` | Database | Loads `/api/experience`. |
| Stats | `components/sections/Stats.tsx` | Static | Portfolio metric cards. |
| GitHub widget | `components/sections/DeveloperStats.tsx` | GitHub public API | Codeforces card was removed. |
| Testimonials / Contact / Footer | corresponding files | Contact calls API | Contact data is saved through the serverless API. |

## 4. Implemented work and current status

### Portfolio UI

- [x] Animated project category tabs: `All`, `IoT & Embedded`, `AI & Security`, `Engineering`, and `Web Development`.
- [x] Certification showcase with 16 cards and click-to-open details dialog.
- [x] CV buttons in Hero and Navbar.
- [x] GitHub activity widget.
- [x] Current Focus card (intentionally compact; not a large standalone section).
- [x] Codeforces/ACPC live-data card removed at the owner’s request.
- [x] AR/EN toggle and its incomplete language infrastructure removed at the owner’s request.
- [x] Static PDF routing fixed on Vercel.
- [x] CCNA Networking Labs project added to the CMS with documented Packet Tracer work and downloadable `.pkt` lab file.
- [x] Admin project gallery now provides image previews plus move-up/move-down controls. The array order is the public gallery order.

### CV files

Both files exist in `artifacts/portfolio/public/` and are intentionally deployed:

| Public URL | File | Why it exists |
| --- | --- | --- |
| `/Ahmed_Khaled_Elfalah_FINAL_CV.pdf` | `Ahmed_Khaled_Elfalah_FINAL_CV.pdf` | Official filename used by new buttons. |
| `/resume.pdf` | `resume.pdf` | Backward-compatible URL used by old links. |

The live legacy URL was verified to return `application/pdf` successfully:

https://ahmed-elfalah.vercel.app/resume.pdf

### CCNA evidence added on 2026-08-02

The following public assets are in `artifacts/portfolio/public/labs/ccna/`:

- `ccna-routing-switching-certificate.pdf` - CCNA Routing and Switching, 98%, 120 total hours (90 technical + 30 soft skills), dated 24 January to 18 February 2026.
- `connectivity-validation.png` - successful Packet Tracer ICMP validation.
- `ospf-adjacency.png` - OSPF neighbor and area configuration.
- `vlan-topology.png` and `switch-topology.png` - switching/VLAN topology work.
- `snmp-router-config.png` and `snmp-manager-agent.png` - SNMP configuration and manager-agent concepts.
- `ccna-lab-project.pkt` - downloadable Cisco Packet Tracer project file.

The CMS project **CCNA Networking Labs** was inserted into the production database with those images in the intended order. Its gallery can be reordered at `/console/projects`: edit the project and use the up/down arrows under **Gallery Images**, then save.

### Current Focus content (as of 2026-08-02)

- Electrical Training — started 4 July 2026; scheduled to end 6 August 2026.
- System Administration Training — started 2 July 2026; ongoing, expected to continue for at least three more months.
- DevOps Training — currently week 3; started approximately 19 July 2026.
- HCIA-Security — upcoming in August 2026; 80 hours.

## 5. Experience database entries added on 2026-08-02

These four rows were added directly to the production PostgreSQL/Supabase `experience` table and confirmed by `GET /api/experience`:

1. **Electrical Training Trainee** — Electrical Training Program (2026-07-04 to 2026-08-06)
2. **System Administration Trainee** — System Administration Training (current)
3. **DevOps Trainee** — DevOps Training Program (current, week 3 at time of writing)
4. **Upcoming HCIA-Security Training** — Huawei ICT Academy (August–September 2026)

The HCIA-Security description includes information-security fundamentals, server/OS security, firewall configuration, NAT, dual-system hot standby, user management, IPS, cryptography, PKI/certificates, monitoring, digital forensics, incident response, and a practical case workshop. It is explicitly marked as **upcoming training**, not a completed certificate.

When a course ends, update its row through the Admin UI or database: set the final `end_date`, set `current_position` to `false`, and revise the description with actual outcomes/labs. Only move it to Certifications when there is a real issued certificate.

## 6. Certificate/documentation workflow — next priority

The owner wants the portfolio to be evidence-based. Start with **Networking / CCNA**.

For every certificate or lab, collect:

1. Full, clear certificate image or PDF.
2. Exact certificate title and issuer.
3. Issue date, expiry date (if any), score, and hours.
4. Credential ID and official verification URL, when available.
5. A short list of concrete skills/lab outcomes.
6. For a lab: screenshots, topology/diagram, problem solved, tools used, and result.

### Recommended order

1. CCNA / Cisco Networking
2. Artificial Intelligence
3. ITI Python & Web Development
4. ACPC / competitive programming
5. DevOps labs
6. HCIA-Security after course completion/certificate issue

### How to add a verified certificate

1. Put the supplied image in `artifacts/portfolio/public/certificates/` (create the folder if needed).
2. Update the relevant object in `components/sections/Certifications.tsx` with a real `verifyUrl` and image field (the component may need a small image-preview addition).
3. Use `Completed` only for issued certificates; use `In progress` or `Upcoming` for training.
4. Build, deploy Preview, visually verify, then promote to Production.

## 7. API, database, and notification notes

### Public/API endpoints used by the frontend

- `GET /api/projects`
- `GET /api/skills`
- `GET /api/experience`
- `POST /api/messages`
- `POST /api/track-visitor`
- `GET /api/healthz`

Admin endpoints are under `/api/admin/*` and need the configured JWT/session flow.

### Notification safety rule

`api/index.js` has existing visitor/message notification behavior. Preserve the use of `await Promise.allSettled([...])` for notification fetches so the serverless invocation waits for those jobs before responding.

### Required Vercel environment variable names

The exact values are private and must exist only in Vercel/local ignored environment files.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL/Supabase connection string |
| `ADMIN_PASSWORD` | Admin console login password |
| `SESSION_SECRET` | JWT/session signing secret |
| `CORS_ORIGIN` | Production domain |
| `NODE_ENV` | `production` in production |

## 8. Local development and verification

From repository root:

```powershell
pnpm --filter @workspace/portfolio run dev
node node_modules\typescript\bin\tsc -p artifacts\portfolio\tsconfig.json --noEmit
pnpm --filter @workspace/portfolio run build
```

If the normal pnpm command reports ignored build scripts for `esbuild`, the Vite binary in the workspace can be run directly after dependencies are already installed. Do not change dependency policy just to bypass that warning.

Useful live checks:

```powershell
curl.exe -I https://ahmed-elfalah.vercel.app/resume.pdf
curl.exe https://ahmed-elfalah.vercel.app/api/experience
curl.exe https://ahmed-elfalah.vercel.app/api/healthz
```

Expected CV response: HTTP 200 with `Content-Type: application/pdf`.

## 9. Git and deployment history relevant to this handover

| Commit | Summary |
| --- | --- |
| `21edd75` | Added Current Focus card. |
| `d333363` | Removed language toggle and Codeforces card. |
| `b19fe96` | Fixed Vercel static-asset routing. |
| `5af01eb` | Added portfolio enhancements and CV files. |
| `d9a95b8` | Ensured serverless notification promises are awaited. |

## 10. Outstanding work / decisions

### High priority

- [ ] Receive the CCNA/networking certificate images and verification information.
- [ ] Add real certificate images and verification links to the Certifications UI.
- [ ] Review the existing 16 certificate cards: replace any placeholder/assumed entry with verified owner-provided data.
- [ ] Update Current Focus dates/status as training milestones change.

### Good next improvements

- [ ] Add a documented Labs & Projects area: network topology, server admin, Docker/CI-CD, and future security labs.
- [ ] Add a status/tag design for `Completed`, `In progress`, and `Upcoming` credentials.
- [ ] Make the Certifications section data-driven from the database after the owner has assembled verified evidence.
- [ ] Review project entries, GitHub URLs, cover images, and categories for accuracy.
- [ ] Reduce the main JavaScript bundle if performance becomes a concern (the build warns that it is above 500 kB after minification).

## 11. Worktree hygiene

At the time this document was created, several local utility scripts and `.gitignore` changes were already uncommitted and were **not** included in feature deployments because their purpose/ownership was not confirmed. Do not delete or commit them blindly. Review them with the owner first.

## 12. Working agreement

- Prefer accuracy over impressive claims.
- Do not mark a training course as a certificate before a certificate is issued.
- Do not publish secret values or personal access tokens.
- Every user-visible change should be typechecked, built, pushed, deployed to a Preview, and promoted to Production once verified.
- After any material change, update this handover document.
