FROM node:20-alpine
RUN apk update && apk add --no-cache bash
WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install


COPY . .

CMD ["npm", "run", "build"]