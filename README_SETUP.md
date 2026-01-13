# Telethai Master Data API

Happy Stack: NestJS + Prisma + PostgreSQL + Redis + BullMQ

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (สำหรับ PostgreSQL และ Redis)

## Installation

```bash
# Install dependencies
pnpm install

# Set up Prisma
pnpm prisma generate

# Start database and redis
docker-compose up -d
```

## Environment Setup

Copy `.env.example` to `.env` และแก้ไขค่าต้องการ

```bash
cp .env.example .env
```

## Running the app

```bash
# Development
pnpm start:dev

# Production
pnpm run build
pnpm start:prod
```

## Database Management

```bash
# Create database migration
pnpm prisma migrate dev --name init

# View database
pnpm prisma studio

# Reset database
pnpm prisma migrate reset
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## Linting & Formatting

```bash
# Lint
pnpm lint

# Format
pnpm format
```

## Stack Details

- **Framework**: NestJS (v11)
- **ORM**: Prisma (v6)
- **Database**: PostgreSQL
- **Cache/Queue**: Redis + BullMQ
- **Language**: TypeScript
- **Testing**: Jest & Supertest

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL
docker-compose exec postgres psql -U user -d telethai_master_data

# Access Redis
docker-compose exec redis redis-cli
```
