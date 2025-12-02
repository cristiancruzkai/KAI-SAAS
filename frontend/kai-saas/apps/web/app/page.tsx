'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { MetricsChart } from '@/components/dashboard/MetricsChart';
import { TransactionCard } from '@/components/dashboard/TransactionCard';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Alert Banner */}
        <AlertBanner />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard />
          <StatCard />
          <StatCard />
        </div>

        {/* Métricas Section */}
        <div>
          <h2 className="text-title font-bold text-slate-800 mb-6">Métricas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MetricsChart />
            </div>
            <div className="bg-white rounded-2xl shadow-sm min-h-[300px]">
              {/* Empty card */}
            </div>
          </div>
        </div>

        {/* Transaction Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TransactionCard variant="green" />
          <TransactionCard variant="yellow" />
          <TransactionCard variant="blue" />
        </div>
      </div>
    </DashboardLayout>
  );
}
