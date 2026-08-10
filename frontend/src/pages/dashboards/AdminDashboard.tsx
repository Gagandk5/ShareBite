import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UtensilsCrossed,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  UserX,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { apiFetch } from '../../services/api';
import { Report } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [analyticsData, reportsData] = await Promise.all([
        apiFetch<any>('/admin/analytics'),
        apiFetch<Report[]>('/admin/reports')
      ]);
      setAnalytics(analyticsData);
      setReports(reportsData);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    try {
      await apiFetch(`/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      showToast(`Report marked as ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast('Failed to update report status', 'error');
    }
  };

  const handleUserAction = async (userId: string, action: 'SUSPEND' | 'ACTIVATE') => {
    try {
      await apiFetch('/admin/user-action', {
        method: 'POST',
        body: JSON.stringify({ userId, action })
      });
      showToast(`User ${action === 'SUSPEND' ? 'suspended' : 'activated'}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast('Failed to update user status', 'error');
    }
  };

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-semibold">Loading platform analytics & moderation center...</p>
      </div>
    );
  }

  const { summary, categoryData, monthlyRescueData } = analytics;

  const roleDistribution = [
    { name: 'Donors', value: summary.donorsCount, color: '#16A34A' },
    { name: 'Recipients', value: summary.recipientsCount, color: '#0284C7' },
    { name: 'Volunteers', value: summary.volunteersCount, color: '#9333EA' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Platform Administration & Analytics</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-300">Monitor real-time food rescue volume, user growth, and moderate community reports.</p>
        </div>

        <div className="flex items-center gap-2 bg-rose-950/80 px-4 py-2 rounded-2xl border border-rose-800/80 self-start md:self-auto">
          <ShieldCheck className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold text-white">Full Governance Privileges</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalUsers}</p>
          <span className="text-[10px] text-slate-500">{summary.donorsCount} Donors • {summary.recipientsCount} Recipients</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Donations</span>
          <p className="text-2xl font-extrabold text-emerald-600">{summary.totalDonations}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{summary.completedDonationsCount} Completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Food Rescued</span>
          <p className="text-2xl font-extrabold text-teal-600">{summary.foodRescuedKg} kg</p>
          <span className="text-[10px] text-slate-500 font-medium">({summary.mealsProvided} meals)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Deliveries</span>
          <p className="text-2xl font-extrabold text-purple-600">{summary.activeDeliveriesCount}</p>
          <span className="text-[10px] text-slate-500">In transit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Open Reports</span>
          <p className="text-2xl font-extrabold text-rose-600">{summary.openReportsCount}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Needs review</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Monthly Food Rescue Volume (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Monthly Food Rescue Growth (kg)
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Trajectory
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRescueData}>
                <defs>
                  <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="foodKg" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorFood)" name="Food Rescued (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: User Role Distribution (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            User Role Distribution
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Reports Moderation Center Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Platform Moderation & Safety Reports ({reports.length})
          </h2>
        </div>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No reported items or user safety issues filed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Reporter</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{r.reporter?.name}</td>
                    <td className="p-3 font-semibold text-rose-700">{r.reason}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{r.description}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'OPEN' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {r.status === 'OPEN' && (
                        <>
                          <button
                            onClick={() => handleUpdateReportStatus(r.id, 'RESOLVED')}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleUpdateReportStatus(r.id, 'DISMISSED')}
                            className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
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
