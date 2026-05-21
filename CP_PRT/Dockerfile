# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:22-alpine as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY package*.json .

# Install all the dependencies
RUN npm install

COPY . .

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:1.25.3

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
#COPY certificate/certificate.crt /etc/nginx/ssl/certificate.crt
#COPY certificate/private.key /etc/nginx/ssl/private.key
#COPY certificate/certificatero.crt /etc/nginx/ssl/certificatero.crt
#COPY certificate/privatero.key /etc/nginx/ssl/privatero.key

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/PRT /usr/share/nginx/html


# Expose port 80
EXPOSE 443

