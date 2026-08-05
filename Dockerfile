# syntax=docker/dockerfile:1.9
FROM node:20-alpine AS base
LABEL org.opencontainers.image.source="https://github.com/fakhrul62/bdapi4all"

# Build stage
FROM base AS builder
WORKDIR /src

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN apk add --no-cache openssl && npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy app source
COPY . .

# Build with standalone output for a minimal runtime image
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_BASE_URL=https://bdapi4all.vercel.app/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

# Production runtime stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && apk add --no-cache openssl

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /src/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /src/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /src/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]