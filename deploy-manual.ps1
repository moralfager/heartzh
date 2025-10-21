# Ручной деплой на production сервер (PowerShell версия)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Manual Production Deploy" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Проверка что мы на ветке prod
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne "prod") {
    Write-Host "❌ Error: Must be on 'prod' branch (current: $branch)" -ForegroundColor Red
    exit 1
}

# Проверка что нет незакоммиченных изменений
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Error: You have uncommitted changes" -ForegroundColor Red
    git status --short
    exit 1
}

# Push в prod
Write-Host "📤 Pushing to prod branch..." -ForegroundColor Yellow
git push origin prod

# SSH параметры (измените под свой сервер)
$SSH_USER = if ($env:SSH_USER) { $env:SSH_USER } else { "root" }
$SSH_HOST = if ($env:SSH_HOST) { $env:SSH_HOST } else { "85.202.192.68" }
$SSH_PORT = if ($env:SSH_PORT) { $env:SSH_PORT } else { "22" }

Write-Host ""
Write-Host "🔐 Connecting to $SSH_USER@$SSH_HOST:$SSH_PORT..." -ForegroundColor Yellow
Write-Host ""

# Деплой команды
$deployScript = @'
set -e
cd /var/www/heartzh

echo "📥 Pulling latest code..."
git fetch --all
git reset --hard origin/prod

echo "🛑 Stopping containers..."
docker compose -f docker-compose.prod.yml down || true

echo "🏗️ Building..."
docker compose -f docker-compose.prod.yml build

echo "🚀 Starting containers..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ Deployment complete!"
echo ""
docker ps
'@

# Выполнение через SSH
ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" $deployScript

Write-Host ""
Write-Host "🎉 Deploy successful!" -ForegroundColor Green
Write-Host "🌐 Check: https://heartofzha.ru" -ForegroundColor Cyan

