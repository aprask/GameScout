FROM node:23.11.0-alpine

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]