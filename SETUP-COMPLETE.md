# ✅ Setup Complete - Ready for Clean Deploy

## Что сделано

### 🗑️ Очистка (29 файлов удалено)

**MD файлы (26):**
- Все SESSION-SUMMARY, PROGRESS, ROADMAP, WORKFLOW
- Все MILESTONE summaries
- Все старые PRODUCTION-*, DEPLOY-*, QUICKSTART-*
- JSON-IMPORT-GUIDE, NORMALIZATION-LOGIC, и другие

**SQL файлы (3):**
- production-seed.sql, schema-only.sql, mysql-schema.sql
- ✅ Оставлен: `database/init-production.sql` (для Docker)

**Осталось только:**
- README.md - основная документация
- START-HERE.md - быстрый старт
- docs/CHATGPT-PROMPT-FOR-RULES.md - полезно для разработки
- prisma/README.md, prisma/LOCAL-SETUP.md - для локальной разработки
- src/lib/result-engine/README.md - документация кода

### 📝 Обновлено

1. **`.gitignore`**
   - Добавлено: `.env.production`
   - Добавлено: `database/*.sql` (кроме init-production.sql)
   - Добавлены deployment logs и backups

2. **`README.md`**
   - Добавлена секция GitHub Actions
   - Инструкции по настройке GitHub Secrets
   - Обновлены инструкции деплоя
   - Убраны ссылки на удаленные файлы

3. **`START-HERE.md`**
   - Добавлен Method 1: GitHub Actions (рекомендуется)
   - Секция о GitHub Actions workflow
   - Упрощенная структура

### 🆕 Создано

**`.github/workflows/deploy.yml`** - Автоматический деплой

Триггеры:
- Push в ветку `prod`
- Ручной запуск (workflow_dispatch)

Шаги:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Build application
5. Run tests
6. Deploy via SSH:
   - Pull latest code
   - Check .env.production
   - Install production dependencies
   - Docker compose down
   - Docker compose up --build
   - Wait 30s
   - Health check
7. Notify on failure

## 🚀 Как деплоить теперь

### Вариант 1: GitHub Actions (Автоматический) ⭐

**Один раз настрой GitHub Secrets:**

Иди в GitHub → Settings → Secrets and variables → Actions

Добавь:
```
SSH_PRIVATE_KEY = <твой SSH ключ>
SERVER_HOST = 85.202.192.68
SERVER_USER = root
SERVER_PATH = /root/psychotest
```

**Деплой:**
```bash
git add .
git commit -m "Deploy to production"
git push origin prod
```

✅ GitHub Actions автоматически задеплоит!

Смотри процесс: GitHub → Actions tab

### Вариант 2: Ручной деплой

**С локального компьютера:**
```powershell
# Windows
.\deploy-production.ps1

# Linux/Mac
chmod +x deploy-production.sh
./deploy-production.sh
```

**Напрямую на сервере:**
```bash
ssh root@85.202.192.68
cd /root/psychotest
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 Первый деплой на чистый сервер

### 1. Установить Docker (если нет)

```bash
ssh root@85.202.192.68

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Проверка
docker --version
docker-compose --version
```

### 2. Клонировать репозиторий

```bash
# Если репозиторий уже есть - удали
rm -rf /root/psychotest

# Клонируй заново
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /root/psychotest
cd /root/psychotest
git checkout prod
```

### 3. Создать .env.production

```bash
# Копируй шаблон
cp env.production.template .env.production

# Редактируй пароли
nano .env.production
```

**Обязательно измени:**
- `MYSQL_ROOT_PASSWORD` - сильный пароль
- `MYSQL_PASSWORD` - пароль для пользователя БД
- `DATABASE_URL` - обнови пароль в строке подключения
- `ADMIN_PASSWORD` - пароль админки
- `SESSION_SECRET` - случайная длинная строка (32+ символа)

### 4. Запустить

```bash
# Первый запуск (инициализация БД)
docker-compose -f docker-compose.prod.yml up -d --build

