**MeroBazaar Backend (NestJS + Prisma + PostgreSQL)**
A scalable backend system built using NestJS, Prisma ORM, PostgreSQL for a hybrid Nepali marketplace platform (vehicles, listings, jobs, etc.).

**Tech Stack**
- NestJS (v11)
- Prisma ORM
- PostgreSQL
- TypeScript
- Docker & Docker Compose(for quick start)


**1. Clone the repository**
-git clone https://github.com/arvion-technology/Mero-Bazaar-<br>
-cd backend

**2. Environment Variables** <br>
-create a .env file in root:<br>
-DATABASE_URL=your_database_url_here<br>
PORT=3000
-copy from .env.example.<br>

**3. Run with Docker:** docker compose up --build

**4. Prisma Setup**<br>
-Generate Prisma client: npx prisma generate<br>
-Run migrations: npx prisma migrate dev<br>
-Docker version: docker exec -it nest_backend npx prisma migrate dev<br>


**Features**
-Vehicle module (CRUD APIs)<br>
-Listings system <br>
-Search and filter by fields<br>
-jobs module<br>
