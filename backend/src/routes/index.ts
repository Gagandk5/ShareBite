import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import {
  getDonations,
  getMyDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation
} from '../controllers/donationController';
import {
  createRequest,
  getRequests,
  updateRequestStatus
} from '../controllers/requestController';
import {
  getDeliveries,
  acceptDelivery,
  updateDeliveryStatus
} from '../controllers/deliveryController';
import {
  getNotifications,
  markAsRead
} from '../controllers/notificationController';
import {
  getMessages,
  sendMessage
} from '../controllers/messageController';
import {
  createReview,
  getUserReviews
} from '../controllers/reviewController';
import {
  createReport,
  getReports,
  updateReportStatus,
  adminActionUser
} from '../controllers/reportController';
import {
  getPublicStats,
  getAdminAnalytics
} from '../controllers/statsController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

// --- Public / Impact Stats ---
router.get('/stats/public', getPublicStats);
router.get('/admin/analytics', authenticate, authorizeRoles('ADMIN'), getAdminAnalytics);

// --- Donation Routes ---
router.get('/donations', getDonations);
router.get('/donations/me', authenticate, getMyDonations);
router.get('/donations/:id', getDonationById);
router.post('/donations', authenticate, createDonation);
router.patch('/donations/:id', authenticate, updateDonation);
router.delete('/donations/:id', authenticate, deleteDonation);

// --- Food Request Routes ---
router.post('/donations/:id/request', authenticate, createRequest);
router.get('/requests', authenticate, getRequests);
router.patch('/requests/:id', authenticate, updateRequestStatus);

// --- Delivery Routes ---
router.get('/deliveries', authenticate, getDeliveries);
router.post('/deliveries/:id/accept', authenticate, acceptDelivery);
router.patch('/deliveries/:id/status', authenticate, updateDeliveryStatus);

// --- Notification Routes ---
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markAsRead);

// --- Messaging Routes ---
router.get('/messages/:donationId', authenticate, getMessages);
router.post('/messages/:donationId', authenticate, sendMessage);

// --- Review Routes ---
router.post('/reviews', authenticate, createReview);
router.get('/users/:id/reviews', getUserReviews);

// --- Report Routes ---
router.post('/reports', authenticate, createReport);
router.get('/admin/reports', authenticate, authorizeRoles('ADMIN'), getReports);
router.patch('/admin/reports/:id', authenticate, authorizeRoles('ADMIN'), updateReportStatus);
router.post('/admin/user-action', authenticate, authorizeRoles('ADMIN'), adminActionUser);

export default router;
