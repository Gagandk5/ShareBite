import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { donationId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await prisma.message.findMany({
      where: {
        donationId
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { donationId } = req.params;
    const { receiverId, message } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Default receiverId to donorId if not specified
    let targetReceiverId = receiverId;
    if (!targetReceiverId) {
      const donation = await prisma.donation.findUnique({ where: { id: donationId } });
      targetReceiverId = donation?.donorId || req.user.id;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: targetReceiverId,
        donationId,
        message: message.trim()
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      }
    });

    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
};
