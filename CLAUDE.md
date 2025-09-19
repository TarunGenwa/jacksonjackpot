# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application with:
- **Frontend**: Next.js 15 application with TypeScript and Tailwind CSS (located in `/client`)
- **Backend**: NestJS application with TypeScript (located in `/server`)

## Development Commands

### Client (Next.js)
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Server (NestJS)
```bash
cd server
npm install          # Install dependencies
npm run start:dev    # Start in watch mode
npm run start:debug  # Start in debug mode
npm run start:prod   # Start production server
npm run build        # Build for production
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier

# Prisma commands
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate       # Create new migration
npm run prisma:migrate:deploy # Deploy migrations to production
npm run prisma:studio        # Open Prisma Studio GUI
```

### Testing Commands

#### Server Tests
```bash
cd server
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
npm run test:debug   # Debug tests
npm run test:e2e     # Run e2e tests
```

## Architecture Overview

### Frontend (Next.js)
- Uses App Router architecture (files in `client/src/app/`)
- TypeScript configuration with strict mode
- Tailwind CSS v4 for styling
- ESLint configured for Next.js best practices

### Backend (NestJS)
- Modular architecture with controllers, services, and modules
- Main entry point: `server/src/main.ts` (default port: 8080)
- PostgreSQL database using Prisma ORM with Neon DB
- Configuration management using @nestjs/config
- Test files colocated with source files (`.spec.ts`)
- E2E tests in `server/test/` directory
- Jest configured for unit and e2e testing

### Database Configuration
- Uses PostgreSQL hosted on Neon
- Prisma ORM for database access and migrations
- Environment-based configuration via `.env` file
- Schema defined in `server/prisma/schema.prisma`
- Generated Prisma Client in `server/generated/prisma/`
- SSL enabled for secure connections

### CORS Configuration
- CORS is enabled for all origins (`origin: true`)
- Supports credentials and common HTTP methods
- Allows headers: Content-Type, Authorization, X-Requested-With, Accept
- Configured in `server/src/main.ts`
- **Note**: All origins are allowed for development convenience

### Database Schema
Current models:

#### Core Models
- **User**: Core user model with authentication and profile
  - Fields: `id`, `email`, `username`, `firstName`, `lastName`, `password`, `isActive`
  - Role-based access: USER, ADMIN, MODERATOR
  - Relations: wallet, tickets, transactions, winners

- **Charity**: Registered charities that host competitions
  - Fields: `name`, `description`, `logoUrl`, `website`, `email`, `taxId`
  - Verification status and bank details for payouts
  - Relations: competitions, donations

- **Competition**: Lottery/raffle competitions for charities
  - Fields: `title`, `description`, `ticketPrice`, `maxTickets`, `ticketsSold`
  - Date management: `startDate`, `endDate`, `drawDate`
  - Status tracking: DRAFT, UPCOMING, ACTIVE, SOLD_OUT, DRAWING, COMPLETED, CANCELLED
  - Relations: charity, prizes, tickets, winners

#### Financial Models
- **Wallet**: User's digital wallet for transactions
  - Fields: `balance`, `currency` (default GBP), `isLocked`
  - One-to-one relation with User

- **Transaction**: All financial transactions
  - Types: DEPOSIT, WITHDRAWAL, TICKET_PURCHASE, PRIZE_PAYOUT, REFUND, BONUS, FEE
  - Status: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED
  - Payment provider integration fields

#### Lottery Models
- **Ticket**: Purchased lottery tickets
  - Fields: `ticketNumber` (unique), `purchasePrice`, `status`
  - Status: ACTIVE, WINNER, EXPIRED, CANCELLED, REFUNDED
  - Relations: competition, user, potential winner

- **Prize**: Competition prizes
  - Fields: `name`, `description`, `value`, `position`, `quantity`
  - Unique constraint on competition + position

- **Winner**: Competition winners and prize allocation
  - Fields: `status`, `claimedAt`, `paidOutAt`
  - Status: PENDING, NOTIFIED, CLAIMED, PAID, EXPIRED
  - Relations: competition, user, ticket, prize

- **Donation**: Direct charity donations
  - Fields: `amount`, `currency`, `donorName`, `donorEmail`, `isAnonymous`
  - Status tracking for payment processing

## Key Configuration Files

- **Client**: 
  - `client/next.config.ts` - Next.js configuration
  - `client/tsconfig.json` - TypeScript configuration
  - `client/eslint.config.mjs` - ESLint configuration
  - `client/postcss.config.mjs` - PostCSS configuration for Tailwind

- **Server**:
  - `server/nest-cli.json` - NestJS CLI configuration
  - `server/tsconfig.json` - TypeScript configuration
  - `server/eslint.config.mjs` - ESLint configuration
  - `server/.prettierrc` - Prettier configuration
  - `server/.env` - Environment variables (database URL, port, JWT secrets)
  - `server/.env.example` - Template for environment variables
  - `server/prisma/schema.prisma` - Prisma database schema
  - `server/prisma/migrations/` - Database migration files

## Running the Full Stack

### Prerequisites
1. Copy `server/.env.example` to `server/.env` and configure your database URL
2. Install dependencies in both directories:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

### Start Development Servers
**Note**: Auto-start is disabled in VS Code settings. Manually run servers when needed.

Open two terminal windows:

1. Terminal 1 - Backend:
   ```bash
   cd server && npm run start:dev
   ```

2. Terminal 2 - Frontend:
   ```bash
   cd client && npm run dev
   ```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8080.