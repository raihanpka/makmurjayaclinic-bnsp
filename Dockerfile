# Stage 1: Base setup
FROM node:22-alpine AS base
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 2: Install all dependencies (development + production)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN pnpm run build

# Stage 4: Production dependencies only
FROM base AS production-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Stage 5: Production runner (Minimum storage)
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from build and prod-deps stages
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/

# Create a non-root user for security
RUN addgroup -S adonis && adduser -S adonis -G adonis
RUN chown -R adonis:adonis /app
USER adonis

# Expose AdonisJS default port
EXPOSE 3333

# Start the application
CMD ["node", "build/bin/server.js"]
