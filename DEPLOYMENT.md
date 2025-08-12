# Deployment Guide: Development to Production

This guide explains how to deploy your diySign application from development to production.

## Key Changes Made for Production

### 1. Environment Variables
- **Admin Password**: Now uses `ADMIN_PASSWORD` environment variable instead of hardcoded value
- **Node Environment**: Set to `NODE_ENV=production`
- **Port Configuration**: Uses `PORT` environment variable

### 2. Security Improvements
- Admin password is externalized to environment variables
- Production logging is reduced (no localhost URL display)
- Separate production Docker compose configuration

### 3. Docker Configuration
- **Development**: `docker-compose.yml` (with source code mounting)
- **Production**: `docker-compose.prod.yml` (optimized for production)

## Deployment Steps

### Option 1: Using Docker Compose (Recommended)

1. **Set Environment Variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your production values
   nano .env
   ```
   
   Set a strong admin password:
   ```
   ADMIN_PASSWORD=your_very_secure_password_here
   NODE_ENV=production
   PORT=3000
   ```

2. **Deploy with Production Configuration**:
   ```bash
   # Build and start the production container
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Verify Deployment**:
   ```bash
   # Check container status
   docker-compose -f docker-compose.prod.yml ps
   
   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   ```

### Option 2: Direct Node.js Deployment

1. **Set Environment Variables**:
   ```bash
   export ADMIN_PASSWORD="your_very_secure_password_here"
   export NODE_ENV="production"
   export PORT="3000"
   ```

2. **Install Dependencies and Start**:
   ```bash
   npm install --production
   npm start
   ```

## Production vs Development Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| **Environment** | `NODE_ENV=development` | `NODE_ENV=production` |
| **Admin Password** | Hardcoded `admin123` | Environment variable |
| **Docker Port** | `3000:3000` | `80:3000` (HTTP) |
| **Source Code** | Live mounted | Baked into image |
| **Data Persistence** | Local files | Mounted volumes |
| **Logging** | Full debug info | Reduced logging |

## Important Security Notes

### 🔒 Change Default Password
The default admin password `admin123` should **NEVER** be used in production. Always set a strong password via the `ADMIN_PASSWORD` environment variable.

### 🔒 HTTPS Recommendation
For production deployments, consider:
- Using a reverse proxy (nginx, Apache) with SSL certificates
- Implementing proper session management
- Adding rate limiting for API endpoints

## File Persistence

The production configuration mounts these directories for data persistence:
- `./data` → `/app/app/public/data` (campus data)
- `./uploads` → `/app/app/public/images/logos` (uploaded logos)

Create these directories before deployment:
```bash
mkdir -p data uploads
```

## Monitoring and Maintenance

### Health Check
The application provides a health endpoint:
```bash
curl http://your-domain/api/health
```

### Container Management
```bash
# Stop the application
docker-compose -f docker-compose.prod.yml down

# Update and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

## Troubleshooting

### Common Issues

1. **Container won't start**: Check environment variables in `.env` file
2. **Admin login fails**: Verify `ADMIN_PASSWORD` is set correctly
3. **Data not persisting**: Ensure `data` and `uploads` directories exist and have proper permissions

### Debug Commands
```bash
# Check environment variables inside container
docker-compose -f docker-compose.prod.yml exec app env

# Access container shell
docker-compose -f docker-compose.prod.yml exec app sh
```

## Rollback Strategy

To rollback to a previous version:
```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Restore from backup (if available)
# Then restart with previous image/code
```

Always backup your `data` and `uploads` directories before deploying updates.
