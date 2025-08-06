#!/bin/bash

# Port Availability Checker
# This script helps you find available ports for your React app deployment

echo "🔍 Checking port availability for Vidhan Bhavan Frontend..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${RED}❌ Port $port is in use${NC}"
        # Try to identify what's using the port
        local process=$(sudo lsof -i :$port 2>/dev/null | tail -n +2 | head -1)
        if [ ! -z "$process" ]; then
            echo "   Used by: $process"
        fi
        return 1
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
        return 0
    fi
}

# Common ports to check
echo "Checking common web ports:"
echo ""

# Standard ports
echo "Standard HTTP/HTTPS ports:"
check_port 80
check_port 443
echo ""

# Safe alternative ports
echo "Safe alternative ports (no root required):"
check_port 8080
check_port 3000
check_port 9000
check_port 8081
check_port 8443
check_port 5000
echo ""

# Read current .env configuration if exists
if [ -f ".env" ]; then
    CONFIGURED_PORT=$(grep "^FRONTEND_PORT=" .env 2>/dev/null | cut -d'=' -f2)
    if [ ! -z "$CONFIGURED_PORT" ]; then
        echo "Your configured port from .env:"
        check_port $CONFIGURED_PORT
        echo ""
    fi
fi

# Show currently listening services
echo "Currently running web services:"
echo ""
netstat -tuln 2>/dev/null | grep LISTEN | grep -E ':(80|443|3000|8080|8081|8443|9000|5000) ' | while read line; do
    port=$(echo $line | awk '{print $4}' | rev | cut -d':' -f1 | rev)
    echo -e "${YELLOW}⚠️  Port $port is in use${NC}"
done

echo ""
echo "💡 Recommendations:"
echo ""

# Check if port 8080 is available (our default)
if check_port 8080 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Use port 8080 (default) - FRONTEND_PORT=8080${NC}"
else
    echo -e "${YELLOW}⚠️  Port 8080 is busy, try these alternatives:${NC}"
    
    # Find first available port from our list
    for port in 3000 9000 8081 5000 8443; do
        if check_port $port >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Use port $port - FRONTEND_PORT=$port${NC}"
            break
        fi
    done
fi

echo ""
echo "📝 To configure your port:"
echo "1. Edit .env file: nano .env"
echo "2. Set: FRONTEND_PORT=your-chosen-port"
echo "3. Run: ./deploy.sh"
echo ""
echo "🔥 Firewall reminder:"
echo "Don't forget to open the port in your firewall:"
echo "sudo ufw allow your-chosen-port"