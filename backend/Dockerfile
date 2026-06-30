FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm ci

COPY backend/tsconfig*.json backend/nest-cli.json ./
COPY backend/src ./src

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist/src ./dist/src
COPY --from=builder /app/dist/prisma ./dist/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN npx prisma generate

EXPOSE 9016

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9016/api/v1/health || exit 1

USER appuser

CMD ["node", "dist/src/main"]
