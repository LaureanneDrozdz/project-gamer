# Étape 1 : Build de l'application
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Builder le projet NestJS
RUN npm run build

# Étape 2 : Image de production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copier le build et le client Prisma depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma


EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]