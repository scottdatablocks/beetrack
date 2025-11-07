# BeeTrack™ v3.0: Constraint Relief for Data Center Procurement

> **Reduce procurement-driven delays by 30-50% within 90 days.**

[![CI/CD](https://github.com/scottdatablocks/beetrack/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/scottdatablocks/beetrack/actions)

## 🎯 The Problem
Data center commissioning dates slip because procurement teams make decisions **18+ hours after delays are discovered**—and often make the wrong decisions. One delayed part (avg 7-day slip) costs **$105K in lost revenue**.

## 💡 The Solution
BeeTrack is a **constraint-relief engine** that:
- **Detects** buffer piercing in real-time (converts delays into $ at risk)
- **Routes** to the right decision-maker (no email chains)
- **Validates** every option before PM sees wrong choices
- **Executes** in 30 seconds (was 18 hours)
- **Learns** from every decision (gets smarter, prevents repeats)

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/scottdatablocks/beetrack.git
cd beetrack

# Start all services
docker compose up

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Docs: http://localhost:3000/api/docs
```

### Manual Setup

#### Backend
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Reference](http://localhost:3000/api/docs) (run server first)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🏗️ Architecture

### Tech Stack
- **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Query
- **Integrations:** Twilio SMS, Slack, BullMQ (job queue)
- **DevOps:** Docker, GitHub Actions, Nginx

### System Architecture
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend    │───▶│  PostgreSQL │
│  (React)    │    │  (NestJS)    │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
                          │
                          ├─────▶ Redis (Cache/Queue)
                          │
                          ├─────▶ Twilio (SMS)
                          │
                          └─────▶ Slack (Notifications)
```

## 🎨 Key Features

- 🔴 **Buffer Piercing™** - Quantifies delay impact (0-1 scale)
- ⚡ **7-minute decision execution** - Was 18 hours
- 📱 **Multi-channel notifications** - SMS + Slack
- 🎯 **Deterministic routing** - Role-based authority
- 📊 **Real-time analytics** - Dashboard with metrics
- 🌍 **Multi-language SMS** - EN/ES/FR/DE/JA
- 🎢 **Escalation with auto-retry** - Smart fallbacks
- 📈 **Vendor reliability learning** - Gets smarter over time

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test
npm run test:watch
npm run test:cov

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Lint
npm run lint

# Format
npm run format
```

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (DB GUI)
npx prisma studio
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/beetrack
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
NODE_ENV=development
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📦 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions for:
- Railway / Fly.io
- AWS / GCP / Azure
- Self-hosted with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📊 Project Status

**v3.0 - Full Stack MVP Complete** ✅

- ✅ Core backend modules (Alerts, Decisions, Rules, Metrics)
- ✅ Database schema with Prisma ORM
- ✅ REST API with Swagger documentation
- ✅ Twilio SMS & Slack integrations
- ✅ React frontend with Dashboard, Alerts, and Metrics
- ✅ Docker containerization
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Comprehensive test suite
- ✅ Production-ready error handling & logging

## 📝 License

Proprietary - BeeTrack™

## 💬 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Email: support@beetrack.io
- Documentation: [docs.beetrack.io](https://docs.beetrack.io)

---

**Built with ❤️ for data center operations teams**
