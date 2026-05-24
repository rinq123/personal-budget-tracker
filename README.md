# Personal Budget Tracker

A full-stack personal finance application built to learn and practise modern full-stack development while creating something useful for personal budgeting.

The app lets users register, log in, manage categories, track transactions, and track fixed monthly income and outgoings such as salary, rent, subscriptions, bills, and savings.

## Project Goals

The main goals of this project are:

- Build a working full-stack application from scratch
- Practise React, TypeScript, Express, Node.js, REST APIs, PostgreSQL, Prisma, Docker, testing, CI, and deployment
- Understand how frontend, backend, authentication, database, and hosting connect together
- Create a personal budgeting tool that can be extended with more finance features over time

## Current Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Protected frontend pages
- Shared frontend auth state with React Context
- Category CRUD
- Transaction CRUD
- Transaction pagination, filtering, and sorting
- Fixed monthly income/outgoing tracking
- Monthly fixed payment summary
- Dashboard with navigation to core sections
- Request validation with Zod
- PostgreSQL database with Prisma ORM
- Prisma migrations
- Local PostgreSQL through Docker Compose
- API tests with Vitest and Supertest
- GitHub Actions CI
- Production-style deployment using Netlify, Render, and Supabase

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Zod
- bcrypt
- JSON Web Tokens
- CORS

### Database

- PostgreSQL
- Prisma ORM
- Supabase PostgreSQL for production
- Docker Compose PostgreSQL for local development

### Tooling And Deployment

- npm
- Git and GitHub
- GitHub Actions
- Docker and Docker Compose
- Netlify for frontend hosting
- Render for API hosting

## Architecture

```text
Netlify React frontend
        |
        v
Render Express API
        |
        v
Supabase PostgreSQL
```

The project is split into two applications:

- `apps/web`: React frontend
- `apps/api`: Express backend API

The frontend handles user-facing pages, routing, forms, auth state, and UI updates.

The backend handles REST API routes, request validation, authentication, business logic, and database access.

The database stores persistent user-owned data such as users, categories, transactions, and fixed payments.

## Request Flow

Example protected request flow:

1. User logs in from the React frontend.
2. Frontend sends email and password to the Express API.
3. API validates the request body with Zod.
4. API checks the password against the stored bcrypt hash.
5. API returns a JWT and safe user details.
6. Frontend stores the auth state.
7. Frontend sends the JWT in the `Authorization` header for protected requests.
8. Auth middleware verifies the JWT and attaches `userId` to the request.
9. Route handlers use `userId` when querying Prisma.
10. Prisma reads or writes user-owned records in PostgreSQL.
11. API returns JSON to the frontend.
12. Frontend updates the UI.

## Project Structure

```text
personal-budget-tracker/
  apps/
    api/
      prisma/
        migrations/
        schema.prisma
      src/
        lib/
        middleware/
        routes/
        schemas/
        types/
        app.ts
        server.ts
      package.json
      tsconfig.json
    web/
      public/
      src/
        context/
        lib/
        pages/
        routes/
        App.tsx
        main.tsx
        styles.css
      package.json
      vite.config.ts
  .github/
    workflows/
      ci.yml
  docker-compose.yml
  README.md
```

## Main API Routes

### Health

- `GET /`
- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Categories

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Transactions

- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

The transaction list supports query parameters for pagination, filtering, and sorting.

### Fixed Payments

- `GET /fixed-payments`
- `POST /fixed-payments`
- `PUT /fixed-payments/:id`
- `DELETE /fixed-payments/:id`

## Database Models

The current Prisma schema includes:

- `User`
- `Category`
- `Transaction`
- `FixedPayment`

The app is designed around user-owned records. Categories, transactions, and fixed payments all belong to a user.

## Local Development

### Prerequisites

- Node.js
- npm
- Git
- Docker Desktop

### 1. Clone The Repository

```powershell
git clone <repository-url>
cd personal-budget-tracker
```

### 2. Start Local PostgreSQL

From the project root:

```powershell
docker compose up -d
```

This starts a local PostgreSQL database using the settings in `docker-compose.yml`.

### 3. Configure API Environment Variables

Create:

```text
apps/api/.env
```

Use this template:

```text
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://budget_user:budget_password@localhost:5432/budget_tracker?schema=public"
JWT_SECRET=example
JWT_EXPIRES_IN=1h
```

Do not commit `.env` files.

### 4. Install And Run The API

```powershell
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API should run on:

```text
http://localhost:4000
```

Test the health endpoint:

```text
http://localhost:4000/health
```

Expected response:

```json
{ "status": "ok" }
```

### 5. Configure Frontend Environment Variables

Create:

```text
apps/web/.env
```

Use this template:

```text
VITE_API_URL=http://localhost:4000
```

Vite only exposes frontend environment variables that start with `VITE_`.

### 6. Install And Run The Frontend

In a separate terminal:

```powershell
cd apps/web
npm install
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

