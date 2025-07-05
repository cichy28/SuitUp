FROM node:20-alpine

WORKDIR /app

# Copy root package.json and package-lock.json for shared dependencies
COPY package*.json ./

# Copy shared directory
COPY shared ./shared

# Install root dependencies (including shared)
RUN npm install

# Copy backend specific package.json and package-lock.json
COPY backend/package*.json ./backend/

# Copy backend source code
COPY backend/src ./backend/src
COPY backend/prisma ./backend/prisma
COPY backend/scripts ./backend/scripts

WORKDIR /app/backend

# Install backend dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]