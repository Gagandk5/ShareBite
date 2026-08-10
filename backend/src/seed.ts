import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database and setting up unified account model for Bengaluru...');

  // Clean all existing tables
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await bcrypt.hash('Password123!', 10);

  // Create unified demo account
  await prisma.user.create({
    data: {
      name: 'ShareBite Community Member',
      email: 'demo@example.com',
      passwordHash: demoPassword,
      phone: '+91 98765 43210',
      role: 'USER',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9784,
      longitude: 77.6408,
      rating: 5.0,
      verified: true
    }
  });

  console.log('✅ Database cleaned successfully! 0 fake food donations.');
  console.log('✅ Created unified demo account (demo@example.com / Password123!).');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
