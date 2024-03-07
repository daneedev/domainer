FROM node:18-alpine
LABEL maintainer="danee@daneeskripter.dev"
WORKDIR /home/node/

COPY package*.json ./
RUN npm install

COPY . .

VOLUME [ "/data" ]

CMD ["node", "server.js"]
