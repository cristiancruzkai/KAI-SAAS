'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { KaiButton } from '@/components/ui/KaiButton';

export function TopBar() {
  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-textnormal">
        <span className="text-gray-500">Tus Agentes</span>
        <span className="text-gray-400">›</span>
        <span className="font-semibold text-slate-800">Dashboard Bimo</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="w-12 h-12 relative bg-white/10 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden">
          <div className="w-6 h-6 left-[11px] top-[12px] absolute rounded-2xl">
            <Bell size={24} className="w-6 h-6" />
          </div>
        </div>

        {/* User Menu */}
        <div className="w-56 h-12 relative bg-white/10 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden">
          <div className="w-32 left-[65px] top-[16px] absolute justify-start text-black/80 text-sm font-bold font-['Nunito_Sans']">Miranda Villareal</div>
        </div>

        {/* Create Agent Button */}
        <div className="w-32 h-12 relative rounded-2xl">
          <div className="w-32 h-12 left-0 top-0 absolute bg-kai-blue rounded-2xl shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)]" />
          <div className="w-24 left-[23px] top-[14px] absolute justify-start text-white text-sm font-bold font-['Nunito_Sans']">Crear Agente</div>
        </div>
      </div>
    </header>
  );
}
