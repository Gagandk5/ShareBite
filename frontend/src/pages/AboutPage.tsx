import React from 'react';
import { ShieldCheck, Heart, Leaf, Globe, Utensils, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
          Mission & Impact
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Connecting Food Abundance with Community Need
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          ShareBite was created to solve one of the most frustrating paradoxes of modern society: millions of tons of wholesome edible food are discarded daily while families and community shelters struggle for basic food security.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Environmental Impact</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rescuing 1 kg of food avoids approximately 2.5 kg of greenhouse CO₂ emissions that would otherwise pollute our atmosphere in landfills.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Social Dignity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By connecting food donors directly with local shelters and NGOs, we ensure food is distributed with dignity, transparency, and care.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Food Safety First</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every donation requires clear preparation time, best-before dates, allergen labels, and temperature compliance instructions.
          </p>
        </div>
      </div>

      {/* Safety & Compliance Guidelines */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Food Safety & Quality Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Only wholesome, unconsumed food items may be listed for rescue.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Cooked food must be kept under safe hot/cold storage temperatures until pickup.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Clear labeling of potential allergens (nuts, dairy, gluten, soy) is mandatory.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>All donors and recipients are verified before initiating logistics tasks.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
