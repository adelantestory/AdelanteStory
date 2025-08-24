# AdelanteStory Codebase Overview

AdelanteStory is a nonprofit organization's website built with modern web technologies in a full-stack TypeScript monorepo architecture.

## Project Architecture

### Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript schemas and types
└── attached_assets/ # Static image assets
```

### Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI component library
- Wouter for client-side routing
- React Query for state management
- Framer Motion for animations

**Backend**
- Express.js with TypeScript
- Drizzle ORM for database operations
- Zod for runtime validation
- PostgreSQL (Neon serverless)
- Session management with Passport.js

**Development Tools**
- TypeScript for type safety
- ESBuild for server bundling
- Drizzle Kit for database migrations

## Frontend Components

### Core Pages
- **Home** (`client/src/pages/home.tsx`) - Main landing page
- **404** (`client/src/pages/not-found.tsx`) - Error page

### Layout Components
- **Navigation** - Site header and navigation menu
- **Hero Section** - Main banner with call-to-action
- **Footer** - Site footer with links and information

### Content Sections
- **Mission Statement** - Organization's mission and values
- **Programs Section** - Showcase of programs and services
- **Partnerships Section** - Partner organizations and collaborations
- **Story Section** - Organization's history and background
- **Impact Stats** - Key metrics and achievements
- **Testimonials** - User testimonials and success stories
- **Contact Section** - Contact form and information

### UI Components
Extensive Radix UI component library including:
- Form controls (input, select, checkbox, etc.)
- Navigation (dropdown, menubar, breadcrumb)
- Feedback (alert, toast, dialog)
- Data display (table, card, accordion)
- Layout (separator, scroll-area, resizable)

## Backend API

### Server Setup (`server/index.ts`)
- Express.js application with middleware
- Request logging for API endpoints
- Error handling middleware
- Development/production environment handling
- Serves both API and static frontend

### API Routes (`server/routes.ts`)
- `POST /api/contact` - Submit contact form messages
- `GET /api/contact` - Retrieve contact messages (admin)

### Data Layer (`server/storage.ts`)
- Database connection and operations
- Contact message CRUD operations
- User management functionality

## Database Schema (`shared/schema.ts`)

### Tables
- **users** - User accounts with authentication
- **contact_messages** - Contact form submissions

### Validation
- Zod schemas for runtime validation
- Type-safe database operations with Drizzle
- Shared types between frontend and backend

## Development Workflow

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production server
npm run check      # TypeScript type checking
npm run db:push    # Push database schema changes
```

### Key Configuration Files
- `vite.config.ts` - Vite build configuration
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn/ui component configuration

## Features

### Contact System
- Form validation with Zod schemas
- Database storage of contact messages
- Error handling and user feedback
- Admin endpoint for message retrieval

### UI/UX
- Responsive design with Tailwind CSS
- Accessible components with Radix UI
- Smooth animations with Framer Motion
- Toast notifications for user feedback

### Development Experience
- Full TypeScript coverage
- Hot module replacement in development
- Type-safe API contracts
- Shared validation schemas

## Deployment
- Production build optimizes both frontend and backend
- Single port serving (5000) for both API and static files
- Environment-based configuration
- Static asset handling for production

This codebase represents a modern, well-structured nonprofit website with a focus on maintainability, type safety, and user experience.