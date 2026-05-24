# StrategyOS Architecture & Design Document

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                         │
│  (React/TypeScript, Vite, Tailwind CSS, Framer Motion)     │
│  - Landing Page                                             │
│  - Analysis Input Form                                      │
│  - 9-Section Report Display                                │
│  - Dashboard & Engagement Tracking                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   REST API SERVER                           │
│        (Node.js/Express, TypeScript)                        │
│  /api/analysis/generate                                     │
│  /api/analysis/:id                                          │
│  /api/templates                                             │
│  /api/export/pdf                                            │
│  /api/execution/track                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                    Node.js IPC
                         │
┌────────────────────────▼────────────────────────────────────┐
│            CONSULTING ENGINE (Core Logic)                   │
│         (TypeScript Business Logic, No Framework)           │
│  ├─ ConsultingEngine Class                                  │
│  ├─ 9-Component Analysis Pipeline                           │
│  ├─ Type Definitions                                        │
│  └─ Analysis Framework                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                      CRUD
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    DATABASE                                 │
│              (PostgreSQL + Prisma ORM)                      │
│  - Engagements                                              │
│  - Analyses (JSONB)                                         │
│  - Execution Tracking                                       │
│  - Clients                                                  │
└─────────────────────────────────────────────────────────────┘
```

## Core Engine Design

The consulting engine is the heart of StrategyOS. It orchestrates a **9-component analysis pipeline**:

### Pipeline Flow

```typescript
async generateAnalysis(): Promise<ConsultingAnalysis> {
  const diagnosis = await this.diagnoseProblem();           // Step 1
  const structure = await this.structureProblem(diagnosis); // Step 2
  const deepDive = await this.conductDeepDive(structure);   // Step 3
  const rootCauses = await this.identifyRootCauses(deepDive); // Step 4
  const options = await this.developStrategicOptions(rootCauses); // Step 5
  const recommendation = await this.formulateRecommendation(options); // Step 6
  const execution = await this.createExecutionPlan(recommendation); // Step 7
  const kpis = await this.designKPISystem(execution);       // Step 8
  const risks = await this.assessRisks(execution);          // Step 9

  return { 
    diagnosis, structure, deepDive, rootCauses, options,
    recommendation, execution, kpis, risks 
  };
}
```

## Type System

Every component is strongly typed:

```typescript
interface BusinessProblem {
  title: string;
  description: string;
  context: string;
  industry: string;
  companySize: 'startup' | 'scale-up' | 'mid-market' | 'enterprise';
  firmStyle: 'mckinsey' | 'bcg' | 'bain' | 'accenture';
  timeframe: string;
}

interface ConsultingAnalysis {
  problemDiagnosis: ProblemDiagnosis;
  problemStructuring: ProblemStructuring;
  deepDiveAnalysis: DeepDiveAnalysis;
  rootCauseAnalysis: RootCauseAnalysis;
  strategicOptions: StrategicOption[];
  finalRecommendation: FinalRecommendation;
  executionPlan: ExecutionPlan;
  kpiTrackingSystem: KPITrackingSystem;
  risksAndMitigation: RiskMitigation[];
}
```

## Backend API Design

### Express Server Structure

```typescript
// Middleware
- Request logging
- CORS
- JSON parsing
- Error handling

// Routes
/api/analysis/generate    (POST)
/api/analysis/:id         (GET)
/api/templates            (GET)
/api/export/pdf          (POST)
/api/execution/track     (POST)
/api/health              (GET)

// Error Handling
- 400: Bad Request
- 404: Not Found
- 500: Server Error
```

## Frontend Component Architecture

### Component Hierarchy

```
App/
├── Navigation
├── Pages/
│   ├── LandingPage
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── CTA Section
│   ├── AnalysisPage
│   │   ├── AnalysisForm
│   │   └── AnalysisReport
│   ├── DashboardPage
│   │   ├── Metrics Cards
│   │   ├── Search Bar
│   │   └── Engagements Table
│   └── EngagementPage
│       ├── Execution Progress Chart
│       ├── KPI Performance Chart
│       └── Phase Status Cards
└── Toaster (notifications)
```

### Key Components

**AnalysisForm.tsx** (180 lines)
- Title, description, context input
- Industry, company size, firm style selection
- Form validation
- API integration

**AnalysisReport.tsx** (200 lines)
- 9-section display
- Collapsible sections with icons
- Color-coded headers
- Export actions

**Navigation.tsx** (50 lines)
- Logo and branding
- Navigation links
- Sign-in button
- Gradient effects

## Database Schema

### Engagements Table
```sql
CREATE TABLE engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

