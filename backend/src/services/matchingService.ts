/**
 * ShareBite AI Food Matching Engine (Option F Implementation)
 * Computes multi-factor priority match scores between surplus food donations and recipients.
 */

export interface LocationCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface DonationData {
  id: string;
  latitude: number;
  longitude: number;
  quantity: number;
  servings: number;
  expiresAt: Date | string;
  pickupStart: Date | string;
  pickupEnd: Date | string;
}

export interface RecipientData {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  verified?: boolean;
  role?: string;
  capacity?: number; // Estimated servings or people capacity
  needTier?: number; // 1 (Highest, e.g. Shelter) to 3 (Individual)
}

export interface MatchBreakdown {
  distanceKm: number;
  distanceScore: number;
  urgencyHoursLeft: number;
  urgencyScore: number;
  capacityScore: number;
  needScore: number;
  availabilityScore: number;
  weightsUsed: {
    distance: number;
    urgency: number;
    capacity: number;
    need: number;
    availability: number;
  };
}

export interface MatchResult {
  aiMatchScore: number; // 0 - 100
  badgeLabel: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'purple';
  breakdown: MatchBreakdown;
}

/**
 * Calculates the Haversine distance in kilometers between two lat/lng coordinates.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculates the AI Priority Match Score (0 - 100) for a given donation and recipient.
 */
export function calculateAIMatchScore(
  donation: DonationData,
  recipient: RecipientData
): MatchResult {
  // 1. Distance Calculation & Score
  const donorLat = donation.latitude || 28.6139; // Default fallback to Delhi center if unassigned
  const donorLon = donation.longitude || 77.209;
  const recipLat = recipient.latitude || donorLat + 0.015;
  const recipLon = recipient.longitude || donorLon + 0.015;

  const distanceKm = calculateHaversineDistance(donorLat, donorLon, recipLat, recipLon);
  // Linear decay: 100 points at 0km, decreases by 8 points per km (min 10)
  const distanceScore = Math.max(10, Math.min(100, Math.round(100 - distanceKm * 8)));

  // 2. Expiration Urgency Score
  const now = new Date().getTime();
  const expiresAtMs = new Date(donation.expiresAt).getTime();
  const urgencyHoursLeft = Math.max(0.1, Math.round(((expiresAtMs - now) / (1000 * 60 * 60)) * 10) / 10);

  // If < 2 hrs left, urgency score is 100. If 24 hrs left, urgency score is 30.
  let urgencyScore = 50;
  if (urgencyHoursLeft <= 2) {
    urgencyScore = 100;
  } else if (urgencyHoursLeft <= 6) {
    urgencyScore = 85;
  } else if (urgencyHoursLeft <= 12) {
    urgencyScore = 65;
  } else {
    urgencyScore = 40;
  }

  // 3. Capacity Score
  const requiredServings = donation.servings || donation.quantity || 1;
  const recipientCap = recipient.capacity || 20; // Default capacity assumption
  const capRatio = recipientCap / requiredServings;
  let capacityScore = 50;
  if (capRatio >= 0.8 && capRatio <= 2.5) {
    capacityScore = 100; // Perfect fit
  } else if (capRatio > 2.5) {
    capacityScore = 80; // Recipient can easily absorb it
  } else {
    capacityScore = Math.max(20, Math.round(capRatio * 100)); // Partial match
  }

  // 4. Need Level Score
  // Verified organizations / high tier get priority
  let needScore = 60;
  if (recipient.needTier === 1 || recipient.role === 'RECIPIENT') {
    needScore = recipient.verified ? 95 : 80;
  } else if (recipient.verified) {
    needScore = 85;
  }

  // 5. Pickup Velocity / Availability Score
  const pickupStartMs = new Date(donation.pickupStart || now).getTime();
  const pickupEndMs = new Date(donation.pickupEnd || expiresAtMs).getTime();
  let availabilityScore = 75;
  if (now >= pickupStartMs && now <= pickupEndMs) {
    availabilityScore = 95; // Pickup window active now!
  }

  // Dynamic Weighting Logic:
  // If urgency is critical (< 3 hrs), boost Urgency & Availability weights
  const isCritical = urgencyHoursLeft < 3;
  const weights = isCritical
    ? { distance: 0.25, urgency: 0.35, capacity: 0.15, need: 0.10, availability: 0.15 }
    : { distance: 0.25, urgency: 0.20, capacity: 0.25, need: 0.15, availability: 0.15 };

  const rawScore =
    distanceScore * weights.distance +
    urgencyScore * weights.urgency +
    capacityScore * weights.capacity +
    needScore * weights.need +
    availabilityScore * weights.availability;

  const aiMatchScore = Math.min(99, Math.max(45, Math.round(rawScore)));

  // Determine Badge Label & Color
  let badgeLabel = 'Good Match';
  let badgeColor: 'emerald' | 'amber' | 'blue' | 'purple' = 'blue';

  if (aiMatchScore >= 90) {
    badgeLabel = '⚡ Prime AI Match';
    badgeColor = 'emerald';
  } else if (aiMatchScore >= 80) {
    badgeLabel = '🔥 Top Urgency Fit';
    badgeColor = 'purple';
  } else if (aiMatchScore >= 70) {
    badgeLabel = '📍 Nearest Recipient';
    badgeColor = 'emerald';
  } else {
    badgeLabel = 'Standard Match';
    badgeColor = 'amber';
  }

  return {
    aiMatchScore,
    badgeLabel,
    badgeColor,
    breakdown: {
      distanceKm,
      distanceScore,
      urgencyHoursLeft,
      urgencyScore,
      capacityScore,
      needScore,
      availabilityScore,
      weightsUsed: weights
    }
  };
}
