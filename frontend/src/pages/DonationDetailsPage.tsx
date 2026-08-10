import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Star,
  Leaf,
  ChevronRight,
  ArrowLeft,
  Truck,
  HeartHandshake,
  Phone
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { Donation, FoodRequest, Delivery } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ReportModal } from '../components/ReportModal';
import { ReviewModal } from '../components/ReviewModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { LeafletMap } from '../components/LeafletMap';

export const DonationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const data = await apiFetch<Donation>(`/donations/${id}`);
      setDonation(data);
    } catch (err: any) {
      showToast('Failed to load donation details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-semibold">Loading donation details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Donation Not Found</h2>
        <p className="text-xs text-slate-500">This food listing may have been removed or expired.</p>
        <button
          onClick={() => navigate('/find-food')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Back to Food Discovery
        </button>
      </div>
    );
  }

  const isDonor = user?.id === donation.donorId;
  const isAvailable = donation.status === 'AVAILABLE';

  // Request Submission by Recipient
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    try {
      await apiFetch(`/donations/${donation.id}/request`, {
        method: 'POST',
        body: JSON.stringify({ message: requestMessage })
      });
      showToast('Food request submitted to donor!', 'success');
      setRequestModalOpen(false);
      fetchDetails();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit request.', 'error');
    } finally {
      setRequestSubmitting(false);
    }
  };

  // Donor Approves Request
  const handleRequestAction = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiFetch(`/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Request ${status.toLowerCase()}!`, 'success');
      fetchDetails();
    } catch (err: any) {
      showToast(err.message || 'Failed to update request.', 'error');
    }
  };

  // Volunteer Accepts Delivery Task
  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/accept`, { method: 'POST' });
      showToast('Delivery task accepted! Added to your schedule.', 'success');
      fetchDetails();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept delivery.', 'error');
    }
  };

  // Stepper steps definition
  const steps = [
    { key: 'AVAILABLE', label: 'Available' },
    { key: 'REQUESTED', label: 'Requested' },
    { key: 'RESERVED', label: 'Reserved' },
    { key: 'PICKUP_ASSIGNED', label: 'Driver Assigned' },
    { key: 'COLLECTED', label: 'Collected' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'COMPLETED', label: 'Completed' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === donation.status);
  const activeDelivery = donation.deliveries?.[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image & Workflow Stepper (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            <img
              src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
              alt={donation.foodName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-emerald-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                {donation.status}
              </span>
              <span className="bg-white/90 backdrop-blur-md text-slate-800 font-bold text-xs px-3 py-1 rounded-full">
                {donation.category}
              </span>
            </div>
          </div>

          {/* Interactive Workflow Stepper Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Donation Rescue Lifecycle</span>
              <span className="text-xs text-emerald-600 font-bold">Status: {donation.status}</span>
            </h3>

            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
              {steps.map((s, idx) => {
                const isPassed = idx <= (currentStepIndex >= 0 ? currentStepIndex : 0);
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={s.key} className="flex flex-col items-center min-w-[70px] text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-medium mt-1.5 ${isCurrent ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Pickup Location & Radius
            </h3>
            <p className="text-xs text-slate-500">{donation.address}, {donation.city}</p>
            <div className="h-56">
              <LeafletMap donations={[donation]} center={[donation.latitude, donation.longitude]} zoom={14} />
            </div>
          </div>

        </div>

        {/* Right Column: Information & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>{donation.dietaryType}</span>
                {donation.allergens && (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                    Allergens: {donation.allergens}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {donation.foodName}
              </h1>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {donation.description}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">QUANTITY</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {donation.quantity} {donation.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">SERVINGS</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {donation.servings} Servings
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">BEST BEFORE</span>
                <span className="font-semibold text-rose-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(donation.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">DISTANCE</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {donation.distance !== undefined ? `${donation.distance} km` : 'Nearby'}
                </span>
              </div>
            </div>

            {/* Donor Profile & Contact Card */}
            <div className="p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                    {donation.donor?.name.charAt(0) || 'D'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{donation.donor?.name || 'Community Donor'}</span>
                      {donation.donor?.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{donation.donor?.city || 'Bengaluru'}, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-slate-200 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{donation.donor?.rating || 5.0}</span>
                </div>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              {donation.donor?.phone && (
                <div className="pt-2 border-t border-emerald-100 flex items-center gap-2">
                  <a
                    href={`tel:${donation.donor.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ({donation.donor.phone})</span>
                  </a>
                  <a
                    href={`https://wa.me/${donation.donor.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs text-center flex items-center gap-1 shadow-sm transition"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons Container */}
            <div className="space-y-3 pt-2">
              
              {/* Request Food Surplus Button (Available to all users except creator) */}
              {user && user.id !== donation.donorId && isAvailable && (
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>Request Food Surplus</span>
                </button>
              )}

              {/* Accept Volunteer Delivery Route (Available to all users) */}
              {user && activeDelivery?.status === 'AVAILABLE' && (
                <button
                  onClick={() => handleAcceptDelivery(activeDelivery.id)}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
                >
                  <Truck className="w-5 h-5" />
                  <span>Accept Volunteer Delivery Route</span>
                </button>
              )}

              {/* Case 3: Donor Manages Requests */}
              {isDonor && donation.requests && donation.requests.length > 0 && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Incoming Recipient Requests</h4>
                  {donation.requests.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{r.recipient?.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {r.status}
                        </span>
                      </div>
                      <p className="text-slate-600 italic">"{r.message}"</p>

                      {r.status === 'PENDING' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleRequestAction(r.id, 'ACCEPTED')}
                            className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleRequestAction(r.id, 'REJECTED')}
                            className="flex-1 py-1.5 bg-rose-100 text-rose-700 font-bold rounded-lg hover:bg-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Review & Report Buttons */}
              <div className="flex items-center justify-between pt-2 text-xs">
                {donation.status === 'COMPLETED' && user && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Rate Experience
                  </button>
                )}

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="text-rose-600 font-semibold hover:underline flex items-center gap-1 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Report Listing
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Recipient Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Submit Food Request</h3>
            <p className="text-xs text-slate-500">
              Send a note to <span className="font-bold text-slate-700">{donation.donor?.name}</span> detailing how many people your shelter/organization will serve.
            </p>
            <textarea
              rows={4}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="e.g. Hello, we would love to collect this donation to serve 40 hot meals to families at our community center tonight..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                disabled={requestSubmitting}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                {requestSubmitting ? 'Sending...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Chat Drawer */}
      {reportModalOpen && (
        <ReportModal
          donationId={donation.id}
          reportedUserId={donation.donorId}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {reviewModalOpen && (
        <ReviewModal
          donationId={donation.id}
          reviewedUserId={donation.donorId}
          reviewedName={donation.donor?.name || 'Donor'}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

      {chatDrawerOpen && user && (
        <ChatDrawer
          donationId={donation.id}
          donationName={donation.foodName}
          receiverId={donation.donorId}
          receiverName={donation.donor?.name || 'Donor'}
          onClose={() => setChatDrawerOpen(false)}
        />
      )}

    </div>
  );
};
