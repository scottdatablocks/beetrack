# BeeTrack Development Guide

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/scottdatablocks/beetrack.git
cd beetrack
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Setup environment:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your local settings

# Frontend
cd ../frontend
cp .env.example .env
```

4. Start database:
```bash
docker compose up db redis -d
```

5. Run migrations:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

6. Start development servers:
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

## Project Structure

```
beetrack/
├── backend/
│   ├── prisma/           # Database schema
│   ├── src/
│   │   ├── alerts/       # Alerts module
│   │   ├── decisions/    # Decisions module
│   │   ├── metrics/      # Metrics module
│   │   ├── rules/        # Business rules
│   │   ├── integrations/ # Twilio, Slack
│   │   ├── notifications/# Notification service
│   │   ├── prisma/       # Prisma service
│   │   ├── config/       # Configuration
│   │   ├── common/       # Filters, interceptors
│   │   └── main.ts       # Entry point
│   └── test/             # Tests
├── frontend/
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── lib/          # API client, types
│       └── styles/       # CSS styles
└── docs/                 # Documentation
```

## Backend Development

### Adding a New Module

1. Generate module:
```bash
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

2. Add to app.module.ts:
```typescript
@Module({
  imports: [FeatureModule, ...],
  ...
})
```

### Database Changes

1. Update Prisma schema:
```prisma
model NewModel {
  id String @id @default(uuid())
  name String
  @@map("new_models")
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_new_model
```

3. Update TypeScript types as needed

### Writing Tests

```typescript
// feature.service.spec.ts
describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FeatureService],
    }).compile();
    service = module.get(FeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### API Documentation

Use Swagger decorators:
```typescript
@ApiTags('feature')
@ApiOperation({ summary: 'Get all items' })
@ApiResponse({ status: 200, description: 'Success' })
@Get()
getAll() { ... }
```

## Frontend Development

### Adding a New Page

1. Create page component:
```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. Add route:
```typescript
// App.tsx
<Route path="new-page" element={<NewPage />} />
```

### API Integration

```typescript
// lib/api.ts
export const featureApi = {
  getAll: () => api.get('/api/feature'),
  getById: (id: string) => api.get(`/api/feature/${id}`),
  create: (data: any) => api.post('/api/feature', data),
};

// In component
const { data } = useQuery({
  queryKey: ['feature'],
  queryFn: () => featureApi.getAll(),
});
```

### Styling

Use Tailwind utility classes:
```tsx
<div className="card">
  <h2 className="text-xl font-bold">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

## Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test
```

## Code Quality

### Linting
```bash
# Backend
npm run lint
npm run lint:fix

# Frontend
npm run lint
```

### Formatting
```bash
npm run format
```

## Debugging

### Backend (VSCode)
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "console": "integratedTerminal"
}
```

### Frontend (VSCode)
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Frontend",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/frontend"
}
```

## Common Tasks

### Reset Database
```bash
npx prisma migrate reset
```

### Seed Database
```bash
npx prisma db seed
```

### View Database
```bash
npx prisma studio
```

### Check Dependencies
```bash
npm outdated
npm audit
```

## Git Workflow

1. Create feature branch:
```bash
git checkout -b feature/my-feature
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: add new feature"
```

3. Push and create PR:
```bash
git push origin feature/my-feature
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Issues
```bash
# Regenerate client
npx prisma generate

# Reset and resync
npx prisma migrate reset
npx prisma db push
```

### npm Issues
```bash
# Clear cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Best Practices

1. **Code Organization**: Keep modules focused and single-purpose
2. **Error Handling**: Use try-catch and proper error responses
3. **Validation**: Use DTOs with class-validator
4. **Security**: Never commit secrets, use environment variables
5. **Testing**: Write tests for business logic
6. **Documentation**: Keep Swagger docs updated
7. **Git**: Write clear commit messages

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
