FROM node:21.6.2-alpine3.18
WORKDIR /app
COPY . .
RUN npm install --verbose
CMD [ "node", "./server/server.js"]