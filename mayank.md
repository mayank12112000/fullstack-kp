EduPlatform
Overview
EduPlatform is a comprehensive educational management system built as a full-stack web application. It provides role-based functionality for students, teachers, administrators, and institutional admins to manage courses, schedules, assignments, attendance, and academic analytics. The platform features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and implementing a clean, responsive design with shadcn/ui components.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript using Vite for build tooling
Routing: Wouter for client-side routing with role-based dashboard routes
UI Library: shadcn/ui components built on Radix UI primitives with Tailwind CSS
State Management: TanStack Query (React Query) for server state with custom context providers for authentication and theming
Form Handling: React Hook Form with Zod validation for type-safe form schemas
Styling: Tailwind CSS with custom CSS variables for theming, supporting light/dark modes
Backend Architecture
Runtime: Node.js with Express.js framework
Language: TypeScript with ES modules
API Design: RESTful endpoints with structured routing in /api namespace
Request Processing: JSON body parsing with custom logging middleware for API requests
Error Handling: Centralized error handling middleware with structured error responses
Development: Vite integration for SSR and HMR in development mode
Database Layer
ORM: Drizzle ORM with TypeScript-first schema definitions
Database: PostgreSQL with connection pooling via Neon serverless driver
Schema: Comprehensive educational data model including users, institutions, courses, enrollments, schedules, attendance, assignments, forums, and notifications
Migrations: Drizzle Kit for schema migrations and database management
Data Access: Repository pattern implemented in storage layer with typed interfaces
Authentication & Authorization
Strategy: Session-based authentication with role-based access control (RBAC)
Roles: Four distinct user roles - student, teacher, admin, institute_admin
Session Management: Express sessions with PostgreSQL session store
Context: React context for user state management with persistent localStorage
Route Protection: Role-based route guards and component-level access control
Project Structure
Monorepo: Single repository with shared schema between client and server
Code Organization:
/client - React frontend application
/server - Express backend API
/shared - Shared TypeScript types and Zod schemas
Component-based architecture with feature-specific organization
Path Aliases: TypeScript path mapping for clean imports (@, @shared, @assets)
External Dependencies
Core Dependencies
@neondatabase/serverless - PostgreSQL serverless driver for database connectivity
drizzle-orm & drizzle-kit - TypeScript ORM and migration toolkit
@tanstack/react-query - Server state management and caching
wouter - Lightweight React router
zod & drizzle-zod - Runtime type validation and schema generation
UI & Design System
@radix-ui/ components* - Accessible UI primitives (30+ components)
tailwindcss - Utility-first CSS framework
class-variance-authority & clsx - Conditional styling utilities
lucide-react - Icon library
react-hook-form & @hookform/resolvers - Form handling and validation
Development Tools
vite - Build tool and development server
typescript - Static type checking
tsx - TypeScript execution for development
esbuild - Production bundling for server code
@replit/vite-plugin-* - Replit-specific development enhancements
Additional Integrations
embla-carousel-react - Carousel component implementation
date-fns - Date manipulation utilities
connect-pg-simple - PostgreSQL session store
cmdk - Command palette component
The application is configured for deployment on Replit with specific development tooling and runtime error handling optimized for the platform.