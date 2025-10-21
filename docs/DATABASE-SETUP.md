# 🗄️ Настройка базы данных для Production

## Проблема

На сервере уже установлена MySQL, поэтому мы не запускаем её в Docker.

---

## ✅ Решение: Подключение к системной MySQL

### 1. Узнайте данные MySQL на сервере

SSH на сервер:
```bash
ssh root@85.202.192.68
```

Проверьте что MySQL запущена:
```bash
systemctl status mysql
# или
systemctl status mysqld
```

### 2. Создайте базу данных (если ещё нет)

```bash
mysql -u root -p
```

В MySQL консоли:
```sql
CREATE DATABASE IF NOT EXISTS psychotest_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'psychotest_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON psychotest_production.* TO 'psychotest_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

### 3. Настройте DATABASE_URL

На сервере откройте `.env`:
```bash
cd /var/www/heartzh
nano .env
```

**Вариант 1: Подключение через localhost (рекомендуется)**
```env
DATABASE_URL="mysql://psychotest_user:YOUR_PASSWORD@172.17.0.1:3306/psychotest_production"
```

**Вариант 2: Через host.docker.internal**
```env
DATABASE_URL="mysql://psychotest_user:YOUR_PASSWORD@host.docker.internal:3306/psychotest_production"
```

**Где:**
- `psychotest_user` - имя пользователя MySQL
- `YOUR_PASSWORD` - пароль пользователя
- `172.17.0.1` - IP адрес хоста из Docker (обычно это default)
- `psychotest_production` - название базы данных

### 4. Примените миграции Prisma

```bash
cd /var/www/heartzh

# Установите зависимости (если нужно)
npm install

# Примените миграции
npx prisma migrate deploy

# Проверьте подключение
npx prisma db pull
```

### 5. Перезапустите контейнер

```bash
docker compose -f docker-compose.prod.yml restart psychotest
```

---

## 🔍 Проверка подключения

### Проверьте что приложение подключилось к БД:

```bash
# Логи контейнера
docker compose -f docker-compose.prod.yml logs -f psychotest

# Должно быть что-то вроде:
# ✓ Database connected
# ✓ Server started on port 3000
```

### Проверьте таблицы в БД:

```bash
mysql -u psychotest_user -p psychotest_production -e "SHOW TABLES;"
```

Должно быть:
```
+-----------------------------------+
| Tables_in_psychotest_production   |
+-----------------------------------+
| _prisma_migrations                |
| Question                          |
| QuestionOption                    |
| Result                            |
| Rule                              |
| Scale                             |
| Session                           |
| Test                              |
+-----------------------------------+
```

---

## 🐛 Troubleshooting

### Ошибка: "Access denied for user"

**Проблема:** Неверный пользователь/пароль

**Решение:**
```bash
mysql -u root -p
GRANT ALL PRIVILEGES ON psychotest_production.* TO 'psychotest_user'@'%' IDENTIFIED BY 'YOUR_PASSWORD';
FLUSH PRIVILEGES;
```

### Ошибка: "Can't connect to MySQL server"

**Проблема:** MySQL не слушает на нужном IP

**Решение:**
```bash
# Проверьте bind-address в MySQL конфиге
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Убедитесь что:
bind-address = 0.0.0.0
# или закомментировано

# Перезапустите MySQL
sudo systemctl restart mysql
```

### Ошибка: "Connection refused"

**Проблема:** Docker не может достучаться до хоста

**Решение:**
Проверьте IP хоста:
```bash
# На сервере (не в контейнере)
ip addr show docker0

# Используйте этот IP в DATABASE_URL
# Обычно это 172.17.0.1
```

---

## 📝 Пример рабочего .env

```env
# Database (system MySQL, not Docker)
DATABASE_URL="mysql://psychotest_user:SecurePass123!@172.17.0.1:3306/psychotest_production"

# Session
SESSION_SECRET="your-32-char-secret-here"
SESSION_COOKIE_NAME="hoz_sid"
SESSION_COOKIE_SAMESITE="Lax"
SESSION_COOKIE_SECURE="true"
RESULT_TTL_HOURS="24"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-admin-password"

# App
NEXT_PUBLIC_APP_URL="https://heartofzha.ru"
NODE_ENV="production"

# Cleanup
CLEANUP_CRON_SCHEDULE="0 * * * *"
```

---

## ✅ После настройки

1. Проверьте что приложение запустилось:
   ```bash
   docker ps
   curl http://localhost:3000
   ```

2. Откройте сайт: https://heartofzha.ru

3. Проверьте админку: https://heartofzha.ru/admin

4. Импортируйте тесты через админку (если нужно)

---

Готово! 🎉