# Подождать 30 секунд для инициализации БД
sleep 30

# Проверить статус
docker-compose -f docker-compose.prod.yml ps

# Проверить здоровье
curl http://localhost:3000/api/health
```

### 5. Проверить

Открой в браузере:
- https://heartofzha.ru/api/health - должен вернуть `{"status":"healthy"}`
- https://heartofzha.ru/tests - должны показаться 2 теста
- https://heartofzha.ru/admin - вход в админку

## 🗄️ База данных

**Автоматически создаётся при первом запуске!**

Файл: `database/init-production.sql`

Содержит:
- ✅ Полную схему (все таблицы)
- ✅ 2 теста (love-psychology, love-expressions)
- ✅ 100 вопросов (50 + 50)
- ✅ Все варианты ответов
- ✅ Все scales и rules

Ничего вручную делать НЕ НУЖНО!

## 🔄 Workflow

**Разработка → Продакшн:**

```bash
# 1. Работаешь локально
git add .
git commit -m "Feature: something"

# 2. Пушишь в prod
git push origin prod

# 3. GitHub Actions автоматически деплоит!
# Смотри процесс в GitHub Actions
```

**Откатить изменения:**

```bash
# На сервере
ssh root@85.202.192.68
cd /root/psychotest
git reset --hard HEAD~1  # Откатить на 1 коммит назад
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Мониторинг

**Просмотр логов:**
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Только приложение
docker-compose -f docker-compose.prod.yml logs -f psychotest

# Только база данных
docker-compose -f docker-compose.prod.yml logs -f mysql

# Только nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

**Статус контейнеров:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

**Рестарт сервиса:**
```bash
# Рестарт приложения
docker-compose -f docker-compose.prod.yml restart psychotest

# Рестарт базы
docker-compose -f docker-compose.prod.yml restart mysql
```

## 🆘 Troubleshooting

### GitHub Actions не работает

**Проверь:**
1. Secrets настроены правильно
2. SSH ключ имеет правильные права (без passphrase)
3. Сервер доступен по SSH
4. Репозиторий клонирован на сервере

**Создание SSH ключа для GitHub Actions:**
```bash
# На сервере
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Скопируй приватный ключ для GitHub Secrets
cat ~/.ssh/github_actions
```

### База данных не инициализируется

```bash
# Проверь, что файл на месте
ls -la database/init-production.sql

# Удали старый volume и пересоздай
docker-compose -f docker-compose.prod.yml down
docker volume rm psychotest_mysql_data
docker-compose -f docker-compose.prod.yml up -d

# Подожди 30 секунд и проверь
docker-compose -f docker-compose.prod.yml logs mysql | grep "ready for connections"
```

### Приложение не стартует

```bash
# Проверь логи
docker-compose -f docker-compose.prod.yml logs psychotest

# Частые причины:
# 1. DATABASE_URL неправильный
# 2. База не готова (подожди 30 сек)
# 3. Порт 3000 занят

# Проверь .env.production
cat .env.production | grep DATABASE_URL

# Рестарт приложения после того как база готова
docker-compose -f docker-compose.prod.yml restart psychotest
```

## 📚 Файлы в проекте

**Ключевые:**
- `START-HERE.md` - начни отсюда
- `README.md` - полная документация
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `docker-compose.prod.yml` - продакшн конфигурация
- `env.production.template` - шаблон переменных окружения
- `database/init-production.sql` - инициализация БД

**Скрипты:**
- `deploy-production.sh` - деплой для Linux/Mac
- `deploy-production.ps1` - деплой для Windows
- `server-cleanup.sh` - очистка сервера

## ✨ Готово к деплою!

Всё настроено и готово. Следуй инструкциям выше для первого деплоя.

**Quick Start:**
1. Настрой GitHub Secrets
2. `git push origin prod`
3. Готово! 🚀

