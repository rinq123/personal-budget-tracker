FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

COPY . .

ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

RUN npm run build

RUN npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]