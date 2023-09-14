# Use an official Node.js runtime as a parent image
FROM node:20-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

WORKDIR /app/lib/
RUN npm link

WORKDIR /app/site 
RUN npm link webfft && \
    npm install && \
    npm run build

FROM nginx:alpine
COPY --from=build /app/site/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


