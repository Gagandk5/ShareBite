import React from 'react';
import { Link } from 'react-router-dom';
import { Donation } from '../types';
import { MapPin, Clock, Users, Leaf, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DonationCardProps {
  donation: Donation;
}

export const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
  const isAvailable = donation.status === 'AVAILABLE';
  const isRequested = donation.status === 'REQUESTED';

  const getDietaryBadge = (type: string) => {
    switch (type) {
      case 'VEGAN':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Leaf className="w-3 h-3" /> Vegan</span>;
      case 'VEGETARIAN':
        return <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Leaf className="w-3 h-3" /> Veg</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Non-Veg</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; style: string }> = {
      AVAILABLE: { label: 'Available', style: 'bg-emerald-500 text-white' },
      REQUESTED: { label: 'Requested', style: 'bg-amber-500 text-white' },
      RESERVED: { label: 'Reserved', style: 'bg-purple-600 text-white' },
      PICKUP_ASSIGNED: { label: 'Driver Assigned', style: 'bg-indigo-600 text-white' },
      COLLECTED: { label: 'Picked Up', style: 'bg-blue-600 text-white' },
      DELIVERED: { label: 'Delivered', style: 'bg-teal-600 text-white' },
      COMPLETED: { label: 'Rescued', style: 'bg-slate-700 text-white' },
      EXPIRED: { label: 'Expired', style: 'bg-rose-500 text-white' }
    };
    const item = map[status] || { label: status, style: 'bg-slate-500 text-white' };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${item.style}`}>
        {item.label}
      </span>
    );
  };

  // Expiry time formatting
  const expiryDate = new Date(donation.expiresAt);
  const isExpiringSoon = expiryDate.getTime() - new Date().getTime() < 3 * 3600 * 1000;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Image Header with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {getStatusBadge(donation.status)}
          {getDietaryBadge(donation.dietaryType)}
        </div>

        {/* Category Pill Right */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {donation.category}
          </span>
        </div>

        {/* Quantity & Servings overlay bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{donation.servings} Servings</span>
            <span className="text-slate-300">({donation.quantity} {donation.unit})</span>
          </div>

          {donation.distance !== undefined && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{donation.distance} km</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-emerald-600 transition">
            {donation.foodName}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {donation.description}
          </p>

          {/* Donor Info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200">
                {donation.donor?.name.charAt(0) || 'D'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 truncate max-w-[150px] flex items-center gap-1">
                  {donation.donor?.name || 'Community Donor'}
                  {donation.donor?.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </span>
                {donation.donor?.phone && (
                  <a href={`tel:${donation.donor.phone}`} className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                    📞 {donation.donor.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Timing & Action CTA */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 font-medium ${isExpiringSoon ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Best before: {expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <Link
            to={`/donations/${donation.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md"
          >
            <span>View Donation Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
