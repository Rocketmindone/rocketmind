# ── Stage 1: Build all apps ──
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Copy env for R-Plan Firebase config (if provided as build arg)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL

RUN npm install --ignore-scripts && npm run postinstall

# Build UI package
RUN npm run build --workspace=packages/ui

# Build site (root path)
RUN npm run build --workspace=apps/site

# Build saas (served at /app)
ENV NEXT_PUBLIC_BASE_PATH=/app
RUN npm run build --workspace=apps/saas

# Build R-Plan (served at /plan)
ENV NEXT_PUBLIC_BASE_PATH=/plan
RUN npm run build --workspace=apps/internal

# ── Stage 2: Serve via nginx ──
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/site/out     /var/www/site
COPY --from=builder /app/apps/saas/out     /var/www/saas
COPY --from=builder /app/apps/internal/out /var/www/rplan

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
