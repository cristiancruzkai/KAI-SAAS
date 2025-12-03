'use client';

import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import AlertBanner from '../components/dashboard/AlertBanner';
import StatCards from '../components/dashboard/StatCards';
import MetricsSection from '../components/dashboard/MetricsSection';
import TransactionCard from '../components/dashboard/TransactionCard';

export default function DashboardPage() {
  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-stone-50 to-indigo-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <TopBar />
      
      {/* Left Sidebar with Agents */}
      <Sidebar />
      
      {/* Alert Banner */}
      <AlertBanner />
      
      {/* Stat Cards */}
      <StatCards />
      
      {/* Metrics Section */}
      <MetricsSection />
      
      {/* Transaction Cards */}
      <TransactionCard variant="first" />
      <TransactionCard variant="second" />
      <TransactionCard variant="third" />
    </div>
  );
}
