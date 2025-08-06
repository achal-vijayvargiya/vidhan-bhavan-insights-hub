#!/bin/bash

# Quick Setup Script for Vidhan Bhavan Frontend
# Server: 103.112.121.174
# This script automates the setup with your specific server configuration

set -e

echo "🚀 Vidhan Bhavan Frontend - Quick Setup for 103.112.121.174"
echo "============================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Create .env file with server-specific configuration
echo "📝 Creating .env file with server configuration..."
cat > .env << EOF
# Vidhan Bhavan Frontend Configuration
# Server: 103.112.121.174

# Backend API Configuration
VITE_API_URL=http://103.112.121.174:8000/api

# Frontend Port Configuration
FRONTEND_PORT=8080

# Optional HTTPS port (uncomment if you enable HTTPS)
# FRONTEND_HTTPS_PORT=8443
EOF

print_status ".env file created with server IP 103.112.121.174"

# Step 2: Check if port 8080 is available
echo ""
echo "🔍 Checking port availability..."
if netstat -tuln 2>/dev/null | grep -q ":8080 "; then
    print_warning "Port 8080 is currently in use!"
    echo "Checking alternative ports..."
    
    # Try alternative ports
    for port in 3000 9000 8081 5000; do
        if ! netstat -tuln 2>/dev/null | grep -q ":$port "; then
            print_status "Using alternative port $port"
            sed -i "s/FRONTEND_PORT=8080/FRONTEND_PORT=$port/" .env
            break
        fi
    done
else
    print_status "Port 8080 is available"
fi

# Step 3: Display current configuration
echo ""
echo "📋 Current Configuration:"
echo "========================="
cat .env
echo ""

# Step 4: Check Docker installation and permissions
echo "🐳 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Please install Docker first:"
    echo "curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "sudo sh get-docker.sh"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Please install Docker Compose first"
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Check Docker permissions
echo "🔐 Checking Docker permissions..."
if ! docker ps &>/dev/null; then
    print_warning "Docker permission issue detected!"
    echo ""
    echo "📋 Quick fixes:"
    echo "1. Run with sudo: sudo ./quick-setup.sh"
    echo "2. Fix permissions: chmod +x fix-docker-permissions.sh && ./fix-docker-permissions.sh"
    echo "3. Add user to docker group: sudo usermod -aG docker \$USER && newgrp docker"
    echo ""
    read -p "Do you want to continue with sudo? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Continuing with sudo..."
        USE_SUDO="sudo"
    else
        print_error "Please fix Docker permissions first and try again"
        exit 1
    fi
else
    print_status "Docker permissions are working correctly"
    USE_SUDO=""
fi

# Step 5: Deploy
echo ""
echo "🚀 Starting deployment..."
echo "Press Enter to continue or Ctrl+C to cancel"
read

# Make scripts executable
chmod +x deploy.sh check-ports.sh

# Run deployment
if [ ! -z "$USE_SUDO" ]; then
    print_warning "Running deployment with sudo..."
    sudo ./deploy.sh
else
    ./deploy.sh
fi

# Final information
FRONTEND_PORT=$(grep "^FRONTEND_PORT=" .env | cut -d'=' -f2)

echo ""
echo "🎉 Quick setup completed!"
echo ""
echo "📱 Your React app is now accessible at:"
echo "   🌐 Public URL: http://103.112.121.174:$FRONTEND_PORT"
echo "   🏠 Local URL: http://localhost:$FRONTEND_PORT"
echo ""
echo "🔗 Backend API URL: http://103.112.121.174:8000/api"
echo ""
echo "📊 Useful commands:"
echo "   Check status: docker-compose ps"
echo "   View logs: docker-compose logs -f"
echo "   Stop app: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "🔥 Don't forget to:"
echo "   1. Ensure your FastAPI backend is running on port 8000"
echo "   2. Open port $FRONTEND_PORT in your firewall: sudo ufw allow $FRONTEND_PORT"
echo "   3. Test the connection: curl http://103.112.121.174:$FRONTEND_PORT/health"