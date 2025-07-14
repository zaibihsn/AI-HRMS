# MapleHR - AI-Powered HR Management System

## Overview

MapleHR is a modern, AI-powered human resources management system built with a full-stack TypeScript architecture. The application provides comprehensive HR functionality including employee management, claims processing, ticket handling, and intelligent chat assistance powered by OpenAI's GPT-4o model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with custom MapleHR theme
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **AI Integration**: OpenAI GPT-4o for chat assistance
- **Session Management**: Express sessions with PostgreSQL storage

### Project Structure
- `/client` - React frontend application
- `/server` - Express.js backend with API routes
- `/shared` - Shared TypeScript schemas and types
- `/migrations` - Database migration files

## Key Components

### Database Schema
- **Users**: Authentication and basic user information
- **Employees**: Extended employee data with department, position, salary
- **Claims**: Expense claims and reimbursement requests
- **Tickets**: Support ticket system
- **Leave Requests**: Time-off management
- **Chat Messages**: AI chat history
- **Performance Reviews**: Employee evaluation system
- **Sessions**: User session storage

### AI Service
- Integrated OpenAI GPT-4o for intelligent HR assistance
- Context-aware responses using employee data
- Chat history persistence
- Supports queries about leaves, claims, policies, and general HR topics

### Authentication System
- Session-based authentication with PostgreSQL storage
- User roles: employee, manager, admin
- Secure session management with cookies

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Storage Layer**: Drizzle ORM manages database operations
4. **AI Integration**: OpenAI service processes chat requests with context
5. **Response**: JSON responses sent back to client with appropriate error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **openai**: Official OpenAI SDK for AI chat features
- **@tanstack/react-query**: Server state management
- **express**: Web application framework
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for running TypeScript backend in development
- Automatic reloading and error overlays via Replit plugins

### Production Build
- Vite builds optimized frontend bundle to `/dist/public`
- esbuild bundles backend to ESM format in `/dist`
- Environment variables for database and OpenAI API configuration

### Database Management
- Drizzle Kit for schema migrations
- `npm run db:push` for development schema updates
- PostgreSQL database provisioned via environment variable

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API key for chat functionality
- `NODE_ENV`: Environment mode (development/production)

The application follows a modern full-stack architecture with strong TypeScript integration, providing a scalable foundation for enterprise HR management with AI-enhanced capabilities.