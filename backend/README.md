**MeroBazaar Backend (NestJS + Prisma + PostgreSQL)**
A scalable backend system built using NestJS, Prisma ORM, PostgreSQL for a hybrid Nepali marketplace platform (vehicles, listings, jobs, etc.).

**Tech Stack**
- NestJS (v11)
- Prisma ORM
- PostgreSQL
- TypeScript
- Docker & Docker Compose(for quick start)


**1. Clone the repository**
-git clone https://github.com/arvion-technology/Mero-Bazaar-
-cd backend

**2. Environment Variables**
-create a .env file in root:
-DATABASE_URL=your_database_url_here
PORT=3000
-copy from .env.example.

**3. Run with Docker:** docker compose up --build

**4. Prisma Setup**
-Generate Prisma client: npx prisma generate
-Run migrations: npx prisma migrate dev
-Docker version: docker exec -it nest_backend npx prisma migrate dev


**Features**
-Vehicle module (CRUD APIs)
-Listings system 
-Search and filter by fields