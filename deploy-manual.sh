#!/bin/bash
# Ручной деплой на production сервер

set -e

echo "🚀 Manual Production Deploy"
echo "=============================="

# Проверка что мы на ветке prod
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "prod" ]; then
    echo "❌ Error: Must be on 'prod' branch (current: $BRANCH)"
    exit 1
fi

# Проверка что нет незакоммиченных изменений
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: You have uncommitted changes"
    git status --short
    exit 1
fi

# Push в prod
echo "📤 Pushing to prod branch..."
git push origin prod

# SSH параметры (измените под свой сервер)
SSH_USER="${SSH_USER:-root}"
SSH_HOST="${SSH_HOST:-85.202.192.68}"
SSH_PORT="${SSH_PORT:-22}"

echo ""
echo "🔐 Connecting to $SSH_USER@$SSH_HOST:$SSH_PORT..."
echo ""

# Деплой на сервер
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << 'ENDSSH'
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
ENDSSH

echo ""
echo "🎉 Deploy successful!"
echo "🌐 Check: https://heartofzha.ru"

