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
      
      {/* Top Bar */}
      <TopBar />
      
      <SidebarProvider defaultOpen>
        {/* Agent Sidebar */}
        <AppSidebar />
        
        {/* Main Content - Responsive */}
        <main className="ml-[280px] mt-[88px] mr-4 mb-4 overflow-auto h-[calc(100vh-104px)]">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
