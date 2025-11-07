# Étape 1 : Build de l'application
FROM node:20-alpine AS builder

USER node
WORKDIR /usr/src/frontend

# Copy package files first to take advantage of Docker layer caching
COPY package*.json ./

# Install all dependencies (including dev) so prisma and build tools are available
RUN npm install


# Build-time args: allow passing API base URLs into the build (used by src/lib/api.ts)
ARG SERVER_API_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_RAWG_API_KEY
# Expose build args as env vars so `process.env.SERVER_API_URL` and
# `process.env.NEXT_PUBLIC_API_URL` are available during `npm run build`.
ENV NEXT_PUBLIC_RAWG_API_KEY=${NEXT_PUBLIC_RAWG_API_KEY}
ENV SERVER_API_URL=${SERVER_API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/frontend

RUN chown -R node:node /usr/src/frontend
USER node

COPY package*.json ./

COPY --from=builder /usr/src/frontend/node_modules ./node_modules
COPY --from=builder /usr/src/frontend/.next ./.next
COPY --from=builder /usr/src/frontend/public ./public


EXPOSE 5173
CMD ["npm", "run", "start"]