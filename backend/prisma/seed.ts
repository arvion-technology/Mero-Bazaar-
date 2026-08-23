import { PrismaClient, ListingCategory, VehicleType, VehicleCondition, BluebookStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'demo@mero.com',
    },
    update: {},
    create: {
      email: 'demo@mero.com',
      password: 'hashedpassword',
      name: 'Demo User',
      role: 'USER',
      isVerified: true,
    },
    });

  // 2. Create listing (IMPORTANT PARENT)
  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      title: 'Toyota Prius 2018',
      description: 'Well maintained hybrid car',
      price: 25000,
      category: ListingCategory.VEHICLE,
      images: ['car1.jpg'],
      latitude: 27.7172,
      longitude: 85.3240,
    },
  });

  // 3. Create vehicle (CHILD)
  await prisma.vehicle.create({
    data: {
      listingId: listing.id,

      type: VehicleType.car,
      brand: 'Toyota',
      model: 'Prius',
      year: 2018,
      km_driven: 45000,
      condition: VehicleCondition.used,
      bluebook_status: BluebookStatus.verified,
      fuel_type: 'hybrid',
      ownership_transfer_ready: true,
    },
  });

  console.log('Seed completed 🚗');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });