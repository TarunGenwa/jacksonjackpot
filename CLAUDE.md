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
- Main entry point: `server/src/main.ts`
- Test files colocated with source files (`.spec.ts`)
- E2E tests in `server/test/` directory
- Jest configured for unit and e2e testing

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

## Running the Full Stack

To run both frontend and backend simultaneously, open two terminal windows:

1. Terminal 1 - Backend:
   ```bash
   cd server && npm run start:dev
   ```

2. Terminal 2 - Frontend:
   ```bash
   cd client && npm run dev
   ```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8080.