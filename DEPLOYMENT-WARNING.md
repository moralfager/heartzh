# ⚠️ IMPORTANT: Deployment Method Changed

## 🚫 Old Scripts Deprecated

The following scripts are now **DEPRECATED** and may cause issues:
- `deploy-production.sh`
- `deploy-production.ps1`

These scripts build Docker images on the server, which is:
- ❌ Slow (5-10 minutes)
- ❌ Resource-intensive on the server
- ❌ Can timeout (as you experienced)

## ✅ New Deployment Method

**Use GitHub Actions** - it's automatic, fast, and reliable.

### How to Deploy Now:

**Option 1: Automatic (Recommended)**
```bash
git add .
git commit -m "your changes"
git push origin prod
```
That's it! GitHub Actions will build and deploy automatically in ~1-2 minutes.

**Option 2: Manual Trigger**
1. Go to GitHub → Actions tab
2. Click "Deploy to Production"
3. Click "Run workflow"
4. Select `prod` branch
5. Click "Run workflow"

## Why This Is Better

| Old Method | New Method |
|------------|-----------|
| Build on server (slow CPU) | Build in GitHub cloud (fast) |
| 5-10 minutes | 1-2 minutes |
| Timeouts | Reliable |
| Server load | No server load |
| Manual rsync | Automatic |

## If You Must Deploy Manually

If GitHub Actions is down or you need emergency manual deployment:

```bash
# On your server
cd /root/psychotest
export GITHUB_REPOSITORY=username/psychotest  # Replace with your repo
git pull origin prod
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --no-build
```

## Migration Checklist

- [x] Updated `.github/workflows/deploy.yml`
- [x] Updated `docker-compose.prod.yml` to use GHCR images
- [x] Increased SSH timeout to 10m
- [x] Added fast git fetch (`--depth=1`)
- [x] Created `DEPLOY-FAST.md` with new instructions

## Rollback

If you need to rollback to building on server:

```bash
# Edit docker-compose.prod.yml
# Change: image: ghcr.io/${GITHUB_REPOSITORY}:prod
# Back to: build: .
```

But this is NOT recommended - fix the issue and deploy properly instead.



