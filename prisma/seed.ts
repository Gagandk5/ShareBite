import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ShareBite database seeding...');

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

  // 1. Primary Demo Users
  const primaryDonor = await prisma.user.create({
    data: {
      name: 'Grand Horizon Bistro',
      email: 'donor@example.com',
      passwordHash: demoPassword,
      phone: '+1 (555) 234-5678',
      role: 'DONOR',
      profileImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      city: 'New York',
      latitude: 40.73061,
      longitude: -73.935242,
      rating: 4.9,
      verified: true
    }
  });

  const primaryRecipient = await prisma.user.create({
    data: {
      name: 'Hope Haven Shelter & Food Bank',
      email: 'recipient@example.com',
      passwordHash: demoPassword,
      phone: '+1 (555) 876-5432',
      role: 'RECIPIENT',
      profileImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
      city: 'New York',
      latitude: 40.7282,
      longitude: -73.9942,
      rating: 5.0,
      verified: true
    }
  });

  const primaryVolunteer = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'volunteer@example.com',
      passwordHash: demoPassword,
      phone: '+1 (555) 345-6789',
      role: 'VOLUNTEER',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'New York',
      latitude: 40.725,
      longitude: -73.99,
      rating: 4.9,
      verified: true
    }
  });

  const primaryAdmin = await prisma.user.create({
    data: {
      name: 'Sarah Connor (Admin)',
      email: 'admin@example.com',
      passwordHash: demoPassword,
      phone: '+1 (555) 000-1111',
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      rating: 5.0,
      verified: true
    }
  });

  // Additional 9 Donors
  const donorData = [
    { name: 'Green Garden Bakery', email: 'bakery@example.com', phone: '+1 (555) 111-2222', lat: 40.7418, lng: -73.9893, city: 'New York' },
    { name: 'Fresh Fields Supermarket', email: 'freshfields@example.com', phone: '+1 (555) 222-3333', lat: 40.7589, lng: -73.9851, city: 'New York' },
    { name: 'Campus Commons Cafeteria', email: 'campus@example.com', phone: '+1 (555) 333-4444', lat: 40.7291, lng: -73.9965, city: 'New York' },
    { name: 'Artisan Oven Pizzeria', email: 'artisan@example.com', phone: '+1 (555) 444-5555', lat: 40.7215, lng: -73.9985, city: 'New York' },
    { name: 'Organic Harvest Co.', email: 'harvest@example.com', phone: '+1 (555) 555-6666', lat: 40.735, lng: -73.991, city: 'New York' },
    { name: 'Metro Hotel Events', email: 'metrohotel@example.com', phone: '+1 (555) 666-7777', lat: 40.7549, lng: -73.984, city: 'New York' },
    { name: 'Nourish Meal Prep', email: 'nourish@example.com', phone: '+1 (555) 777-8888', lat: 40.7484, lng: -73.9857, city: 'New York' },
    { name: 'Sunset Catering', email: 'sunset@example.com', phone: '+1 (555) 888-9999', lat: 40.7127, lng: -74.0059, city: 'New York' },
    { name: 'The Friendly Pantry', email: 'pantry@example.com', phone: '+1 (555) 999-0000', lat: 40.732, lng: -73.988, city: 'New York' }
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

  // Additional 9 Recipients
  const recipientData = [
    { name: 'Community Care Shelter', email: 'shelter@example.com', lat: 40.718, lng: -73.995 },
    { name: 'St. Jude Food Pantry', email: 'stjude@example.com', lat: 40.733, lng: -73.982 },
    { name: 'Youth Outreach Center', email: 'youth@example.com', lat: 40.742, lng: -73.998 },
    { name: 'Senior Wellness Hub', email: 'seniors@example.com', lat: 40.751, lng: -73.978 },
    { name: 'Westside Community Kitchen', email: 'westside@example.com', lat: 40.759, lng: -73.992 },
    { name: 'Downtown Mission Relief', email: 'mission@example.com', lat: 40.711, lng: -74.009 },
    { name: 'Harbor Family House', email: 'harbor@example.com', lat: 40.704, lng: -74.012 },
    { name: 'East Village Aid Network', email: 'eastvillage@example.com', lat: 40.726, lng: -73.981 },
    { name: 'City Rescue Mission', email: 'cityrescue@example.com', lat: 40.745, lng: -73.986 }
  ];

  const recipients = [primaryRecipient];
  for (const r of recipientData) {
    const user = await prisma.user.create({
      data: {
        name: r.name,
        email: r.email,
        passwordHash: demoPassword,
        role: 'RECIPIENT',
        city: 'New York',
        latitude: r.lat,
        longitude: r.lng,
        rating: 4.9,
        verified: true
      }
    });
    recipients.push(user);
  }

  // Additional 9 Volunteers
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
        city: 'New York',
        latitude: 40.72 + i * 0.005,
        longitude: -73.99 + i * 0.003,
        rating: 4.8 + (i % 3) * 0.1,
        verified: true
      }
    });
    volunteers.push(user);
  }

  console.log('✅ Created Users (10 Donors, 10 Recipients, 10 Volunteers, 1 Admin)');

  // 25 Food Donations
  const sampleDonations = [
    {
      foodName: 'Fresh Baked Sourdough & Croissants',
      category: 'Bakery & Bread',
      description: 'Artisanal sourdough loaves and chocolate croissants baked fresh this morning. Perfectly edible and golden crisp.',
      quantity: 15,
      unit: 'kg',
      servings: 45,
      dietaryType: 'VEGETARIAN',
      allergens: 'Gluten, Wheat, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
      address: '142 Bleecker St, New York, NY 10012',
      lat: 40.7288,
      lng: -73.9982,
      donorIndex: 1
    },
    {
      foodName: 'Surplus Gourmet Pasta & Sauce Bowls',
      category: 'Cooked Meals',
      description: 'Freshly prepared Penne Arrabbiata and Creamy Mushroom Pasta from lunch event catering. Kept in food safety warming containers.',
      quantity: 25,
      unit: 'meals',
      servings: 50,
      dietaryType: 'VEGETARIAN',
      allergens: 'Dairy, Gluten',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
      status: 'REQUESTED',
      address: '520 8th Ave, New York, NY 10018',
      lat: 40.7538,
      lng: -73.9912,
      donorIndex: 0 // Primary Donor Grand Horizon
    },
    {
      foodName: 'Organic Apples & Banana Crate Pack',
      category: 'Produce & Fruits',
      description: 'Crates of ripe organic Honeycrisp apples and Cavendish bananas. Perfect for shelters and youth snack programs.',
      quantity: 30,
      unit: 'kg',
      servings: 80,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE',
      address: '230 W 34th St, New York, NY 10001',
      lat: 40.7516,
      lng: -73.9911,
      donorIndex: 2
    },
    {
      foodName: 'Assorted Sandwich Trays & Wraps',
      category: 'Cooked Meals',
      description: 'Turkey avocado wraps, Caprese paninis, and roasted veggie sandwiches wrapped individually.',
      quantity: 20,
      unit: 'boxes',
      servings: 40,
      dietaryType: 'NON_VEGETARIAN',
      allergens: 'Gluten, Poultry, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      status: 'RESERVED',
      address: 'Washington Square Park E, New York, NY 10003',
      lat: 40.7308,
      lng: -73.9973,
      donorIndex: 3
    },
    {
      foodName: 'Fresh Dairy Milk & Greek Yogurts',
      category: 'Dairy',
      description: 'Sealed whole milk cartons and low-fat Greek yogurt tubs with best before date 5 days out.',
      quantity: 12,
      unit: 'liters',
      servings: 35,
      dietaryType: 'VEGETARIAN',
      allergens: 'Milk, Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
      status: 'PICKUP_ASSIGNED',
      address: '75 9th Ave, New York, NY 10011',
      lat: 40.7423,
      lng: -74.0062,
      donorIndex: 4
    },
    {
      foodName: 'Whole Roasted Chicken & Veggie Bowls',
      category: 'Cooked Meals',
      description: 'Hot roasted chicken trays with seasoned potatoes and steamed carrots from hotel banquet.',
      quantity: 40,
      unit: 'meals',
      servings: 60,
      dietaryType: 'NON_VEGETARIAN',
      allergens: 'Soy, Poultry',
      imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      status: 'COLLECTED',
      address: '109 W 39th St, New York, NY 10018',
      lat: 40.7533,
      lng: -73.9855,
      donorIndex: 5
    },
    {
      foodName: 'Vegan Lentil Stew & Quinoa Bowls',
      category: 'Cooked Meals',
      description: 'High-protein vegan Mediterranean lentil curry served with quinoa and flatbread.',
      quantity: 18,
      unit: 'kg',
      servings: 55,
      dietaryType: 'VEGAN',
      allergens: 'Sesame',
      imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
      status: 'DELIVERED',
      address: '150 1st Ave, New York, NY 10009',
      lat: 40.7289,
      lng: -73.9841,
      donorIndex: 6
    },
    {
      foodName: 'Wood-fired Veggie & Margherita Pizzas',
      category: 'Cooked Meals',
      description: '8 large freshly baked wood-fired pizzas untouched from a corporate lunch meeting.',
      quantity: 8,
      unit: 'boxes',
      servings: 32,
      dietaryType: 'VEGETARIAN',
      allergens: 'Dairy, Gluten',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: '80 Spring St, New York, NY 10012',
      lat: 40.7224,
      lng: -73.9972,
      donorIndex: 0
    },
    {
      foodName: 'Packaged Organic Rice & Grain Bags',
      category: 'Groceries & Packaged',
      description: 'Unopened 5kg bags of Jasmine rice, brown rice, and whole oats.',
      quantity: 50,
      unit: 'kg',
      servings: 150,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: '40 Central Park S, New York, NY 10019',
      lat: 40.7651,
      lng: -73.9754,
      donorIndex: 7
    },
    {
      foodName: 'Fresh Squeezed Orange & Berry Juices',
      category: 'Beverages',
      description: 'Cold-pressed fruit juices in sealed glass bottles. 100% natural without additives.',
      quantity: 20,
      unit: 'liters',
      servings: 40,
      dietaryType: 'VEGAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: '350 5th Ave, New York, NY 10118',
      lat: 40.7484,
      lng: -73.9857,
      donorIndex: 8
    }
  ];

  // Generate 15 additional completed/historical donations
  for (let i = 11; i <= 25; i++) {
    sampleDonations.push({
      foodName: `Rescued Food Parcel Batch #${i}`,
      category: i % 2 === 0 ? 'Cooked Meals' : 'Produce & Fruits',
      description: `Surplus nutritious food rescued from commercial food partners. Fully verified for food safety standards.`,
      quantity: 15 + (i * 2),
      unit: i % 2 === 0 ? 'meals' : 'kg',
      servings: 30 + (i * 4),
      dietaryType: i % 3 === 0 ? 'VEGAN' : i % 3 === 1 ? 'VEGETARIAN' : 'NON_VEGETARIAN',
      allergens: 'None',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
      status: 'COMPLETED',
      address: `${100 + i} 5th Ave, New York, NY 10011`,
      lat: 40.7300 + (i * 0.002),
      lng: -73.9900 - (i * 0.002),
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
        city: 'New York',
        latitude: d.lat,
        longitude: d.lng,
        imageUrl: d.imageUrl,
        status: d.status
      }
    });

    createdDonations.push(donation);

    // Create corresponding FoodRequest and Delivery
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

  console.log('✅ Created 25 Food Donations, Deliveries, Requests, Reviews, Reports, and Notifications!');
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
