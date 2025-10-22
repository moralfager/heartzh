#!/bin/bash

# ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ v2: Добавляет поле recommendations в БД
# Исправлено имя контейнера на heartzh-psychotest-1

echo "🔧 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ v2: Добавляем поле recommendations..."
echo ""

# Проверяем имя контейнера
echo "📋 Найденные контейнеры:"
docker ps --filter "name=psychotest" --format "{{.Names}}"
echo ""

# Добавляем колонку напрямую в MySQL (правильное имя контейнера)
echo "💾 Добавляем колонку в БД..."
docker exec heartzh-psychotest-1 npx prisma db push --skip-generate

echo ""
echo "✅ Схема обновлена!"
echo ""
echo "🔄 Перезапускаем контейнеры..."

cd /var/www/heartzh
docker compose -f docker-compose.prod.yml restart psychotest

echo ""
echo "⏳ Ждём 10 секунд..."
sleep 10

echo ""
echo "✅ ГОТОВО! Проверь сайт - ошибка должна исчезнуть."
echo ""
echo "📊 Статус контейнеров:"
docker ps

echo ""
echo "🔍 Проверяем логи:"
docker compose -f docker-compose.prod.yml logs --tail=10 psychotest

