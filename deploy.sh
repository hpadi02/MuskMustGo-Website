#!/bin/bash

# Deployment script for Musk Must Go app
set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="musk-must-go-app"
APP_DIR="/var/www/musk-must-go"
BACKUP_DIR="/var/backups/musk-must-go"
LOG_FILE="/var/log/musk-must-go-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    error "PM2 is not installed. Please install it first: npm install -g pm2"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    error "pnpm is not installed. Please install it first: npm install -g pnpm"
fi

log "Creating backup of current deployment..."
if [ -d "$APP_DIR" ]; then
    sudo mkdir -p $BACKUP_DIR
    sudo cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
fi

log "Stopping PM2 processes..."
pm2 stop $APP_NAME || warn "PM2 process $APP_NAME was not running"

log "Installing dependencies..."
pnpm install --frozen-lockfile

log "Building application..."
pnpm build

log "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

log "Saving PM2 configuration..."
pm2 save

log "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

log "Deployment completed successfully! 🎉"
log "Application is running on port 3000"
log "Check status with: pm2 status"
log "View logs with: pm2 logs $APP_NAME"
