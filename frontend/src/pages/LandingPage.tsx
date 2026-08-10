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
  Sparkles,
  TrendingUp,
  Globe2,
  Award
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { Donation, PublicStats } from '../types';
import { DonationCard } from '../components/DonationCard';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [featuredDonations, setFeaturedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

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

            {/* Right Hero Image Card Stack */}
            <div className="relative mx-auto lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Community Food Rescue"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                {/* Floating Metric Pill 1 */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Live Food Rescue Grid</p>
                      <p className="text-[11px] text-slate-500">Over 3,500+ meals redistributed this month</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: GLOBAL PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Problem We Solve</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Millions of tons of edible food are thrown away while millions suffer hunger.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Restaurants, hotels, cafeterias, and supermarkets discard fresh surplus food daily because there was no unified digital platform to coordinate quick identification, reservation, and volunteer transport. ShareBite bridges this gap.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
                <span className="text-3xl font-extrabold text-rose-400">1.3B</span>
                <p className="text-xs text-slate-300 font-medium">Tons of food wasted globally per year</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
                <span className="text-3xl font-extrabold text-amber-400">1 in 9</span>
                <p className="text-xs text-slate-300 font-medium">People struggle to get daily nutrition</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
                <span className="text-3xl font-extrabold text-emerald-400">8%</span>
                <p className="text-xs text-slate-300 font-medium">Global greenhouse emissions from food waste</p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
                <span className="text-3xl font-extrabold text-teal-400">$0</span>
                <p className="text-xs text-slate-300 font-medium">Cost to donate or receive through ShareBite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW SHAREBITE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Simple & Transparent</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How ShareBite Works</h2>
          <p className="text-sm text-slate-600">Four seamless steps to transform surplus food into community nourishment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Donor Posts Food</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Commercial kitchens or individuals list surplus food quantity, expiry time, dietary tags, and pickup slot.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Recipient Discovers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Shelters and community groups discover nearby available food via map/filters and submit a request.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Volunteer Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              A community volunteer accepts the delivery route, collects food from donor, and delivers to recipient.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-extrabold text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Impact Tracked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receipt is confirmed, ratings are recorded, and food rescued & CO₂e avoided are updated on dashboard!
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: IMPACT STATISTICS */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Our Collective Social & Environmental Impact</h2>
            <p className="text-xs text-slate-300 mt-2">Real-time metrics calculated across all completed food rescue operations.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <UtensilsCrossed className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats ? stats.mealsProvided.toLocaleString() : '3,450+'}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Meals Provided</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Leaf className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats ? `${stats.foodRescuedKg.toLocaleString()} kg` : '1,820 kg'}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Surplus Food Rescued</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Globe2 className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats ? `${stats.estimatedCo2AvoidedKg.toLocaleString()} kg` : '4,550 kg'}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Est. CO₂e Emissions Avoided</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Users className="w-8 h-8 text-sky-400 mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats ? stats.totalUsers : '30+'}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Active Community Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED FOOD DONATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Available Now</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Available Food Donations</h2>
          </div>
          <Link
            to="/find-food"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Donations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDonations.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-10">Loading live food listings...</p>
          ) : (
            featuredDonations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))
          )}
        </div>
      </section>

      {/* SECTION 6: USER ROLES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Tailored Dashboards</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Designed for Every Stakeholder</h2>
          <p className="text-sm text-slate-600">Explore how ShareBite empowers donors, recipients, volunteers, and platform managers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Food Donors</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restaurants, hotels, cafeterias, and bakeries. Effortlessly publish surplus food, track request approvals, and gain tax impact reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Recipients</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              NGOs, shelters, food banks, and individuals. Discover nearby fresh meals, reserve instantly, and confirm food receipt safely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Volunteers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Community drivers and delivery volunteers. Browse pickup routes, accept transport tasks, and earn community service badges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Administrators</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Platform moderators. Monitor analytics, manage user accounts, resolve reports, and enforce platform food safety guidelines.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Help End Food Waste in Your City?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Join ShareBite today as a food donor, recipient organization, or volunteer driver. Together we turn surplus into shared hope.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/find-food"
              className="px-8 py-3.5 rounded-2xl bg-emerald-800/60 border border-emerald-400/40 text-white font-bold text-sm hover:bg-emerald-800 transition"
            >
              Browse Active Donations
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