### Analyses Table
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID UNIQUE NOT NULL,
  problem_diagnosis JSONB NOT NULL,
  problem_structuring JSONB NOT NULL,
  deep_dive_analysis JSONB NOT NULL,
  root_cause_analysis JSONB NOT NULL,
  strategic_options JSONB NOT NULL,
  final_recommendation JSONB NOT NULL,
  execution_plan JSONB NOT NULL,
  kpi_tracking_system JSONB NOT NULL,
  risks_and_mitigation JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (engagement_id) REFERENCES engagements(id)
);
```

### Execution Tracking Table
```sql
CREATE TABLE execution_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  phase VARCHAR(50),
  metric VARCHAR(255),
  value FLOAT NOT NULL,
  target FLOAT NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (engagement_id) REFERENCES engagements(id)
);
```

## Data Flow

### 1. Input Flow
```
User Input → Form Validation → API Request → Backend Receives
```

### 2. Processing Flow
```
Backend → Consulting Engine → Analysis Pipeline → 9 Components Generated
```

### 3. Output Flow
```
Generated Analysis → API Response → Frontend Receives → Renders Report
```

### 4. Storage Flow
```
Analysis → Database Storage → Queryable by ID → Retrieved for Dashboard
```

## API Response Pattern

```json
{
  "success": boolean,
  "analysisId": "uuid",
  "analysis": {
    "problemDiagnosis": { ... },
    "problemStructuring": { ... },
    // ... all 9 components
  },
  "generatedAt": "ISO 8601 timestamp",
  "error": "error message if success=false"
}
```

## State Management (Frontend)

Uses **Zustand** for simple state:

```typescript
const useAnalysisStore = create((set) => ({
  analysis: null,
  setAnalysis: (data) => set({ analysis: data }),
  clearAnalysis: () => set({ analysis: null }),
}));
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Recharts bundled separately
   - Motion library lazy loaded
   - Routes code-split with React Router

2. **Caching**
   - Browser cache for static assets
   - API response caching at 5 minutes
   - Database query optimization with indexes

3. **Database**
   - Indexes on `engagement_id`, `client_id`
   - JSONB columns for flexible schema
   - Connection pooling with PgBouncer

4. **API**
   - Request compression with gzip
   - Response pagination for tables
   - Rate limiting per user

## Security Architecture

### Authentication
- JWT tokens for API
- Token refresh mechanism
- Session management

### Authorization
- Role-based access control (RBAC)
- Client isolation
- Data encryption at rest

### Input Validation
- Server-side validation
- Input sanitization
- SQL injection prevention (Prisma)

### API Security
- CORS configured per environment
- HTTPS required in production
- Rate limiting
- DDoS protection

## Deployment Architecture

### Development
```
laptop → npm run dev → http://localhost:3000
                    → http://localhost:3001
```

### Production (Docker)
```
Docker Image → Container Registry → K8s Cluster → Load Balancer
     ↓                                    ↓
Backend Service                    Frontend Service
  Port 3001                          Port 80/443
```

### Database
```
PostgreSQL Replica Set
  ├─ Primary (writes)
  ├─ Replica 1 (read)
  └─ Replica 2 (read)
  
Connection Pool: 20 connections per app instance
```

## Monitoring & Observability

### Logging
```
- Request logs with request ID
- Error logs with stack traces
- Performance logs for timing
```

### Metrics
```
- API response time (p50, p95, p99)
- Analysis generation time
- Database query time
- Frontend page load time
```

### Alerting
```
- High error rate (> 1%)
- Slow API response (> 5s)
- Database connection issues
- Server downtime
```

## Scaling Strategy

### Horizontal Scaling
- Stateless backend instances
- Load balancer (nginx/HAProxy)
- Multiple analysis engines

### Vertical Scaling
- Increase database resources
- Cache layer (Redis)
- CDN for static files

### Database Scaling
- Read replicas
- Sharding by client ID
- Archive old analyses

---

This architecture is designed to:
- ✅ Scale to millions of analyses
- ✅ Support real-time collaboration
- ✅ Maintain strict data isolation
- ✅ Enable rapid iteration
- ✅ Provide enterprise-grade reliability
