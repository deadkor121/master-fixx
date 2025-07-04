# Master-House Platform

## Overview

Master-House is a full-stack web application that connects homeowners with professional handymen and service providers in Norway. The platform allows users to find, book, and review various home services including plumbing, electrical work, cleaning, repairs, and more.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React with TypeScript, styled using Tailwind CSS and shadcn/ui components
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **State Management**: React Query for server state management
- **Routing**: Wouter for client-side routing

### Monorepo Structure
The application follows a monorepo structure with shared schema and types:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript schemas and types using Drizzle

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Internationalization**: i18next for Norwegian language support
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack React Query for caching and synchronization

### Backend Architecture
- **API Design**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL adapter (@neondatabase/serverless)
- **Security**: Helmet for security headers, rate limiting, CORS protection
- **Authentication**: JWT tokens with middleware-based authorization
- **Validation**: Zod schemas for request/response validation

### Database Schema
The application uses a relational database with the following core entities:
- **Users**: Base user accounts (clients and masters)
- **Masters**: Extended profiles for service providers
- **Service Categories**: Categorized services (plumbing, electrical, etc.)
- **Services**: Specific services offered by masters
- **Bookings**: Service appointments and orders
- **Reviews**: User feedback and ratings

## Data Flow

### User Registration/Authentication
1. User submits registration form with role selection (client/master)
2. Server validates data, hashes password, stores user in database
3. JWT token generated and returned to client
4. Token stored in localStorage for subsequent API calls

### Service Discovery
1. Users search by category, location, or keywords
2. Frontend filters and displays available masters
3. Master profiles show ratings, reviews, and service offerings
4. Real-time data synchronization via React Query

### Booking Process
1. Client selects master and service
2. Booking form captures service details, scheduling, and contact info
3. Server validates and stores booking request
4. Master receives notification and can accept/decline

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (serverless)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Validation**: Zod for schema validation
- **Authentication**: bcrypt for password hashing, jsonwebtoken for JWT
- **HTTP Client**: Axios for API requests

### Development Tools
- **Build System**: Vite for frontend bundling
- **Database Migration**: Drizzle Kit for schema management
- **TypeScript**: Strict type checking across the stack
- **Linting/Formatting**: ESLint and Prettier (configured via package.json)

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory via Vite
- Backend compiles TypeScript to `dist/server` directory via esbuild
- Single build command handles both frontend and backend compilation

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- SSL configuration for production database connections
- JWT secret configuration for token security
- Development vs production environment detection

### Hosting Strategy
- Static frontend hosting (GitHub Pages configured)
- Server-side hosting with Node.js runtime
- Database hosted on Neon (serverless PostgreSQL)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup