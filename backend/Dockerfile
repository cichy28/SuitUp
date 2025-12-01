# Etap 1: Budowanie aplikacji
FROM node:20-alpine AS builder

WORKDIR /app

# Instalacja narzędzi potrzebnych do budowania (w tym zależności dla node-gyp)
RUN apk add --no-cache python3 make g++ pkgconf cairo-dev jpeg-dev pango-dev giflib-dev openssl

# Kopiowanie plików package.json i instalacja zależności
# Kopiujemy wszystkie pliki package.json, aby poprawnie zainstalować zależności w monorepo
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package.json ./shared/

# Instalujemy wszystkie zależności (w tym deweloperskie)
RUN npm ci

# Kopiowanie reszty kodu źródłowego
COPY . .

# Generowanie klienta Prisma
RUN npm run prisma:generate --workspace=backend

# Budowanie aplikacji backendowej
RUN npm run build --workspace=backend


# Etap 2: Tworzenie lekkiego obrazu produkcyjnego
FROM node:20-alpine

WORKDIR /app

# Instalacja tylko tych zależności systemowych, które są potrzebne do uruchomienia aplikacji
RUN apk add --no-cache cairo jpeg pango giflib openssl python3 make pkgconf pixman-dev cairo-dev pango-dev g++ giflib-dev

# Kopiowanie plików package.json, aby npm wiedział, jak uruchomić aplikację
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package.json ./shared/
COPY tsconfig.base.json ./
COPY backend/tsconfig.json ./backend/
RUN npm ci --omit=dev

# Kopiowanie zainstalowanych i zbudowanych zależności z etapu "builder"
COPY --from=builder /app/node_modules ./node_modules

# Kopiowanie zbudowanej aplikacji z etapu "builder"
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/templates ./backend/templates
COPY --from=builder /app/backend/scripts ./backend/scripts
COPY --from=builder /app/shared ./shared

# Utworzenie katalogów na dane runtime
RUN mkdir -p /app/uploads && mkdir -p /app/_do_importu

# Ustawienie katalogu roboczego na backend
WORKDIR /app/backend

EXPOSE 3000

# Polecenie startowe, które uruchamia zbudowaną aplikację
CMD ["npm", "start"]