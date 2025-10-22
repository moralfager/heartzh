#!/bin/bash

# ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ: Добавляет поле recommendations в БД
# Запускай это на сервере ПРЯМО СЕЙЧАС!

echo "🔧 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ: Добавляем поле recommendations..."
echo ""

# Добавляем колонку напрямую в MySQL
docker exec psychotest-psychotest-1 mysql -u psychotest_user -p1234 psychotest_production -e "
ALTER TABLE default_results 
ADD COLUMN IF NOT EXISTS recommendations JSON DEFAULT ('[]');
"

echo "✅ Поле добавлено!"
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

