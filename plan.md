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
- [x] First version replaced budgets with fixed payments feature
- [x] Build fixed payments REST API
- [x] Build fixed payments frontend page
- [x] Verify current frontend/backend build checks
- [x] Add Vitest unit tests
- [x] Add Supertest API tests
- [x] Add GitHub Actions CI
- [x] Set up Supabase production database
- [x] Set up Netlify for Web hosting
- [x] Set up Render for API Hosting
- [x] Add platform auto-deployment through hosted services
- [x] Write final README notes
- [x] Add Rate limiting using Redis
- [x] Add Token expiry handling on the frontend

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

- REST resources for users, accounts, categories, transactions, fixed payments, budgets, budget summaries, and reports
- Request validation
- Error handling
- Authentication with JWT
- Protected routes
- User-owned data
- Pagination, filtering, and sorting
- CORS configuration
- Environment variables
- Database migrations
- Future bank import and category rule workflows

## Frontend Concepts

- Page-based routing
- Authenticated and unauthenticated views
- Basic localStorage-based auth state
- React Context API for shared auth state
- Protected route handling
- Logout flow
- Token expiry handling
- Forms for transactions, categories, fixed payments, budgets, and account setup
- Loading, error, and empty states
- Dashboard summaries
- Budget summaries and spending progress indicators
- Filtering by month, category, account, and transaction type
- Sorting by date, amount, and category

## Testing

- Unit tests with Vitest
- API endpoint tests with Supertest
- Optional browser tests later with Playwright

Vitest is commonly paired with Vite, but it is not only for Vite projects. It can test backend TypeScript too. Supertest will be used to test Express API endpoints without needing to manually click through the frontend.

## Docker

Use Docker Compose to run local infrastructure services:

- PostgreSQL database
- Redis cache

For the current project phase, the frontend and backend can still run locally with npm scripts. Docker Compose is mainly used for services the app depends on. Dockerizing the frontend and backend can be added later if container deployment becomes part of the learning goal.

## Deployment Direction

Production-style deployment:

- Host the React client with Netlify
- Host the Express API with Render
- Host production PostgreSQL with Supabase
- Use GitHub Actions for automated tests before deployment
- Hosted services can auto-deploy from the GitHub repository
- Optionally use GitHub Actions later for custom deployment workflows
- Use environment variables and hosted secrets for production configuration

## CI/CD Direction

- Use GitHub Actions instead of Azure DevOps for this project
- CI should run automatically on pull requests and pushes
- CI should check formatting/linting, TypeScript, Vitest, and Supertest
- Platform auto-deployment is handled by Netlify and Render
- Custom CD with GitHub Actions can be added later after the app is stable
- Deployment targets are Netlify, Render, and Supabase PostgreSQL

## First Version Scope

- Register, login, and logout
- Add, edit, delete, and list transactions
- Create categories
- View monthly income, expenses, and remaining balance
- Add, edit, delete, and list fixed monthly income/outgoings
- Calculate expected monthly remaining balance after fixed payments
- Filter and sort transactions
- Protect user data behind authentication

## Next Phase Scope

- Reintroduce budgets as monthly category limits.
- Add budget database models and migrations.
- Add budget REST endpoints for create, read, update, and delete.
- Add a budget summary endpoint that compares budget amount against actual transaction spending for the selected month.
- Build a frontend budgets page with create/edit/delete forms.
- Show spent amount, remaining amount, percentage used, and over-budget state.
- Add dashboard budget summary cards after the core budget page works.
- Keep fixed payments as forecasting data, not as the source of truth for actual spending.
- Later, use fixed payments to suggest budget amounts and to match expected payments against bank-imported transactions.

## Product Decisions And Challenges

- The project direction is now to separate planned money, actual money, and spending limits clearly.
- Fixed payments should represent forecasted recurring income and outgoings, such as salary, rent, bills, subscriptions, savings, and other predictable commitments.
- Transactions should represent actual money movement. Manual transactions are useful for learning CRUD and app state, but bank-imported transactions should eventually become the main source of truth for actual income and spending.
- Budgets should return as a core planning feature. A budget is a planned monthly cap or target, usually attached to a category.
- Categories should connect fixed payments, transactions, and budgets so the app can compare expected spending, actual spending, and planned limits.
- Fixed payments should help forecast the month and suggest budgets, but they should not replace budgets.
- Bank integration should not make fixed payments redundant. Fixed payments can later be matched against imported bank transactions to confirm whether expected payments actually happened.

## New Product Direction

The application should move toward three connected concepts:

- Fixed payments: forecasted recurring income and outgoings.
- Transactions: actual income and outgoings.
- Budgets: planned monthly category limits or targets.

The basic budget calculation should be:

```txt
remaining budget = monthly budget amount - actual expense transactions for that category and month
```

Example:

```txt
Groceries budget for June: GBP 300
Actual grocery transactions in June: GBP 185
Remaining grocery budget: GBP 115
```

Budgets should not store the remaining amount directly. The app should calculate remaining budget from the budget amount and the matching transactions. This keeps the budget accurate when transactions are added, edited, deleted, or imported from a bank API.

Budget displays should focus first on clear progress indicators:

- Amount spent
- Amount remaining
- Percentage used
- Over-budget warning

Charts can be added later. Progress bars are likely clearer than pie charts for individual budgets, while pie charts are better for showing category spending breakdowns.

## Budget Planning Direction

- Add monthly category budgets.
- Add a backend budget summary endpoint that returns budget amount, spent amount, remaining amount, percentage used, and over-budget status.
- Let users copy budgets from the previous month.
- Later, add budget templates so default monthly budgets can be generated automatically.
- Later, suggest budget amounts from fixed payments and recent transaction history.
- Use month length only for pacing insights, not for the total budget amount. For example, a GBP 300 monthly groceries budget can stay GBP 300 in both 30-day and 31-day months, but the daily pace will be different.

## Fixed Payments Direction

- Keep fixed payments as expected recurring income/outgoings.
- Do not remove the scheduling concept entirely. The app still needs to know when a fixed payment is expected.
- Consider replacing a simple due date with clearer recurring schedule fields later, such as frequency, day of month, start date, and optional end date.
- Use fixed payments for forecasting monthly cash flow.
- Later, use fixed payments to create projected transactions or expected payment entries.
- When bank imports exist, match projected fixed payments against actual imported transactions instead of counting both separately.

## Bank Integration Direction

- Bank-imported transactions should eventually become the main source of truth for actual money movement.
- Imported transactions should be automatically categorised where possible.
- Categorisation should use user rules first, then merchant matching, bank-provided category data, keyword matching, and recurring fixed payment matching.
- If the app is unsure, imported transactions should be marked as uncategorised and corrected by the user.
- User corrections should create or improve future categorisation rules.
- The app should track whether a category was chosen manually, matched from a rule, suggested by bank data, or inferred from a recurring payment.

## Stretch Goals

- Dashboard charts and pie graphs
- Dashboard quick links to core sections
- Profile menu or modal
- User settings page
- Profile picture support
- AI-assisted spending insights
- AI budget suggestions
- Monthly budget planning
- Monthly budget templates
- Automatic transaction categorisation rules
- Fixed payment and bank transaction matching
- Bank-imported transactions
- Projected transaction generation from fixed payments
- CSV import/export
- Spending charts
- Savings goals
- Multiple accounts
- Refresh tokens 
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
