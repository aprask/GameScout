FROM node:23.11.0-alpine

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]