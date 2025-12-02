'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { GlobalSidebar } from './GlobalSidebar';
import { TopBar } from './TopBar';
import { KaiLogo } from '@/components/ui/KaiLogo';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Logo Row */}
      <div className="shrink-0 p-4 pb-0">
        <div className="w-44 h-20 bg-blue-900 rounded-3xl shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] flex items-center justify-center">
          <KaiLogo className="h-8 w-auto" />
        </div>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-1 overflow-hidden">
        <GlobalSidebar />
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
