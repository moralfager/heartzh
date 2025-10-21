# 🔐 Production Environment Setup

## 📋 Чеклист настройки

### 1. На вашем сервере создайте `.env` файл

```bash
cd /path/to/psychotest
nano .env
```

### 2. Скопируйте и заполните:

```bash
# ===================================
# 🗄️ Database (Production MySQL)
# ===================================
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/psychotest_production?schema=public&connection_limit=5"

# ===================================
# 🔐 Session & Security
# ===================================
# Сгенерируйте безопасный ключ (минимум 32 символа)
SESSION_SECRET="ВАШ_СУПЕР_СЕКРЕТНЫЙ_КЛЮЧ_32_СИМВОЛА_МИНИМУМ"

SESSION_COOKIE_NAME="hoz_sid"
SESSION_COOKIE_SAMESITE="Lax"
SESSION_COOKIE_SECURE="true"  # ⚠️ true для HTTPS
RESULT_TTL_HOURS="24"

# ===================================
# 👤 Admin Access
# ===================================
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="СИЛЬНЫЙ_ПАРОЛЬ_СМЕНИТЕ_ЭТО"  # ⚠️ ОБЯЗАТЕЛЬНО СМЕНИТЕ!

# ===================================
# 🌐 Application URLs
# ===================================
NEXT_PUBLIC_APP_URL="https://heartofzha.ru"

# ===================================
# 🧹 Cleanup
# ===================================
CLEANUP_CRON_SCHEDULE="0 * * * *"

# ===================================
# 🚀 Environment
# ===================================
NODE_ENV="production"

# ===================================
# 📊 Prisma
# ===================================
PRISMA_GENERATE_SKIP_AUTOINSTALL="true"
```

---

## 🔑 Генерация безопасного SESSION_SECRET

### Вариант 1: OpenSSL (Linux/Mac)
```bash
openssl rand -base64 32
```

### Вариант 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Вариант 3: PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Результат будет примерно таким:**
```
k7J9mP2nX5vQ8wR4tY6uI1oL3aS5dF7gH9jK0mN2bV4c
```

---

## 🗄️ Настройка MySQL для Production

### 1. Создайте базу данных

```bash
mysql -u root -p
```

```sql
CREATE DATABASE psychotest_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'psychotest_user'@'localhost' IDENTIFIED BY 'СИЛЬНЫЙ_ПАРОЛЬ';

GRANT ALL PRIVILEGES ON psychotest_production.* TO 'psychotest_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

### 2. Обновите DATABASE_URL в `.env`

```bash
DATABASE_URL="mysql://psychotest_user:СИЛЬНЫЙ_ПАРОЛЬ@localhost:3306/psychotest_production?schema=public&connection_limit=5"
```

---

## ✅ Проверка конфигурации

### 1. Проверьте что `.env` создан
```bash
ls -la .env
```

### 2. Проверьте что переменные загружаются
```bash
cat .env | grep -v "^#" | grep -v "^$"
```

### 3. Тест подключения к БД
```bash
npx prisma db pull
```

Если ошибок нет - всё настроено правильно! ✅

---

## 🔒 Безопасность

### ⚠️ КРИТИЧНО:

1. **Никогда** не коммитьте `.env` в git
   ```bash
   # Проверьте что .env в .gitignore
   grep ".env" .gitignore
   ```

2. **Смените** дефолтный ADMIN_PASSWORD
   ```
   ❌ ПЛОХО: "admin", "password", "psychotest2024"
   ✅ ХОРОШО: "Xk9#mL2$vN8@pQ5&"
   ```

3. **Используйте** сильный SESSION_SECRET (минимум 32 символа)

4. **Включите** COOKIE_SECURE="true" для HTTPS

5. **Ограничьте** доступ к `.env`
   ```bash
   chmod 600 .env
   ```

---

## 📝 Финальный чеклист

- [ ] `.env` файл создан на сервере
- [ ] `DATABASE_URL` настроен с production БД
- [ ] `SESSION_SECRET` сгенерирован (32+ символа)
- [ ] `ADMIN_PASSWORD` изменён на сильный
- [ ] `COOKIE_SECURE="true"` для HTTPS
- [ ] `NEXT_PUBLIC_APP_URL` установлен на ваш домен
- [ ] `NODE_ENV="production"`
- [ ] Права на `.env` установлены (600)
- [ ] Проверено что `.env` в `.gitignore`
- [ ] Подключение к БД протестировано

---

## 🚀 Следующий шаг

После настройки environment переходите к:
- **Шаг 3:** Database миграции (`npx prisma migrate deploy`)
- **Шаг 4:** Docker и деплой

См. `PRODUCTION-CHECKLIST.md`

