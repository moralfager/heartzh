#!/bin/bash

# Быстрый деплой исправления подключения к БД
set -e

echo "🚀 Starting quick fix deployment..."

# 1. Остановить контейнер приложения
echo "📦 Stopping psychotest container..."
docker compose -f docker-compose.prod.yml stop psychotest

# 2. Удалить старый образ
echo "🗑️ Removing old image..."
docker compose -f docker-compose.prod.yml rm -f psychotest

# 3. Пересобрать образ
echo "🔨 Rebuilding image..."
docker compose -f docker-compose.prod.yml build psychotest

# 4. Запустить контейнер
echo "▶️ Starting psychotest container..."
docker compose -f docker-compose.prod.yml up -d psychotest

# 5. Подождать пока контейнер станет здоровым
echo "⏳ Waiting for container to be healthy..."
sleep 10

# 6. Проверить статус
echo "📊 Container status:"
docker compose -f docker-compose.prod.yml ps psychotest

# 7. Показать логи
echo "📝 Recent logs:"
docker compose -f docker-compose.prod.yml logs --tail=50 psychotest

echo "✅ Deployment complete!"
echo ""
echo "To monitor logs in real-time, run:"
echo "docker compose -f docker-compose.prod.yml logs -f psychotest"

