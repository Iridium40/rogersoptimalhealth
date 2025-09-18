# Production Deployment Guide

## Branch Strategy

### Branches
- **`main`** - Development branch for active development
- **`production`** - Production-ready code, deployed to live site
- **`staging`** - Optional staging branch for pre-production testing

### Code Lock Policy

🔒 **PRODUCTION BRANCH IS LOCKED**

- Direct pushes to `production` branch are **PROHIBITED**
- All changes must go through Pull Request review process
- Only approved, tested code can be merged to production

## Deployment Process

### 1. Development Workflow
```bash
# Work on main branch
git checkout main
git pull origin main

# Make changes, test locally
pnpm dev

# Commit and push to main
git add .
git commit -m "Description of changes"
git push origin main
```

### 2. Production Release
```bash
# Create PR from main to production
# 1. Go to GitHub
# 2. Create Pull Request: main → production  
# 3. Fill out PR template with testing checklist
# 4. Request review and approval
# 5. After approval, merge PR
```

### 3. Vercel Deployment
- **Development**: Auto-deploys from `main` branch to preview URL
- **Production**: Only deploys from `production` branch to live domain
- Use `vercel-production.json` for production builds

## Pre-Production Checklist

Before merging to production:

- [ ] ✅ All features tested locally
- [ ] ✅ No console errors or warnings  
- [ ] ✅ Google Analytics tracking verified
- [ ] ✅ Newsletter functionality tested
- [ ] ✅ All forms working properly
- [ ] ✅ Mobile responsiveness checked
- [ ] ✅ SEO meta tags verified
- [ ] ✅ Performance optimized
- [ ] ✅ Cross-browser compatibility
- [ ] ✅ Code reviewed and approved

## Emergency Hotfixes

For critical production issues:

1. Create hotfix branch from `production`
2. Make minimal fix
3. Test thoroughly
4. Create PR to `production` 
5. Get expedited review
6. Deploy immediately after merge
7. Backport fix to `main` branch

## Rollback Process

If issues occur in production:

1. Revert the problematic commit on `production` branch
2. Force push to trigger immediate redeployment
3. Investigate and fix issues on `main` branch
4. Create new PR when ready

## Branch Protection Settings

Recommended GitHub branch protection for `production`:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging  
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files
- ✅ Do not allow bypassing the above settings
