FROM node:18-alpine
LABEL maintainer="danee@daneeskripter.dev"
VOLUME [ "/home/node/" ]

WORKDIR /home/node/

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]
