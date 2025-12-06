'use client';

import { 
  Bot, 
  Calendar, 
  Plane, 
  Users, 
  MessageSquare, 
  Folder 
} from 'lucide-react';

export function GlobalSidebar() {
  return (
    <aside className="w-14 h-72 relative m-4">
      {/* Bottom Icons */}
      <div className="w-6 h-6 left-[23px] top-[277px] absolute">
        <Folder className="w-6 h-6 text-gray-400" />
      </div>
      <div className="w-6 h-6 left-[23px] top-[223px] absolute">
        <MessageSquare className="w-6 h-6 text-gray-400" />
      </div>
      <div className="w-6 h-6 left-[23px] top-[61px] absolute">
        <Calendar className="w-6 h-6 text-gray-400" />
      </div>
      <div className="w-6 h-6 left-[23px] top-[115px] absolute">
        <Plane className="w-6 h-6 text-gray-400" />
      </div>
      <div className="w-6 h-6 left-[23px] top-[169px] absolute">
        <Users className="w-6 h-6 text-gray-400" />
      </div>
      
      {/* Active Bot Item */}
      <div className="w-14 h-11 left-0 top-0 absolute bg-gradient-to-b from-white to-white/30 rounded-tr-2xl rounded-br-2xl shadow-[0px_5px_20px_0px_rgba(1,0,245,0.20)] border border-white/0" />
      <div className="w-5 h-4 left-[24px] top-[15px] absolute">
        <Bot className="w-full h-full text-kai-blue" />
      </div>
    </aside>
  );
}
