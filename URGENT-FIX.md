# 🚨 СРОЧНОЕ ИСПРАВЛЕНИЕ - Сайт не отвечает

## Проблема
ERR_CONNECTION_REFUSED - сервер не отвечает

---

## 🔍 ШАГ 1: Диагностика

Подключитесь к серверу и выполните:

```bash
ssh root@85.202.192.68
# или
ssh ubuntu@85.202.192.68

cd /var/www/heartzh

# Проверьте статус контейнеров
sudo docker ps -a
```

### Ожидаемый результат:
Должно быть 4 контейнера в статусе `Up`:
- heartzh-psychotest-1
- heartzh-nginx-1
- heartzh-mysql-1 (или не должно быть, мы его убрали)
- heartzh-watchtower-1

---

## 🔧 ШАГ 2: Возможные проблемы и решения

### Проблема А: Контейнеры не запущены

```bash
cd /var/www/heartzh
sudo docker compose -f docker-compose.prod.yml up -d
sudo docker ps
```

### Проблема Б: Nginx не запустился

```bash
# Проверьте логи Nginx
sudo docker compose -f docker-compose.prod.yml logs nginx

# Если ошибка в конфиге - проверьте
sudo docker exec heartzh-nginx-1 nginx -t

# Перезапустите Nginx
sudo docker compose -f docker-compose.prod.yml restart nginx
```

### Проблема В: Психотест не запустился (ошибка БД)

```bash
# Проверьте логи
sudo docker compose -f docker-compose.prod.yml logs psychotest

# Если ошибка подключения к БД:
# 1. Проверьте DATABASE_URL в .env
sudo cat /var/www/heartzh/.env | grep DATABASE_URL

# 2. Проверьте что MySQL доступна
mysql -u psychotest_user -p -h 172.17.0.1 psychotest_production

# 3. Примените миграции
cd /var/www/heartzh
sudo npx prisma migrate deploy

# 4. Перезапустите
sudo docker compose -f docker-compose.prod.yml restart psychotest
```

### Проблема Г: Порты заняты

```bash
# Проверьте что порты 80 и 443 свободны
sudo netstat -tlnp | grep -E ':(80|443)'

# Если занято - найдите что занимает
sudo lsof -i :80
sudo lsof -i :443

# Остановите конфликтующий процесс или измените порты
```

---

## 🚀 ШАГ 3: Полный перезапуск

Если ничего не помогает:

```bash
cd /var/www/heartzh

# Остановите всё
sudo docker compose -f docker-compose.prod.yml down

# Проверьте что порты свободны
sudo netstat -tlnp | grep -E ':(80|443|3000)'

# Запустите заново
sudo docker compose -f docker-compose.prod.yml up -d

# Подождите 30 секунд
sleep 30

# Проверьте статус
sudo docker ps

# Проверьте логи
sudo docker compose -f docker-compose.prod.yml logs --tail=50
```

---

## 📊 ШАГ 4: Проверка доступности

```bash
# С сервера проверьте что приложение отвечает
curl http://localhost:3000
curl http://localhost:80

# Проверьте из внешнего мира
curl http://85.202.192.68
```

---

## 🔥 БЫСТРОЕ РЕШЕНИЕ (если нужно срочно)

```bash
cd /var/www/heartzh

# 1. Остановите и удалите все контейнеры
sudo docker compose -f docker-compose.prod.yml down -v

# 2. Пересоберите и запустите
sudo docker compose -f docker-compose.prod.yml up -d --build

# 3. Проверьте логи
sudo docker compose -f docker-compose.prod.yml logs -f

# Нажмите Ctrl+C когда увидите "Server listening on port 3000"

# 4. Проверьте сайт
curl http://localhost
```

---

## 📋 Чеклист проверки

- [ ] `docker ps` показывает контейнеры в статусе Up
- [ ] Логи психотеста не показывают ошибок БД
- [ ] Логи Nginx не показывают ошибок
- [ ] `curl http://localhost:3000` возвращает HTML
- [ ] `curl http://localhost` возвращает HTML
- [ ] Порты 80 и 443 слушаются
- [ ] Сайт открывается в браузере

---

## 🆘 Если всё равно не работает

Скопируйте результаты команд:

```bash
# 1. Статус контейнеров
sudo docker ps -a

# 2. Логи
sudo docker compose -f docker-compose.prod.yml logs --tail=100

# 3. Порты
sudo netstat -tlnp | grep -E ':(80|443|3000)'

# 4. Тест изнутри
curl -v http://localhost:3000
```

И покажите мне результаты!

---

## 💡 Вероятная причина

Скорее всего один из контейнеров не запустился из-за:
1. **Ошибка подключения к БД** → проверьте DATABASE_URL
2. **Nginx не может запуститься** → проверьте конфиг
3. **Порты заняты** → освободите или измените порты
4. **Build failed** → пересоберите образы

**Выполните диагностику и напишите что показало!** 🔧





