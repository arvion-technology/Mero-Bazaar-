FROM node:24-alpine

WORKDIR /app/backend

RUN apk add --no-cache openssl

COPY backend/package*.json ./

RUN npm install

COPY backend ./

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]