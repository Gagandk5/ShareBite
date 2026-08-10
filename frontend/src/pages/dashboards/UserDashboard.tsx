import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Truck,
  HeartHandshake,
  Search,
  Check,
  Package,
  RotateCw
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Donation, FoodRequest, Delivery } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'donations' | 'requests' | 'deliveries'>('donations');
  const [loading, setLoading] = useState(true);

  // Data states
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FoodRequest[]>([]);
  const [myRequests, setMyRequests] = useState<FoodRequest[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const loadAllData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [donationsData, requestsData, myRequestsData, deliveriesData] = await Promise.all([
        apiFetch<Donation[]>(`/donations?donorId=${user.id}`),
        apiFetch<FoodRequest[]>('/requests'),
        apiFetch<FoodRequest[]>('/requests/me'),
        apiFetch<Delivery[]>('/deliveries')
      ]);

      setMyDonations(donationsData);
      setIncomingRequests(requestsData);
      setMyRequests(myRequestsData);
      setDeliveries(deliveriesData);
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id, location.pathname, location.key]);

  // Actions
  const handleRequestAction = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiFetch(`/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Request ${status.toLowerCase()}!`, 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    if (!window.confirm('Are you sure you want to remove this donation listing?')) return;
    try {
      await apiFetch(`/donations/${donationId}`, { method: 'DELETE' });
      showToast('Donation removed.', 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/accept`, { method: 'POST' });
      showToast('Delivery route accepted!', 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept delivery', 'error');
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, status: 'COLLECTED' | 'DELIVERED' | 'COMPLETED') => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Delivery status updated to ${status}`, 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const pendingIncomingRequests = incomingRequests.filter((r) => r.status === 'PENDING');
  const myActiveDeliveries = deliveries.filter((d) => d.volunteerId === user?.id && d.status !== 'COMPLETED');
  const availableDeliveries = deliveries.filter((d) => d.status === 'AVAILABLE');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <span>✨ ShareBite Member</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name || 'Community Member'}!</h1>
          <p className="text-xs text-slate-300">
            You have full access to donate food, request food, or volunteer for pickup routes in Bengaluru.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => loadAllData()}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1.5"
            title="Refresh dashboard data"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/donate"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Donate Food</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{myDonations.length}</p>
            <p className="text-xs font-semibold text-slate-500">My Food Donations</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{myRequests.length}</p>
            <p className="text-xs font-semibold text-slate-500">Food Requests Made</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{deliveries.filter(d => d.volunteerId === user?.id).length}</p>
            <p className="text-xs font-semibold text-slate-500">Volunteer Deliveries</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Tab Header Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'donations'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
            <span>My Donations ({myDonations.length})</span>
            {pendingIncomingRequests.length > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center">
                {pendingIncomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-sky-600" />
            <span>My Food Requests ({myRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'deliveries'
                ? 'bg-white text-purple-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-purple-600" />
            <span>Volunteer Routes ({myActiveDeliveries.length + availableDeliveries.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6">
          
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Syncing user activity...</p>
            </div>
          ) : activeTab === 'donations' ? (
            
            /* TAB 1: MY DONATIONS & INCOMING REQUESTS */
            <div className="space-y-8">
              
              {/* Incoming Requests Section */}
              {pendingIncomingRequests.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-rose-600">
                    <Clock className="w-4 h-4" />
                    Incoming Recipient Requests ({pendingIncomingRequests.length})
                  </h3>

                  <div className="space-y-3">
                    {pendingIncomingRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-slate-900">{req.recipient?.name}</p>
                          <p className="text-xs text-slate-600 font-medium">{req.message || 'Requested food parcel'}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleRequestAction(req.id, 'ACCEPTED')}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'REJECTED')}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Donations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">My Posted Food Listings</h3>
                  <Link to="/donate" className="text-xs font-bold text-emerald-700 hover:underline">
                    + Post New Food
                  </Link>
                </div>

                {myDonations.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <UtensilsCrossed className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No Food Donations Posted Yet</p>
                    <p className="text-xs text-slate-500">Have excess edible food? Post a listing to help local communities.</p>
                    <Link
                      to="/donate"
                      className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                    >
                      Donate Food Now
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myDonations.map((d) => (
                      <div key={d.id} className="p-4 rounded-2xl border border-slate-200 flex gap-4 bg-white hover:shadow-sm transition">
                        <img src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} alt={d.foodName} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{d.foodName}</h4>
                            <button onClick={() => handleDeleteDonation(d.id)} className="text-slate-400 hover:text-rose-600 transition" title="Delete listing">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500">{d.quantity} {d.unit} ({d.servings} Servings)</p>
                          <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : activeTab === 'requests' ? (
            
            /* TAB 2: MY REQUESTED FOOD */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Food Parcels Requested</h3>
                <Link to="/find-food" className="text-xs font-bold text-sky-700 hover:underline">
                  Browse Find Food
                </Link>
              </div>

              {myRequests.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Food Requests Made</p>
                  <p className="text-xs text-slate-500">Explore active food donations available across Bengaluru.</p>
                  <Link to="/find-food" className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md">
                    Find Food Available
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm">{req.donation?.foodName || 'Food Donation'}</p>
                        <p className="text-xs text-slate-500">Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            
            /* TAB 3: VOLUNTEER ROUTES & AVAILABLE PICKUPS */
            <div className="space-y-8">
              
              {/* My Active Volunteer Deliveries */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">My Active Pickup Routes</h3>

                {myActiveDeliveries.length === 0 ? (
                  <p className="text-xs text-slate-500">You currently have no active accepted pickup routes.</p>
                ) : (
                  <div className="space-y-3">
                    {myActiveDeliveries.map((del) => (
                      <div key={del.id} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-sm">{del.donation?.foodName || 'Food Route'}</p>
                          <p className="text-xs text-slate-600">Pickup: {del.pickupLocation}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {del.status === 'ASSIGNED' && (
                            <button
                              onClick={() => handleUpdateDeliveryStatus(del.id, 'COLLECTED')}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition"
                            >
                              Mark Collected
                            </button>
                          )}
                          {del.status === 'COLLECTED' && (
                            <button
                              onClick={() => handleUpdateDeliveryStatus(del.id, 'DELIVERED')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Delivery Opportunities */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Available Delivery Opportunities</h3>

                {availableDeliveries.length === 0 ? (
                  <p className="text-xs text-slate-500">No open pickup routes available right now.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableDeliveries.map((del) => (
                      <div key={del.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{del.donation?.foodName || 'Food Transport'}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">From: {del.pickupLocation}</p>
                        </div>
                        <button
                          onClick={() => handleAcceptDelivery(del.id)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shrink-0 transition"
                        >
                          Accept Route
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
