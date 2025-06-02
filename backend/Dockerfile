FROM node:20-alpine
RUN apk update && apk add --no-cache bash
WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

