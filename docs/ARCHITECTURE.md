# BeeTrack Architecture

## Overview
BeeTrack is a full-stack procurement optimization platform built with modern technologies and best practices.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │    Alerts    │  │   Metrics    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         React 18 + TypeScript + TailwindCSS                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Alerts    │  │  Decisions   │  │   Metrics    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Rules     │  │Notifications │  │ Integrations │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
           │                  │                    │
           ▼                  ▼                    ▼
    ┌────────────┐    ┌────────────┐      ┌─────────────┐
    │ PostgreSQL │    │   Redis    │      │ Twilio/Slack│
    │  (Prisma)  │    │  (Cache)   │      │    (APIs)   │
    └────────────┘    └────────────┘      └─────────────┘
```

## Technology Stack

### Backend
- **Framework:** NestJS (Node.js framework with TypeScript)
- **ORM:** Prisma (modern database toolkit)
- **Database:** PostgreSQL 15
- **Cache/Queue:** Redis 7
- **API Docs:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer
- **Testing:** Jest

### Frontend
- **Framework:** React 18 (with hooks)
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Data Fetching:** TanStack Query (React Query)
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **TypeScript:** Full type safety

### Integrations
- **SMS:** Twilio
- **Chat:** Slack Web API
- **Job Queue:** BullMQ (for async tasks)

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Web Server:** Nginx (for frontend)
- **Environment:** Node.js 20

## System Flow

```
1. Alert Creation
   └─> Detect delay in order line
   └─> Calculate buffer piercing (Rules Engine)
   └─> Calculate ROI at stake
   └─> Determine severity
   └─> Store in database

2. Decision Routing
   └─> Generate unique decision token
   └─> Identify stakeholders (PM, procurement)
   └─> Send notifications (SMS + Slack)
   └─> Include decision link

3. Notification
   └─> Multi-channel (SMS, Slack, Email)
   └─> Multi-language support (EN/ES/FR/DE/JA)
   └─> Decision buttons/links included
   └─> Track delivery status

4. Decision Capture
   └─> Receive decision via token
   └─> Validate token (one-time use)
   └─> Record decision with timestamp
   └─> Update alert status
   └─> Log for metrics

5. Analytics
   └─> Aggregate decision data
   └─> Calculate metrics (time, rate, etc.)
   └─> Display on dashboard
   └─> Track vendor reliability
```

## Database Schema

### Core Tables

**tenants**
- Organizational units (multi-tenant support)

**projects**
- Individual data center projects
- Links to tenant
- Contains need-by dates, daily delay costs

**order_lines**
- Individual parts/components
- Links to projects
- ETA tracking, critical path flags

**alerts**
- Generated when delays detected
- Buffer piercing score, ROI calculations
- Severity levels (critical, high, medium, low)

**decisions**
- Decision records with tokens
- Links to alerts
- Tracks who decided and when

**vendors**
- Vendor reliability tracking
- Historical delay data
- Learning system for recommendations

**notifications**
- Notification log (SMS, Slack, email)
- Delivery status tracking
- Error logging

**users**
- User accounts (Auth0 integration)
- Role-based access control

## API Endpoints

### Alerts
- `GET /api/alerts` - List all alerts
- `GET /api/alerts/critical` - Get critical alerts
- `GET /api/alerts/:id` - Get alert by ID
- `GET /api/alerts/project/:projectId` - Get project alerts
- `POST /api/alerts` - Create new alert
- `PATCH /api/alerts/:id/status` - Update alert status

### Decisions
- `GET /api/decisions` - List all decisions
- `GET /api/decisions/:id` - Get decision by ID
- `GET /api/decisions/alert/:alertId` - Get decisions for alert
- `PUT /api/decisions/:token` - Record decision via token
- `POST /api/decisions` - Create decision

### Metrics
- `GET /api/metrics/decisions` - Decision analytics
- `GET /api/metrics/vendors` - Vendor performance
- `GET /api/metrics/pms` - Project manager metrics
- `GET /api/metrics/health` - System health

### Swagger Docs
- `GET /api/docs` - Interactive API documentation

## Business Logic

### Buffer Piercing™ Calculation

```typescript
bufferPiercing = (deltaDays / categoryBuffer) * criticalPathWeight

