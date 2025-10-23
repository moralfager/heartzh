#!/bin/bash
# Production Deployment Script
# Automated deployment to VPS server

set -e

# Configuration
SERVER_USER=${SERVER_USER:-"root"}
SERVER_HOST=${SERVER_HOST:-"85.202.192.68"}
SERVER_PATH=${SERVER_PATH:-"/root/psychotest"}
LOCAL_PATH="."

echo "🚀 Starting production deployment..."
echo "📍 Target: $SERVER_USER@$SERVER_HOST:$SERVER_PATH"
echo ""

# Step 1: Build locally (optional)
read -p "📦 Build application locally before deploy? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Building application..."
    npm run build
    echo "✅ Build complete"
fi

# Step 2: Sync files to server
echo "📤 Syncing files to server..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude 'database/data-only.sql' \
    --exclude 'database/schema-only.sql' \
    --exclude 'database/production-seed.sql' \
    $LOCAL_PATH/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

echo "✅ Files synced"

# Step 3: Deploy on server
echo "🔧 Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
set -e

cd /root/psychotest

echo "📋 Server deployment steps..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  Creating .env.production from template..."
    cp env.production.template .env.production
    echo "⚠️  IMPORTANT: Edit .env.production with secure passwords!"
    echo "Run: nano .env.production"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Build and start containers
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Test health endpoint
echo "🔍 Testing application..."
curl -f http://localhost:3000/api/health || echo "⚠️  Health check failed"

echo "✅ Deployment complete!"
echo ""
echo "📊 View logs:"
echo "docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🌐 Application should be available at: https://heartofzha.ru"

ENDSSH

echo ""
echo "✅ Deployment finished!"
echo ""
echo "📋 Post-deployment checklist:"
echo "  1. Visit: https://heartofzha.ru"
echo "  2. Test health: https://heartofzha.ru/api/health"
echo "  3. Check tests: https://heartofzha.ru/tests"
echo "  4. Verify admin: https://heartofzha.ru/admin"
echo "  5. Check logs: ssh $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker-compose -f docker-compose.prod.yml logs -f'"

