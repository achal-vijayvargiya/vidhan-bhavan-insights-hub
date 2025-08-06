#!/bin/bash

# Vidhan Bhavan Frontend Deployment Script
set -e

echo "🚀 Starting Vidhan Bhavan Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        print_warning ".env file not found. Creating from env.example..."
        cp env.example .env
        print_warning "Please edit .env file with your backend API URL before proceeding"
        echo "Current .env content:"
        cat .env
        read -p "Do you want to continue with current configuration? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled. Please update .env file and run again."
            exit 1
        fi
    else
        print_error ".env file not found and env.example is missing"
        exit 1
    fi
fi

print_status ".env file is configured"

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Remove old images (optional)
read -p "Do you want to remove old Docker images to free up space? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Removing old images..."
    docker image prune -f || true
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    print_error "Docker build failed"
    exit 1
fi

print_status "Docker image built successfully"

# Start the application
echo "🚀 Starting the application..."
docker-compose up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start the application"
    exit 1
fi

print_status "Application started successfully"

# Wait for application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Get the frontend port from .env file or use default
FRONTEND_PORT=$(grep "^FRONTEND_PORT=" .env 2>/dev/null | cut -d'=' -f2 || echo "3030")

# Check if the application is healthy
echo "🔍 Checking application health on port $FRONTEND_PORT..."
for i in {1..30}; do
    if curl -f http://localhost:$FRONTEND_PORT/health > /dev/null 2>&1; then
        print_status "Application is healthy and ready!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        print_error "Application health check failed"
        echo "Checking logs..."
        docker-compose logs --tail=20 vidhan-bhavan-frontend
        exit 1
    fi
    
    echo "Waiting... ($i/30)"
    sleep 2
done

# Server IP configuration
SERVER_IP="103.112.121.174"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📍 Access your application at:"
echo "   Local: http://localhost:$FRONTEND_PORT"
echo "   Public: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Direct URL: http://103.112.121.174:$FRONTEND_PORT"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f vidhan-bhavan-frontend"
echo "   Stop app: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Status: docker-compose ps"
echo ""
echo "📊 Container status:"
docker-compose ps

# Show resource usage
echo ""
echo "💾 Resource usage:"
docker stats --no-stream vidhan-bhavan-frontend