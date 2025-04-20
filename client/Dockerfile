FROM node:23-bullseye-slim as builder

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/local/app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]