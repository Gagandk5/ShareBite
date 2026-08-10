import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getDeliveries = async (req: AuthRequest, res: Response) => {
  try {
    const { status, volunteerId } = req.query;

    const where: any = {};
    if (status) {
      where.status = status as string;
    }
    if (volunteerId) {
      where.volunteerId = volunteerId as string;
    }

    const deliveries = await prisma.delivery.findMany({
      where,
      include: {
        donation: {
          include: {
            donor: { select: { id: true, name: true, phone: true, city: true } },
            requests: {
              where: { status: 'ACCEPTED' },
              include: { recipient: { select: { id: true, name: true, phone: true, city: true } } }
            }
          }
        },
        volunteer: { select: { id: true, name: true, phone: true, rating: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(deliveries);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch deliveries' });
  }
};

export const acceptDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || (req.user.role !== 'VOLUNTEER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Only registered Volunteers can accept delivery tasks.' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { donation: true }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery task not found.' });
    }

    if (delivery.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'This delivery task is no longer available.' });
    }

    // Check overlap rule: Ensure volunteer has no active delivery task in overlapping pickup time window
    const activeVolunteerDeliveries = await prisma.delivery.findMany({
      where: {
        volunteerId: req.user.id,
        status: { in: ['ASSIGNED', 'COLLECTED'] }
      },
      include: { donation: true }
    });

    const targetStart = new Date(delivery.donation.pickupStart).getTime();
    const targetEnd = new Date(delivery.donation.pickupEnd).getTime();

    for (const active of activeVolunteerDeliveries) {
      const activeStart = new Date(active.donation.pickupStart).getTime();
      const activeEnd = new Date(active.donation.pickupEnd).getTime();
      if (Math.max(targetStart, activeStart) < Math.min(targetEnd, activeEnd)) {
        return res.status(400).json({
          error: 'Time conflict: You already have an active delivery during this pickup time window.'
        });
      }
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        volunteerId: req.user.id,
        status: 'ASSIGNED',
        acceptedAt: new Date()
      }
    });

    // Update donation status to PICKUP_ASSIGNED
    await prisma.donation.update({
      where: { id: delivery.donationId },
      data: { status: 'PICKUP_ASSIGNED' }
    });

    // Notify Donor
    await prisma.notification.create({
      data: {
        userId: delivery.donation.donorId,
        title: 'Volunteer Assigned',
        message: `Volunteer ${req.user.name} accepted the pickup for "${delivery.donation.foodName}".`,
        type: 'VOLUNTEER_ASSIGNED'
      }
    });

    res.json({
      message: 'Delivery task accepted successfully!',
      delivery: updatedDelivery
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to accept delivery task' });
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // COLLECTED, DELIVERED, COMPLETED

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        donation: {
          include: {
            donor: true,
            requests: { where: { status: 'ACCEPTED' }, include: { recipient: true } }
          }
        }
      }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery task not found.' });
    }

    // Only assigned volunteer or admin or recipient (for confirming completion)
    if (
      delivery.volunteerId !== req.user?.id &&
      req.user?.role !== 'ADMIN' &&
      !(status === 'COMPLETED' && delivery.donation.requests[0]?.recipientId === req.user?.id)
    ) {
      return res.status(403).json({ error: 'You are not authorized to update this delivery task.' });
    }

    const updateData: any = { status };
    const donationUpdateData: any = { status };

    const now = new Date();

    if (status === 'COLLECTED') {
      updateData.collectedAt = now;
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = now;
    } else if (status === 'COMPLETED') {
      updateData.completedAt = now;
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: updateData
    });

    await prisma.donation.update({
      where: { id: delivery.donationId },
      data: donationUpdateData
    });

    const recipient = delivery.donation.requests[0]?.recipient;

    // Trigger Notifications
    if (status === 'COLLECTED') {
      await prisma.notification.create({
        data: {
          userId: delivery.donation.donorId,
          title: 'Food Collected',
          message: `Your donation "${delivery.donation.foodName}" has been collected by the volunteer.`,
          type: 'COLLECTED'
        }
      });
      if (recipient) {
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: 'On the Way!',
            message: `Volunteer is on the way to deliver "${delivery.donation.foodName}".`,
            type: 'COLLECTED'
          }
        });
      }
    } else if (status === 'DELIVERED') {
      if (recipient) {
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: 'Food Delivered!',
            message: `Your food "${delivery.donation.foodName}" has arrived. Please confirm receipt.`,
            type: 'DELIVERED'
          }
        });
      }
    } else if (status === 'COMPLETED') {
      await prisma.notification.create({
        data: {
          userId: delivery.donation.donorId,
          title: 'Donation Completed! 🎉',
          message: `Your donation "${delivery.donation.foodName}" rescued ${delivery.donation.servings} meals!`,
          type: 'GENERAL'
        }
      });
    }

    res.json({
      message: `Delivery status updated to ${status}`,
      delivery: updatedDelivery
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update delivery status' });
  }
};
