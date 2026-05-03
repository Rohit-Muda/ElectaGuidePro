# ── Stage 1: Build React frontend ────────────────────────────
FROM node:20-alpine AS client-build

WORKDIR /client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ .
RUN npm run build

# ── Stage 2: Build server dependencies ───────────────────────
FROM node:20-alpine AS server-deps

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ── Stage 3: Production image ─────────────────────────────────
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy server source + production node_modules
COPY --from=server-deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs server/ .

# Copy built frontend into server's public folder
COPY --from=client-build --chown=nodejs:nodejs /client/dist ./public

USER nodejs

EXPOSE 8080

ENV PORT=8080 \
    NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "index.js"]
