FROM node:23-bullseye-slim

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "prod"]