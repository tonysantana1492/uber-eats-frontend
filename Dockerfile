# Development
FROM node:18-alpine AS development

WORKDIR /app

COPY --chown=node:node package*.json ./

ENV NODE_ENV development

RUN npm ci

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD [ "npm", "start" ]

# Build production
FROM node:18-alpine AS build

WORKDIR /app

COPY --chown=node:node package*.json ./

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

USER node

# Production
FROM nginx:1.21.0-alpine as production

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/build /usr/share/nginx/html

COPY --chown=node:node nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]