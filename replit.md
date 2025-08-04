# Overview

This is a full-stack web application for the Adelante Story Foundation, a 501(c)3 non-profit organization focused on creating impact for people and communities through connected experiences. The application serves as the foundation's main website, featuring information about their programs, story, impact statistics, testimonials, and a contact form for community engagement.

The site showcases three main program areas: Education (digital equity programs), Community (serving vulnerable populations), and Connection (workforce development and partnerships). It includes sections for mission statement, program details, partnerships with organizations like Microsoft, the foundation's origin story, impact statistics, community testimonials, and a contact form for inquiries.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built as a Single Page Application (SPA) using React with TypeScript. The application uses a component-based architecture with the following key design decisions:

- **React Router**: Uses Wouter for lightweight client-side routing
- **UI Components**: Leverages Radix UI primitives with shadcn/ui component system for consistent, accessible design
- **Styling**: TailwindCSS for utility-first styling with custom CSS variables for brand colors
- **State Management**: React Query (TanStack Query) for server state management and API calls
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Toast Notifications**: Custom toast system for user feedback

The frontend follows a page-component structure where the main Home page composes multiple section components (Hero, Programs, Story, Contact, etc.) for better maintainability and reusability.

## Backend Architecture

The backend is built with Express.js and follows a RESTful API design:

- **Web Framework**: Express.js with TypeScript for type safety
- **API Routes**: RESTful endpoints for contact form submission and data retrieval
- **Storage Layer**: Abstracted storage interface allowing for pluggable storage implementations (currently using in-memory storage with plans for database integration)
- **Validation**: Zod schemas for request/response validation shared between frontend and backend
- **Error Handling**: Centralized error handling middleware for consistent error responses

The backend implements a clean separation of concerns with dedicated modules for routing, storage, and server configuration.

## Data Storage

Currently uses an in-memory storage implementation for development, with architecture prepared for database integration:

- **Schema Definition**: Drizzle ORM with PostgreSQL dialect for database schema management
- **Data Models**: User management and contact message storage
- **Migration Support**: Drizzle Kit for database migrations
- **Connection**: Configured for PostgreSQL with connection pooling via Neon Database

The storage layer uses an interface-based design allowing easy swapping between different storage implementations.

## Development and Build System

- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Full TypeScript support across frontend, backend, and shared code
- **Hot Module Replacement**: Development server with hot reloading
- **Path Aliases**: Configured path mapping for cleaner imports
- **Shared Code**: Common schemas and types shared between frontend and backend

## Authentication and Authorization

Currently implements basic user schema structure but no active authentication system. The foundation is laid for future implementation of user authentication and session management.

# External Dependencies

## UI and Styling
- **Radix UI**: Accessible component primitives for building the UI
- **TailwindCSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system built on Radix UI

## Data Management
- **TanStack React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations and schema management
- **Zod**: Schema validation for type-safe data handling
- **React Hook Form**: Form state management and validation

## Database and Hosting
- **Neon Database**: PostgreSQL hosting service for production database
- **PostgreSQL**: Primary database system with JSON support

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire application
- **Wouter**: Lightweight React router
- **ESBuild**: Fast JavaScript bundler for production builds

## External Integrations
The application is structured to support future integrations with:
- Email services for contact form notifications
- CRM systems for contact management
- Analytics platforms for user engagement tracking
- Social media APIs for content sharing

The architecture supports easy addition of external service integrations through the abstracted API layer and modular component design.