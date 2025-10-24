# 🚀 Fast Production Deployment Guide

## Overview
This setup uses pre-built Docker images from GitHub Container Registry (GHCR) for fast deployments without rebuilding on the server.

## How It Works

1. **GitHub Actions builds** the Docker image once in the cloud
2. **Pushes to GHCR** (GitHub Container Registry)
3. **Server pulls** the pre-built image (much faster than building)
4. **Restarts** only the changed service

## Setup Requirements

### 1. GitHub Secrets
Add these secrets to your GitHub repository (Settings → Secrets → Actions):

- `SSH_HOST` - your server IP
- `SSH_USER` - SSH username
- `SSH_KEY` - SSH private key
- `SSH_PORT` - SSH port (usually 22)
- `SERVER_PATH` - path to project on server (e.g., `/home/user/psychotest`)

### 2. Server Setup

On your production server, run:

```bash
cd /path/to/your/project

# Create .env.production if not exists
cp env.production.template .env.production
nano .env.production

# IMPORTANT: Make sure docker compose is installed
docker compose version

# Test that you can pull from GHCR (login once manually)
# This creates ~/.docker/config.json for future pulls
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### 3. Repository Settings

Make sure your repository allows package access:
1. Go to your GitHub repository
2. Settings → Actions → General
3. Workflow permissions → "Read and write permissions"

### 4. Make Image Public (Optional but Recommended)

To avoid login issues:
1. Go to `https://github.com/YOUR_USERNAME?tab=packages`
2. Find your package
3. Package settings → Change visibility → Public

## Deployment Process

### Automatic Deployment
Push to `prod` branch:
```bash
git push origin prod
```

### Manual Deployment
GitHub Actions → Deploy to Production → Run workflow

## Deployment Speed

- ❌ Old way: Build on server (~5-10 minutes)
- ✅ New way: Pull pre-built image (~30-60 seconds)

## Optimizations Applied

1. **Shallow Git Fetch**: Only fetches the latest commit (`--depth=1`)
2. **Pre-built Images**: Docker image built once in GitHub Actions
3. **Selective Restart**: Only restarts changed service (`--no-build psychotest`)
4. **Increased Timeouts**: 10m SSH timeout (was 3m)
5. **Layer Caching**: Docker BuildKit caching in GHCR
6. **Fast Health Check**: 5 seconds instead of 10

## Troubleshooting

### Image Pull Failed
```bash
# Re-login to GHCR on server
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### Wrong Image Name
Check that your `GITHUB_REPOSITORY` matches:
- GitHub repo: `username/repo-name`
- In workflow, it's auto: `${{ github.repository }}`

### Health Check Fails
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs psychotest --tail=200

# Manual health check
curl http://localhost:3000/api/health
```

### Old Deploy Script Issues
If you have any old deploy scripts (deploy-production.sh, deploy-production.ps1), they might conflict. 
Use GitHub Actions workflow instead.

## Files Changed

- `.github/workflows/deploy.yml` - Workflow configuration
- `docker-compose.prod.yml` - Now uses pre-built images
- `Dockerfile` - Multi-stage build with caching

## Next Steps

1. Test deployment: `git push origin prod`
2. Monitor: GitHub Actions tab
3. Verify: Check your site at https://heartofzha.ru



