# 🔧 Настройка локального MySQL (без Docker)

## Шаг 1: Установка MySQL (у тебя уже установлен!)

Ты уже устанавливал MySQL Server 8.0.42. Используем его!

## Шаг 2: Запустить MySQL Service

**В PowerShell (от администратора):**

```powershell
# Проверить статус
Get-Service MySQL80

# Запустить (если не запущен)
Start-Service MySQL80
```

## Шаг 3: Создать базу данных

**Подключиться к MySQL:**

```powershell
# Пароль root: 1234 (как ты указал)
mysql -u root -p
```

**В MySQL консоли:**

```sql
-- Создать базу данных
CREATE DATABASE psychotest_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создать пользователя
CREATE USER 'psychotest'@'localhost' IDENTIFIED BY 'psychotest_password';

-- Выдать права
GRANT ALL PRIVILEGES ON psychotest_dev.* TO 'psychotest'@'localhost';
FLUSH PRIVILEGES;

-- Проверить
SHOW DATABASES;

-- Выйти
EXIT;
```

## Шаг 4: Настроить .env

**Создай файл `.env` в корне проекта:**

```env
# Database
DATABASE_URL="mysql://psychotest:psychotest_password@localhost:3306/psychotest_dev"

# Session
RESULT_TTL_HOURS=24
SESSION_COOKIE_NAME=hoz_sid
SESSION_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SECURE=false

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=psychotest2024

# Cleanup Cron
CLEANUP_CRON_SCHEDULE="0 * * * *"

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Шаг 5: Применить миграции

```bash
npx prisma migrate dev --name init_schema
```

## Шаг 6: Импортировать тесты

```bash
npm run import-tests
```

## Шаг 7: Открыть Prisma Studio (опционально)

```bash
npx prisma studio
# Откроется http://localhost:5555
```

## Шаг 8: Запустить Next.js

```bash
npm run dev
# Откроется http://localhost:3000
```

---

## 🔍 Troubleshooting

### MySQL не запускается?

```powershell
# Проверить порт 3306
netstat -ano | findstr :3306

# Если занят другим процессом, остановить:
Stop-Service MySQL80
Start-Service MySQL80
```

### Забыл root пароль?

1. Открой MySQL Installer
2. Reconfigure → MySQL Server
3. Измени root пароль

### Ошибка подключения?

```bash
# Проверить DATABASE_URL в .env
echo $env:DATABASE_URL

# Проверить Prisma
npx prisma db pull
```

---

## ✅ После успешной настройки

Ты сможешь:
- ✅ Создавать/читать сессии
- ✅ Сохранять результаты тестов
- ✅ Тестировать API endpoints
- ✅ Смотреть данные в Prisma Studio
- ✅ Запускать cleanup cron вручную

**Готово к разработке! 🚀**

