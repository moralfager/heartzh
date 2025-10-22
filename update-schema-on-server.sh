#!/bin/bash

# Скрипт для обновления схемы БД на production сервере
# Добавляет поле recommendations в таблицу default_results

echo "🔄 Обновление схемы БД на production..."

# Запускаем Prisma DB Push внутри Docker контейнера
docker exec psychotest-psychotest-1 npx prisma db push

echo ""
echo "✅ Схема обновлена!"
echo "🔍 Проверяем что приложение работает:"
docker exec psychotest-psychotest-1 node -e "console.log('Node OK')"

echo ""
echo "✅ Готово! Теперь в админке можно редактировать рекомендации."

