#!/bin/bash

# Deployment script to pull updates and rebuild
set -e

echo "🚀 Starting deployment of latest updates..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Make sure you're in the project root directory."
fi

log "Stopping PM2 processes..."
pm2 stop musk-must-go-app || warn "PM2 process was not running"

log "Creating backup of current deployment..."
if [ -d "../backup" ]; then
    rm -rf "../backup"
fi
cp -r . ../backup
log "Backup created at ../backup"

log "Pulling latest changes from main branch..."
git fetch origin
git reset --hard origin/main

log "Installing/updating dependencies..."
npm install

log "Building application..."
npm run build

log "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

log "Saving PM2 configuration..."
pm2 save

log "✅ Deployment completed successfully!"
log "Application is running. Check status with: pm2 status"
log "View logs with: pm2 logs musk-must-go-app"

echo ""
echo "🎉 Your emoji attributes system is now live!"
echo "Test it at: /test-emoji-checkout"
