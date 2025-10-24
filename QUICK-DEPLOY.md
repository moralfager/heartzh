# ⚡ Quick Deploy Reference

## 🎯 Deploy to Production (New Fast Method)

```bash
git push origin prod
```

Wait 1-2 minutes. Done! ✅

## 📊 Monitor Deployment

Watch it live:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

## 🔧 First Time Setup Only

### On GitHub:
1. Settings → Secrets → Actions → Add:
   - `SSH_HOST` = your server IP
   - `SSH_USER` = your SSH username  
   - `SSH_KEY` = your private SSH key
   - `SSH_PORT` = 22 (or your SSH port)
   - `SERVER_PATH` = /root/psychotest (or your path)

2. Settings → Actions → General:
   - Workflow permissions → "Read and write permissions"

### On Server (One Time):
```bash
# Login to GHCR once
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Make sure docker compose is installed
docker compose version
```

## ⏱️ Speed Comparison

```
Old: git push → 5-10 min → ⏰ timeout
New: git push → 1-2 min  → ✅ deployed
```

## 🆘 Troubleshooting

**Health check failed?**
```bash
ssh user@server
docker compose -f docker-compose.prod.yml logs psychotest --tail=200
```

**Wrong image name?**
Check `docker-compose.prod.yml`:
```yaml
image: ghcr.io/username/repo:prod  # Must match your GitHub repo
```

**Deploy stuck?**
- Check GitHub Actions logs
- SSH timeout increased to 10m (was 3m)
- git fetch uses `--depth=1` (faster)

## 📚 More Info

- Full guide: `DEPLOY-FAST.md`
- Old vs new: `DEPLOYMENT-WARNING.md`
- SSL setup: `SETUP-SSL.md`

## 🎉 That's It!

You should never wait more than 2 minutes for deployment now.



