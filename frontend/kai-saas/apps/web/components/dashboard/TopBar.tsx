'use client';

import { Bell, ChevronDown } from 'lucide-react';

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
        <button className="p-2.5 bg-white rounded-xl shadow-sm text-gray-500 hover:text-blue-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-1.5 pr-3 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
