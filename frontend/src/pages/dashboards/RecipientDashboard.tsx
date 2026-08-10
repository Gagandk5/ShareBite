import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, HeartHandshake, UtensilsCrossed, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { FoodRequest, Donation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const RecipientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [nearbyDonations, setNearbyDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [reqData, donationsData] = await Promise.all([
        apiFetch<FoodRequest[]>('/requests'),
        apiFetch<Donation[]>('/donations?status=AVAILABLE')
      ]);
      setRequests(reqData);
      setNearbyDonations(donationsData);
    } catch (err) {
      console.error('Failed to load recipient dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleConfirmReceipt = async (donationId: string) => {
    try {
      const deliveries = await apiFetch<any[]>(`/deliveries?status=DELIVERED`);
      const target = deliveries.find((d) => d.donationId === donationId);
      if (target) {
        await apiFetch(`/deliveries/${target.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'COMPLETED' })
        });
        showToast('Receipt confirmed! Thank you for reducing food waste.', 'success');
        loadData();
      } else {
        showToast('Delivery record not ready for completion.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm receipt', 'error');
    }
  };

  const activeRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'ACCEPTED');
  const completedRequests = requests.filter((r) => r.donation?.status === 'COMPLETED');
  const totalMealsReceived = completedRequests.reduce((sum, r) => sum + (r.donation?.servings || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Recipient & Shelter Portal</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-300">Discover surplus food listings, manage requests, and confirm food delivery receipts.</p>
        </div>

        <Link
          to="/find-food"
          className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Search className="w-5 h-5" />
          <span>Browse Food Discovery</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Available Nearby</span>
          <p className="text-2xl font-extrabold text-slate-900">{nearbyDonations.length}</p>
          <span className="text-[10px] text-sky-600 font-semibold">Ready to request</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Requests</span>
          <p className="text-2xl font-extrabold text-amber-600">{activeRequests.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold">In progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Requests</span>
          <p className="text-2xl font-extrabold text-emerald-600">{completedRequests.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Successfully received</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Meals Received</span>
          <p className="text-2xl font-extrabold text-purple-600">{totalMealsReceived}</p>
          <span className="text-[10px] text-slate-500 font-medium">Community impact</span>
        </div>
      </div>

      {/* Active Requests Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Requested Donations & Status</h2>

        {requests.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">You haven't requested any food donations yet.</p>
            <Link to="/find-food" className="inline-block px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl">
              Explore Available Food
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{r.donation?.foodName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Status: {r.donation?.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Donor: {r.donation?.donor?.name} ({r.donation?.servings} Servings)</p>
                </div>

                <div className="flex items-center gap-3">
                  {r.donation?.status === 'DELIVERED' && (
                    <button
                      onClick={() => handleConfirmReceipt(r.donationId)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Confirm Receipt
                    </button>
                  )}
                  <Link
                    to={`/donations/${r.donationId}`}
                    className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
