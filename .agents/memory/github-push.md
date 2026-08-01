---
name: GitHub push
description: How to push to GitHub from this Replit project — the Git UI is broken, use shell instead.
---

# GitHub Push Workflow

## The problem
Replit's built-in Git pane throws "unrecognized fatal error" on this project — it cannot authenticate. Do not waste time trying to fix the Git UI.

## The working solution
Use the shell directly with a stored Personal Access Token:

```bash
git push https://Ahmed77khaled:${GITHUB_TOKEN}@github.com/Ahmed77khaled/ahmed-elfalah.git main
```

`GITHUB_TOKEN` is already saved as a Replit Secret. It is available as an env var at runtime.

## GitHub repo
- Owner: `Ahmed77khaled`
- Repo: `ahmed-elfalah`
- Default branch: `main`
- URL: https://github.com/Ahmed77khaled/ahmed-elfalah

## Normal git flow
All edits happen directly on `main`. There are no feature branches. Workflow:
1. Make changes, they are auto-staged by Replit checkpoints.
2. If needed, `git add -A && git commit -m "message"` in the shell.
3. Push with the command above.

**Why:** The Replit Git pane fails with "UNKNOWN" CLI error — confirmed 2026-07-30. Shell push with PAT works reliably.
