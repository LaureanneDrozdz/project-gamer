# Étape 1 : Build de l'application
FROM node:20-alpine AS builder


WORKDIR /usr/src/frontend

# Copy package files first to take advantage of Docker layer caching
COPY package*.json ./

# Install all dependencies (including dev) so prisma and build tools are available
RUN npm install

# Copy application source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/frontend

RUN chown -R node:node /usr/src/frontend
USER node

COPY package*.json ./

COPY --from=builder /usr/src/frontend/node_modules ./node_modules
COPY --from=builder /usr/src/frontend/dist ./next
COPY --from=builder /app/public ./public

EXPOSE 5173
CMD ["npm", "run", "start"]