import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@hamromarketplace.com";
  const plainPassword = process.env.ADMIN_PASSWORD;
  const hash = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
      password: hash,
    },
    create: {
      email,
      password: hash,
      name: "Admin",
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  console.log("Admin ready:", admin.email, admin.id);
  console.log('Login with password:', plainPassword);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());