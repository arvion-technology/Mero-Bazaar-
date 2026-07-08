import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@hamromarketplace.com";

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
    create: {
      email,
      name: "Admin",
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  console.log("Admin ready:", admin.email, admin.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());