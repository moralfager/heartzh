# 🔐 SSL Setup Instructions

## После успешного деплоя приложения

Когда приложение работает на **http://heartofzha.ru**, выполни эти шаги чтобы добавить HTTPS.

---

## Шаг 1: Получить SSL сертификаты

```bash
# SSH на сервер
ssh root@85.202.192.68
cd /root/psychotest

# Остановить nginx (временно)
docker-compose -f docker-compose.prod.yml stop nginx

# Установить certbot
apt-get update
apt-get install -y certbot

# Получить SSL сертификаты
certbot certonly --standalone \
  -d heartofzha.ru \
  -d www.heartofzha.ru \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com

# Сертификаты будут в: /etc/letsencrypt/live/heartofzha.ru/
```

---

## Шаг 2: Скопировать сертификаты в Docker volume

```bash
# Создать volume для SSL
docker volume create psychotest_letsencrypt

# Скопировать сертификаты
docker run --rm \
  -v /etc/letsencrypt:/source:ro \
  -v psychotest_letsencrypt:/target \
  alpine sh -c "cp -r /source/* /target/"

# Проверить
docker run --rm \
  -v psychotest_letsencrypt:/data \
  alpine ls -la /data/live/heartofzha.ru/
```

---

## Шаг 3: Обновить docker-compose.prod.yml

Отредактируй файл на сервере:

```bash
nano /root/psychotest/docker-compose.prod.yml
```

**Измени секцию nginx:**

```yaml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Вернуть полный конфиг с SSL
      - ./nginx-docker.conf:/etc/nginx/conf.d/default.conf
      - letsencrypt:/etc/letsencrypt
      - certbot-webroot:/var/www/certbot
    depends_on:
      - psychotest
    restart: unless-stopped
```

**Раскомментируй volumes внизу:**

```yaml
volumes:
  mysql_data:
  letsencrypt:
  certbot-webroot:
```

---

## Шаг 4: Перезапустить с SSL

```bash
cd /root/psychotest

# Перезапустить все сервисы с новой конфигурацией
docker-compose -f docker-compose.prod.yml up -d --force-recreate nginx

# Проверить логи
docker-compose -f docker-compose.prod.yml logs -f nginx
```

---

## Шаг 5: Проверить HTTPS

```bash
# Проверить что сертификат работает
curl -I https://heartofzha.ru

# В браузере открой
# https://heartofzha.ru
# Должен быть зелёный замочек 🔒
```

---

## Автоматическое обновление SSL

Добавь cron задачу для автообновления (сертификаты действительны 90 дней):

```bash
# Открой crontab
crontab -e

# Добавь эту строку (обновление каждый день в 3:00)
0 3 * * * certbot renew --quiet --deploy-hook "docker exec psychotest-nginx-1 nginx -s reload"
```

---

## Проверка

После настройки SSL:
- ✅ http://heartofzha.ru → редирект на https
- ✅ https://heartofzha.ru → работает с зелёным замочком
- ✅ https://www.heartofzha.ru → работает

---

## Возврат в репозиторий

После успешной настройки SSL на сервере, обнови код в репозитории:

```bash
# На локальной машине
# Раскомментируй SSL volumes в docker-compose.prod.yml
# Измени nginx-http-only.conf на nginx-docker.conf

git add docker-compose.prod.yml
git commit -m "Enable SSL after server setup"
git push origin prod
```

---

## Troubleshooting

### Nginx не запускается после изменения конфига

```bash
# Проверь логи
docker-compose -f docker-compose.prod.yml logs nginx

# Проверь что сертификаты на месте
docker exec psychotest-nginx-1 ls -la /etc/letsencrypt/live/heartofzha.ru/

# Если их нет - повтори Шаг 2
```

### Certbot ошибка "Port 80 in use"

```bash
# Останови nginx перед запуском certbot
docker-compose -f docker-compose.prod.yml stop nginx

# Потом получи сертификаты
certbot certonly --standalone ...

# Запусти nginx обратно
docker-compose -f docker-compose.prod.yml start nginx
```

---

**Готово!** 🎉 Твой сайт теперь работает с HTTPS!




