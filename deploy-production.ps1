# Production Deployment Script (PowerShell for Windows)
# Automated deployment to VPS server

param(
    [string]$ServerUser = "root",
    [string]$ServerHost = "85.202.192.68",
    [string]$ServerPath = "/root/psychotest"
)

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green
Write-Host "📍 Target: $ServerUser@$ServerHost`:$ServerPath" -ForegroundColor Cyan
Write-Host ""

# Check if SSH is available
try {
    $null = Get-Command ssh -ErrorAction Stop
} catch {
    Write-Host "❌ SSH not found. Install OpenSSH or use WSL/Git Bash" -ForegroundColor Red
    exit 1
}

# Step 1: Build locally (optional)
$build = Read-Host "📦 Build application locally before deploy? (y/N)"
if ($build -eq "y" -or $build -eq "Y") {
    Write-Host "🔨 Building application..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build complete" -ForegroundColor Green
}

# Step 2: Sync files to server
Write-Host "📤 Syncing files to server..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

# Create exclusion list
$excludeFile = New-TemporaryFile
@"
node_modules/
.next/
.git/
.env
.env.local
.env*.local
database/data-only.sql
database/schema-only.sql
database/production-seed.sql
"@ | Out-File $excludeFile.FullName -Encoding ASCII

# Use SCP for Windows (simpler than rsync on Windows)
Write-Host "Using SCP to transfer files..." -ForegroundColor Gray
Write-Host "Note: This may ask for your SSH password multiple times" -ForegroundColor Yellow

# Create temp directory for filtered files
$tempDir = Join-Path $env:TEMP "psychotest-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "Preparing files..." -ForegroundColor Gray
robocopy . $tempDir /E /XD node_modules .next .git /XF .env .env.local | Out-Null

Write-Host "Transferring to server (this may take a while)..." -ForegroundColor Yellow
scp -r "$tempDir\*" "${ServerUser}@${ServerHost}:${ServerPath}/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files synced" -ForegroundColor Green
} else {
    Write-Host "❌ File sync failed" -ForegroundColor Red
    Remove-Item $tempDir -Recurse -Force
    exit 1
}

# Cleanup temp directory
Remove-Item $tempDir -Recurse -Force
Remove-Item $excludeFile.FullName -Force

# Step 3: Deploy on server
Write-Host "🔧 Deploying on server..." -ForegroundColor Yellow

$deployScript = @'
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
'@

$deployScript | ssh "${ServerUser}@${ServerHost}" "bash -s"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment finished!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Post-deployment checklist:" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://heartofzha.ru" -ForegroundColor White
    Write-Host "  2. Test health: https://heartofzha.ru/api/health" -ForegroundColor White
    Write-Host "  3. Check tests: https://heartofzha.ru/tests" -ForegroundColor White
    Write-Host "  4. Verify admin: https://heartofzha.ru/admin" -ForegroundColor White
    Write-Host "  5. Check logs: ssh $ServerUser@$ServerHost 'cd $ServerPath && docker-compose -f docker-compose.prod.yml logs -f'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check the output above for errors." -ForegroundColor Red
    exit 1
}

