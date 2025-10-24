# Быстрый деплой исправления подключения к БД
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting quick fix deployment..." -ForegroundColor Green

# 1. Остановить контейнер приложения
Write-Host "📦 Stopping psychotest container..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml stop psychotest

# 2. Удалить старый образ
Write-Host "🗑️ Removing old image..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml rm -f psychotest

# 3. Пересобрать образ
Write-Host "🔨 Rebuilding image..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build psychotest

# 4. Запустить контейнер
Write-Host "▶️ Starting psychotest container..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d psychotest

# 5. Подождать пока контейнер станет здоровым
Write-Host "⏳ Waiting for container to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 6. Проверить статус
Write-Host "📊 Container status:" -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml ps psychotest

# 7. Показать логи
Write-Host "📝 Recent logs:" -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml logs --tail=50 psychotest

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To monitor logs in real-time, run:" -ForegroundColor Yellow
Write-Host "docker compose -f docker-compose.prod.yml logs -f psychotest" -ForegroundColor White

