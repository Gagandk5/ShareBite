import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { reviewSchema } from '../validators';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validated = reviewSchema.parse(req.body);

    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.id,
        reviewedUserId: validated.reviewedUserId,
        donationId: validated.donationId,
        rating: validated.rating,
        comment: validated.comment || null
      }
    });

    // Recalculate average rating for reviewed user
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: validated.reviewedUserId }
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

    await prisma.user.update({
      where: { id: validated.reviewedUserId },
      data: { rating: avgRating }
    });

    res.status(201).json({
      message: 'Thank you for your rating!',
      review
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    res.status(500).json({ error: error.message || 'Failed to submit review' });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: id },
      include: {
        reviewer: { select: { id: true, name: true, profileImage: true, role: true } },
        donation: { select: { id: true, foodName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
  }
};
