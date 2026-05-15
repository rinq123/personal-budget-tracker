# Personal Budget Tracker Plan

## Goal

Build a full-stack personal budget tracker using React, CSS, TypeScript, Express, Node/npm, REST APIs, Docker, and a relational database.

The project should be useful enough to keep using personally, while staying small enough to finish a working version.

Working project name: personal-budget-tracker

## Project Rule

Use this project to learn by building. When stuck, ask for explanation, debugging guidance, design tradeoffs, or documentation-style help rather than finished project code.

## Project Checklist

- [x] Create project plan
- [x] Create project resources document
- [x] Confirm Node.js and npm are installed
- [x] Confirm Git is installed
- [x] Confirm Docker Desktop is installed
- [x] Confirm GitHub account and repository setup
- [x] Decide final project name
- [x] Scaffold React frontend with TypeScript
- [x] Add React Router
- [x] Scaffold Express backend with TypeScript
- [x] Add local PostgreSQL with Docker Compose
- [x] Add Prisma
- [x] Design first database schema
- [x] Add environment variable setup
- [x] Add CORS configuration
- [x] Add request validation
- [ ] Add password hashing
- [ ] Create users with Prisma during registration
- [ ] Build login credential checking
- [ ] Add JWT authentication
- [ ] Add protected route middleware
- [ ] Build transaction REST API
- [ ] Build category REST API
- [ ] Add pagination, filtering, and sorting
- [ ] Build frontend pages and forms
- [ ] Add Vitest unit tests
- [ ] Add Supertest API tests
- [ ] Add GitHub Actions CI
- [ ] Set up Supabase production database
- [ ] Set up Azure Static Web Apps frontend hosting
- [ ] Set up Azure Container Apps API hosting
- [ ] Add deployment automation
- [ ] Write final README notes

## Core Stack

- Frontend: React, TypeScript, CSS
- Routing: React Router
- Backend: Express, Node.js, TypeScript
- API style: REST
- Database: PostgreSQL
- Database toolkit: Prisma
- Local environment: Docker Compose
- Package management: npm
- Version control: Git and GitHub
- Continuous integration: GitHub Actions

## Version Control And CI

- Use Git locally for commits and branching
- Use GitHub as the remote repository
- Use pull requests or feature branches for larger changes
- Run automated checks with GitHub Actions
- CI should run linting, type checks, Vitest unit tests, and Supertest API tests
- Keep environment secrets out of GitHub source code

## Backend Concepts

- REST resources for users, accounts, categories, transactions, budgets, and reports
- Request validation
- Error handling
- Authentication with JWT
- Protected routes
- User-owned data
- Pagination, filtering, and sorting
- CORS configuration
- Environment variables
- Database migrations

## Frontend Concepts

- Page-based routing
- Authenticated and unauthenticated views
- Forms for transactions, categories, budgets, and account setup
- Loading, error, and empty states
- Dashboard summaries
- Filtering by month, category, account, and transaction type
- Sorting by date, amount, and category

## Testing

- Unit tests with Vitest
- API endpoint tests with Supertest
- Optional browser tests later with Playwright

Vitest is commonly paired with Vite, but it is not only for Vite projects. It can test backend TypeScript too. Supertest will be used to test Express API endpoints without needing to manually click through the frontend.

## Docker

Use Docker Compose to run the app locally as multiple services:

- Frontend
- Backend API
- Database

This should teach service boundaries, environment configuration, networking between containers, and reproducible local setup.

## Deployment Direction

Production-style deployment:

- Host the React client with Azure Static Web Apps
- Host the Express API with Azure Container Apps
- Host production PostgreSQL with Supabase
- Use GitHub Actions for automated tests before deployment
- Optionally use GitHub Actions later for deployment automation
- Use environment variables and hosted secrets for production configuration

## CI/CD Direction

- Use GitHub Actions instead of Azure DevOps for this project
- CI should run automatically on pull requests and pushes
- CI should check formatting/linting, TypeScript, Vitest, and Supertest
- CD can be added later after the app is stable
- Deployment targets are Azure Static Web Apps, Azure Container Apps, and Supabase PostgreSQL

## First Version Scope

- Register, login, and logout
- Add, edit, delete, and list transactions
- Create categories
- View monthly income, expenses, and remaining balance
- Set monthly category budgets
- Filter and sort transactions
- Protect user data behind authentication

## Stretch Goals

- Recurring transactions
- CSV import/export
- Spending charts
- Savings goals
- Multiple accounts
- Refresh tokens
- Rate limiting on auth routes
- OpenAPI documentation

## Database Choice

Use PostgreSQL with Prisma.

This should be compared against previous experience with MongoDB and Firebase:

- Data modeling
- Relationships
- Querying
- Migrations
- Local development
- Deployment
- Personal project value
