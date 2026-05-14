# Twofit

## Project Overview

Twofit is a full-stack application built as a monorepo with:
- `Backend/` — Express.js API server with MongoDB, Redis, authentication, file upload support, email, sockets, and cron jobs.
- `admindashboard/` — React + Vite admin dashboard with Redux, Tailwind, routing, charts, notifications, and Socket.IO client.
- `docker-compose.yml` — container orchestration for backend, frontend, and Redis.
- `.github/workflows/main.yml` — CI/CD pipeline that deploys to a remote server on `master` pushes.

## Architecture

The repository is designed as a Dockerized deployment stack:

- `backend`: Node.js/Express backend service.
- `frontend`: React admin dashboard built with Vite.
- `redis`: Redis caching/session service.

The services are wired together using `docker-compose.yml` and the backend depends on Redis.

## Repository Structure

- `Backend/`
  - `index.js` — backend entrypoint.
  - `routes/` — API route registration.
  - `modules/` — feature modules with controllers, services, models, and routes.
  - `utils/` — helper utilities for cron jobs, JWT, email, notifications, and more.
  - `middleware/` — authentication, authorization, upload, validation middleware.
  - `seeds/` — data seeding scripts such as `createAdmin.js`.
  - `uploads/` — mounted upload storage for file handling.

- `admindashboard/`
  - `src/` — React application source.
  - `src/components/` — UI components and page modules.
  - `src/pages/` — route pages and dashboard screens.
  - `src/lib/` and `src/utils/` — shared utilities.
  - `redux/` — Redux store, reducers, and feature slices.

- `.github/workflows/main.yml` — GitHub Actions pipeline for deployment.
- `docker-compose.yml` — local and production container definitions.

## Developer Setup

### Prerequisites

- Git
- Node.js (recommend Node 18+)
- npm
- Docker
- Docker Compose

### Clone the repository

```bash
git clone <repository-url>
cd twofit
```

### Environment files

Create `.env` files in both `Backend/` and `admindashboard/` if not already present.

Typical values to define in `Backend/.env` include:

- `PORT=5000`
- `MONGO_URI=<your-mongodb-connection-string>`
- `JWT_SECRET=<secret>`
- `REDIS_URL=redis://:newRedisPassword@redis:6379`
- `SENDGRID_API_KEY=<key>`
- `EMAIL_USER=<email>`
- `EMAIL_PASS=<password>`
- Any other custom variables used in the backend.

For `admindashboard/.env`, define any frontend environment variables required by the app.

### Install dependencies

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../admindashboard
npm install
```

## Running Locally

### Docker Compose (recommended)

From the repository root:

```bash
docker-compose up --build
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`
- Redis service with password from `Backend/.env`

To stop the services:

```bash
docker-compose down
```

### Running services individually

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd admindashboard
npm run dev
```

## Useful Backend Scripts

- `npm run dev` — start backend with `nodemon`.
- `npm run start` — start backend normally.
- `npm run seed:admin` — run the admin creation seed script.

## CI/CD Deployment

This project includes a GitHub Actions-based deployment workflow located at `.github/workflows/main.yml`.

### What it does

- Triggers on pushes to the `master` branch.
- Checks out the repository.
- Configures SSH using `webfactory/ssh-agent@v0.9.0`.
- Connects to the remote server using secrets:
  - `SERVER_SSH_KEY`
  - `SERVER_USER`
  - `SERVER_HOST`
  - `APP_PATH`
- Pulls the latest code on the remote server.
- Stops existing containers and removes unused Docker resources.
- Rebuilds containers with `docker-compose build --no-cache`.
- Starts the stack with `docker-compose up -d`.

### Required GitHub Secrets

- `SERVER_SSH_KEY`
- `SERVER_USER`
- `SERVER_HOST`
- `APP_PATH`

## Notes 

- The frontend is built with React, Vite, Tailwind, Redux Toolkit, and Socket.IO.
- The backend uses Express, Mongoose, Redis, JWT auth, file uploads, and cron jobs.
- `docker-compose.yml` mounts backend uploads and Redis data to local named volumes.
- The remote deployment pipeline is configured to rebuild containers on every deploy.

## Recommendations

- Keep `Backend/.env` and `admindashboard/.env` out of version control.
- Use feature branches and open pull requests for changes.
- Test backend and frontend locally before pushing to `master`.
- Review GitHub Actions logs if deployment fails.

## Contact

For questions about the codebase, ask the repository maintainer or lead developer.
