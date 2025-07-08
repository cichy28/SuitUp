FROM node:20-alpine

WORKDIR /app

# Copy root package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.base.json ./

# Install root dependencies
RUN npm install

# Copy shared directory
COPY shared ./shared

# Set WORKDIR to backend
WORKDIR /app/backend

# Copy backend specific package.json and package-lock.json
COPY backend/package*.json .
COPY backend/tsconfig.json .

# Copy backend source code
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/scripts ./scripts

# Install build tools for node-gyp
RUN apk add --no-cache python3 make g++ pkgconf cairo-dev jpeg-dev pango-dev giflib-dev openssl

# Install backend dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npm run prisma:generate

# Build the backend application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads
RUN chmod -R 777 uploads

EXPOSE 3000

CMD ["npm", "start"]