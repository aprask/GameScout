FROM node:23-bullseye-slim

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]