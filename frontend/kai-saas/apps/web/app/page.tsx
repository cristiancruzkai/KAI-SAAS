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
          <StatCard title="Base de Conocimiento" imageSrc="/conocimiento.png" />
          <StatCard title="Galeria de Tools" imageSrc="/tools.png" />
          <StatCard title="Bandeja de entrada" imageSrc="/bandeja.png" />
        </div>

        {/* Métricas Section */}
        <div>
          <h2 className="text-title font-bold text-slate-800 mb-6">Métricas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <MetricsChart />
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