where:
  - deltaDays: days of delay
  - categoryBuffer: 1.2-2.0 (varies by category)
  - criticalPathWeight: 0.4-1.0 (based on float)

Result: 0-1 score (1 = most critical)
```

### ROI Calculation

```typescript
roiValue = (daysSaved * dailyDelayCost) - expediteCost
roiPercentage = (roiValue / expediteCost) * 100
```

### Severity Determination

```
critical: bufferPiercing >= 0.8 OR roiAtStake >= $100K
high:     bufferPiercing >= 0.5 OR roiAtStake >= $50K
medium:   bufferPiercing >= 0.3 OR roiAtStake >= $25K
low:      everything else
```

## Security

### Backend Security
- Helmet for HTTP headers
- CORS configuration
- Rate limiting (100 req/15min per IP)
- Input validation (class-validator)
- Request sanitization
- Error handling (no sensitive data leakage)

### Frontend Security
- XSS protection
- CSRF tokens
- Secure API communication
- Environment variable management
- No hardcoded secrets

### Authentication (Future)
- Auth0 integration
- JWT tokens
- Role-based access control (RBAC)
- Tenant isolation

## Performance

### Backend Optimizations
- Database indexing (on foreign keys, search fields)
- Query optimization (Prisma)
- Redis caching (sessions, frequent queries)
- Compression middleware
- Async job processing (BullMQ)

### Frontend Optimizations
- Code splitting (Vite)
- Lazy loading (React.lazy)
- Image optimization
- CDN for static assets
- React Query caching

## Monitoring & Logging

### Health Checks
- Database connectivity
- Redis connectivity
- External service status (Twilio, Slack)
- `/health` endpoint

### Logging
- Structured logging (JSON)
- Log levels (debug, info, warn, error)
- Request/response logging
- Error stack traces
- Performance metrics

### Metrics
- Alert volume
- Decision time (avg)
- System health status
- Notification success rate
- API response times

## Scalability

### Horizontal Scaling
- Stateless backend (can add instances)
- Redis for shared state
- Load balancer ready
- Database connection pooling

### Vertical Scaling
- Increase DB resources
- Increase Redis memory
- Increase app server resources

### Future Enhancements
- Message queue for high volume (Kafka, RabbitMQ)
- Read replicas for database
- Microservices architecture (if needed)
- Event sourcing for audit trail

## Error Handling

### Backend
- Global exception filter
- HTTP exception responses
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Structured error responses

### Frontend
- Error boundaries
- API error handling
- Toast notifications
- Fallback UI
- Retry mechanisms

## Testing Strategy

### Backend Tests
- Unit tests (Jest)
- Integration tests (with test DB)
- E2E tests (API testing)
- Coverage target: >70%

### Frontend Tests
- Component tests (Vitest)
- Integration tests
- E2E tests (Playwright/Cypress - future)

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Load Balancer                   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│   Frontend     │    │   Backend       │
│   (Nginx)      │    │   (Node.js)     │
│   Container    │    │   Container     │
└────────────────┘    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼──────┐
            │   PostgreSQL   │  │    Redis    │
            │   Container    │  │  Container  │
            └────────────────┘  └─────────────┘
```

## Future Roadmap

- [ ] Real-time WebSocket notifications
- [ ] Advanced analytics (ML/AI predictions)
- [ ] Mobile app (React Native)
- [ ] Email integration (SendGrid)
- [ ] Multi-language UI
- [ ] Advanced RBAC
- [ ] Audit logging
- [ ] Data export (PDF, CSV)
- [ ] Vendor portal
- [ ] API rate limiting per user
- [ ] GraphQL API option
