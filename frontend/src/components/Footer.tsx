import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">ShareBite</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ShareBite is a food rescue and redistribution ecosystem connecting commercial food donors with local shelters, community kitchens, and volunteers to minimize waste and conquer hunger.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with UN SDG 2 (Zero Hunger) & SDG 12</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-food" className="hover:text-emerald-400 transition">Find Food Donations</Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-emerald-400 transition">Donate Food Surplus</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">About Our Impact</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">Volunteer Network</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Target Roles */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Stakeholders</h3>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">Restaurants & Cafeterias</span></li>
              <li><span className="text-slate-400">Hotels & Banquet Halls</span></li>
              <li><span className="text-slate-400">Shelters & Food Banks</span></li>
              <li><span className="text-slate-400">Community Drivers & Volunteers</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Safety */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Support</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                New York Headquarters, NY 10012
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                support@sharebite-rescue.org
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                +1 (800) 555-FOOD
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShareBite Rescue Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for community food security.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
