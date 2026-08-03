# Deployment Runbook - Ahmed El-Falah Portfolio

> Last updated: 2026-08-03
>
> For product architecture and current public content, read `PROJECT_HANDOVER.md`.

## Live services

| Service | URL / value |
| --- | --- |
| Production | https://ahmed-elfalah.vercel.app |
| GitHub | https://github.com/Ahmed77khaled/ahmed-elfalah |
| Vercel project | `fel7o/ahmed-elfalah` |
| Branch | `master` |

## Safe release checklist

1. Confirm only intended files are modified:

```powershell
git status --short
git diff --check
```

2. Verify TypeScript from repository root:

```powershell
node_modules\.bin\tsc.cmd --noEmit -p artifacts\portfolio\tsconfig.json
```

3. Build from the portfolio application directory:

```powershell
Set-Location artifacts\portfolio
node_modules\.bin\vite.cmd build
```

4. Commit and push:

```powershell
git add -- <intended files>
git commit -m "<clear summary>"
git push origin master
```

5. Verify Preview status:

```powershell
vercel ls --yes
```

6. Promote the newest Ready Preview only:

```powershell
vercel promote https://<latest-preview>.vercel.app --yes
```

7. Wait for the new Production deployment to become `Ready`:

```powershell
vercel inspect https://<production-deployment>.vercel.app --timeout 60s
```

8. Confirm the public alias and health endpoint:

```powershell
curl.exe -I https://ahmed-elfalah.vercel.app
curl.exe https://ahmed-elfalah.vercel.app/api/healthz
```

## Vercel configuration

`vercel.json` uses:

- Build command: `pnpm --filter @workspace/portfolio run build`
- Output directory: `artifacts/portfolio/dist/public`
- Serverless API: `api/index.js`
- SPA rewrite for application routes while preserving static files such as PDFs and images.
- Daily cron route: `/api/cron/reminders`.

## Required environment variable names

Set these in Vercel Project Settings. Keep values private and never commit them:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `CORS_ORIGIN`
- `NODE_ENV=production`
- `CRON_SECRET`

## Important notes

- A GitHub push creates a Preview deployment. Production requires manual promotion.
- If pnpm reports ignored `esbuild` build scripts, use the already-installed direct TypeScript/Vite verification commands above. Do not weaken dependency policy without approval.
- Do not deploy secrets, generated archives, or unrelated local scripts.
- After every meaningful public change, update `PROJECT_HANDOVER.md` and this runbook when release behavior changes.
