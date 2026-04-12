# Stage 1: Build frontend
FROM node:20-alpine AS build
ARG COMMIT_HASH=dev
ARG BUILD_NUM=0
ENV VITE_COMMIT_HASH=$COMMIT_HASH
ENV VITE_BUILD_NUM=$BUILD_NUM
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src/ src/
RUN npm run build

# Stage 2: Run Express server + serve static files
FROM node:20-slim
RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install claude CLI native binary
RUN curl -fsSL https://claude.ai/install.sh | bash

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy backend
COPY server.js ./

# Copy built frontend
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "server.js"]
