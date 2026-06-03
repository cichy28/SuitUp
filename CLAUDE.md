# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuitUp is a full-stack TypeScript monorepo for a suit customization e-commerce application. The project is currently a PoC with a mobile-first React Native frontend and an Express.js REST API backend.

## Monorepo Structure

```
/
├── backend/    # Express.js REST API + Prisma ORM
├── frontend/   # React Native (Expo) mobile/web app
├── shared/     # Zod validators and TypeScript enums shared between workspaces
├── deploy/     # Production Docker Compose + Cloudflare Tunnel configs
├── nginx/      # Reverse proxy config for local dev
└── aboutMe/    # Separate static Express server (CV site, unrelated to main app)
```

## Commands

### Local Development

```bash
# Start full local stack (PostgreSQL, backend, frontend, Adminer)
npm run docker:dev

# Frontend only (Expo web)
npm run dev:frontend

# Backend only (with ts-node-dev hot reload, requires local .env)
npm run dev:backend
```

### Backend

```bash
cd backend

# Run dev server with hot reload
npm run dev

# Build TypeScript
npm run build

# Prisma
npm run prisma:generate          # Regenerate Prisma client after schema changes
npm run prisma:migrate:dev       # Create and apply new migration
npm run prisma:migrate:prod      # Deploy migrations to production DB
npm run prisma:reset             # Reset DB and reapply all migrations (destructive)

# Reset local DB and import seed images
npm run db:reset-and-import
```

### Frontend

```bash
cd frontend

npm run web      # Expo web (browser dev)
npm start        # Expo Metro bundler
npm test         # Jest
npm run lint     # ESLint
npm run build    # Export static web build
```

### Docker / Deployment

```bash
npm run docker:dev   # Start local dev stack
npm run docker:prod  # Start production stack (uses docker-compose.prod.yml)
npm run deploy       # Build and push Docker images to GHCR
```

**Note:** npm install requires `--force` in Dockerfiles due to peer dependency conflicts (PoC constraint).

## Architecture

### Backend

- **Pattern:** Controller → Route → Prisma (no service layer for most endpoints)
- **Auth:** Import token (`verifyImportToken` middleware) for admin/import routes; JWT planned but not implemented
- **Validation:** Zod schemas from `shared/validators/` applied via `validateRequest` middleware
- **File uploads:** Multer; files stored at `/app/uploads`
- **Email:** Resend service
- **Key routes:** `/api/products`, `/api/orders`, `/api/product-skus`, `/api/properties`, `/api/property-variants`, `/api/categories`, `/api/customers`, `/api/multimedia`, `/api/recommendations`, `/api/upload`, `/api/admin`

### Frontend

- **Navigation flow (linear):** Loading → Welcome → Brief → StylePreferences → Recommendation → ProductConfigurator → Summary → Confirmation
- **State:** DesignContext (React Context) for design configuration state; Zustand also available
- **Data fetching:** Axios (`src/utils/`) + SWR
- **Styling:** NativeWind (Tailwind CSS for React Native)

### Database (Prisma + PostgreSQL)

Key model relationships:
- `User` (Producer role) owns `Product` and `Property` definitions
- `Product` → `ProductSku` (concrete variants with price) → `PropertyVariant` (color, size, etc.)
- `Order` → `OrderItem` (specific SKUs) → `Customer`
- `Multimedia` attaches images to users, products, and property variants
- `Category` has a hierarchy for product organization

Enums live in `shared/enums.ts`: `UserRole`, `OrderStatus`, `BodyShape`, `StylePreference`, `OrderDeliveryMethod`.

### Shared Package

`shared/` is an npm workspace referenced by both backend and frontend. It exports:
- Zod validators in `validators/` (one file per entity)
- `enums.ts` with all shared TypeScript enums

Import as: `import { ProductValidator } from 'shared/validators/product'`

## Environment

- **Local dev DB:** PostgreSQL 13 on port 5433 (Docker), Adminer on port 8080
- **Backend dev:** `.env.development` in `backend/`; production uses `.env.production`
- **Production:** Images published to `ghcr.io/cichy28/suit-up/`; Cloudflare Tunnel handles SSL

## Known Constraints

- The hardcoded import token `a1b2c3d4-e5f6-7890-1234-56789abcdef0` should be an env variable — do not change its value without updating the deployment env.
- `npm install --force` is intentional in all Dockerfiles.
