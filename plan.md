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
- [x] Add password hashing
- [x] Create users with Prisma during registration
- [x] Build login credential checking
- [x] Add JWT authentication
- [x] Add protected route middleware
- [x] Build category REST API
- [x] Configure Postman for local testing
- [x] Build transaction REST API
- [x] Add pagination, filtering, and sorting
- [x] Add first name to user registration and login responses
- [x] Build frontend login form
- [x] Build frontend register form
- [x] Add basic dashboard route protection with localStorage token check
- [x] Add basic logout from dashboard
- [x] Add React Context API auth state
- [x] Wrap app with AuthProvider
- [x] Build frontend pages and forms for the current scope
- [x] Add reusable protected route handling
- [x] Add current-user validation endpoint
- [x] Replace budgets with fixed payments feature
- [x] Build fixed payments REST API
- [x] Build fixed payments frontend page
- [x] Verify current frontend/backend build checks
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

- REST resources for users, accounts, categories, transactions, fixed payments, and reports
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
- Basic localStorage-based auth state
- React Context API for shared auth state
- Protected route handling
- Logout flow
- Token expiry handling
- Forms for transactions, categories, fixed payments, and account setup
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
- Add, edit, delete, and list fixed monthly income/outgoings
- Calculate expected monthly remaining balance after fixed payments
- Filter and sort transactions
- Protect user data behind authentication

## Product Decisions And Challenges

- Replaced the original budgets idea with fixed payments because the first version needed a more immediately useful personal feature.
- Manual transactions are useful for practising CRUD, protected routes, filtering, sorting, and pagination, but they are less practical as a daily-use feature without future bank integration.
- Fixed payments better match the main personal use case: tracking predictable monthly income and committed outgoings such as salary, rent, subscriptions, bills, and savings.
- Monthly budget planning remains a future feature because it needs a more detailed product design around category limits, time periods, reports, and alerts.

## Stretch Goals

- Dashboard charts and pie graphs
- Dashboard quick links to core sections
- Profile menu or modal
- User settings page
- Profile picture support
- AI-assisted spending insights
- AI budget suggestions
- Monthly budget planning
- Bank-imported transactions
- Recurring transaction generation from fixed payments
- CSV import/export
- Spending charts
- Savings goals
- Multiple accounts
- Refresh tokens 
- Rate limiting on auth routes
- OpenAPI documentation
- Token expiry handling on the frontend

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
