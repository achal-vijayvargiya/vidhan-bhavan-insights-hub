## Build stage: compile the React app
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Allow build-time API URL override
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

## Runtime stage: copy build artifacts to a shared volume mounted at /usr/share/nginx/html
FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache bash coreutils

# Copy the build output from the build stage
COPY --from=build /app/dist /build

# Declare the shared volume path (will be provided by docker-compose)
VOLUME ["/usr/share/nginx/html"]

# On container start, copy the built files into the mounted volume and keep the container running
CMD ["sh", "-c", "cp -r /build/* /usr/share/nginx/html/ && echo 'Frontend build copied to shared volume' && tail -f /dev/null"]