import React, { useState, useEffect } from 'react';
import { Search, Filter, Map, Grid, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { Donation } from '../types';
import { DonationCard } from '../components/DonationCard';
import { LeafletMap } from '../components/LeafletMap';

export const FindFoodPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [dietaryType, setDietaryType] = useState('ALL');
  const [maxDistance, setMaxDistance] = useState('25');
  const [sortBy, setSortBy] = useState('nearest');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category !== 'ALL') params.append('category', category);
      if (dietaryType !== 'ALL') params.append('dietaryType', dietaryType);
      if (maxDistance) params.append('maxDistance', maxDistance);
      if (sortBy) params.append('sortBy', sortBy);

      const data = await apiFetch<Donation[]>(`/donations?${params.toString()}`);
      setDonations(data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [category, dietaryType, maxDistance, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonations();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Surplus Food</h1>
          <p className="text-xs text-slate-500 mt-1">Browse available food rescue listings near your location</p>
        </div>

        {/* Grid vs Map View Toggle */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'map' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food name, description, address, city..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            Search
          </button>
        </form>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery & Bread">Bakery & Bread</option>
              <option value="Produce & Fruits">Produce & Fruits</option>
              <option value="Groceries & Packaged">Groceries & Packaged</option>
              <option value="Beverages">Beverages</option>
              <option value="Dairy">Dairy</option>
            </select>
          </div>

          {/* Dietary Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dietary Preference</label>
            <select
              value={dietaryType}
              onChange={(e) => setDietaryType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Dietary Types</option>
              <option value="VEGETARIAN">Vegetarian Only</option>
              <option value="VEGAN">Vegan Only</option>
              <option value="NON_VEGETARIAN">Non-Vegetarian</option>
            </select>
          </div>

          {/* Max Distance */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Max Distance</label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sort Results By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="nearest">Nearest Distance</option>
              <option value="newest">Newest First</option>
              <option value="endingSoon">Ending Soon</option>
              <option value="quantity">Largest Quantity</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl animate-shimmer" />
          ))}
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px]">
          <LeafletMap donations={donations} />
        </div>
      ) : donations.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Donations Found</h3>
          <p className="text-xs text-slate-500">
            Try expanding your distance radius or changing your search filters to find available food.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('ALL');
              setDietaryType('ALL');
              setMaxDistance('50');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}

    </div>
  );
};
