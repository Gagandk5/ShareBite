import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { reportSchema } from '../validators';

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validated = reportSchema.parse(req.body);

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        reportedUserId: validated.reportedUserId || null,
        donationId: validated.donationId || null,
        reason: validated.reason,
        description: validated.description,
        status: 'OPEN'
      }
    });

    res.status(201).json({
      message: 'Report submitted successfully. Our team will inspect this issue promptly.',
      report
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    res.status(500).json({ error: error.message || 'Failed to submit report' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true, role: true } },
        reportedUser: { select: { id: true, name: true, email: true, status: true } },
        donation: { select: { id: true, foodName: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch reports' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body; // OPEN, UNDER_REVIEW, RESOLVED, DISMISSED

    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' || status === 'DISMISSED' ? new Date() : null
      }
    });

    res.json({ message: `Report status updated to ${status}`, report });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update report' });
  }
};

export const adminActionUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId, action } = req.body; // SUSPEND, ACTIVATE

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: action === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE' }
    });

    res.json({ message: `User status changed to ${user.status}`, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update user status' });
  }
};
