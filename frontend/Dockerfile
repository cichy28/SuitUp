FROM node:20-alpine as builder

WORKDIR /app

# Copy root package.json and package-lock.json for shared dependencies
COPY package*.json ./

# Copy shared directory
COPY shared ./shared

# Install root dependencies (including shared)
RUN npm install

# Copy frontend specific package.json and package-lock.json
# Copy the rest of the frontend application code
COPY frontend/src ./frontend/src
COPY frontend/app.json ./frontend/app.json
COPY frontend/App.tsx ./frontend/App.tsx
COPY frontend/babel.config.js ./frontend/babel.config.js
COPY frontend/index.ts ./frontend/index.ts
COPY frontend/tsconfig.json ./frontend/tsconfig.json
COPY frontend/assets ./frontend/assets

WORKDIR /app/frontend

# Copy frontend specific package.json and package-lock.json
COPY frontend/package*.json ./
COPY frontend/.env.development ./
COPY frontend/.env.production ./

# Install frontend dependencies
RUN npm install

# Build the web application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the built application from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]