# Deployment Guide

## Branch Strategy

**`main` is the only long-lived branch, and it deploys straight to the live
site.** There is no `production` branch and no PR gate. This matches the
WellSmith site.

A push to `main` triggers a production deployment on Vercel. There is nothing
between a push and the live domain, so test locally before pushing.

## Deployment Process

```bash
git checkout main
git pull origin main

# Make changes, then test locally
pnpm dev            # dev server on :8080
pnpm typecheck      # must be clean
pnpm run build      # must succeed

git add .
git commit -m "Description of changes"
git push origin main   # -> deploys to the live site
```

Feature branches are still fine for work in progress; they get Vercel preview
URLs. Merging one into `main` deploys it.

## Pre-Push Checklist

Since a push goes live immediately:

- [ ] `pnpm typecheck` clean
- [ ] `pnpm run build` succeeds
- [ ] Feature tested locally against the real page
- [ ] No console errors
- [ ] Forms tested if touched (see Email below)
- [ ] Mobile layout checked if styling changed
- [ ] SEO meta / structured data verified if markup changed

## Email

Both the health assessment and the newsletter send through **Resend**. There is
no SMTP path.

Required environment variables in Vercel:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sending. Everything fails without a valid key. |
| `FROM_EMAIL` | Sender. Its domain must be verified in Resend. |
| `ADMIN_EMAIL` | Where health assessment submissions are delivered. |
| `RESEND_AUDIENCE_ID` | Newsletter audience. |

The health assessment email is the entire booking flow — Calendly was removed —
so a bad key means enquiries fail silently. Verify the key after any rotation:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/domains
```

`200` is good. `401` means the key is invalid.

## Rollback

A bad deploy is reverted by shipping a revert commit:

```bash
git revert <bad-commit-sha>
git push origin main
```

For an immediate fix while you investigate, use **Instant Rollback** in the
Vercel dashboard (Deployments → pick the last good one → Promote to
Production). That repoints the live domain without waiting for a build, and
without touching git history.

## Recipes

The recipes page is served from the Health Coach Hub, proxied through
`/api/recipes` because the upstream endpoint sends no CORS headers.

`RECIPES_SOURCE_URL` overrides the upstream URL. It is optional and defaults to
`https://health-coach-hub.vercel.app/api/public/recipes`. If the hub moves or
goes down, the recipes page goes empty — that variable is the escape hatch.
