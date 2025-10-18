#!/bin/bash

# Deploy script for Psychology Love Test
echo "🚀 Starting deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Create production start script
echo "📝 Creating production start script..."
cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=3000
npm start
EOF

chmod +x start-production.sh

# Create PM2 ecosystem file
echo "📝 Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'psychology-love-test',
    script: 'npm',
    args: 'start',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

echo "✅ Deployment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files to your server"
echo "2. Run: chmod +x deploy.sh start-production.sh"
echo "3. Run: ./deploy.sh"
echo "4. Start with PM2: pm2 start ecosystem.config.js"
echo "5. Save PM2 config: pm2 save"
echo "6. Setup PM2 startup: pm2 startup"
echo ""
echo "🌐 Your app will be available at: http://your-server:3000"
