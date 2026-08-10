import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { donationSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';

// Helper to calculate distance in km using Haversine formula
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Auto update expired donations
async function updateExpiredDonations() {
  const now = new Date();
  await prisma.donation.updateMany({
    where: {
      status: { in: ['AVAILABLE', 'REQUESTED'] },
      expiresAt: { lt: now }
    },
    data: { status: 'EXPIRED' }
  });
}

export const getDonations = async (req: Request, res: Response) => {
  try {
    await updateExpiredDonations();

    const {
      search,
      category,
      dietaryType,
      status,
      donorId,
      lat,
      lng,
      maxDistance,
      sortBy
    } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    if (donorId) {
      where.donorId = donorId as string;
    }

    if (category && category !== 'ALL') {
      where.category = category as string;
    }

    if (dietaryType && dietaryType !== 'ALL') {
      where.dietaryType = dietaryType as string;
    }

    if (search) {
      const query = (search as string).toLowerCase();
      where.OR = [
        { foodName: { contains: query } },
        { description: { contains: query } },
        { address: { contains: query } },
        { city: { contains: query } }
      ];
    }

    let donations = await prisma.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            rating: true,
            verified: true,
            city: true
          }
        },
        requests: true,
        deliveries: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const userLat = lat ? parseFloat(lat as string) : 12.9716;
    const userLng = lng ? parseFloat(lng as string) : 77.5946;

    let result = donations.map((donation) => {
      const distance = calculateHaversineDistance(
        userLat,
        userLng,
        donation.latitude,
        donation.longitude
      );
      return {
        ...donation,
        distance
      };
    });

    if (maxDistance) {
      const maxKm = parseFloat(maxDistance as string);
      result = result.filter((d) => d.distance <= maxKm);
    }

    if (sortBy === 'nearest') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'quantity') {
      result.sort((a, b) => b.servings - a.servings);
    } else if (sortBy === 'endingSoon') {
      result.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch donations' });
  }
};

export const getDonationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            rating: true,
            verified: true,
            city: true
          }
        },
        requests: {
          include: {
            recipient: {
              select: { id: true, name: true, email: true, phone: true, rating: true, verified: true }
            }
          }
        },
        deliveries: {
          include: {
            volunteer: {
              select: { id: true, name: true, email: true, phone: true, rating: true, verified: true }
            }
          }
        },
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true, profileImage: true } }
          }
        }
      }
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const distance = calculateHaversineDistance(
      12.9716,
      77.5946,
      donation.latitude,
      donation.longitude
    );

    res.json({ ...donation, distance });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch donation details' });
  }
};

export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'DONOR' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Only registered Donors can create food listings.' });
    }

    const validated = donationSchema.parse(req.body);

    const donation = await prisma.donation.create({
      data: {
        donorId: req.user.id,
        foodName: validated.foodName,
        category: validated.category,
        description: validated.description,
        quantity: validated.quantity,
        unit: validated.unit,
        servings: validated.servings,
        dietaryType: validated.dietaryType,
        allergens: validated.allergens || null,
        preparedAt: new Date(validated.preparedAt),
        expiresAt: new Date(validated.expiresAt),
        pickupStart: new Date(validated.pickupStart),
        pickupEnd: new Date(validated.pickupEnd),
        address: validated.address,
        city: validated.city,
        latitude: validated.latitude,
        longitude: validated.longitude,
        imageUrl: validated.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        status: 'AVAILABLE'
      }
    });

    // Automatically create a Delivery entry in AVAILABLE status for volunteers
    await prisma.delivery.create({
      data: {
        donationId: donation.id,
        pickupLocation: donation.address + ', ' + donation.city,
        deliveryLocation: 'Recipient Address (TBD)',
        status: 'AVAILABLE'
      }
    });

    res.status(201).json({
      message: 'Food donation created successfully',
      donation
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    res.status(500).json({ error: error.message || 'Failed to create donation' });
  }
};

export const updateDonation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await prisma.donation.findUnique({ where: { id } });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.donorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to modify this donation.' });
    }

    if (donation.status === 'COMPLETED') {
      return res.status(400).json({ error: 'A completed donation cannot be modified.' });
    }

    const updated = await prisma.donation.update({
      where: { id },
      data: req.body
    });

    res.json({ message: 'Donation updated successfully', donation: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update donation' });
  }
};

export const deleteDonation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await prisma.donation.findUnique({ where: { id } });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.donorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this donation.' });
    }

    await prisma.donation.delete({ where: { id } });

    res.json({ message: 'Donation removed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete donation' });
  }
};
