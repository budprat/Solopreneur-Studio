# SoloAI Studio - AI Solopreneur Operating System

## Overview

SoloAI Studio is a comprehensive operating system designed for AI solopreneurs who build, manage, and scale AI-powered businesses. The application provides a unified workspace that consolidates project management, AI tool orchestration, prompt library management, knowledge base organization, automation workflows, and revenue tracking into a single platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Overall Architecture
The application follows a full-stack monorepo architecture with clear separation between client and server components:

- **Frontend**: React-based SPA built with Vite
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Node.js with ESM modules

### Directory Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types and database schema
├── migrations/      # Database migration files
└── attached_assets/ # Project documentation and assets
```

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for UI state
- **Routing**: Wouter for client-side navigation
- **Theme**: Dark/light mode support with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database Provider**: Neon (PostgreSQL) for cloud hosting
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: PostgreSQL session store (connect-pg-simple)

### UI Component System
- **Design System**: shadcn/ui components built on Radix UI primitives
- **Component Library**: Comprehensive set of accessible components
- **Styling Strategy**: Utility-first CSS with Tailwind
- **Responsive Design**: Mobile-first approach with breakpoint system

### Advanced Features (Added January 2025)
- **AI Experimentation Lab**: Multi-model prompt testing and optimization
- **Strategic Growth Advisor**: AI-powered business intelligence and recommendations
- **Business Intelligence**: Comprehensive analytics and predictive insights
- **Real-time Collaboration**: Project and document collaboration features
- **Advanced Prompt Optimization**: Enhanced prompt performance tracking

## Data Flow

### Database Schema
The application uses a relational database with the following core entities:

1. **Users**: Authentication and profile management
2. **Clients**: Customer relationship management
3. **Projects**: Project tracking with client relationships
4. **AI Tools**: AI service integration and cost tracking
5. **Prompts**: Prompt library with performance metrics
6. **Knowledge Base**: Document and resource management
7. **Automation Workflows**: Business process automation
8. **Revenue Tracking**: Financial analytics and reporting
9. **AI Usage Logs**: Usage analytics and cost optimization

### API Layer
- RESTful API endpoints for all major entities
- Consistent error handling and response formatting
- Mock user authentication (ready for production auth integration)
- Query parameter support for filtering and searching

### Client-Server Communication
- HTTP-based REST API communication
- TanStack Query for caching and synchronization
- Optimistic updates for better user experience
- Error boundaries for graceful error handling

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, ESBuild
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer

### UI Component Dependencies
- **Radix UI**: Comprehensive primitive components
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Utility class merging

### Database and Backend
- **Neon Database**: PostgreSQL cloud hosting
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Database migrations and tooling
- **Express.js**: Web framework
- **Zod**: Runtime type validation

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting (configured via package.json)
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both client and server
- **Hot Reload**: Vite provides instant feedback for frontend changes
- **Database Management**: `npm run db:push` for schema updates
- **TypeScript Checking**: `npm run check` for type validation

### Production Build
- **Frontend Build**: Vite bundles React app to `dist/public`
- **Backend Build**: ESBuild compiles server to `dist/index.js`
- **Asset Optimization**: Vite handles code splitting and optimization
- **Environment Variables**: Database URL and other configs via environment

### Database Strategy
- **Cloud Hosting**: Neon PostgreSQL for scalability
- **Schema Management**: Drizzle migrations in `migrations/` directory
- **Connection Pooling**: Built-in connection pooling with Neon
- **Type Safety**: Generated types from schema definitions

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types reduces duplication and ensures consistency
2. **Drizzle ORM**: Chosen for type safety and performance over traditional ORMs
3. **shadcn/ui**: Provides consistent design system with accessibility built-in
4. **TanStack Query**: Handles server state management and caching efficiently
5. **Neon Database**: Cloud-native PostgreSQL for scalability and reliability
6. **Vite Build System**: Fast development experience with optimized production builds

The application is designed to be production-ready with proper error handling, type safety, and scalable architecture while maintaining developer productivity through modern tooling and clear separation of concerns.

## Recent Changes

### January 2025 - Advanced Analytics and AI Assistant Implementation
- **Comprehensive Analytics Dashboard**: Built predictive analytics system with multi-model forecasting, business insights, and performance tracking
- **AI Assistant Integration**: Created personalized AI assistant powered by Gemini API with proactive recommendations and business intelligence
- **Quick Action Tooltips**: Implemented floating action button with quick access to all major features and keyboard shortcuts
- **Predictive Analytics**: Added revenue forecasting, performance predictions, and skill development tracking with interactive visualizations
- **Business Intelligence**: Integrated AI-powered insights generation with risk assessment, opportunity identification, and trend analysis
- **Enhanced User Experience**: Added floating action button, comprehensive tooltips, and intuitive navigation for faster user interactions
- **Real-time Analytics**: Implemented live data visualization with animated charts, progress indicators, and interactive dashboards
- **AI-Powered Recommendations**: Created personalized business recommendations based on user behavior and business data

### January 2025 - Complete Advanced Features Implementation
- **AI Experimentation Lab**: Created comprehensive multi-model testing interface with real-time results comparison
- **Strategic Growth Advisor**: Implemented AI-powered business intelligence with market analysis and growth recommendations
- **Business Intelligence Dashboard**: Added predictive analytics, performance metrics, and financial forecasting
- **Content Creation System**: Built AI-powered content creation studio with multi-modal content generation and management
- **Email Intelligence System**: Implemented automatic client request extraction, sentiment analysis, and AI-powered response suggestions
- **Intelligent Scheduling Engine**: Added energy pattern learning, deadline-aware prioritization, and focus time protection
- **Digital Asset Management**: Created centralized content repository with AI-powered tagging and analysis
- **Knowledge Graph Engine**: Built entity extraction and relationship mapping system with interactive visualization
- **Content Pipeline Automation**: Implemented automated content workflows from ideation to publication
- **Enhanced Database Schema**: Added comprehensive tables for all new features including content, tasks, assets, and knowledge entities
- **Navigation Updates**: Added all new features to sidebar with "NEW" badges for easy access
- **API Expansion**: Extended backend routes to support all new advanced features with proper validation and mock responses

All advanced features from the PRD have been successfully implemented except voice-activated workflow automation (as requested by the user).