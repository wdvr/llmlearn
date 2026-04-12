# Stage 1: Build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src/ src/
RUN npm run build

# Stage 2: Run Express server + serve static files
FROM node:20-alpine
WORKDIR /app

# Install claude CLI
RUN npm install -g @anthropic-ai/claude-code

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy backend
COPY server.js ./

# Copy built frontend
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "server.js"]
