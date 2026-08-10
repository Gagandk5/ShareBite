import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database and setting up clean initial state for Bengaluru...');

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

  // Create only the 4 core accounts for testing
  await prisma.user.create({
    data: {
      name: 'Bengaluru Food Donor',
      email: 'donor@example.com',
      passwordHash: demoPassword,
      phone: '+91 98765 43210',
      role: 'DONOR',
      profileImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9784,
      longitude: 77.6408,
      rating: 5.0,
      verified: true
    }
  });

  await prisma.user.create({
    data: {
      name: 'Hope Shelter Bengaluru',
      email: 'recipient@example.com',
      passwordHash: demoPassword,
      phone: '+91 98123 45678',
      role: 'RECIPIENT',
      profileImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9340,
      longitude: 77.6220,
      rating: 5.0,
      verified: true
    }
  });

  await prisma.user.create({
    data: {
      name: 'Alex (Volunteer Driver)',
      email: 'volunteer@example.com',
      passwordHash: demoPassword,
      phone: '+91 97654 32109',
      role: 'VOLUNTEER',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9360,
      longitude: 77.6250,
      rating: 5.0,
      verified: true
    }
  });

  await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@example.com',
      passwordHash: demoPassword,
      phone: '+91 99000 11111',
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      rating: 5.0,
      verified: true
    }
  });

  console.log('✅ Database cleaned successfully! 0 fake food donations.');
  console.log('✅ Created 4 clean demo accounts (Donor, Recipient, Volunteer, Admin).');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
