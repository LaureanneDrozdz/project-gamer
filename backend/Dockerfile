FROM node:20-alpine AS builder
RUN apk update && apk add --no-cache bash
WORKDIR /usr/src/backend

# Install all deps (including dev) so prisma and build tools are available
COPY package*.json ./
RUN npm ci

# Copy source and generate the Prisma client, then build the app
COPY . .
RUN npx prisma generate
RUN npm run build


# Copy built files and generated Prisma client from builder
COPY --from=builder /usr/src/backend/dist ./dist
COPY --from=builder /usr/src/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/backend/node_modules/@prisma ./node_modules/@prisma

# Copy any other runtime files your app needs (e.g., prisma schema for runtime if required)
COPY --from=builder /usr/src/backend/prisma ./prisma


EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]