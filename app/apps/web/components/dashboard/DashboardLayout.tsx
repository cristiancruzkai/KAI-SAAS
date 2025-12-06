'use client';

import { ReactNode } from 'react';
import { Sidebar } from './SidebarAgentes';
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
      <div className="shrink-0 p-4 pb-0 flex gap-4">
        <div className="w-52 h-24 bg-[#00188A] rounded-3xl flex items-center justify-center" >
          <KaiLogo className="h-8 w-auto" />
        </div>
        <div className="flex-1">
          <TopBar />
        </div>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-1 overflow-hidden">
        <GlobalSidebar />
        <Sidebar />
        
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}
