# ATK Monorepo

Monorepo for **An Thái Khang JSC** — three apps in one repo.

```
atk/
├── api/      # REST API — Fastify + Prisma + PostgreSQL
├── admin/    # Admin Dashboard — React 19 + Vite + TailwindCSS
├── web/      # Public Website — Next.js 16 + TailwindCSS
├── .gitignore
└── package.json
```

---

## Requirements

| Tool       | Version |
| ---------- | ------- |
| Node.js    | >= 20   |
| npm        | >= 10   |
| PostgreSQL | >= 14   |

---

## Getting Started

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment variables
cp api/.env.example api/.env
cp admin/.env.example admin/.env
cp web/.env.example web/.env

# 3. Set up the database
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed        # optional: seed sample data
```

---

## Development

```bash
npm run dev          # Run all three apps concurrently

npm run dev:api      # API only   → http://localhost:3000
npm run dev:admin    # Admin only → http://localhost:5173
npm run dev:web      # Web only   → http://localhost:8080
```

---

## Build

```bash
npm run build          # Build all

npm run build:api
npm run build:admin
npm run build:web
```

---

## Database (Prisma)

```bash
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate:dev   # Create and apply a new migration (dev)
npm run prisma:migrate       # Apply migrations (production)
npm run prisma:seed          # Seed sample data
npm run prisma:reset         # Reset database (drops all data)
npm run prisma:studio        # Open Prisma Studio GUI
```

---

## Environment Variables

### `api/.env`

| Variable                 | Required | Description                                                |
| ------------------------ | -------- | ---------------------------------------------------------- |
| `HOST`                   | ✓        | Server host (default `0.0.0.0`)                            |
| `PORT`                   | ✓        | Server port (default `3000`)                               |
| `NODE_ENV`               | ✓        | `development` / `test` / `production`                      |
| `LOG_LEVEL`              |          | Fastify log level (`info`, `debug`, `warn`)                |
| `ALLOWED_ORIGINS`        | ✓        | Comma-separated CORS origins                               |
| `DATABASE_URL`           | ✓        | PostgreSQL connection string                               |
| `SESSION_SECRET`         | ✓        | Secret key for signing sessions — use a long random string |
| `COOKIE_NAME`            |          | Session cookie name (default `sid`)                        |
| `COOKIE_MAX_AGE`         |          | Session lifetime in ms (default `1800000` = 30 min)        |
| `CLOUDINARY_URL`         | ✓        | Full Cloudinary URL (`cloudinary://key:secret@cloud`)      |
| `GA_PROPERTY_ID`         |          | Google Analytics property ID                               |
| `GOOGLE_SHEET_ID`        |          | Google Sheet ID for data export                            |
| `GOOGLE_SERVICE_ACCOUNT` |          | Service account JSON (stringified)                         |

### `admin/.env`

| Variable        | Required | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| `VITE_APP_NAME` |          | App display name                               |
| `VITE_NODE_ENV` | ✓        | `development` / `test` / `production`          |
| `VITE_API_URL`  | ✓        | API base URL, e.g. `http://localhost:3000/api` |

### `web/.env`

| Variable               | Required | Description                                      |
| ---------------------- | -------- | ------------------------------------------------ |
| `APP_NAME`             |          | Site display name                                |
| `NODE_ENV`             | ✓        | `development` / `test` / `production`            |
| `BASE_URL`             | ✓        | API base URL (server-side)                       |
| `NEXT_PUBLIC_BASE_URL` | ✓        | API base URL (client-side)                       |
| `NEXT_PUBLIC_SITE_URL` | ✓        | Public site URL                                  |
| `NEXT_PUBLIC_GA_ID`    |          | Google Analytics measurement ID (`G-XXXXXXXXXX`) |

---

## Tech Stack

| Layer     | Technology                                                 |
| --------- | ---------------------------------------------------------- |
| API       | Fastify, Prisma, Zod, bcrypt, Cloudinary, @fastify/session |
| Admin     | React 19, Vite, TailwindCSS v4, TipTap, shadcn/ui, SWR     |
| Web       | Next.js 16, TailwindCSS v4, Framer Motion, Swiper          |
| Database  | PostgreSQL                                                 |
| Analytics | Google Analytics Data API                                  |

---

## Contributing

1. Branch off `main`: `git checkout -b feat/your-feature`
2. Follow commit convention: `feat:`, `fix:`, `chore:`, `docs:`
3. Open a PR with a clear description of what changed and why
