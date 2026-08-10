import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UtensilsCrossed, Users, CheckCircle2, Clock, AlertCircle, Trash2, ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Donation, FoodRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [donationsData, requestsData] = await Promise.all([
        apiFetch<Donation[]>(`/donations?donorId=${user?.id}`),
        apiFetch<FoodRequest[]>('/requests')
      ]);
      setDonations(donationsData);
      setRequests(requestsData);
    } catch (err) {
      console.error('Failed to load donor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRequestAction = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiFetch(`/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Request ${status.toLowerCase()}!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    if (!window.confirm('Are you sure you want to remove this donation listing?')) return;
    try {
      await apiFetch(`/donations/${donationId}`, { method: 'DELETE' });
      showToast('Donation removed.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const activeDonations = donations.filter((d) => ['AVAILABLE', 'REQUESTED', 'RESERVED', 'PICKUP_ASSIGNED', 'COLLECTED', 'DELIVERED'].includes(d.status));
  const completedDonations = donations.filter((d) => d.status === 'COMPLETED');
  const totalServingsRescued = completedDonations.reduce((sum, d) => sum + d.servings, 0);
  const totalKgRescued = completedDonations.reduce((sum, d) => sum + d.quantity, 0);
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Donor Management Hub</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-300">Track surplus food listings, manage recipient requests, and view community impact.</p>
        </div>

        <Link
          to="/donate"
          className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Create Food Donation</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Listed</span>
          <p className="text-2xl font-extrabold text-slate-900">{donations.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">{activeDonations.length} Active Now</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Meals Provided</span>
          <p className="text-2xl font-extrabold text-emerald-600">{totalServingsRescued}</p>
          <span className="text-[10px] text-slate-500 font-medium">({totalKgRescued} kg food rescued)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Rescue</span>
          <p className="text-2xl font-extrabold text-teal-600">{completedDonations.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Verified completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Requests</span>
          <p className="text-2xl font-extrabold text-amber-600">{pendingRequests.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Requires approval</span>
        </div>
      </div>

      {/* Incoming Recipient Requests Queue */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Pending Incoming Requests ({pendingRequests.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{r.recipient?.name}</span>
                  <span className="text-emerald-700">{r.donation?.foodName}</span>
                </div>
                <p className="text-slate-600 italic">"{r.message}"</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleRequestAction(r.id, 'ACCEPTED')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleRequestAction(r.id, 'REJECTED')}
                    className="py-2 px-3 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Managed Donations Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Food Donation Listings</h2>

        {donations.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">You have not created any food listings yet.</p>
            <Link to="/donate" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
              Create Your First Donation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Food Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Servings</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={d.imageUrl || ''} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span>{d.foodName}</span>
                    </td>
                    <td className="p-3 text-slate-600">{d.category}</td>
                    <td className="p-3 text-emerald-700 font-bold">{d.servings} Servings</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        to={`/donations/${d.id}`}
                        className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                      >
                        <span>Manage</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteDonation(d.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
