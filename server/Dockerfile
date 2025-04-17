FROM node:23-bullseye-slim

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y libpq-dev postgresql-client

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]