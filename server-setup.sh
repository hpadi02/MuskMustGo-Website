#!/bin/bash

# First-time server setup script
set -e

echo "🔧 Setting up nginx server for Musk Must Go app..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
log "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
log "Installing PM2..."
sudo npm install -g pm2

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    log "Installing nginx..."
    sudo apt install -y nginx
fi

# Create nginx configuration
log "Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/musk-must-go << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # UPDATE THIS

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Handle static files
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Handle images and other assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
EOF

# Enable the site
log "Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/musk-must-go /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
log "Testing nginx configuration..."
sudo nginx -t

# Restart nginx
log "Restarting nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create app directory
log "Creating application directory..."
sudo mkdir -p /var/www/musk-must-go
sudo chown -R $USER:$USER /var/www/musk-must-go

# Create log directories
sudo mkdir -p /var/log
sudo mkdir -p /var/backups/musk-must-go

log "✅ Server setup completed!"
warn "Don't forget to:"
warn "1. Update your domain in /etc/nginx/sites-available/musk-must-go"
warn "2. Set up SSL certificate (Let's Encrypt recommended)"
warn "3. Update the GIT_REPO variable in deploy-to-nginx.sh"
warn "4. Run deploy-to-nginx.sh to deploy your app"
