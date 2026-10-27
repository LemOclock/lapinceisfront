# --- Build du site statique
FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# L'API est servie sur le même domaine, sous /api (voir nginx.conf)
ENV API_URL=/api
RUN npm run build

# --- Serveur web
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
