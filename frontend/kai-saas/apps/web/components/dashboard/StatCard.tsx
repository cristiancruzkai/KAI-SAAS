'use client';

import { Bell, MoreVertical } from 'lucide-react';

export function StatCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <Bell className="text-gray-400" size={22} />
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="mt-6">
        <p className="text-textnormal text-gray-500 font-medium">XXXX</p>
        <p className="text-subtitle font-semibold text-slate-800">XXXXXXXXXX</p>
      </div>
    </div>
  );
}
