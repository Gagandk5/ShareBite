import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number is required').regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number (e.g. +91 9876543210)'),
  role: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const donationSchema = z.object({
  foodName: z.string().min(2, 'Food name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  servings: z.number().int().positive('Servings must be a positive integer'),
  dietaryType: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN']),
  allergens: z.string().optional(),
  preparedAt: z.string(),
  expiresAt: z.string(),
  pickupStart: z.string(),
  pickupEnd: z.string(),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional()
});

export const requestSchema = z.object({
  message: z.string().optional()
});

export const reviewSchema = z.object({
  reviewedUserId: z.string(),
  donationId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(300, 'Comment max 300 characters').optional()
});

export const reportSchema = z.object({
  reportedUserId: z.string().optional(),
  donationId: z.string().optional(),
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().min(5, 'Description is required')
});
