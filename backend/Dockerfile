FROM node:20-alpine AS builder
RUN apk update && apk add --no-cache bash
WORKDIR /usr/src/backend

# Install all deps (including dev) so prisma and build tools are available
COPY package*.json ./
RUN npm ci

# Copy source and generate the Prisma client, then build the app

RUN npx prisma generate
RUN npm run build
COPY . .




EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]