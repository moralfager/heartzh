#!/bin/bash
# Импорт тестов в production базу данных

set -e

echo "🚀 Импорт тестов в production"
echo "=============================="
echo ""

# 1. Примените миграции
echo "📋 Применяю миграции Prisma..."
npx prisma migrate deploy
echo ""

# 2. Импортируйте тесты
echo "📦 Импортирую тесты..."
npm run import-tests -- --force
echo ""

echo "✅ Готово!"
echo ""
echo "Проверьте:"
echo "  - Админка: https://heartofzha.ru/admin/tests"
echo "  - Тесты: https://heartofzha.ru/tests"





