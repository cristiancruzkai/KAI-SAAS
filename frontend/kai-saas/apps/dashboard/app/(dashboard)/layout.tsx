'use client';

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSideBarAgent"
import TopBar from "@/components/dashboard/TopBar";
import GlobalSidebar from "@/components/dashboard/GlobalSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 overflow-hidden">
      {/* Global Sidebar - Fixed left */}
      <GlobalSidebar />
      
      <SidebarProvider defaultOpen>
        {/* Agent Sidebar - Positioned after GlobalSidebar */}
        <AppSidebar />
        
        {/* Top Bar */}
        <TopBar />
        
        {/* Main Content */}
        <main className="absolute left-[280px] top-[88px] right-0 bottom-0 overflow-auto">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
