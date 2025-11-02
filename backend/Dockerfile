FROM node:20-alpine
RUN apk update && apk add --no-cache bash
WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]