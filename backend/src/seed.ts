import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ShareBite database seeding (Bengaluru, India)...');

  // Clean existing tables
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await bcrypt.hash('Password123!', 10);

  // 1. Primary Demo Users (Bengaluru, India)
  const primaryDonor = await prisma.user.create({
    data: {
      name: 'Grand Horizon Bistro',
      email: 'donor@example.com',
      passwordHash: demoPassword,
      phone: '+91 98765 43210',
      role: 'DONOR',
      profileImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9784,
      longitude: 77.6408,
      rating: 4.9,
      verified: true
    }
  });

  const primaryRecipient = await prisma.user.create({
    data: {
      name: 'Hope Haven Shelter & Food Bank',
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

  const primaryVolunteer = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'volunteer@example.com',
      passwordHash: demoPassword,
      phone: '+91 97654 32109',
      role: 'VOLUNTEER',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Bengaluru',
      latitude: 12.9360,
      longitude: 77.6250,
      rating: 4.9,
      verified: true
    }
  });

  const primaryAdmin = await prisma.user.create({
    data: {
      name: 'Sarah Connor (Admin)',
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

  // Additional 9 Donors in Bengaluru
  const donorData = [
    { name: 'Green Garden Bakery', email: 'bakery@example.com', phone: '+91 98450 11111', lat: 12.9352, lng: 77.6245, city: 'Bengaluru' },
    { name: 'Fresh Fields Supermarket', email: 'freshfields@example.com', phone: '+91 98450 22222', lat: 12.9756, lng: 77.6066, city: 'Bengaluru' },
    { name: 'Campus Commons Cafeteria', email: 'campus@example.com', phone: '+91 98450 33333', lat: 12.9250, lng: 77.5938, city: 'Bengaluru' },
    { name: 'Artisan Oven Pizzeria', email: 'artisan@example.com', phone: '+91 98450 44444', lat: 12.9121, lng: 77.6445, city: 'Bengaluru' },
    { name: 'Organic Harvest Co.', email: 'harvest@example.com', phone: '+91 98450 55555', lat: 12.9917, lng: 77.5712, city: 'Bengaluru' },
    { name: 'Metro Hotel Events', email: 'metrohotel@example.com', phone: '+91 98450 66666', lat: 12.9698, lng: 77.7499, city: 'Bengaluru' },
    { name: 'Nourish Meal Prep', email: 'nourish@example.com', phone: '+91 98450 77777', lat: 13.0358, lng: 77.5970, city: 'Bengaluru' },
    { name: 'Sunset Catering', email: 'sunset@example.com', phone: '+91 98450 88888', lat: 12.8452, lng: 77.6602, city: 'Bengaluru' },
    { name: 'The Friendly Pantry', email: 'pantry@example.com', phone: '+91 98450 99999', lat: 12.9592, lng: 77.6974, city: 'Bengaluru' }
  ];

  const donors = [primaryDonor];
  for (const d of donorData) {
    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email,
        passwordHash: demoPassword,
        phone: d.phone,
        role: 'DONOR',
        profileImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        city: d.city,
        latitude: d.lat,
        longitude: d.lng,
        rating: 4.8,
        verified: true
      }
    });
    donors.push(user);
  }

  // Additional 9 Recipients in Bengaluru
  const recipientData = [
    { name: 'Community Care Shelter', email: 'shelter@example.com', lat: 12.9750, lng: 77.6380 },
    { name: 'St. Jude Food Pantry', email: 'stjude@example.com', lat: 12.9280, lng: 77.5890 },
    { name: 'Youth Outreach Center', email: 'youth@example.com', lat: 12.9100, lng: 77.6420 },
    { name: 'Senior Wellness Hub', email: 'seniors@example.com', lat: 12.9940, lng: 77.5680 },
    { name: 'Westside Community Kitchen', email: 'westside@example.com', lat: 12.9880, lng: 77.5540 },
    { name: 'Downtown Mission Relief', email: 'mission@example.com', lat: 12.9710, lng: 77.6080 },
    { name: 'Harbor Family House', email: 'harbor@example.com', lat: 12.9810, lng: 77.6190 },
    { name: 'East Village Aid Network', email: 'eastvillage@example.com', lat: 12.9600, lng: 77.6380 },
    { name: 'City Rescue Mission', email: 'cityrescue@example.com', lat: 12.9160, lng: 77.6100 }
  ];

  const recipients = [primaryRecipient];
  for (const r of recipientData) {
    const user = await prisma.user.create({
      data: {
        name: r.name,
        email: r.email,
        passwordHash: demoPassword,
        role: 'RECIPIENT',
        city: 'Bengaluru',
        latitude: r.lat,
        longitude: r.lng,
        rating: 4.9,
        verified: true
      }
    });
    recipients.push(user);
  }

  // Additional 9 Volunteers in Bengaluru
  const volunteerNames = [
    'Jordan Lee', 'Taylor Smith', 'Morgan Davis', 'Sam Wilson',
    'Chris Martinez', 'Pat Taylor', 'Riley Johnson', 'Casey Brown', 'Jesse Garcia'
  ];

  const volunteers = [primaryVolunteer];
  for (let i = 0; i < volunteerNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        name: volunteerNames[i],
        email: `vol${i + 1}@example.com`,
        passwordHash: demoPassword,
        role: 'VOLUNTEER',
        city: 'Bengaluru',
        latitude: 12.93 + (i * 0.01),
        longitude: 77.60 + (i * 0.01),
        rating: 4.8 + (i % 3) * 0.1,
        verified: true
      }
    });
    volunteers.push(user);
  }

  console.log('✅ Created Users in Bengaluru (10 Donors, 10 Recipients, 10 Volunteers, 1 Admin)');

  // 25 Food Donations in Bengaluru
  const sampleDonations = [
    {
      foodName: 'Fresh Baked Sourdough & Croissants',
      category: 'Bakery & Bread',
      description: 'Artisanal sourdough loaves and chocolate croissants baked fresh this morning in Koramangala. Perfectly edible and golden crisp.',
      quantity: 15,
      unit: 'kg',
      servings: 45,
      dietaryType: 'VEGETARIAN',
      allergens: 'Gluten, Wheat, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
      address: '100 Feet Rd, Koramangala, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      donorIndex: 1
    },
    {
      foodName: 'Surplus Gourmet Pasta & Sauce Bowls',
      category: 'Cooked Meals',
      description: 'Freshly prepared Penne Arrabbiata and Creamy Mushroom Pasta from lunch event catering in Indiranagar.',
      quantity: 25,
      unit: 'meals',
      servings: 50,
      dietaryType: 'VEGETARIAN',
      allergens: 'Dairy, Gluten',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
      status: 'REQUESTED',
      address: '12th Main Rd, Indiranagar, Bengaluru',
      lat: 12.9784,
      lng: 77.6408,
      donorIndex: 0
    },
    {
      foodName: 'Organic Apples & Banana Crate Pack',
      category: 'Produce & Fruits',
      description: 'Crates of ripe organic apples and bananas from MG Road supermarket store.',
      quantity: 30,
      unit: 'kg',
      servings: 80,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
      address: 'MG Road Metro Station Area, Bengaluru',
      lat: 12.9756,
      lng: 77.6066,
      donorIndex: 2
    },
    {
      foodName: 'Assorted Sandwich Trays & Wraps',
      category: 'Cooked Meals',
      description: 'Paneer tikka wraps, Caprese paninis, and roasted veggie sandwiches individually packed in Jayanagar.',
      quantity: 20,
      unit: 'boxes',
      servings: 40,
      dietaryType: 'VEGETARIAN',
      allergens: 'Gluten, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      status: 'RESERVED',
      address: '4th Block, Jayanagar, Bengaluru',
      lat: 12.9250,
      lng: 77.5938,
      donorIndex: 3
    },
    {
      foodName: 'Fresh Dairy Milk & Greek Yogurts',
      category: 'Dairy',
      description: 'Sealed whole milk cartons and low-fat Greek yogurt tubs from HSR Layout store.',
      quantity: 12,
      unit: 'liters',
      servings: 35,
      dietaryType: 'VEGETARIAN',
      allergens: 'Milk, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
      status: 'PICKUP_ASSIGNED',
      address: 'Sector 1, HSR Layout, Bengaluru',
      lat: 12.9121,
      lng: 77.6445,
      donorIndex: 4
    },
    {
      foodName: 'Roasted Veggie & Biryani Rice Bowls',
      category: 'Cooked Meals',
      description: 'Hot vegetable biryani and curry trays from banquet event in Whitefield.',
      quantity: 40,
      unit: 'meals',
      servings: 60,
      dietaryType: 'VEGETARIAN',
      allergens: 'Spices, Soy',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      status: 'COLLECTED',
      address: 'ITPL Main Rd, Whitefield, Bengaluru',
      lat: 12.9698,
      lng: 77.7499,
      donorIndex: 5
    },
    {
      foodName: 'Vegan Lentil Stew & Quinoa Bowls',
      category: 'Cooked Meals',
      description: 'High-protein vegan Mediterranean lentil curry served with quinoa in Malleshwaram.',
      quantity: 18,
      unit: 'kg',
      servings: 55,
      dietaryType: 'VEGAN',
      allergens: 'Sesame',
      imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
      status: 'DELIVERED',
      address: '8th Main, Malleshwaram, Bengaluru',
      lat: 12.9917,
      lng: 77.5712,
      donorIndex: 6
    },
    {
      foodName: 'Wood-fired Veggie & Margherita Pizzas',
      category: 'Cooked Meals',
      description: '8 large freshly baked wood-fired pizzas untouched from corporate lunch in Indiranagar.',
      quantity: 8,
      unit: 'boxes',
      servings: 32,
      dietaryType: 'VEGETARIAN',
      allergens: 'Dairy, Gluten',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: '100 Feet Rd, Indiranagar, Bengaluru',
      lat: 12.9784,
      lng: 77.6408,
      donorIndex: 0
    },
    {
      foodName: 'Packaged Organic Rice & Grain Bags',
      category: 'Groceries & Packaged',
      description: 'Unopened 5kg bags of Jasmine rice, brown rice, and whole oats in Electronic City.',
      quantity: 50,
      unit: 'kg',
      servings: 150,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: 'Phase 1, Electronic City, Bengaluru',
      lat: 12.8452,
      lng: 77.6602,
      donorIndex: 7
    },
    {
      foodName: 'Fresh Squeezed Orange & Berry Juices',
      category: 'Beverages',
      description: 'Cold-pressed fruit juices in sealed glass bottles from Hebbal outlet.',
      quantity: 20,
      unit: 'liters',
      servings: 40,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: 'Outer Ring Rd, Hebbal, Bengaluru',
      lat: 13.0358,
      lng: 77.5970,
      donorIndex: 8
    }
  ];

  for (let i = 11; i <= 25; i++) {
    sampleDonations.push({
      foodName: `Rescued Food Parcel Batch #${i}`,
      category: i % 2 === 0 ? 'Cooked Meals' : 'Produce & Fruits',
      description: `Surplus nutritious food rescued from commercial food partners in Bengaluru. Fully verified for food safety standards.`,
      quantity: 15 + (i * 2),
      unit: i % 2 === 0 ? 'meals' : 'kg',
      servings: 30 + (i * 4),
      dietaryType: i % 3 === 0 ? 'VEGAN' : i % 3 === 1 ? 'VEGETARIAN' : 'NON_VEGETARIAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: `Sector ${i % 7 + 1}, HSR Layout, Bengaluru`,
      lat: 12.9100 + (i * 0.003),
      lng: 77.6200 + (i * 0.004),
      donorIndex: i % donors.length
    });
  }

  const createdDonations = [];
  const now = new Date();

  for (const d of sampleDonations) {
    const prepDate = new Date(now.getTime() - 4 * 3600 * 1000);
    const expDate = new Date(now.getTime() + (d.status === 'COMPLETED' ? -24 : 24) * 3600 * 1000);
    const pickupStart = new Date(now.getTime() - 2 * 3600 * 1000);
    const pickupEnd = new Date(now.getTime() + 6 * 3600 * 1000);

    const donor = donors[d.donorIndex];

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        foodName: d.foodName,
        category: d.category,
        description: d.description,
        quantity: d.quantity,
        unit: d.unit,
        servings: d.servings,
        dietaryType: d.dietaryType,
        allergens: d.allergens,
        preparedAt: prepDate,
        expiresAt: expDate,
        pickupStart: pickupStart,
        pickupEnd: pickupEnd,
        address: d.address,
        city: 'Bengaluru',
        latitude: d.lat,
        longitude: d.lng,
        imageUrl: d.imageUrl,
        status: d.status
      }
    });

    createdDonations.push(donation);

    const recipient = recipients[createdDonations.length % recipients.length];
    const volunteer = volunteers[createdDonations.length % volunteers.length];

    if (['REQUESTED', 'RESERVED', 'PICKUP_ASSIGNED', 'COLLECTED', 'DELIVERED', 'COMPLETED'].includes(d.status)) {
      const requestStatus = d.status === 'REQUESTED' ? 'PENDING' : 'ACCEPTED';
      await prisma.foodRequest.create({
        data: {
          donationId: donation.id,
          recipientId: recipient.id,
          message: 'We are requesting this food donation to serve 40 people at our shelter tonight.',
          status: requestStatus
        }
      });
    }

    const deliveryStatus = d.status === 'PICKUP_ASSIGNED' ? 'ASSIGNED' :
                          d.status === 'COLLECTED' ? 'COLLECTED' :
                          d.status === 'DELIVERED' ? 'DELIVERED' :
                          d.status === 'COMPLETED' ? 'COMPLETED' : 'AVAILABLE';

    await prisma.delivery.create({
      data: {
        donationId: donation.id,
        volunteerId: deliveryStatus !== 'AVAILABLE' ? volunteer.id : null,
        pickupLocation: donation.address,
        deliveryLocation: `${recipient.name}, ${recipient.city}`,
        status: deliveryStatus,
        acceptedAt: deliveryStatus !== 'AVAILABLE' ? new Date(now.getTime() - 3 * 3600 * 1000) : null,
        collectedAt: ['COLLECTED', 'DELIVERED', 'COMPLETED'].includes(deliveryStatus) ? new Date(now.getTime() - 2 * 3600 * 1000) : null,
        deliveredAt: ['DELIVERED', 'COMPLETED'].includes(deliveryStatus) ? new Date(now.getTime() - 1 * 3600 * 1000) : null,
        completedAt: deliveryStatus === 'COMPLETED' ? new Date() : null
      }
    });

    if (d.status === 'COMPLETED') {
      await prisma.review.create({
        data: {
          reviewerId: recipient.id,
          reviewedUserId: donor.id,
          donationId: donation.id,
          rating: 5,
          comment: 'Outstanding food quality and super punctual donor! Highly recommended.'
        }
      });
    }
  }

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: primaryDonor.id,
      title: 'Request Approved',
      message: 'Hope Haven Shelter accepted pickup slot for Gourmet Pasta.',
      type: 'REQUEST_ACCEPTED',
      read: false
    }
  });

  await prisma.notification.create({
    data: {
      userId: primaryRecipient.id,
      title: 'Food Reserved',
      message: 'Your request for Fresh Baked Sourdough has been approved.',
      type: 'DONATION_REQUEST',
      read: false
    }
  });

  // Create sample report
  await prisma.report.create({
    data: {
      reporterId: primaryRecipient.id,
      reportedUserId: donors[1].id,
      donationId: createdDonations[0].id,
      reason: 'Incorrect Information',
      description: 'Pickup timing on listing differed slightly from actual store closing time.',
      status: 'OPEN'
    }
  });

  console.log('✅ Created 25 Food Donations, Deliveries, Requests, Reviews, Reports, and Notifications in Bengaluru!');
  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
