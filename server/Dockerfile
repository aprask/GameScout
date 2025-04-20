FROM node:23-bullseye-slim

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y libpq-dev postgresql-client

COPY . .

RUN npm run build

CMD ["npm", "run", "prod"]