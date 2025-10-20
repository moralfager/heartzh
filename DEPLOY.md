# 🚀 Production Deployment Guide

## Quick Deploy

**Автоматический деплой настроен!** При push в ветку `prod` запускается GitHub Actions.

```bash
# 1. Переключиться на prod
git checkout prod

# 2. Слить изменения из dev
git merge dev

# 3. Запушить (автодеплой запустится)
git push origin prod
```

---

## Первичная настройка production сервера

### 1. Переменные окружения

Создайте `.env` на сервере (используйте `.env.example` как шаблон):

```bash
# На сервере
cd /path/to/project
cp .env.example .env
nano .env
```

**Обязательные переменные:**
- `DATABASE_URL` - production MySQL connection
- `SESSION_SECRET` - минимум 32 символа (сгенерировать: `openssl rand -base64 32`)
- `COOKIE_SECURE="true"` - для HTTPS

### 2. База данных

```bash
# Применить миграции
npx prisma migrate deploy

# Проверить подключение
npx prisma db pull
```

### 3. Запуск

```bash
# Production запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Проверка после деплоя

✅ **Health check:** `https://heartofzha.ru/api/health` (скоро будет добавлен)  
✅ **Admin:** `https://heartofzha.ru/admin`  
✅ **Tests:** `https://heartofzha.ru/tests`

---

## Мониторинг

```bash
# Логи
docker-compose -f docker-compose.prod.yml logs -f psychotest

# Статус
docker-compose -f docker-compose.prod.yml ps

# Рестарт
docker-compose -f docker-compose.prod.yml restart psychotest
```

---

## Откат (если что-то пошло не так)

```bash
# Вернуться к backup
git checkout prod
git reset --hard prod-backup-2025-10-20
git push origin prod --force

# Рестарт контейнеров
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## CI/CD Pipeline

**Файл:** `.github/workflows/deploy-prod.yml`

**Триггер:** Push в ветку `prod`

**Шаги:**
1. Checkout code
2. Build Docker image
3. Deploy to VPS (если настроено)
4. Health check

---

## Готово к деплою! 🎉

Все Milestones 1-4 завершены. Проект production-ready.

