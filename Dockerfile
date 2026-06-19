# Front Sarl 2F Général — build statique servi par Caddy (HTTPS automatique).
# Caddy sert le SPA ET fait office de reverse-proxy /api + /uploads vers le backend.

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_API_URL volontairement vide → le front appelle /api en relatif (même origine).
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
