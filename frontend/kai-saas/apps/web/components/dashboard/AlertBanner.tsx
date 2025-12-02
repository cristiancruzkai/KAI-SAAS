'use client';

import { Play } from 'lucide-react';

export function AlertBanner() {
  return (
    <div className="relative w-full bg-[#FF8147] rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] p-8 overflow-hidden">
      <div className="relative z-10">
        <p className="text-white/80 text-textnormal font-semibold tracking-wider uppercase mb-2">NOVEDADES</p>
        <h2 className="text-white text-title font-bold mb-1">XXXX</h2>
        <p className="text-white text-subtitle font-bold mb-6">XXXXXXXXX</p>
        
        <button className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-textnormal font-medium transition-colors">
          XXXXXXX
          <div className="bg-white rounded-full p-1">
            <Play size={10} className="text-slate-800 fill-current ml-0.5" />
          </div>
        </button>
      </div>

      {/* Decorative dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="w-2 h-2 rounded-full bg-white/40" />
        <div className="w-2 h-2 rounded-full bg-white/40" />
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    </div>
  );
}
