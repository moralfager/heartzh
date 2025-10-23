#!/bin/bash
# Server Cleanup Script
# This script stops and removes all Docker containers and cleans up the application

set -e

echo "🧹 Starting server cleanup..."

# Stop all running containers
echo "📦 Stopping Docker containers..."
docker-compose -f docker-compose.prod.yml down || true

# Remove all containers (including stopped ones)
echo "🗑️  Removing all containers..."
docker container prune -f

# Optional: Remove unused images to free space
echo "🖼️  Removing unused Docker images..."
docker image prune -af

# Optional: Remove unused volumes (BE CAREFUL - this removes data!)
read -p "⚠️  Remove Docker volumes (including database)? This will DELETE ALL DATA! (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💣 Removing Docker volumes..."
    docker volume prune -f
    echo "✅ Volumes removed"
else
    echo "⏭️  Skipping volume removal"
fi

# Clean up application build artifacts (but keep source code)
echo "🧹 Cleaning application build artifacts..."
rm -rf .next/
rm -rf node_modules/.cache/

echo "✅ Server cleanup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm install"
echo "2. Copy env.production.template to .env.production and configure"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"

