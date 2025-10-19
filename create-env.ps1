# Создание .env файла для локальной разработки

$envContent = @"
DATABASE_URL="mysql://root:1234@localhost:3306/psychotest_dev"
RESULT_TTL_HOURS=24
SESSION_COOKIE_NAME=hoz_sid
SESSION_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SECURE=false
ADMIN_USERNAME=admin
ADMIN_PASSWORD=psychotest2024
CLEANUP_CRON_SCHEDULE="0 * * * *"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Contents:" -ForegroundColor Cyan
Get-Content ".env"

