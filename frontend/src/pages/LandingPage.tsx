import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Truck,
  Leaf,
  Users,
  Building2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Globe2,
  Award
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { Donation, PublicStats } from '../types';
import { DonationCard } from '../components/DonationCard';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    title: 'Fresh Organic Produce Rescue',
    badge: 'Zero Food Waste'
  },
  {
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    title: 'Community Food Sharing & Shelters',
    badge: 'Shared Hope'
  },
  {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    title: 'Artisanal Bakery & Bread Rescue',
    badge: '100% Edible Saved'
  },
  {
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    title: 'Supermarket Surplus Redistribution',
    badge: 'Bengaluru Impact'
  }
];

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [featuredDonations, setFeaturedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiFetch<PublicStats>('/stats/public');
        const donationsData = await apiFetch<Donation[]>('/donations?status=AVAILABLE');
        setStats(statsData);
        setFeaturedDonations(donationsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto-rotate hero images every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroImages[activeHeroIndex];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Next-Gen Food Rescue & Redistribution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn Surplus Food Into <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">Shared Hope.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect surplus food from restaurants, cafeterias, and supermarkets with local shelters, food banks, and individuals in need — powered by volunteer drivers and real-time tracking.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Start Sharing Food</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/find-food"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Find Food Near You</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Food Safety Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  <span>Zero Plate Waste</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Interactive Carousel */}
            <div className="relative mx-auto lg:max-w-none group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-700">
                <img
                  src={currentHero.url}
                  alt={currentHero.title}
                  className="w-full h-[420px] object-cover transition-opacity duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                
                {/* Carousel Controls */}
                <button
                  onClick={() => setActiveHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveHeroIndex((prev) => (prev + 1) % heroImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md">
                    {currentHero.badge}
                  </span>
                </div>

                {/* Floating Metric Pill & Dots */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentHero.title}</p>
                      <p className="text-[11px] text-slate-500">Over 3,500+ meals redistributed this month</p>
                    </div>
                  </div>

                  {/* Carousel Dots */}
                  <div className="flex items-center gap-1.5">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveHeroIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeHeroIndex === idx
                            ? 'bg-emerald-600 w-6'
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: GLOBAL PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl" />

          <div className="max-w-3xl relative z-10 space-y-6">
            <span className="text-emerald-400 text-xs font-extrabold tracking-widest uppercase">The Food Waste Paradox</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              1/3 of All Produced Food is Wasted, While Millions Experience Hunger.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Every day, edible meals from restaurants, supermarkets, caterers, and events go to landfills — releasing methane gas and accelerating environmental damage. ShareBite bridges the gap between surplus abundance and community need.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div>
                <p className="text-3xl font-extrabold text-emerald-400">1.3B Tons</p>
                <p className="text-xs text-slate-400">Global food wasted annually</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-teal-400">8%-10%</p>
                <p className="text-xs text-slate-400">Global GHG emissions from food waste</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-green-400">2.5 kg CO₂e</p>
                <p className="text-xs text-slate-400">Emissions avoided per 1 kg rescued</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-emerald-700 text-xs font-extrabold tracking-widest uppercase">Simple 4-Step Ecosystem</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How ShareBite Works</h2>
          <p className="text-slate-600 text-sm">
            Seamless collaboration between surplus donors, community recipients, and volunteer drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Donor Posts Surplus</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restaurants, hotels, or households upload excess edible food with photos, dietary tags, and pickup windows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Recipient Requests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified food banks, shelters, or individuals discover nearby listings via map view and send a request.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Volunteer Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Community volunteer drivers accept the route, collect the packaged food, and transport it safely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Impact Tracked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receipt is confirmed, meals served are logged, and CO₂e emission reductions are added to live analytics.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE IMPACT COUNTER */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-emerald-300 text-xs font-extrabold tracking-widest uppercase">Real-Time Community Metrics</span>
            <h2 className="text-3xl font-extrabold">Our Collective Food Rescue Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-2">
              <UtensilsCrossed className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-4xl font-extrabold">{stats?.mealsProvided || 3450}+</p>
              <p className="text-xs text-emerald-200 font-medium">Meals Served to Communities</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-2">
              <Leaf className="w-8 h-8 text-teal-400 mx-auto" />
              <p className="text-4xl font-extrabold">{stats?.estimatedCo2AvoidedKg ? (stats.estimatedCo2AvoidedKg / 1000).toFixed(1) : '8.6'} Tons</p>
              <p className="text-xs text-emerald-200 font-medium">CO₂e Emissions Prevented</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-2">
              <Users className="w-8 h-8 text-green-400 mx-auto" />
              <p className="text-4xl font-extrabold">{stats?.totalUsers || 31}</p>
              <p className="text-xs text-emerald-200 font-medium">Active Donors & Volunteers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-2">
              <Award className="w-8 h-8 text-emerald-300 mx-auto" />
              <p className="text-4xl font-extrabold">98.4%</p>
              <p className="text-xs text-emerald-200 font-medium">Successful Redistribution Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: USER ROLES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-emerald-700 text-xs font-extrabold tracking-widest uppercase">Tailored Platform Roles</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Empowering Everyone to Make a Difference</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Donor Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Food Donors</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Restaurants, bakeries, supermarkets, and caterers. Easily upload excess food, set safe pickup windows, and eliminate commercial food waste.
              </p>
            </div>
            <Link
              to="/register?role=DONOR"
              className="inline-flex items-center gap-2 font-bold text-xs text-emerald-700 hover:text-emerald-800"
            >
              <span>Join as a Donor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recipient Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Recipients & NGOs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Shelters, food banks, community organizations, and individuals. Browse nearby map pins, request fresh food parcels, and confirm delivery.
              </p>
            </div>
            <Link
              to="/register?role=RECIPIENT"
              className="inline-flex items-center gap-2 font-bold text-xs text-teal-700 hover:text-teal-800"
            >
              <span>Join as a Recipient</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Volunteer Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Volunteer Drivers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drivers and bike couriers. Accept convenient pickup routes in your neighborhood, deliver fresh meals safely, and earn community impact badges.
              </p>
            </div>
            <Link
              to="/register?role=VOLUNTEER"
              className="inline-flex items-center gap-2 font-bold text-xs text-green-700 hover:text-green-800"
            >
              <span>Become a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Stop Food Waste in Your City?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Join thousands of donors, recipient organizations, and volunteers who are turning food waste into shared hope every single day.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-emerald-800 font-extrabold text-base shadow-xl hover:bg-slate-100 transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-800/40 hover:bg-emerald-800/60 text-white border border-white/30 font-bold text-base backdrop-blur-md transition"
              >
                Food Safety Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
