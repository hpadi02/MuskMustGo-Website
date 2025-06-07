#!/bin/bash

# Debug script for PM2 issues
echo "🔍 Debugging PM2 startup issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking if port 3000 is in use...${NC}"
if lsof -i :3000; then
    echo -e "${RED}Port 3000 is in use. Killing processes...${NC}"
    sudo kill -9 $(lsof -t -i:3000) 2>/dev/null || true
else
    echo -e "${GREEN}Port 3000 is free${NC}"
fi

echo -e "${YELLOW}2. Stopping all PM2 processes...${NC}"
pm2 stop all
pm2 delete all

echo -e "${YELLOW}3. Checking PM2 status...${NC}"
pm2 status

echo -e "${YELLOW}4. Creating logs directory...${NC}"
mkdir -p logs

echo -e "${YELLOW}5. Checking if server.js exists...${NC}"
if [ -f "server.js" ]; then
    echo -e "${GREEN}server.js found${NC}"
else
    echo -e "${RED}server.js not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}6. Testing server.js directly...${NC}"
timeout 10s node server.js &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}Server starts successfully${NC}"
    kill $SERVER_PID
else
    echo -e "${RED}Server fails to start${NC}"
    exit 1
fi

echo -e "${YELLOW}7. Starting with PM2 in fork mode...${NC}"
pm2 start ecosystem.config.js --env production

echo -e "${YELLOW}8. Checking PM2 logs...${NC}"
pm2 logs --lines 20
