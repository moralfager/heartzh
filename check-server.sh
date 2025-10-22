#!/bin/bash
# Диагностика сервера

echo "🔍 Проверка статуса сервера"
echo "=============================="
echo ""

echo "📊 Docker контейнеры:"
docker ps -a
echo ""

echo "📊 Логи психотеста (последние 30 строк):"
docker compose -f docker-compose.prod.yml logs --tail=30 psychotest
echo ""

echo "📊 Логи Nginx (последние 20 строк):"
docker compose -f docker-compose.prod.yml logs --tail=20 nginx
echo ""

echo "🌐 Порты:"
netstat -tlnp | grep -E ':(80|443|3000|3306)'
echo ""

echo "🔥 Процессы:"
ps aux | grep -E '(nginx|node|docker)' | grep -v grep
echo ""

echo "💾 Диск:"
df -h /var/www/heartzh
echo ""

echo "✅ Готово!"





