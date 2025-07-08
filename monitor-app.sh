#!/bin/bash

# App monitoring script
APP_NAME="musk-must-go-app"

echo "📊 Musk Must Go App Status"
echo "=========================="

# PM2 status
echo "🔄 PM2 Status:"
pm2 status $APP_NAME

echo ""
echo "📈 Memory Usage:"
pm2 monit --no-daemon | head -10

echo ""
echo "📝 Recent Logs:"
pm2 logs $APP_NAME --lines 20 --nostream

echo ""
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "💾 Disk Usage:"
df -h /var/www/musk-must-go

echo ""
echo "🔍 Process Info:"
ps aux | grep -E "(node|nginx)" | grep -v grep
