# Frontend API Deployment Guide

## 📋 Overview

This guide covers deploying the PronaFlow Frontend with integrated API support. The frontend is a React application built with Vite that communicates with the FastAPI backend.

## 🚀 Quick Deploy

### Option 1: Using Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy/deploy-frontend-api.js

# Run deployment
node scripts/deploy/deploy-frontend-api.js

# Skip container testing
node scripts/deploy/deploy-frontend-api.js --skip-test
```

### Option 2: Using npm Commands

```bash
# Build frontend
cd apps/frontend
npm run build

# Run locally
npm run preview

# Or with Docker
docker build -t pronaflow-frontend:latest .
docker run -p 5173:5173 pronaflow-frontend:latest
```

### Option 3: Using Docker Compose

```bash
# Development
docker-compose up frontend

# Production
docker-compose -f docker-compose.prod.yml up -d frontend
```

## 🔧 Configuration

### Environment Variables

Create `.env.production` in `apps/frontend/`:

```env
# API Configuration
VITE_API_URL=https://api.pronaflow.com/api/v1
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=PronaFlow
VITE_APP_VERSION=1.0.0

# AI Service
VITE_AI_SERVICE_URL=https://ai-service.pronaflow.com/api/v1
VITE_AI_ENABLED=true

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_REAL_TIME=true
```

### API Services Integrated

The frontend includes the following API service modules:

1. **Authentication Service** (`authService.ts`)
   - Login/Register
   - Token refresh
   - 2FA verification
   - User profile management

2. **Workspace Service** (`workspaceService.ts`)
   - Create/read/update/delete workspaces
   - Member management
   - Settings

3. **Project Service** (`projectService.ts`)
   - Project CRUD operations
   - Teams and permissions
   - Project analytics

4. **Task Service** (`taskService.ts`)
   - Task management
   - Status tracking
   - Subtasks and dependencies

5. **Notification Service** (`notificationService.ts`)
   - Real-time notifications
   - Preferences management
   - Notification history

6. **Analytics Service** (`analyticsService.ts`)
   - Project metrics
   - Team performance
   - Custom reports

7. **Integration Service** (`integrationService.ts`)
   - Third-party integrations
   - Webhook management
   - API tokens

8. **Other Services**
   - Archive management
   - Help center/support
   - Billing information
   - Onboarding flow
   - Personalization preferences

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd apps/frontend
docker build -t pronaflow-frontend:latest .
docker tag pronaflow-frontend:latest pronaflow-frontend:$(date +%Y%m%d)
```

### Production Deployment

```bash
# Push to registry
docker push your-registry/pronaflow-frontend:latest

# Run with environment variables
docker run -d \
  -p 5173:5173 \
  -e VITE_API_URL=https://api.pronaflow.com/api/v1 \
  -e VITE_APP_NAME=PronaFlow \
  --name pronaflow-frontend \
  your-registry/pronaflow-frontend:latest
```

## ☸️ Kubernetes Deployment

Create `deployment/k8s/frontend-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pronaflow-frontend
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pronaflow-frontend
  template:
    metadata:
      labels:
        app: pronaflow-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/pronaflow-frontend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 5173
          name: http
        env:
        - name: VITE_API_URL
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-url
        - name: VITE_APP_NAME
          value: PronaFlow
        livenessProbe:
          httpGet:
            path: /
            port: 5173
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 5173
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: pronaflow-frontend
spec:
  selector:
    app: pronaflow-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5173
  type: LoadBalancer
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  api-url: https://api.pronaflow.com/api/v1
```

Deploy:
```bash
kubectl apply -f deployment/k8s/frontend-deployment.yaml
kubectl get svc pronaflow-frontend
```

## 🔐 API Security

### CORS Configuration

The backend should have these CORS settings:

```python
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://pronaflow.com",
    "https://app.pronaflow.com",
]
```

### Authentication Flow

1. User logs in via `/auth/login`
2. Receives access token (JWT)
3. Token stored in secure storage
4. Token sent in `Authorization: Bearer <token>` header
5. Token refreshed via `/auth/refresh` when expired

### API Base Configuration

The frontend uses Axios client with:
- Base URL: `VITE_API_URL`
- Timeout: `VITE_API_TIMEOUT` (default: 30s)
- Automatic token injection
- Retry logic for failed requests
- Error handling and logging

## 📊 Monitoring

### Health Check

```bash
# Check container/pod health
curl http://localhost:5173/

# Check API connectivity
curl -H "Authorization: Bearer <token>" \
  http://localhost:5173/api/v1/health
```

### Logs

```bash
# Docker
docker logs -f pronaflow-frontend

# Docker Compose
docker-compose logs -f frontend

# Kubernetes
kubectl logs -f deployment/pronaflow-frontend
```

## ✅ Verification Checklist

- [ ] Environment variables configured correctly
- [ ] API URL is accessible
- [ ] CORS headers properly configured
- [ ] Authentication tokens working
- [ ] All API services responding
- [ ] Analytics enabled (if required)
- [ ] Notifications working
- [ ] Real-time features connected
- [ ] Error handling functioning
- [ ] Performance acceptable

## 🔄 Rolling Updates

### Docker Compose

```bash
# Update image
docker-compose -f docker-compose.prod.yml pull frontend

# Restart service (zero-downtime)
docker-compose -f docker-compose.prod.yml up -d frontend
```

### Kubernetes

```bash
# Update image in deployment
kubectl set image deployment/pronaflow-frontend \
  frontend=your-registry/pronaflow-frontend:v2.0 \
  --record

# Check rollout status
kubectl rollout status deployment/pronaflow-frontend

# Rollback if needed
kubectl rollout undo deployment/pronaflow-frontend
```

## 🐛 Troubleshooting

### Frontend not connecting to API

1. Check `VITE_API_URL` environment variable
2. Verify backend is running: `curl $VITE_API_URL/health`
3. Check CORS headers in browser DevTools
4. Check network tab for API requests

### Application won't start

1. Check logs: `docker logs <container-id>`
2. Verify Node dependencies: `npm ci`
3. Check for environment variable issues
4. Ensure port 5173 is available

### Slow API responses

1. Check backend performance
2. Verify network connectivity
3. Check `VITE_API_TIMEOUT` setting
4. Review API rate limiting

## 📚 References

- [Frontend Architecture](../../docs/frontend/00-Overview.md)
- [API Specifications](../../docs/backend)
- [Deployment Infrastructure](../../deployment)
- [Environment Configuration](../../configs)
