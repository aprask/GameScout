FROM node:23-bullseye-slim

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]