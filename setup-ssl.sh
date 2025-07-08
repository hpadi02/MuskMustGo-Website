#!/bin/bash

# SSL setup script using Let's Encrypt
set -e

echo "🔒 Setting up SSL certificate..."

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

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

# Install certbot
log "Installing certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
log "Getting SSL certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN

# Test auto-renewal
log "Testing auto-renewal..."
sudo certbot renew --dry-run

log "✅ SSL certificate installed successfully!"
log "Your site should now be available at https://$DOMAIN"
