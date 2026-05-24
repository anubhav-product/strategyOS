# StrategyOS — Setup & Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Configuration](#configuration)
6. [Development Workflow](#development-workflow)

---

## Prerequisites

### Required
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **PostgreSQL** 14.0 or higher
- **Git** 2.30 or higher
- **VS Code** or IDE of choice

### Optional
- **Docker** & **Docker Compose** (for containerized setup)
- **Postman** (for API testing)
- **pgAdmin** (for database management)

### Install Node.js
```bash
# macOS
brew install node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
```

### Install PostgreSQL
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install -y postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/anubhav-product/strategyOS.git
cd strategyOS
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install -w core
npm install -w backend
npm install -w frontend
```

### 3. Create Environment File

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Environment Configuration

Edit `.env`:

```env
# Backend
BACKEND_PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://strategyos_user:strategyos_pass@localhost:5432/strategyos_dev"
JWT_SECRET="dev-secret-key-change-in-production"

# Frontend
VITE_API_URL=http://localhost:3001
VITE_APP_NAME="StrategyOS"

# Optional: AI/LLM Keys
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
```

---

## Database Setup

### 1. Start PostgreSQL

```bash
# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql

# Windows
# Start from Services or Command Prompt
```

### 2. Create Database User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create user
CREATE USER strategyos_user WITH PASSWORD 'strategyos_pass';

# Create database
CREATE DATABASE strategyos_dev OWNER strategyos_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strategyos_dev TO strategyos_user;

# Exit
\q
```

### 3. Verify Connection

```bash
psql -U strategyos_user -d strategyos_dev -h localhost
```

### 4. Run Migrations (When Prisma is Configured)

```bash
# Generate Prisma client
npm run build -w core

# Run migrations
npx prisma migrate dev --name init

# Seed database (if seeds exist)
# npx prisma db seed
```

---

## Running the Application

### 1. Build Core Package

```bash
npm run build -w core
```

### 2. Start Development Servers

```bash
# Terminal 1 - Runs both backend and frontend
npm run dev
```

Or run servers separately:

```bash
# Terminal 1 - Backend (Port 3001)
npm run dev -w backend

# Terminal 2 - Frontend (Port 3000)
npm run dev -w frontend
```

### 3. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs (if Swagger enabled)

### 4. Test API (Using curl)

```bash
# Generate analysis
curl -X POST http://localhost:3001/api/analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Revenue Growth Strategy",
    "description": "How can we grow revenue by 20% this year?",
    "context": "SaaS company, $10M ARR",
    "industry": "Enterprise SaaS",
    "companySize": "mid-market",
    "firmStyle": "mckinsey",
    "timeframe": "12 months"
  }'

# Check health
curl http://localhost:3001/api/health

# Get templates
curl http://localhost:3001/api/templates
```

---

## Configuration

### Backend Configuration

**File**: `.env`

```env
# Server
BACKEND_PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/database"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRY="7d"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Logging
LOG_LEVEL="debug"
```

### Frontend Configuration

**File**: `.env` (used by Vite)

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME="StrategyOS"
VITE_ENABLE_ANALYTICS=false
```

### Database Configuration

**File**: `backend/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Development Workflow

### Project Structure

```
strategyOS/
├── core/                    # Business logic package
│   ├── src/
│   │   ├── engine.ts       # Main analysis engine
│   │   ├── types.ts        # Type definitions
│   │   └── index.ts        # Exports
│   └── package.json
├── backend/                 # Express API
│   ├── src/
│   │   ├── index.ts        # Server entry
│   │   ├── routes/         # API routes
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── App.tsx         # Main app
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── styles/         # CSS
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   └── package.json
├── packages/
│   └── shared/             # Shared utilities
├── .env.example
├── package.json            # Root workspace config
├── tsconfig.json          # TypeScript config
└── README.md
```

### Common Commands

```bash
# Development
npm run dev                 # Start all dev servers
npm run dev -w backend     # Start backend only
npm run dev -w frontend    # Start frontend only

# Building
npm run build              # Build all packages
npm run build -w core      # Build core only

# Code Quality
npm run lint               # Lint all code
npm run format             # Format code with prettier
npm test                   # Run tests

# Database
npx prisma studio         # Open Prisma admin UI
npx prisma migrate dev    # Create migration
npx prisma generate       # Generate Prisma client
```

### Adding Dependencies

```bash
# Add to core
npm install package-name -w core

# Add to backend
npm install package-name -w backend

# Add to frontend
npm install package-name -w frontend

# Add dev dependency
npm install --save-dev package-name -w backend
```

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `AnalysisForm.tsx`)
- Pages: `PascalCase.tsx` (e.g., `DashboardPage.tsx`)
- Utilities: `camelCase.ts` (e.g., `apiClient.ts`)
- Hooks: `useXxx.ts` (e.g., `useAnalysis.ts`)
- Types: `types.ts` or `interface.ts`

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

### Debugging

```bash
# Backend debugging
DEBUG=* npm run dev -w backend

# Frontend debugging (Chrome DevTools)
# Open http://localhost:3000
# Press F12 to open DevTools

# Node inspector
node --inspect dist/index.js
# Access at chrome://inspect
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
psql -U postgres

# Check connection string in .env
# Format: postgresql://user:password@host:port/database

# Test connection
psql -U strategyos_user -d strategyos_dev -h localhost
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Vite Development Server Issues

```bash
# Clear Vite cache
rm -rf .vite

# Restart development server
npm run dev -w frontend
```

---

## Docker Setup (Optional)

### 1. Build Docker Image

```bash
docker build -t strategyos-backend -f Dockerfile .
```

### 2. Run with Docker Compose

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Docker Compose File

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: strategyos_user
      POSTGRES_PASSWORD: strategyos_pass
      POSTGRES_DB: strategyos_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://strategyos_user:strategyos_pass@postgres:5432/strategyos_dev
      NODE_ENV: development
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

---

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Logging enabled
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Load balancer configured
- [ ] SSL certificates valid
- [ ] Rate limiting enabled
- [ ] CI/CD pipeline configured

---

## Getting Help

- **Documentation**: See [README.md](../README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
- **Issues**: Create issue on GitHub
- **Docker**: Use `docker-compose logs` for debugging
- **Database**: Use `psql` or pgAdmin for direct queries

---

## Next Steps

1. ✅ Complete Setup
2. 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md)
3. 🚀 Start with First Analysis page
4. 📚 Review [API Documentation](API.md)
5. 🤝 Check Contributing guidelines
