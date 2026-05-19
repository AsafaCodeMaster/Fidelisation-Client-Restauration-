# --- Étape 1 : Build & Installation des dépendances ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copie des manifestes de dépendances
COPY package*.json ./

# Installation stricte des dépendances de production
RUN npm ci --only=production

# --- Étape 2 : Image d'exécution finale durcie ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Copie des dépendances installées à l'étape précédente
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copie de TOUT le code de l'application (controllers, routes, views, public, etc.)
COPY . .

# Application du principe du moindre privilège
USER node

# Port exposé par ton application Express
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]