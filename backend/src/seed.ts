import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database: wiping all tables and removing all demo accounts...');

  // Clean all existing tables
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database purged successfully!');
  console.log('✅ 0 user accounts, 0 demo accounts, 0 food donations.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
