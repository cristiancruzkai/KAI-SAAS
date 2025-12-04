'use client';

import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Top Navigation Bar */}
        <TopBar />
        
        {/* Left Sidebar with Agents */}
        <Sidebar />
        
        {/* Content area */}
        {children}
      </div>
    </div>
  );
}
