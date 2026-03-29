# ======================
# 1. Install deps
# ======================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install

# ======================
# 2. Build app
# ======================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ⚠️ KHÔNG cần DB để generate
RUN npx prisma generate

RUN npm run build

# ======================
# 3. Production image
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY .env ./.env

EXPOSE 3000

# 👉 chạy migrate khi container start (LÚC NÀY DB đã chạy)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]