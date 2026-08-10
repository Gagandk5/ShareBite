import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Delivery } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await apiFetch<Delivery[]>('/deliveries');
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to load volunteer deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAcceptTask = async (deliveryId: string) => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/accept`, { method: 'POST' });
      showToast('Delivery task accepted! Time window added to schedule.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept task', 'error');
    }
  };

  const handleUpdateStatus = async (deliveryId: string, status: 'COLLECTED' | 'DELIVERED') => {
    try {
      await apiFetch(`/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Status updated to ${status}!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const availableTasks = deliveries.filter((d) => d.status === 'AVAILABLE');
  const myActiveDeliveries = deliveries.filter((d) => d.volunteerId === user?.id && ['ASSIGNED', 'COLLECTED'].includes(d.status));
  const myCompletedDeliveries = deliveries.filter((d) => d.volunteerId === user?.id && ['DELIVERED', 'COMPLETED'].includes(d.status));
  const totalMealsDelivered = myCompletedDeliveries.reduce((sum, d) => sum + (d.donation?.servings || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Volunteer Dispatch Console</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-300">Accept pickup opportunities and transport surplus food to local shelters.</p>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/80 px-4 py-2 rounded-2xl border border-purple-800/80 self-start md:self-auto">
          <Truck className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold text-white">{myActiveDeliveries.length} Active Deliveries</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Available Tasks</span>
          <p className="text-2xl font-extrabold text-purple-600">{availableTasks.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Ready for pickup</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Deliveries</span>
          <p className="text-2xl font-extrabold text-amber-600">{myActiveDeliveries.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold">In progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Deliveries</span>
          <p className="text-2xl font-extrabold text-emerald-600">{myCompletedDeliveries.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Completed routes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">People Helped</span>
          <p className="text-2xl font-extrabold text-teal-600">{totalMealsDelivered}</p>
          <span className="text-[10px] text-slate-500 font-medium">Meals delivered</span>
        </div>
      </div>

      {/* My Active Deliveries Section */}
      {myActiveDeliveries.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-purple-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" />
            Your Active Transport Tasks ({myActiveDeliveries.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myActiveDeliveries.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">{d.donation?.foodName}</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 uppercase">
                    {d.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Pickup: {d.pickupLocation}
                  </p>
                  <p className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Destination: {d.deliveryLocation}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  {d.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleUpdateStatus(d.id, 'COLLECTED')}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm"
                    >
                      Mark Food as COLLECTED
                    </button>
                  )}
                  {d.status === 'COLLECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(d.id, 'DELIVERED')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                    >
                      Mark Food as DELIVERED
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Delivery Opportunities Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Available Pickup Opportunities</h2>

        {availableTasks.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-10">No available pickup tasks right now. New delivery routes will appear here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition space-y-3 text-xs bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{task.donation?.foodName}</h3>
                    <span className="text-[10px] text-emerald-700 font-bold">{task.donation?.servings} Servings</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    AVAILABLE
                  </span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p className="truncate"><span className="font-semibold">Pickup:</span> {task.pickupLocation}</p>
                  <p className="truncate"><span className="font-semibold">Drop:</span> {task.deliveryLocation}</p>
                </div>

                <button
                  onClick={() => handleAcceptTask(task.id)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-sm"
                >
                  Accept Delivery Route
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
