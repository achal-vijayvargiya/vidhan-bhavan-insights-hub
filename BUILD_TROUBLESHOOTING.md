# Docker Build Troubleshooting Guide

This guide helps you resolve common Docker build issues for the React application.

## 🔍 Common Build Errors

### Error: "vite: not found"
```
sh: vite: not found
The command '/bin/sh -c npm run build' returned a non-zero code: 127
```

**Cause**: Dev dependencies (including Vite) are not installed during build.

**Solution**: ✅ **FIXED** - Updated Dockerfile to install all dependencies including dev dependencies.

### Error: "Cannot find module"
```
Error: Cannot find module 'some-package'
```

**Cause**: Missing dependencies or peer dependency conflicts.

**Solutions**:
1. **Clear Docker cache**:
   ```bash
   docker system prune -a
   docker-compose build --no-cache
   ```

2. **Use legacy peer deps** (already in Dockerfile):
   ```bash
   npm ci --legacy-peer-deps
   ```

3. **Update package-lock.json**:
   ```bash
   rm package-lock.json
   npm install
   ```

### Error: "Permission denied"
```
Error: EACCES: permission denied
```

**Cause**: File permission issues in Docker.

**Solutions**:
1. **Fix file permissions**:
   ```bash
   sudo chown -R $USER:$USER .
   ```

2. **Use non-root user in Docker** (already configured).

### Error: "Out of memory"
```
JavaScript heap out of memory
```

**Cause**: Insufficient memory for build process.

**Solutions**:
1. **Increase Docker memory**:
   ```bash
   docker-compose build --memory=2g
   ```

2. **Use Node.js memory flag**:
   ```bash
   NODE_OPTIONS="--max-old-space-size=2048" npm run build
   ```

## 🛠️ Build Process

### Step 1: Clean Environment
```bash
# Remove old containers and images
docker-compose down
docker system prune -a

# Clear npm cache
npm cache clean --force
```

### Step 2: Check Dependencies
```bash
# Verify package.json
cat package.json

# Check for missing dependencies
npm ls --depth=0
```

### Step 3: Build with Debug
```bash
# Build with verbose output
docker-compose build --no-cache --progress=plain

# Or build individual stage
docker build --target build --progress=plain .
```

## 🔧 Manual Build Steps

If Docker build fails, try building manually:

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Build application
npm run build

# Check if build output exists
ls -la dist/
```

## 📋 Build Verification

### Check Build Output
```bash
# Verify build files
ls -la dist/

# Check for index.html
cat dist/index.html

# Test build locally
npm run preview
```

### Verify Docker Image
```bash
# Build image
docker build -t vidhan-bhavan-frontend .

# Run container for testing
docker run -p 8080:80 vidhan-bhavan-frontend

# Check container logs
docker logs <container-id>
```

## 🚀 Quick Fixes

### Fix 1: Complete Rebuild
```bash
# Stop everything
docker-compose down

# Remove all images
docker rmi $(docker images -q)

# Rebuild from scratch
docker-compose build --no-cache
```

### Fix 2: Update Dependencies
```bash
# Update npm packages
npm update

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild Docker
docker-compose build --no-cache
```

### Fix 3: Use Different Node Version
```bash
# Edit Dockerfile to use different Node version
# FROM node:16-alpine as build
# or
# FROM node:20-alpine as build
```

## 🔍 Debug Commands

### Check Docker Build Context
```bash
# See what files are being copied
docker build --progress=plain . 2>&1 | grep "COPY\|ADD"
```

### Inspect Build Stage
```bash
# Build only the build stage
docker build --target build -t temp-build .

# Run build stage interactively
docker run -it temp-build sh
```

### Check File Permissions
```bash
# Check current permissions
ls -la

# Fix permissions if needed
sudo chown -R $USER:$USER .
chmod -R 755 .
```

## 📊 Build Performance

### Optimize Build Speed
```bash
# Use Docker BuildKit
export DOCKER_BUILDKIT=1

# Use multi-stage build (already configured)
# Use .dockerignore (already configured)
```

### Reduce Image Size
```bash
# Use Alpine base image (already configured)
# Clean up dev dependencies (already configured)
# Use multi-stage build (already configured)
```

## ❓ Still Having Issues?

If build issues persist:

1. **Check system resources**:
   ```bash
   free -h
   df -h
   ```

2. **Update Docker**:
   ```bash
   sudo apt update
   sudo apt upgrade docker.io
   ```

3. **Check Docker daemon**:
   ```bash
   sudo systemctl status docker
   sudo journalctl -u docker.service
   ```

4. **Use alternative build method**:
   ```bash
   # Build locally and copy to Docker
   npm run build
   docker build --target production .
   ```

## 🎯 Current Dockerfile Features

✅ **Multi-stage build** - Reduces final image size
✅ **All dependencies installed** - Includes dev dependencies for build
✅ **Legacy peer deps** - Handles dependency conflicts
✅ **Production cleanup** - Removes dev dependencies after build
✅ **Non-root user** - Security best practice
✅ **Optimized nginx** - Production-ready web server 