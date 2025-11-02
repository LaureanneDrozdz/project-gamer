# Étape 1 : Build de l'application
FROM node:20-alpine AS builder

# Use a consistent working directory for builder and final image
WORKDIR /usr/src/backend


# Copy package files first to take advantage of Docker layer caching
COPY package*.json ./

# Install all dependencies (including dev) so prisma and build tools are available
RUN npm install

# Copy Prisma schema and generate the client early
COPY prisma ./prisma/
RUN npx prisma generate

# Copy application source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/backend

RUN chown -R node:node /usr/src/backend
USER node

# Install only production dependencies
COPY package*.json ./
# Copy node_modules from the builder stage (builder installed all deps).
# This avoids running `npm install` again in the final image which can fail
# in some CI environments (exit code 243) and ensures the generated Prisma
# client is present. If you prefer a slimmer image, we can instead run
# `npm ci --omit=dev` here as root before switching to the node user.
COPY --from=builder /usr/src/backend/node_modules ./node_modules

# Copy build output and the generated Prisma client from builder
COPY --from=builder /usr/src/backend/dist ./dist
COPY --from=builder /usr/src/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/backend/prisma ./prisma


EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]