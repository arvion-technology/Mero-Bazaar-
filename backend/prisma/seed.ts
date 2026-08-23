<<<<<<< HEAD
import 'dotenv/config';
=======
>>>>>>> origin/aashika
import { PrismaClient, ListingCategory, VehicleType, VehicleCondition, BluebookStatus } from '@prisma/client';

const prisma = new PrismaClient();

<<<<<<< HEAD
// Demo job listings so the Job category filter (type/city/skill) is populated.
const DEMO_JOBS = [
  { role: 'Sales Manager', city: 'Kathmandu', salaryMin: 30000, salaryMax: 45000, payPeriod: 'MONTHLY', contractType: 'FULL_TIME', skillTags: ['Sales', 'Marketing'], isUrgent: true },
  { role: 'Graphic Designer', city: 'Lalitpur', salaryMin: 15000, salaryMax: 25000, payPeriod: 'MONTHLY', contractType: 'PART_TIME', skillTags: ['Design', 'Marketing'], isUrgent: false },
  { role: 'Frontend Developer', city: 'Pokhara', salaryMin: 40000, salaryMax: 60000, payPeriod: 'MONTHLY', contractType: 'CONTRACT', skillTags: ['IT & Software', 'Design'], isUrgent: true },
  { role: 'UI/UX Designer', city: 'Kathmandu', salaryMin: 20000, salaryMax: 35000, payPeriod: 'MONTHLY', contractType: 'FREELANCE', skillTags: ['Design'], isUrgent: false },
  { role: 'Junior Accountant', city: 'Bhaktapur', salaryMin: 10000, salaryMax: 15000, payPeriod: 'MONTHLY', contractType: 'INTERNSHIP', skillTags: ['Accounting', 'Finance'], isUrgent: false },
  { role: 'Construction Worker', city: 'Biratnagar', salaryMin: 800, salaryMax: 1200, payPeriod: 'DAILY', contractType: 'LABOUR', skillTags: ['Construction'], isUrgent: true },
  { role: 'Housekeeper', city: 'Butwal', salaryMin: 15000, salaryMax: 20000, payPeriod: 'MONTHLY', contractType: 'DOMESTIC', skillTags: ['Domestic'], isUrgent: false },
  { role: 'Delivery Rider', city: 'Chitwan', salaryMin: 50000, salaryMax: 70000, payPeriod: 'MONTHLY', contractType: 'GIG', skillTags: ['Delivery', 'Riding'], isUrgent: true },
] as const;

=======
>>>>>>> origin/aashika
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
<<<<<<< HEAD
      bluebook_status: BluebookStatus.pending, // reviewer-controlled flag; not self-asserted
=======
      bluebook_status: BluebookStatus.verified,
>>>>>>> origin/aashika
      fuel_type: 'hybrid',
      ownership_transfer_ready: true,
    },
  });

<<<<<<< HEAD
  // 4. Demo employer (KYC-verified VENDOR) so job listings have a real owner.
  const employer = await prisma.user.upsert({
    where: { email: 'employer@mero.com' },
    update: {},
    create: {
      email: 'employer@mero.com',
      password: 'hashedpassword',
      name: 'Demo Employer',
      role: 'VENDOR',
      isVerified: true,
      vendorProfile: { create: { businessName: 'Demo Hiring Co.', businessType: 'COMPANY', isVerified: true } },
    },
  });

  // 5. Create the demo job listings (skip if already seeded, so re-runs don't duplicate).
  const existingJobs = await prisma.listing.count({
    where: { category: ListingCategory.JOB, userId: employer.id },
  });

  if (existingJobs === 0) {
    for (const job of DEMO_JOBS) {
      const jobListing = await prisma.listing.create({
        data: {
          userId: employer.id,
          title: `${job.role} in ${job.city}`,
          description: `Hiring for ${job.role} position in ${job.city}.`,
          category: ListingCategory.JOB,
          images: [],
          job: {
            create: {
              role: job.role,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              payPeriod: job.payPeriod as any,
              city: job.city,
              skillTags: [...job.skillTags],
              contractType: job.contractType as any,
              isUrgent: job.isUrgent,
            },
          },
        },
      });
      console.log(`  job: ${jobListing.title}`);
    }
    console.log(`Seeded ${DEMO_JOBS.length} job listings.`);
  } else {
    console.log(`Job listings already present (${existingJobs}); skipping.`);
  }

=======
>>>>>>> origin/aashika
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