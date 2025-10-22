# Скрипт для обновления схемы БД на production сервере
# Добавляет поле recommendations в таблицу default_results

Write-Host "🔄 Подключаемся к серверу через SSH..." -ForegroundColor Cyan

ssh root@heartofzha.ru @"
cd /var/www/heartzh
echo '🔄 Обновление схемы БД на production...'
docker exec psychotest-psychotest-1 npx prisma db push
echo ''
echo '✅ Схема обновлена!'
echo '🔍 Проверяем что приложение работает:'
docker exec psychotest-psychotest-1 node -e 'console.log(\"Node OK\")'
echo ''
echo '✅ Готово! Теперь в админке можно редактировать рекомендации.'
"@

Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green

