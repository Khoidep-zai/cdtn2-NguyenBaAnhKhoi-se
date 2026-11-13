# ==============================================================================
# Multi-stage Dockerfile for React Vite SPA Frontend (CDTN2 - Nhóm 8)
# Base: Node 20 Alpine (Build) + Nginx 1.27 Alpine (Production Web Server)
# ==============================================================================

# Stage 1: Build Application
FROM node:20-alpine AS build
WORKDIR /app

# Cache dependencies layer
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source and compile production static bundle
COPY . .
RUN npm run build

# Stage 2: High-Performance Production Nginx Server
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built artifacts from build stage
COPY --from=build /app/dist ./

# Copy optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
