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
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-indigo-100 bg-fixed">
      {/* Global Sidebar - Fixed left */}
      <GlobalSidebar />
      
      {/* Top Bar */}
      <TopBar />
      
      <SidebarProvider defaultOpen>
        {/* Agent Sidebar */}
        <AppSidebar />
        
        {/* Main Content - Responsive with relative positioning for absolute children */}
        <main className="ml-[280px] mt-[88px] mr-4 mb-4 relative min-h-[1200px]">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
