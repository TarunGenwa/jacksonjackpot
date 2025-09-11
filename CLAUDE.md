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

### Database Schema
Current models:
- **User**: Core user model with fields for authentication and profile
  - `id` (UUID), `email`, `username`, `firstName`, `lastName`
  - `password` (hashed), `isActive`, `role` (USER/ADMIN/MODERATOR)
  - Timestamps: `createdAt`, `updatedAt`

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
  - `server/.env` - Environment variables (database URL, port)
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