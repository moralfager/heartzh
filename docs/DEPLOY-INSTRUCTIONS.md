# 🚀 Инструкции по деплою в Production

## 📋 Предварительные требования

### На сервере должно быть установлено:
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ MySQL (или используйте Docker MySQL)
- ✅ SSL сертификат (Let's Encrypt)

---

## 🔧 Шаг 1: Подготовка сервера

### 1.1 Подключитесь к серверу
```bash
ssh user@heartofzha.ru
```

### 1.2 Клонируйте репозиторий (если ещё не клонирован)
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/psychotest.git
cd psychotest
```

### 1.3 Переключитесь на production ветку
```bash
git checkout prod
git pull origin prod
```

---

## 🔐 Шаг 2: Настройка Environment Variables

### 2.1 Создайте `.env` файл
```bash
nano .env
```

### 2.2 Вставьте и заполните:
```bash
# Database (Production MySQL)
DATABASE_URL="mysql://psychotest_user:YOUR_PASSWORD@localhost:3306/psychotest_production?schema=public&connection_limit=5"

# Session & Security
SESSION_SECRET="$(openssl rand -base64 32)"  # Сгенерируйте новый!
SESSION_COOKIE_NAME="hoz_sid"
SESSION_COOKIE_SAMESITE="Lax"
SESSION_COOKIE_SECURE="true"  # HTTPS required
RESULT_TTL_HOURS="24"

# Admin Access
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="STRONG_PASSWORD_HERE"  # Обязательно смените!

# Application URLs
NEXT_PUBLIC_APP_URL="https://heartofzha.ru"

# Cleanup
CLEANUP_CRON_SCHEDULE="0 * * * *"

# Environment
NODE_ENV="production"

# Prisma
PRISMA_GENERATE_SKIP_AUTOINSTALL="true"
```

### 2.3 Установите правильные права
```bash
chmod 600 .env
```

---

## 🗄️ Шаг 3: Настройка MySQL

### 3.1 Создайте базу данных
```bash
mysql -u root -p
```

```sql
CREATE DATABASE psychotest_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'psychotest_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON psychotest_production.* TO 'psychotest_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

### 3.2 Запустите миграции Prisma
```bash
npx prisma migrate deploy
```

### 3.3 Проверьте подключение
```bash
npx prisma db pull
```

---

## 🐳 Шаг 4: Docker Build & Deploy

### 4.1 Остановите старые контейнеры (если есть)
```bash
docker-compose -f docker-compose.prod.yml down
```

### 4.2 Соберите новый образ
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 4.3 Запустите контейнеры
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4.4 Проверьте статус
```bash
docker-compose -f docker-compose.prod.yml ps
```

Должно быть:
```
NAME          STATUS      PORTS
psychotest    Up          0.0.0.0:3000->3000/tcp
nginx         Up          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
watchtower    Up
```

---

## 📊 Шаг 5: Импорт тестов в production БД

### 5.1 Скопируйте JSON файлы тестов (если их нет)
```bash
# Уже должны быть в public/tests/
ls public/tests/
```

### 5.2 Импортируйте тесты через админку

1. Откройте браузер: `https://heartofzha.ru/admin`
2. Войдите (admin / ваш пароль из `.env`)
3. Создайте новый тест или импортируйте JSON
4. Опубликуйте тесты (Published = true)

---

## ✅ Шаг 6: Проверка работоспособности

### 6.1 Проверьте главную страницу
```bash
curl https://heartofzha.ru
```

### 6.2 Проверьте API health
```bash
curl https://heartofzha.ru/api/tests
```

### 6.3 Пройдите тест вручную
1. Откройте `https://heartofzha.ru`
2. Выберите тест
3. Пройдите все вопросы
4. Проверьте результаты

### 6.4 Проверьте что результаты сохраняются
```bash
mysql -u psychotest_user -p psychotest_production -e "SELECT COUNT(*) FROM results;"
```

---

## 🔍 Шаг 7: Мониторинг и логи

### 7.1 Просмотр логов приложения
```bash
docker-compose -f docker-compose.prod.yml logs -f psychotest
```

### 7.2 Просмотр логов Nginx
```bash
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 7.3 Проверка использования ресурсов
```bash
docker stats
```

---

## 🔄 Автоматическое обновление (CI/CD)

### GitHub Actions уже настроен!

Каждый push в ветку `prod` автоматически:
1. Собирает Docker образ
2. Пушит в Docker registry (если настроен)
3. Обновляет контейнеры через Watchtower

**Чтобы обновить production:**
```bash
git checkout main
git pull
# Внесите изменения
git commit -m "Update"
git push

git checkout prod
git merge main
git push origin prod  # Триггерит автодеплой!
```

---

## 🛠️ Troubleshooting

### Проблема: Контейнер не запускается
```bash
# Проверьте логи
docker-compose -f docker-compose.prod.yml logs psychotest

# Проверьте .env загружен
docker exec psychotest env | grep DATABASE_URL
```

### Проблема: База данных не подключается
```bash
# Проверьте что MySQL запущен
sudo systemctl status mysql

# Проверьте права пользователя
mysql -u psychotest_user -p -e "SHOW GRANTS;"
```

### Проблема: Nginx не проксирует
```bash
# Проверьте конфиг
docker exec nginx nginx -t

# Перезапустите Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Проблема: SSL сертификат истёк
```bash
# Обновите Let's Encrypt
sudo certbot renew

# Перезапустите Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📈 Post-Deploy чеклист

- [ ] Сайт открывается: https://heartofzha.ru
- [ ] SSL сертификат валиден (зелёный замок)
- [ ] Тесты работают и сохраняют результаты
- [ ] Админка доступна: https://heartofzha.ru/admin
- [ ] Логи не показывают ошибок
- [ ] Watchtower мониторит обновления
- [ ] Cleanup cron работает (проверьте через 1 час)
- [ ] Результаты удаляются через 24 часа

---

## 🎉 Поздравляем! Вы в production!

### Полезные команды:

**Перезапуск:**
```bash
docker-compose -f docker-compose.prod.yml restart
```

**Остановка:**
```bash
docker-compose -f docker-compose.prod.yml down
```

**Обновление:**
```bash
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

**Backup БД:**
```bash
mysqldump -u psychotest_user -p psychotest_production > backup_$(date +%Y%m%d).sql
```

---

## 📞 Поддержка

Если что-то пошло не так:
1. Проверьте логи: `docker-compose logs`
2. Проверьте `.env` файл
3. Проверьте подключение к БД
4. Откатитесь на предыдущую версию: `git checkout HEAD~1`

