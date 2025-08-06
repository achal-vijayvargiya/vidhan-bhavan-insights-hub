# Docker Permissions Fix Guide

This guide helps you resolve Docker permission errors like "Permission denied" when running Docker commands.

## 🔍 The Problem

When you see this error:
```
docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', PermissionError(13, 'Permission denied'))
```

It means your user account doesn't have permission to access the Docker daemon.

## 🚀 Quick Solutions (Choose One)

### Solution 1: Use Sudo (Immediate Fix)
```bash
sudo ./quick-setup.sh
# or
sudo ./deploy.sh
```

### Solution 2: Fix Permissions Properly
```bash
chmod +x fix-docker-permissions.sh
./fix-docker-permissions.sh
```

### Solution 3: Manual Permission Fix
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Activate the group (choose one)
newgrp docker          # Option A: Activate in current session
# OR
logout && login        # Option B: Logout and login again

# Test Docker access
docker ps
```

## 🔧 Detailed Steps

### Step 1: Check Current Status
```bash
# Check if Docker is running
sudo systemctl status docker

# Check if you're in docker group
groups $USER | grep docker

# Test Docker access
docker ps
```

### Step 2: Start Docker Service (if needed)
```bash
sudo systemctl start docker
sudo systemctl enable docker  # Start on boot
```

### Step 3: Add User to Docker Group
```bash
sudo usermod -aG docker $USER
```

### Step 4: Activate Group Membership
Choose one of these methods:

**Method A: Restart Session**
```bash
logout
# Login again via SSH
```

**Method B: New Group Session**
```bash
newgrp docker
```

**Method C: Switch User**
```bash
su - $USER
```

### Step 5: Verify Fix
```bash
docker ps
# Should work without sudo
```

## 🛠️ Troubleshooting

### Issue: Docker service not running
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Issue: User still not in docker group
```bash
# Check groups
groups $USER

# Force add to group
sudo gpasswd -a $USER docker

# Restart Docker daemon
sudo systemctl restart docker
```

### Issue: Permission still denied after adding to group
```bash
# Logout completely and login again
logout

# Or restart the system
sudo reboot
```

### Issue: Docker daemon not responding
```bash
# Restart Docker service
sudo systemctl restart docker

# Check Docker status
sudo systemctl status docker

# Check Docker logs
sudo journalctl -u docker.service
```

## 📋 One-Command Solutions

### For Ubuntu/Debian:
```bash
# Complete fix in one command
sudo usermod -aG docker $USER && newgrp docker && docker ps
```

### For CentOS/RHEL:
```bash
# Start Docker and add user
sudo systemctl start docker && sudo usermod -aG docker $USER && newgrp docker
```

## 🔒 Security Considerations

**⚠️ Important**: Adding a user to the docker group grants privileges equivalent to root because Docker can run containers with root privileges.

**Alternatives for production**:
1. Use `sudo` for Docker commands
2. Use Docker in rootless mode
3. Use container orchestration tools with proper RBAC

## 🚀 After Fixing Permissions

Once Docker permissions are fixed, you can run:

```bash
# Check if fix worked
docker ps

# Run deployment
./quick-setup.sh

# Or manual deployment
./deploy.sh
```

## ❓ Still Having Issues?

If none of these solutions work:

1. **Check system logs**:
   ```bash
   sudo journalctl -u docker.service
   ```

2. **Reinstall Docker**:
   ```bash
   sudo apt remove docker docker-engine docker.io containerd runc
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **Use our automated fix**:
   ```bash
   ./fix-docker-permissions.sh
   ```

4. **Contact support** with the output of:
   ```bash
   docker version
   groups $USER
   sudo systemctl status docker
   ```