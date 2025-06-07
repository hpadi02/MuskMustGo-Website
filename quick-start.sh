#!/bin/bash

# Quick start script for Ed
echo "🚀 Quick start script for MuskMustGo app..."

# Stop any existing processes
echo "Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Kill any processes on port 3000
echo "Freeing up port 3000..."
sudo kill -9 $(lsof -t -i:3000) 2>/dev/null || true

# Create logs directory
mkdir -p logs

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Build the app
echo "Building the app..."
pnpm build

# Start with PM2
echo "Starting with PM2..."
pm2 start ecosystem.config.js --env production

# Show status
echo "PM2 Status:"
pm2 status

echo "✅ Startup complete! Check logs with: pm2 logs"
