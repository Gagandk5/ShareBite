export type Role = 'DONOR' | 'RECIPIENT' | 'VOLUNTEER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  profileImage?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rating: number;
  verified: boolean;
  status?: string;
  createdAt: string;
}

export type DonationStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'RESERVED'
  | 'PICKUP_ASSIGNED'
  | 'COLLECTED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Donation {
  id: string;
  donorId: string;
  donor?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    rating: number;
    verified: boolean;
    city?: string;
  };
  foodName: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  servings: number;
  dietaryType: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN';
  allergens?: string | null;
  preparedAt: string;
  expiresAt: string;
  pickupStart: string;
  pickupEnd: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  status: DonationStatus;
  distance?: number;
  createdAt: string;
  updatedAt: string;
  requests?: FoodRequest[];
  deliveries?: Delivery[];
  reviews?: Review[];
}

export interface FoodRequest {
  id: string;
  donationId: string;
  recipientId: string;
  message?: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  recipient?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    rating: number;
    verified: boolean;
    city?: string;
  };
  donation?: Donation;
}

export interface Delivery {
  id: string;
  donationId: string;
  volunteerId?: string | null;
  pickupLocation: string;
  deliveryLocation: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'COLLECTED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  acceptedAt?: string | null;
  collectedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  donation?: Donation;
  volunteer?: {
    id: string;
    name: string;
    phone?: string;
    rating: number;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  donationId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string | null;
  donationId?: string | null;
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reporter?: { id: string; name: string; email: string };
  reportedUser?: { id: string; name: string; email: string; status: string };
  donation?: { id: string; foodName: string; status: string };
}

export interface PublicStats {
  foodRescuedKg: number;
  mealsProvided: number;
  completedDonations: number;
  totalDonations: number;
  totalUsers: number;
  volunteersCount: number;
  donorsCount: number;
  recipientsCount: number;
  estimatedCo2AvoidedKg: number;
}
