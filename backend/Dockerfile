FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Prisma 7 necesita que DATABASE_URL exista durante generate.
# Es únicamente una URL temporal de construcción.
ARG DATABASE_URL=postgresql://appuser:apppass@postgres:5432/appdb
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]