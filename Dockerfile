# ========================================
# BOOKVERSE PRODUCTION DOCKERFILE
# Multi-stage build for optimal performance
# ========================================

# Stage 1: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
COPY backend/ ./

# Stage 2: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Install PHP and Apache (for frontend)
RUN apk add --no-cache \
    php8 \
    php8-apache2 \
    php8-mysqli \
    php8-json \
    php8-curl \
    php8-mbstring \
    php8-xml \
    php8-zip \
    php8-gd \
    php8-intl

# Copy frontend files
COPY frontend/ ./

# Stage 3: Production Image
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    tzdata

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bookverse -u 1001

# Set working directory
WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder --chown=bookverse:nodejs /app/backend ./backend

# Copy frontend from builder
COPY --from=frontend-builder --chown=bookverse:nodejs /app/frontend ./frontend

# Create logs directory
RUN mkdir -p /app/logs && chown bookverse:nodejs /app/logs

# Switch to non-root user
USER bookverse

# Expose ports
EXPOSE 3000 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/server.js"]