## Useful Commands

### API

```powershell
cd apps/api
```

Run development server:

```powershell
npm run dev
```

Generate Prisma client:

```powershell
npx prisma generate
```

Apply local migrations:

```powershell
npx prisma migrate dev
```

Check migration status:

```powershell
npx prisma migrate status
```

Open Prisma Studio:

```powershell
npx prisma studio
```

Typecheck:

```powershell
npm run typecheck
```

Run tests:

```powershell
npm test
```

Build production output:

```powershell
npm run build
```

Start compiled API:

```powershell
npm start
```

### Web

```powershell
cd apps/web
```

Run development server:

```powershell
npm run dev
```

Build frontend:

```powershell
npm run build
```

Preview production build:

```powershell
npm run preview
```

## Testing

The API uses:

- Vitest as the test runner
- Supertest for testing Express endpoints

Current tests cover:

- Health endpoint
- Root endpoint
- Protected route rejection without a token
- Invalid register input validation

These tests are focused smoke/integration tests. They prove that important API wiring works, but they are not intended to be complete test coverage yet.

Run API tests:

```powershell
cd apps/api
npm test
```

## Continuous Integration

GitHub Actions runs checks on pushes and pull requests.

The CI pipeline currently:

- Installs API dependencies
- Generates the Prisma client
- Typechecks the API
- Runs API tests
- Installs frontend dependencies
- Builds the frontend

The workflow file is:

```text
.github/workflows/ci.yml
```

## Deployment

The current deployment approach is:

- Frontend: Netlify
- API: Render
- Database: Supabase PostgreSQL

### Frontend Deployment

The frontend is deployed as a Vite static build.

Netlify build settings:

```text
Base directory: apps/web
Build command: npm run build
Publish directory: dist
```

The frontend needs this Netlify environment variable:

```text
VITE_API_URL=<deployed-api-url>
```

The frontend also includes:

```text
apps/web/public/_redirects
```

This supports React Router routes on Netlify by serving `index.html` for frontend routes.

### API Deployment

The API is deployed as a Render web service.

Render settings:

```text
Root directory: apps/api
Build command: npm ci --include=dev && npx prisma generate && npm run build
Start command: npm start
Health check path: /health
```

Render environment variables:

```text
DATABASE_URL=<supabase-postgres-url>
JWT_SECRET=<production-secret>
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=<netlify-frontend-url>
NODE_ENV=production
```

### Database Deployment

Supabase hosts the production PostgreSQL database.

Prisma migrations are used to manage schema changes.

For production migration deployment:

```powershell
cd apps/api
npx prisma migrate deploy
```

## Docker

Docker Compose is used locally for PostgreSQL:

```powershell
docker compose up -d
```

The API also has Docker deployment preparation, including a Dockerfile and `.dockerignore`, so the API can be run as a container if needed.

Example local image build:

```powershell
docker build -t personal-budget-api ./apps/api
```

## Security Notes

Current security measures:

- Passwords are hashed with bcrypt
- JWTs are used for protected API access
- Protected routes require an Authorization header
- API routes check user ownership through `userId`
- CORS restricts browser access to the configured frontend origin
- Secrets are stored in environment variables

Future security improvements:

- Refresh tokens
- httpOnly cookie-based auth
- Frontend token expiry handling
- Rate limiting on auth routes
- Stronger production logging and error handling

## Product Decisions

The first version originally considered a traditional budgets feature. This was replaced with fixed payments because fixed recurring income and outgoings were more useful for the first working version.

Fixed payments cover predictable monthly items such as:

- salary
- rent
- subscriptions
- bills
- savings

Monthly budget planning remains a future feature because it needs a more detailed design around time periods, category limits, reporting, and alerts.

## Current Limitations

- Transactions are manually entered
- No bank API integration yet
- No refresh token flow yet
- No advanced dashboard charts yet
- Limited automated test coverage
- No OpenAPI documentation yet

## Future Features

- Dashboard charts
- Spending summaries
- Monthly budget planning
- Savings goals
- Recurring transaction generation from fixed payments
- Bank-imported transactions
- CSV import/export
- Multiple accounts
- Profile/settings page
- AI-assisted finance insights
- OpenAPI documentation
- More complete API and frontend tests

## Learning Outcomes

This project is being used to practise:

- Full-stack project structure
- React and TypeScript
- Express REST API design
- Authentication and protected routes
- Request validation
- Relational database modelling
- Prisma schema design and migrations
- Docker-based local development
- Environment variable configuration
- Frontend/backend integration
- Automated tests
- CI with GitHub Actions
- Deployment across separate frontend, API, and database services

