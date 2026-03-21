# Documentation

## 🚀 Overview

Backend service built with **Node.js**, **Fastify**, **Prisma ORM**, and **TypeScript**. This service provides RESTful APIs, authentication, role-based authorization, and integration with external services.

## 📦 Tech Stack

-  **Node.js**
-  **Fastify**
-  **TypeScript**
-  **Prisma ORM** (PostgreSQL)
-  **Zod** (validation)
-  **Fastify Plugins** (CORS, Session, Rate Limit, Helmet, Multipart, Static)
-  **Google Service Account** (Sheets, Analytics)

## ⚙️ Installation

```bash
$ npm install
```

Copy environment file:

```bash
$ cp .env.example .env
```

Update database connection:

```bash
DATABASE_URL=postgresql://postgres:123@127.0.0.1:5432/name
```

## 🗄️ Database Setup

Run migrations:

```bash
$ npx prisma migrate deploy
```

Generate Prisma Client:

```bash
$ npx prisma generate
```

Run seed (only first-time or when needed):

```bash
$ npm run seed
```

## ▶️ Run Server

Development:

```bash
$ npm run dev
```

Production:

```bash
$ npm run build
$ npm run start
```

## 🧩 Environment Variables

| Key              | Description             |
| ---------------- | ----------------------- |
| `DATABASE_URL`   | Database connection URL |
| `SESSION_SECRET` | Secret key for session  |
| `PORT`           | Server port             |
| `CLOUDINARY_URL` | Optional integration    |

## 🧪 Scripts

| Command         | Description          |
| --------------- | -------------------- |
| `npm run dev`   | Start dev server     |
| `npm run build` | Build TypeScript     |
| `npm run start` | Run production build |
| `npm run lint`  | Lint code            |
| `npm run seed`  | Run seed script      |

## 🚀 Deployment Notes

### Production steps:

1. Pull latest code
2. Install dependencies
3. Run `npx prisma migrate deploy`
4. Run seed only if required (`npm run seed`)
5. Build & start app

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Open pull request
