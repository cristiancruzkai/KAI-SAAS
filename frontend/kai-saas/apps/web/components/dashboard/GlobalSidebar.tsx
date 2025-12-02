'use client';

import { 
  Bot, 
  Calendar, 
  Plane, 
  Users, 
  MessageSquare, 
  Folder 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GlobalSidebar() {
  return (
    <aside className="w-20 h-screen flex flex-col items-center py-6 gap-8 bg-white border-r border-gray-100 shadow-sm z-50">
       {/* Active Item (Bot) */}
       <div className="relative">
         <div className="absolute inset-0 bg-blue-100 blur-lg opacity-50 rounded-full" />
         <div className="relative bg-white p-2 rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,255,0.1)] border border-blue-50">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
              <Bot className="h-6 w-6" />
            </Button>
         </div>
       </div>

       {/* Other Items */}
       <div className="flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
            <Calendar className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
            <Plane className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
            <Users className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
            <MessageSquare className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
            <Folder className="h-6 w-6" />
          </Button>
       </div>
    </aside>
  );
}
