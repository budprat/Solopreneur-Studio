# SoloAIStudio

**An AI-Powered Business Management Platform for Solopreneurs**

SoloAIStudio is a comprehensive, all-in-one platform designed to empower solopreneurs and small business owners with cutting-edge AI capabilities to manage clients, projects, revenue, content, and business intelligence—all from a single, intuitive interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [Key Features in Detail](#key-features-in-detail)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Business Management

- **Dashboard** - Real-time business metrics with animated charts and statistics
- **Client Management** - Track client information, status, and revenue
- **Project Management** - Manage projects with progress tracking, budgets, and deadlines
- **Revenue Tracking** - Monitor invoices, payments, and expenses
- **Business Intelligence** - Advanced analytics and performance insights

### AI-Powered Tools

- **AI Assistant** - Interactive AI helper powered by OpenAI and Google Gemini
- **Prompt Library** - Organize and manage reusable AI prompts with version control
- **AI Experimentation Lab** - Test and compare different AI models and prompt variations
- **Growth Advisor** - Strategic AI insights for business opportunities and optimization

### Content & Productivity

- **Content Creation & Management** - Create, schedule, and manage multi-platform content
- **Content Pipeline Automation** - Automate content workflows from creation to publishing
- **Email Intelligence** - AI-powered email analysis, categorization, and auto-responses
- **Task Management** - Intelligent task scheduling with energy and focus optimization
- **Inspiration Generator** - AI-generated creative ideas and motivational content

### Knowledge & Collaboration

- **Knowledge Base** - Centralized repository for articles, notes, and resources
- **Knowledge Graph** - Visual network of interconnected business concepts and relationships
- **Digital Asset Management** - AI-powered asset organization with smart tagging
- **Real-time Collaboration** - Share projects and documents with team members

### Automation & Workflows

- **Automation Workflows** - Create custom automated workflows with triggers and actions
- **AI Usage Tracking** - Monitor AI tool usage, costs, and performance metrics

## Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Recharts** - Data visualization charts
- **TanStack Query** - Server state management
- **Wouter** - Lightweight client-side routing
- **React Hook Form + Zod** - Form validation

### Backend

- **Node.js + Express** - Server framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Primary database (Neon serverless)
- **Express Session** - Session management
- **Passport.js** - Authentication

### AI Integration

- **OpenAI API** - GPT models for advanced AI features
- **Google Gemini API** - Alternative AI model provider

### Development Tools

- **TSX** - TypeScript execution for development
- **ESBuild** - Fast JavaScript bundler
- **Drizzle Kit** - Database migration tool

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** database (or Neon serverless instance)
- **OpenAI API Key** (for AI features)
- **Google Gemini API Key** (optional, for Gemini AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SoloAIStudio.git
   cd SoloAIStudio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required Environment Variables

# Database Connection
DATABASE_URL=postgresql://user:password@host:port/database

# AI API Keys
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Session Configuration
SESSION_SECRET=your-random-session-secret-here

# Replit Authentication (if using Replit)
REPL_ID=your-repl-id
REPLIT_DOMAINS=your-replit-domains
ISSUER_URL=https://replit.com/oidc

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Environment Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for AI features |
| `GEMINI_API_KEY` | No | Google Gemini API key (alternative AI provider) |
| `SESSION_SECRET` | Yes | Random string for session encryption |
| `REPL_ID` | Conditional | Required when deploying on Replit |
| `REPLIT_DOMAINS` | Conditional | Required for Replit authentication |
| `ISSUER_URL` | No | OAuth issuer URL (defaults to Replit) |
| `PORT` | No | Server port (defaults to 5000) |
| `NODE_ENV` | No | Environment mode (development/production) |

### Database Setup

1. Ensure your PostgreSQL database is running and accessible

2. Push the database schema:
   ```bash
   npm run db:push
   ```

3. The database will be initialized with all required tables

## Development

Start the development server:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Vite dev server with HMR for the frontend
- Automatic TypeScript compilation

The application will be available at `http://localhost:5000`

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Type-check TypeScript without building |
| `npm run db:push` | Push database schema changes |

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the production server:
   ```bash
   npm run start
   ```

### Deployment Platforms

The application is optimized for deployment on:

- **Replit** - Built-in Replit authentication support
- **Vercel** - Edge-optimized deployment
- **Railway** - Full-stack deployment with PostgreSQL
- **Render** - Container-based deployment
- **Heroku** - Traditional PaaS deployment

## Project Structure

```
SoloAIStudio/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ai/          # AI-related components
│   │   │   ├── inspiration/ # Inspiration generator
│   │   │   └── ui/          # Base UI components (Radix UI)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and types
│   │   ├── pages/           # Application pages/routes
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
│
├── server/                   # Backend Express application
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── openai.ts           # OpenAI client setup
│   ├── gemini.ts           # Gemini AI client setup
│   ├── replitAuth.ts       # Replit authentication
│   ├── storage.ts          # File storage utilities
│   └── vite.ts             # Vite integration
│
├── shared/                  # Shared code between client/server
│   └── schema.ts           # Database schema (Drizzle ORM)
│
├── attached_assets/        # Static assets
├── drizzle.config.ts       # Drizzle ORM configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Key Features in Detail

### Dashboard

The main dashboard provides a comprehensive overview of your business:

- Real-time revenue charts and statistics
- Active projects and their progress
- Client status overview
- Quick access to all major features
- AI-powered insights and recommendations

### AI Tools Integration

SoloAIStudio integrates with multiple AI providers:

- **OpenAI**: GPT-4, GPT-3.5-turbo for advanced text generation
- **Google Gemini**: Alternative AI model for experimentation
- Track usage, costs, and performance metrics
- Compare different models side-by-side

### Prompt Library

Manage and organize your AI prompts:

- Version control for prompts
- Success rate tracking
- Usage analytics
- Category and tag organization
- Share prompts with team members
- Template system for common use cases

### AI Experimentation Lab

Test and optimize your AI interactions:

- A/B testing for prompt variations
- Multi-model comparison
- Performance metrics
- Result visualization
- Export experiment data

### Knowledge Graph

Visualize your business knowledge:

- Interactive graph visualization
- Entity relationships (clients, projects, concepts)
- Connection strength analysis
- Smart discovery of related entities
- Visual network exploration

### Content Pipeline

Automate your content workflow:

- Multi-stage pipeline creation
- Automated content generation
- Scheduled publishing
- Platform-specific optimization
- Performance tracking

### Email Intelligence

AI-powered email management:

- Automatic categorization (project requests, follow-ups, payments)
- Urgency detection (low, medium, high, critical)
- Sentiment analysis
- Action suggestions
- Draft auto-responses
- Data extraction from emails

### Task Management

Intelligent scheduling system:

- Priority-based task organization
- Energy level optimization
- Focus time detection
- Deadline tracking
- Project association
- Smart scheduling recommendations

## Security

### Best Practices Implemented

- **Environment Variables**: All sensitive data (API keys, database credentials) stored in environment variables
- **Session Security**: Secure session management with encrypted cookies
- **Authentication**: Replit OAuth integration with passport.js
- **Database**: Parameterized queries via Drizzle ORM prevent SQL injection
- **HTTPS**: Production deployment requires HTTPS
- **Input Validation**: Zod schema validation for all user inputs

### Security Audit Status

A comprehensive security audit was performed on **November 4, 2025**:

- ✅ **No exposed secrets or API keys** found in source code
- ✅ All sensitive configuration properly externalized
- ✅ Environment variable validation in place
- ✅ Secure authentication implementation
- ✅ Database credentials properly protected

### Recommended Security Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** regularly
3. **Use strong session secrets** (minimum 32 random characters)
4. **Enable 2FA** on all service accounts (OpenAI, database provider)
5. **Use managed secrets** in production (AWS Secrets Manager, Replit Secrets)
6. **Monitor API usage** for unusual patterns
7. **Keep dependencies updated** regularly

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write descriptive commit messages
- Add tests for new features
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Resources

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/SoloAIStudio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SoloAIStudio/discussions)

## Acknowledgments

- Built with [Replit](https://replit.com)
- AI powered by [OpenAI](https://openai.com) and [Google Gemini](https://deepmind.google/technologies/gemini/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Database hosting on [Neon](https://neon.tech)

---

**Made with ❤️ for Solopreneurs**
