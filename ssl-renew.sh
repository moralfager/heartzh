#!/bin/bash
# Скрипт для автоматического обновления SSL сертификатов

cd /var/www/heartzh

# Обновление сертификатов
docker run --rm \
  -v heartzh_certbot-webroot:/var/www/certbot \
  -v heartzh_letsencrypt:/etc/letsencrypt \
  certbot/certbot renew --webroot -w /var/www/certbot \
  --deploy-hook "docker compose -f /var/www/heartzh/docker-compose.prod.yml exec -T nginx nginx -s reload"

# Перезагрузка Nginx для применения новых сертификатов
docker compose -f docker-compose.prod.yml exec -T nginx nginx -s reload

echo "SSL certificate renewal completed at $(date)" >> /var/log/ssl-renew.log
