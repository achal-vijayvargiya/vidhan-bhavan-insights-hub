# Vidhan Bhavan Frontend Deployment Guide

This guide explains how to deploy the React frontend application to a Linux server using Docker.

## Prerequisites

- Linux server with Docker and Docker Compose installed
- Access to your FastAPI backend server
- Port 80 (and optionally 443 for HTTPS) available on the server

## Quick Deployment

1. **Clone the repository** to your Linux server:
   ```bash
   git clone <your-repo-url>
   cd vidhan-bhavan-insights-hub
   ```

2. **Configure environment variables**:
   ```bash
   cp env.example .env
   # Edit .env file with your backend API URL
   nano .env
   ```

3. **Build and run the application**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access your application**:
   - Open your browser and navigate to `http://103.112.121.174:8080`
   - The application will be accessible on port 8080 by default (configurable)

## Manual Deployment Steps

### Step 1: Environment Configuration

Create a `.env` file from the example:
```bash
cp env.example .env
```

Edit the `.env` file and set your backend API URL and frontend port:
```bash
VITE_API_URL=http://103.112.121.174:8000/api
FRONTEND_PORT=8080
```

### Step 2: Build and Deploy

Build the Docker image and start the container:
```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d
```

### Step 3: Verify Deployment

Check if the container is running:
```bash
docker-compose ps
```

Check application health:
```bash
curl http://localhost:8080/health
```

View logs:
```bash
docker-compose logs -f vidhan-bhavan-frontend
```

## Configuration Options

### Backend API URL Examples

For different deployment scenarios, update the `VITE_API_URL` in your `.env` file:

- **Backend on same server (recommended)**: `http://103.112.121.174:8000/api`
- **Local development**: `http://localhost:8000/api`
- **HTTPS (if SSL configured)**: `https://103.112.121.174:8000/api`
- **Backend in Docker on same host**: `http://host.docker.internal:8000/api`

### Port Configuration

By default, the application runs on port 8080 to avoid conflicts. You can change this by setting `FRONTEND_PORT` in your `.env` file:

```bash
# Safe options (no root privileges required)
FRONTEND_PORT=8080  # Default
FRONTEND_PORT=3000  # React development port
FRONTEND_PORT=9000  # Alternative high port

# Standard ports (may require root/sudo)
FRONTEND_PORT=80    # Standard HTTP
FRONTEND_PORT=443   # Standard HTTPS
```

**Port Considerations:**
- **Port 80/443**: Require root privileges, may conflict with existing web servers
- **Ports 1024+**: Safe to use without root privileges
- **Common conflicts**: Apache (80), nginx (80), Node.js dev servers (3000), PostgreSQL (5432)

**Check for Port Conflicts:**
```bash
# Check if a port is in use
sudo netstat -tlnp | grep :8080
# or
sudo lsof -i :8080

# Find available ports
netstat -tuln | grep LISTEN
```

### HTTPS Configuration (Optional)

To enable HTTPS, you'll need to:
1. Obtain SSL certificates
2. Update nginx configuration
3. Mount certificate volumes in docker-compose.yml

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs vidhan-bhavan-frontend

# Rebuild image
docker-compose build --no-cache
```

### Application Not Accessible
```bash
# Check if port is open (replace 8080 with your port)
sudo netstat -tlnp | grep :8080

# Check firewall settings
sudo ufw status
sudo ufw allow 8080

# Check if another service is using the port
sudo lsof -i :8080
```

### Backend Connection Issues
1. Verify backend API URL in `.env` file
2. Check if backend server is accessible from the frontend container
3. Test API connectivity: `curl http://103.112.121.174:8000/api/health`

### Check Container Health
```bash
# View container status
docker inspect vidhan-bhavan-frontend --format='{{.State.Health.Status}}'

# Test health endpoint (replace 8080 with your port)
curl http://localhost:8080/health
```

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### View Logs
```bash
# Real-time logs
docker-compose logs -f vidhan-bhavan-frontend

# Recent logs
docker-compose logs --tail=100 vidhan-bhavan-frontend
```

### Backup and Restore
The application is stateless, but you may want to backup:
- Configuration files (`.env`, `docker-compose.yml`)
- Custom nginx configurations

## Security Considerations

- The application runs as a non-root user inside the container
- Security headers are configured in nginx
- Consider using HTTPS in production
- Regularly update Docker images
- Use a reverse proxy (like Traefik or nginx) for additional security

## Performance Optimization

- Static assets are cached for 1 year
- Gzip compression is enabled
- Consider using a CDN for static assets in production