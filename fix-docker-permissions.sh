#!/bin/bash

# Docker Permissions Fix Script
# This script fixes the Docker permission denied error

echo "🔧 Fixing Docker Permissions..."
echo "================================"

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

# Check if Docker is running
if ! sudo systemctl is-active --quiet docker; then
    print_warning "Docker service is not running. Starting Docker..."
    sudo systemctl start docker
    sudo systemctl enable docker
    print_status "Docker service started"
fi

# Check current user
CURRENT_USER=$(whoami)
print_warning "Current user: $CURRENT_USER"

# Check if user is in docker group
if groups $CURRENT_USER | grep -q '\bdocker\b'; then
    print_status "User $CURRENT_USER is already in docker group"
else
    print_warning "User $CURRENT_USER is NOT in docker group. Adding..."
    
    # Add user to docker group
    sudo usermod -aG docker $CURRENT_USER
    print_status "User $CURRENT_USER added to docker group"
    
    print_warning "⚠️  IMPORTANT: You need to log out and log back in for group changes to take effect!"
    print_warning "    Alternative: Run 'newgrp docker' to activate the group in current session"
    echo ""
    
    read -p "Do you want to activate docker group in current session? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Activating docker group in current session..."
        exec newgrp docker
    fi
fi

# Test Docker access
echo ""
echo "🧪 Testing Docker access..."
if docker ps &>/dev/null; then
    print_status "Docker access working correctly!"
else
    print_error "Docker access still not working."
    echo ""
    echo "📋 Manual solutions:"
    echo "1. Logout and login again:"
    echo "   exit"
    echo "   # Login again via SSH"
    echo ""
    echo "2. Or activate docker group:"
    echo "   newgrp docker"
    echo ""
    echo "3. Or use sudo (temporary fix):"
    echo "   sudo docker ps"
    echo "   sudo ./quick-setup.sh"
    echo ""
    echo "4. Or restart your session:"
    echo "   sudo systemctl restart docker"
    echo "   su - $CURRENT_USER"
fi

echo ""
print_status "Permission fix script completed!"
echo ""
echo "🚀 Next steps:"
echo "1. If Docker access is working, run: ./quick-setup.sh"
echo "2. If still having issues, run: sudo ./quick-setup.sh"
echo "3. Or logout/login and try again"