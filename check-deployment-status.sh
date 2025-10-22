#!/bin/bash

echo "🔍 Проверка статуса деплоя..."
echo ""

echo "📊 Контейнеры:"
docker ps --filter "name=heartzh"
echo ""

echo "📦 Последний коммит:"
cd /var/www/heartzh
git log -1 --oneline
echo ""

echo "🔍 Логи приложения (последние 30 строк):"
docker compose -f docker-compose.prod.yml logs --tail=30 psychotest
echo ""

echo "🗄️ Проверка БД (есть ли поле recommendations):"
docker exec heartzh-psychotest-1 mysql -u psychotest_user -p1234 psychotest_production -e "DESCRIBE default_results;" | grep recommendations
echo ""

echo "📋 Проверка записей default_results:"
docker exec heartzh-psychotest-1 mysql -u psychotest_user -p1234 psychotest_production -e "SELECT id, test_id, JSON_LENGTH(recommendations) as rec_count FROM default_results;"

