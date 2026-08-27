# Pinned, minimal, least-privilege production image.
# Builder stage: compile TypeScript.
FROM node:24.19.0-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
# Reproducible install from the committed lockfile (never npm install).
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime stage: no source, no devDependencies, non-root user.
FROM node:24.19.0-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache openssl \
  && addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/prisma ./prisma

# Upload/private-storage directories must be writable by the runtime user.
RUN mkdir -p /app/uploads /app/private-storage && chown -R app:app /app/uploads /app/private-storage

USER app

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
