FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

FROM deps AS builder
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY .env ./.env

EXPOSE 3000
CMD ["node", "dist/index.js"]