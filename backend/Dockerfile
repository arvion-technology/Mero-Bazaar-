FROM node:24-alpine

WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Generate Prisma client inside container
RUN npx prisma generate

# Build NestJS app (TS → JS)
RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "run", "start:prod"]