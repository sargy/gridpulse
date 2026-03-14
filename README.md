# GridPulse

A motorsport calendar web app featuring a 3D interactive globe, live countdown timers, and race schedules across multiple racing series.

## Features

- **8 Racing Series** — F1, F2, F3, F1 Academy, Formula E, IndyCar, WEC, WRC
- **3D Globe** — Interactive Three.js globe with race location markers
- **Countdown Timers** — Live countdowns to the next race in each series
- **Multi-language** — Internationalized in 7 languages (EN, FR, ES, DE, PL, JA, KO)
- **News Feeds** — Aggregated RSS news from motorsport sources
- **Dark Theme** — Full dark mode UI with series-specific accent colors
- **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 19, TypeScript, Three.js (react-three-fiber), Vite |
| Backend  | Spring Boot 3.4.8, Java 21, MongoDB Driver    |
| Database | MongoDB 7                                     |
| CI/CD    | GitHub Actions (lint, test, build, security scanning) |
| Deploy   | Railway (Docker containers)                   |

## Project Structure

```
gridpulse/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/   # Globe, Header, FilterBar, RaceList, Settings
│   │   ├── context/      # React contexts (Race, Settings, Theme)
│   │   ├── hooks/        # Custom hooks (useCountdown, etc.)
│   │   ├── locales/      # i18n translation files
│   │   └── __tests__/    # Vitest test suites
│   ├── Dockerfile        # Multi-stage: node build → nginx
│   └── railway.toml
├── backend/           # Spring Boot REST API
│   ├── src/main/java/com/gridpulse/api/
│   │   ├── controller/   # REST endpoints (/api/races, /api/series, etc.)
│   │   ├── service/      # Business logic, RSS news aggregation
│   │   ├── repository/   # MongoDB repositories
│   │   └── seed/         # Startup data seeder
│   ├── Dockerfile        # Multi-stage: maven build → JRE alpine
│   └── railway.toml
├── .github/workflows/ # CI/CD pipelines
│   ├── ci.yml            # Lint, test, build, security scans (8 jobs)
│   └── deploy.yml        # Docker image build & push to GHCR
├── docker-compose.yml # Local development stack
└── railway-setup.md   # Railway deployment guide
```

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for frontend development)
- Java 21+ (for backend development)

### Quick Start with Docker Compose

```bash
docker compose up
```

This starts MongoDB, the backend API, and the frontend. Open http://localhost:3000.

### Individual Services

**Frontend** (hot reload):
```bash
cd frontend
npm install
npm run dev
```

**Backend**:
```bash
cd backend
mvn spring-boot:run
```

## API Endpoints

| Endpoint               | Description                    |
|------------------------|--------------------------------|
| `GET /api/races`       | All races for the current season |
| `GET /api/series`      | All racing series              |
| `GET /api/translations/{lang}` | Translation strings    |
| `GET /api/news`        | Aggregated motorsport news     |

## CI/CD

GitHub Actions runs **8 parallel jobs** on every push:

1. **Frontend** — ESLint + Vitest + Vite build
2. **Backend** — Maven compile + test
3. **npm audit** — Dependency vulnerability check
4. **OWASP Dependency-Check** — Java dependency CVE scan
5. **TruffleHog** — Secret detection in git history
6. **Trivy** — Container image vulnerability scan
7. **CodeQL** — Static analysis (JavaScript + Java)
8. **Docker** — Verify both images build successfully

## Deployment

Deployed to [Railway](https://railway.com) with 3 services (MongoDB, backend, frontend).

See [railway-setup.md](railway-setup.md) for full deployment configuration and recreation instructions.

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `SPRING_DATA_MONGODB_URI` | Backend | MongoDB connection string |
| `BACKEND_URL` | Frontend | Internal URL to backend service |
| `PORT` | Frontend | Port nginx listens on (80) |
