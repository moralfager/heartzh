# 🎯 START HERE - Production Deployment

## You're Ready to Deploy! 

All files have been prepared for production deployment.

## 🚀 Quick Deploy (Choose Method)

### Method 1: Автоматический деплой (GitHub Actions) ⭐ Рекомендуется

```bash
# 1. Настрой GitHub Secrets (один раз)
# GitHub → Settings → Secrets and variables → Actions
# Добавь:
# - SSH_PRIVATE_KEY: ваш SSH ключ
# - SERVER_HOST: 85.202.192.68
# - SERVER_USER: root
# - SERVER_PATH: /root/psychotest

# 2. Деплой одной командой
git push origin prod
# ✅ GitHub Actions автоматически задеплоит!
```

### Method 2: Ручной деплой со скриптами

**Windows:**
```powershell
.\deploy-production.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### Method 3: Ручной деплой на сервере

```bash
ssh root@85.202.192.68
cd /root/psychotest
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📚 Documentation

- **README.md** - Complete project documentation with deployment instructions
- **env.production.template** - Environment variables template for server

## ✅ What's Ready

- ✅ Database with 2 complete tests (love-psychology, love-expressions)
- ✅ Docker Compose configuration with MySQL 8.0
- ✅ **GitHub Actions** for automatic deployment
- ✅ Automated deployment scripts (Windows & Linux)
- ✅ Environment template for configuration
- ✅ Health checks and monitoring
- ✅ SSL support (existing certificates)

## 🤖 GitHub Actions Workflow

**Файл:** `.github/workflows/deploy.yml`

**Что делает:**
1. Триггерится на push в ветку `prod`
2. Устанавливает зависимости и билдит приложение
3. Запускает тесты (если есть)
4. Подключается к серверу по SSH
5. Обновляет код (`git pull`)
6. Перезапускает Docker контейнеры
7. Проверяет health check

**Как настроить:**
1. Добавь GitHub Secrets (см. README.md)
2. Push в `prod` ветку
3. Открой Actions в GitHub и смотри процесс
4. Готово!

## ⚠️ Important: Before Deploy

1. **You'll need to create `.env.production` on the server**
   - Copy from: `env.production.template`
   - Change ALL passwords!
   - File location: `/root/psychotest/.env.production`

2. **Required changes in `.env.production`:**
   - `MYSQL_ROOT_PASSWORD` - MySQL root password
   - `MYSQL_PASSWORD` - Database user password
   - `DATABASE_URL` - Update with same password
   - `ADMIN_PASSWORD` - Admin panel password
   - `SESSION_SECRET` - Random long string

## 🎬 Deployment Steps

1. **Run deployment script** (see "Quick Deploy" above)
2. **Script will sync files** to server
3. **Script will deploy** on server
4. **If first time**: It will stop and ask you to configure `.env.production`
5. **SSH to server** and edit `.env.production`
6. **Re-run deployment script**
7. **Done!** Check https://heartofzha.ru

## 🧪 Test After Deploy

Visit these URLs to verify:
- https://heartofzha.ru/api/health - Health check
- https://heartofzha.ru/tests - Test catalog (should show 2 tests)
- https://heartofzha.ru/admin - Admin panel (login required)

## 🆘 Need Help?

| Problem | Solution |
|---------|----------|
| Script won't run | `chmod +x deploy-production.sh` |
| SSH connection fails | Check server IP and credentials |
| App won't start | Wait 30s for database, check logs |
| Can't see tests | Database initializing, wait 1 minute |
| Health check fails | See troubleshooting in docs |

## 📂 Files Created

**Database:**
- `database/init-production.sql` - Complete database dump

**Configuration:**
- `env.production.template` - Environment variables template
- `docker-compose.prod.yml` - Production services config

**Scripts:**
- `deploy-production.sh` - Linux/Mac deployment
- `deploy-production.ps1` - Windows deployment
- `server-cleanup.sh` - Clean server script

**Documentation:**
- `PRODUCTION-QUICK-START.md` - Fast deployment guide
- `DEPLOY-PRODUCTION.md` - Complete reference
- `DEPLOYMENT-READY.md` - Overview & checklist

## 🔍 Quick Commands

After deployment, use these:

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status  
docker-compose -f docker-compose.prod.yml ps

# Restart app
docker-compose -f docker-compose.prod.yml restart psychotest

# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 What Gets Deployed

- **MySQL 8.0** - Database with 2 complete tests
- **Next.js App** - Your application on port 3000
- **Nginx** - HTTPS proxy (ports 80, 443)
- **Watchtower** - Auto-updates containers

## 🎉 That's It!

You're ready to deploy. Start with the quick deploy command above!

**Estimated time:** 5-10 minutes

---

**Questions?** Read the detailed guides in the documentation files listed above.

