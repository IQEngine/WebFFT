FROM node:20 as build

WORKDIR /app

COPY package*.json ./

COPY . .

WORKDIR /app/site 
RUN npm install && \
    npm run build

FROM nginx:alpine
COPY --from=build /app/site/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]