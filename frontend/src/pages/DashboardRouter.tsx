import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UnifiedDashboard } from './dashboards/UnifiedDashboard';

export const DashboardRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading your ShareBite dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <UnifiedDashboard />;
};
