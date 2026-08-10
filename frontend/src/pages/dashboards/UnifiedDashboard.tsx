import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Utensils, HeartHandshake, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Donation, FoodRequest, Delivery } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'DONATOR' | 'RECIPIENT' | 'VOLUNTEER'>('DONATOR');
  const [loading, setLoading] = useState(true);

  // Data
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [myRequests, setMyRequests] = useState<FoodRequest[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<Delivery[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (user) {
        const donations = await apiFetch<Donation[]>(`/donations?donorId=${user.id}`);
        setMyDonations(donations);

        const requests = await apiFetch<FoodRequest[]>('/requests');
        setMyRequests(requests);
      }

      const availableDels = await apiFetch<Delivery[]>('/deliveries?status=AVAILABLE');
      setAvailableDeliveries(availableDels);

      const allDels = await apiFetch<Delivery[]>('/deliveries');
      if (user) {
        setMyDeliveries(allDels.filter(d => d.volunteerId === user.id));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await apiFetch(`/requests/${requestId}/accept`, { method: 'POST' });
      showToast('Food request accepted!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept request.', 'error');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await apiFetch(`/requests/${requestId}/reject`, { method: 'POST' });
      showToast('Food request declined.', 'info');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to decline request.', 'error');
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/accept`, { method: 'POST' });
      showToast('Delivery route accepted!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept delivery.', 'error');
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Delivery status updated to ${status}!`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update delivery status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest">ShareBite Community Dashboard</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            As a ShareBite member, you can donate surplus food, request food packages, or volunteer to deliver meals anytime.
          </p>
        </div>

        <Link
          to="/donate"
          className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm shadow-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span>+ Donate Surplus Food</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DONATOR')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition flex items-center gap-2 ${
            activeTab === 'DONATOR'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>My Donations ({myDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RECIPIENT')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition flex items-center gap-2 ${
            activeTab === 'RECIPIENT'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>My Food Requests ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VOLUNTEER')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition flex items-center gap-2 ${
            activeTab === 'VOLUNTEER'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Volunteer Deliveries ({myDeliveries.length + availableDeliveries.length})</span>
        </button>
      </div>

      {/* TAB 1: MY DONATIONS */}
      {activeTab === 'DONATOR' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Food Donations Posted By You</h2>
            <Link to="/donate" className="text-xs font-bold text-emerald-700 hover:underline">+ New Donation</Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading your donations...</div>
          ) : myDonations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Food Donations Posted Yet</h3>
              <p className="text-xs text-slate-500">Share your surplus food with nearby communities in Bengaluru.</p>
              <Link
                to="/donate"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
              >
                + Donate Food Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDonations.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{d.category}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">{d.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{d.foodName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{d.description}</p>
                  
                  <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-2">
                    <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {d.address}</p>
                    <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Expires: {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  {/* Incoming requests for this donation */}
                  {d.requests && d.requests.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-800">Incoming Requests ({d.requests.length})</p>
                      {d.requests.map((req) => (
                        <div key={req.id} className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-2">
                          <p className="text-slate-700"><span className="font-bold">{req.recipient?.name}:</span> "{req.message}"</p>
                          {req.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptRequest(req.id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-emerald-700">{req.status}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY FOOD REQUESTS */}
      {activeTab === 'RECIPIENT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Food Requests Submitted By You</h2>
            <Link to="/find-food" className="text-xs font-bold text-sky-700 hover:underline">Find Food to Request</Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading your requests...</div>
          ) : myRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Active Food Requests</h3>
              <p className="text-xs text-slate-500">Explore available surplus food items in Bengaluru and request parcels.</p>
              <Link
                to="/find-food"
                className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition"
              >
                Find Food Near You
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">{req.status}</span>
                    <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{req.donation?.foodName}</h3>
                  <p className="text-xs text-slate-600">Your note: "{req.message}"</p>
                  <div className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                    <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {req.donation?.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VOLUNTEER DELIVERIES */}
      {activeTab === 'VOLUNTEER' && (
        <div className="space-y-8">
          
          {/* Active Deliveries */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Your Active Delivery Routes ({myDeliveries.length})</h2>

            {myDeliveries.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs text-slate-500 border border-slate-200">
                You have no active volunteer delivery routes right now. Accept a pickup route below!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myDeliveries.map((del) => (
                  <div key={del.id} className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{del.status}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base">{del.donation?.foodName}</h3>
                      <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Pickup:</span> {del.pickupLocation}</p>
                      <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Delivery:</span> {del.deliveryLocation}</p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      {del.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, 'COLLECTED')}
                          className="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                        >
                          Mark Food Collected 📦
                        </button>
                      )}
                      {del.status === 'COLLECTED' && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, 'DELIVERED')}
                          className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Mark Food Delivered 🚚
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Delivery Opportunities */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Available Pickup Opportunities ({availableDeliveries.length})</h2>

            {availableDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
                No open delivery routes waiting for pickup right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDeliveries.map((del) => (
                  <div key={del.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Available Route</span>
                    <h3 className="font-bold text-slate-900 text-base">{del.donation?.foodName}</h3>
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Pickup:</span> {del.pickupLocation}</p>
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Dropoff:</span> {del.deliveryLocation}</p>
                    
                    <button
                      onClick={() => handleAcceptDelivery(del.id)}
                      className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition mt-2"
                    >
                      Accept Volunteer Route
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
