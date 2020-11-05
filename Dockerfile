FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=production

COPY . ./

CMD [ "node", "index.js"]
