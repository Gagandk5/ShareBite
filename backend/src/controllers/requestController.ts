import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id: donationId } = req.params;
    const { message } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true }
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.donorId === req.user.id) {
      return res.status(400).json({ error: 'A donor cannot request their own donation.' });
    }

    if (new Date() > new Date(donation.expiresAt) || donation.status === 'EXPIRED') {
      return res.status(400).json({ error: 'This donation has expired and cannot be requested.' });
    }

    if (donation.status !== 'AVAILABLE' && donation.status !== 'REQUESTED') {
      return res.status(400).json({ error: `This food donation is currently ${donation.status.toLowerCase()} and cannot be reserved.` });
    }

    const existingRequest = await prisma.foodRequest.findFirst({
      where: {
        donationId,
        recipientId: req.user.id,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You have already submitted a request for this donation.' });
    }

    const foodRequest = await prisma.foodRequest.create({
      data: {
        donationId,
        recipientId: req.user.id,
        message: message || 'Hello, I would like to request this surplus food donation for our community.',
        status: 'PENDING'
      }
    });

    // Update donation status to REQUESTED
    await prisma.donation.update({
      where: { id: donationId },
      data: { status: 'REQUESTED' }
    });

    // Notify Donor
    await prisma.notification.create({
      data: {
        userId: donation.donorId,
        title: 'New Food Request',
        message: `${req.user.name} requested your donation: "${donation.foodName}".`,
        type: 'DONATION_REQUEST'
      }
    });

    res.status(201).json({
      message: 'Request submitted successfully',
      foodRequest
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit request' });
  }
};

export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let requests;
    if (req.user.role === 'DONOR') {
      requests = await prisma.foodRequest.findMany({
        where: {
          donation: { donorId: req.user.id }
        },
        include: {
          donation: true,
          recipient: { select: { id: true, name: true, email: true, phone: true, rating: true, verified: true, city: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'RECIPIENT') {
      requests = await prisma.foodRequest.findMany({
        where: { recipientId: req.user.id },
        include: {
          donation: { include: { donor: { select: { id: true, name: true, phone: true, rating: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Admin or Volunteer view
      requests = await prisma.foodRequest.findMany({
        include: {
          donation: { include: { donor: true } },
          recipient: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch requests' });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    const requestItem = await prisma.foodRequest.findUnique({
      where: { id },
      include: {
        donation: true,
        recipient: true
      }
    });

    if (!requestItem) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Only donor of this donation or admin can approve/reject
    if (requestItem.donation.donorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only the donor can respond to requests for this donation.' });
    }

    const updatedRequest = await prisma.foodRequest.update({
      where: { id },
      data: { status }
    });

    if (status === 'ACCEPTED') {
      // Mark donation as RESERVED
      await prisma.donation.update({
        where: { id: requestItem.donationId },
        data: { status: 'RESERVED' }
      });

      // Update Delivery destination
      const recipientAddress = requestItem.recipient.city ? `${requestItem.recipient.name}, ${requestItem.recipient.city}` : `${requestItem.recipient.name} Address`;
      await prisma.delivery.updateMany({
        where: { donationId: requestItem.donationId },
        data: { deliveryLocation: recipientAddress }
      });

      // Reject all other pending requests for this donation
      await prisma.foodRequest.updateMany({
        where: {
          donationId: requestItem.donationId,
          id: { not: id },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });

      // Notify Recipient
      await prisma.notification.create({
        data: {
          userId: requestItem.recipientId,
          title: 'Food Request Accepted!',
          message: `Your request for "${requestItem.donation.foodName}" has been accepted by the donor.`,
          type: 'REQUEST_ACCEPTED'
        }
      });
    } else if (status === 'REJECTED') {
      // Check if there are other pending requests
      const remainingPending = await prisma.foodRequest.count({
        where: {
          donationId: requestItem.donationId,
          status: 'PENDING'
        }
      });

      if (remainingPending === 0) {
        await prisma.donation.update({
          where: { id: requestItem.donationId },
          data: { status: 'AVAILABLE' }
        });
      }

      await prisma.notification.create({
        data: {
          userId: requestItem.recipientId,
          title: 'Food Request Update',
          message: `Your request for "${requestItem.donation.foodName}" was not accepted.`,
          type: 'GENERAL'
        }
      });
    }

    res.json({
      message: `Request status updated to ${status}`,
      request: updatedRequest
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update request status' });
  }
};
