
# Personal Budget Tracker

A full-stack personal project to practice React, TypeScript, Express, PostgreSQL, Prisma, Docker Compose, RESTful APIs, validation, authentication, and deployment workflows.

## Project Status
This project is currently in development.

Implemented so far:

- React Frontent scaffolded with TypeScript and React Router
- Express API scaffolded with TypeScript
- ENV setup
- CORS configuration
- Prisma basic database schema and initial migration
- Local PostgreSQL Database using Docker Compose 
- Auth Route Placeholders
- Zod request validation for registration endpoint

## Tech stack

Frontend:

- React
- TypeScript
- React Router
- Vite
- CSS

Backend:

 - Node.js
 - Express
 - TypeScript
 - Zod
 - Prisma

Database:

 - PostgreSQL
 - Docker Compose

### Planned deployment

 - Azure Static Web Apps for Frontend
 - Azure Container Apps for API
 - Supabase PostgreSQL for production database
 - GitHub Actions for CI/CD implementation

## Project Structure

 - `/apps/web` contains React Frontend
 - `/apps/api` contains Express Backend
 - `docker-compose.yml` contains local PostgreSQL
 - `apps/api/prisma contains the database schema and migrations

 ## Architecture

The frontend and backend are separated into two separate apps.

The frontend handles user-facing pages such as login, register, dashboard, transactions, and budgets.

The backend handles the API routes, Zod validation, authentication, business logic, and database access.

The database stores user data, such as users, categories, transcations and budgets.

Basic Request Flow:

1. User interacts with the React frontend.
2. Frontend sends a request to the backend Express API
3. Backend API validates the request
4. Backend API reads or writes data to the database using Prisma
5. PostgreSQL stores any persistent data
6. API returns JSON and status to the Frontend

## Local development

Prerequisites:

 - Node.js and npm
 - Git
 - Docker Desktop

Start the local database from the project root directory:

```powershell
docker compose up -d
```

Install and run the API
```powershell
cd apps/api
npm install
npm run dev
```

Install and run the Frontend
```powershell
cd apps/web
npm install
npm run dev
```



## Environment Variables

The API uses environment variables for local configuration.

Create apps/api/.env based on apps/api/.env.example.

## Database

The local database runs in Docker using PostgreSQL.

Prisma is used to define the schema and manage migrations.

Useful commands
```powershell
npx prisma validate
npx prisma migrate status
npx prisma studio
```

## API routes

Current API routes :
 - GET /
 - GET /health
 - POST /auth/register
 - POST /auth/login


 ## Planned Features
- Password hashing
- User registration with Prisma
- Login credential checking
- JWT authentication
- Middleware for protecting routes
- Transaction CRUD
- Category CRUD
- Budget Tracking
- Pagination, Filters, and Sorting
- Unit and API tests
- GitHub Actions CI
- Azure/Supabase deployment

# What I Am Learning
This project is built to practise:

 - TypeScript implementation
 - Full-stack application Structure
 - Creating RESTful APIs
 - Validation and security measures to protect the API and database
 - relational database modelling
 - Docker-based local development
 - Prisma migrations
 - Authentication Flow
 - Frontend/Backend integration (React and Express/Node)
 - Deployment planning