# Base Stage
FROM node:20-alpine AS base

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node . .

# Development Stage
FROM base AS development

ENV NODE_ENV=dev

RUN npm install -g pnpm

RUN pnpm install

RUN pnpx prisma generate

RUN pnpm build

RUN chown -R node:node /app

EXPOSE 3000

USER node

CMD ["node", "./build/index.js"]

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

# Build Stage
FROM base AS build

COPY --chown=node:node --from=development /app/node_modules ./node_modules

RUN pnpx prisma generate

RUN pnpm build

ENV NODE_ENV=production

RUN pnpm install --prod

USER node

# Production stage
FROM base AS production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/build ./build


EXPOSE 3000

USER node

CMD ["node", "./build/index.js"]

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
