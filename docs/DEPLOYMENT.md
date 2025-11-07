# BeeTrack Deployment Guide

This guide covers deploying BeeTrack to various platforms.

## Prerequisites

- Docker installed locally for testing
- Git repository access
- Environment variables configured

## Docker Deployment

### Production Docker Compose

```yaml
version: '3.9'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: beetrack
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7
    volumes:
      - redis_data:/data
    restart: always

  backend:
    image: beetrack-backend:latest
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/beetrack
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    depends_on:
      - db
      - redis
    restart: always

  frontend:
    image: beetrack-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
  redis_data:
```

## Railway Deployment

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add PostgreSQL and Redis:
```bash
railway add --plugin postgresql
railway add --plugin redis
```

4. Deploy backend:
```bash
cd backend
railway up
```

5. Deploy frontend:
```bash
cd frontend
railway up
```

## Fly.io Deployment

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login:
```bash
fly auth login
```

3. Deploy backend:
```bash
cd backend
fly launch
fly deploy
```

4. Deploy frontend:
```bash
cd frontend
fly launch
fly deploy
```

## Environment Variables

### Production Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/beetrack
REDIS_URL=redis://host:6379
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
SLACK_BOT_TOKEN=
SLACK_WEBHOOK_URL=
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong-random-secret>
```

### Production Frontend
```env
VITE_API_URL=https://api.yourdomain.com
```

## Database Migrations

Run migrations in production:
```bash
npx prisma migrate deploy
```

## Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /`

### Logging
- Backend logs to stdout
- Use log aggregation service (e.g., Datadog, CloudWatch)

### Metrics
- Access metrics at: `/api/metrics/health`

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS/TLS enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Secrets rotated regularly
- [ ] Monitoring alerts configured

## Rollback Strategy

```bash
# Rollback backend
docker pull beetrack-backend:previous-version
docker-compose up -d backend

# Rollback database migration
npx prisma migrate resolve --rolled-back <migration_name>
```

## Scaling

### Horizontal Scaling
- Backend: Add more instances behind load balancer
- Frontend: CDN for static assets

### Vertical Scaling
- Increase database resources
- Increase Redis memory
- Increase backend CPU/memory

## Backup & Recovery

### Database Backup
```bash
pg_dump -h host -U user beetrack > backup.sql
```

### Restore
```bash
psql -h host -U user beetrack < backup.sql
```

## Support

For deployment issues, contact support@beetrack.io
