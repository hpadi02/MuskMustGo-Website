#!/bin/bash

# Deployment script for Musk Must Go app on nginx server
set -e

echo "🚀 Starting deployment to nginx server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE FOR YOUR SERVER
APP_NAME="musk-must-go-app"
APP_DIR="/var/www/musk-must-go"
BACKUP_DIR="/var/backups/musk-must-go"
LOG_FILE="/var/log/musk-must-go-deploy.log"
GIT_REPO="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"  # UPDATE THIS
BRANCH="main"  # or whatever branch you merged to

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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a $LOG_FILE
}

# Check if running with proper permissions
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check required tools
log "Checking required tools..."
command -v git >/dev/null 2>&1 || error "git is not installed"
command -v node >/dev/null 2>&1 || error "Node.js is not installed"
command -v npm >/dev/null 2>&1 || error "npm is not installed"
command -v pm2 >/dev/null 2>&1 || error "PM2 is not installed. Install with: npm install -g pm2"

# Create backup of current deployment
log "Creating backup of current deployment..."
if [ -d "$APP_DIR" ]; then
    sudo mkdir -p $BACKUP_DIR
    sudo cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
    log "Backup created successfully"
fi

# Stop PM2 processes
log "Stopping PM2 processes..."
pm2 stop $APP_NAME || warn "PM2 process $APP_NAME was not running"
pm2 delete $APP_NAME || warn "PM2 process $APP_NAME was not found"

# Create app directory if it doesn't exist
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Navigate to app directory
cd $APP_DIR

# Clone or pull latest code
if [ -d ".git" ]; then
    log "Pulling latest code from GitHub..."
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
else
    log "Cloning repository from GitHub..."
    git clone $GIT_REPO .
    git checkout $BRANCH
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    warn ".env.local file not found. Creating template..."
    cat > .env.local << 'EOF'
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Backend API Configuration
API_BASE_URL=https://your-backend-api.com

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
HOSTNAME=127.0.0.1
PORT=3000

# Environment
NODE_ENV=production
EOF
    error "Please update .env.local with your actual values and run the script again"
fi

# Install dependencies
log "Installing dependencies..."
npm ci --only=production

# Build the application
log "Building application..."
npm run build

# Create logs directory
mkdir -p logs

# Start application with PM2
log "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
log "Saving PM2 configuration..."
pm2 save

# Setup PM2 startup script (run once)
log "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Test if application is running
log "Testing application..."
sleep 5
if pm2 list | grep -q $APP_NAME; then
    log "✅ Application is running successfully!"
else
    error "❌ Application failed to start"
fi

# Display status
log "Deployment Summary:"
info "Application: $APP_NAME"
info "Directory: $APP_DIR"
info "Port: 3000"
info "Status: $(pm2 jlist | jq -r '.[] | select(.name=="'$APP_NAME'") | .pm2_env.status')"

log "🎉 Deployment completed successfully!"
log "Check status with: pm2 status"
log "View logs with: pm2 logs $APP_NAME"
log "Restart with: pm2 restart $APP_NAME"
