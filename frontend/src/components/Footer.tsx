import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">ShareBite</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ShareBite is a food rescue and redistribution ecosystem connecting food donors with local community recipients and volunteers to minimize waste and conquer hunger.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with UN SDG 2 (Zero Hunger) & SDG 12</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Links</h3>
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
                <Link to="/dashboard" className="hover:text-emerald-400 transition">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Support</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Lakshmidevinagara, Laggere, Bangalore</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:gagandk2007@gmail.com" className="hover:text-emerald-400 transition">gagandk2007@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+918971115212" className="hover:text-emerald-400 transition">+91 8971115212</a>
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
            <span>for community food security in Bengaluru.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
