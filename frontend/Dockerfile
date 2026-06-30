FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/tsconfig*.json frontend/vite.config.ts frontend/index.html frontend/postcss.config.js frontend/tailwind.config.js ./
COPY frontend/src ./src
COPY frontend/public ./public

RUN npm run build

FROM nginx:stable-alpine AS production

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY --from=builder /app/dist /usr/share/nginx/html
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
