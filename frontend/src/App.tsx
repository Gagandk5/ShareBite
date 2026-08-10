import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FindFoodPage } from './pages/FindFoodPage';
import { CreateDonationPage } from './pages/CreateDonationPage';
import { DonationDetailsPage } from './pages/DonationDetailsPage';
import { DashboardRouter } from './pages/DashboardRouter';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/find-food" element={<FindFoodPage />} />
                  <Route path="/donate" element={<CreateDonationPage />} />
                  <Route path="/donations/:id" element={<DonationDetailsPage />} />
                  <Route path="/dashboard" element={<DashboardRouter />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
